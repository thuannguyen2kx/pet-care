import PostModel, { IPost, IMedia, IReport } from "../models/post.model";
import CommentModel, { IComment } from "../models/comment.model";
import ReactionModel from "../models/reaction.model";
import UserModel from "../models/user.model";
import PetModel from "../models/pet.model";
import { deleteFile } from "../utils/file-uploade";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../utils/app-error";
import { Roles } from "../enums/role.enum";

interface PostQuery {
  page?: number;
  limit?: number;
  tag?: string;
  author?: string;
  petId?: string;
  status?: string;
  visibility?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

interface ModerationQuery {
  page?: number;
  limit?: number;
  status?: string;
  reportCount?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

interface ReportedPostsQuery {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// Tạo interface cho comment với replies
interface CommentWithReplies extends IComment {
  replies: IComment[];
}

// Get all posts (with filtering, pagination)
export const getPostsService = async ({
  query,
  user,
}: {
  query: PostQuery;
  user?: any;
}) => {
  const {
    page = 1,
    limit = 10,
    tag,
    author,
    petId,
    status,
    visibility,
    search,
    sortBy = "createdAt",
    sortDirection = "desc",
  } = query;

  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};

  // Only admins can see all posts regardless of status/visibility
  // Regular users can only see active and public posts
  if (user?.role === "admin") {
    if (status) {
      filter.status = status;
    }

    if (visibility) {
      filter.visibility = visibility;
    }
  } else {
    filter.status = "active";
    filter.visibility = "public";
  }

  if (tag) {
    filter.tags = tag;
  }

  if (author) {
    filter.authorId = author;
  }

  if (petId) {
    filter.petIds = petId;
  }

  // Search in title or content
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  // Create sort object
  const sort: any = {};
  sort[sortBy] = sortDirection === "asc" ? 1 : -1;

  // Get posts with pagination
  const posts = await PostModel.find(filter)
    .populate("authorId", "fullName profilePicture")
    .populate("petIds", "name species breed profilePicture")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalPosts = await PostModel.countDocuments(filter);

  return {
    posts,
    pagination: {
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    },
  };
};

// Get post by ID
export const getPostByIdService = async ({
  postId,
  user,
}: {
  postId: string;
  user?: any;
}) => {
  const post = await PostModel.findById(postId)
    .populate("authorId", "fullName profilePicture")
    .populate("petIds", "name species breed profilePicture");

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  // Check if the post is public or if the user is the author or admin
  if (
    post.visibility !== "public" &&
    user?.role !== Roles.CUSTOMER &&
    (!user || post.authorId.toString() !== user._id.toString())
  ) {
    throw new ForbiddenException("Not authorized to view this post");
  }

  // Increment view count if not the author
  if (!user || post.authorId.toString() !== user._id.toString()) {
    post.stats.viewCount += 1;
    await post.save();
  }

  // Get comments for the post
  const comments = await CommentModel.find({
    postId: post._id,
    status: "active",
    parentCommentId: { $exists: false },
  })
    .populate("authorId", "fullName profilePicture")
    .sort({ createdAt: -1 });

  // Get replies to comments
  const commentIds = comments.map((comment) => comment._id);
  const replies = await CommentModel.find({
    postId: post._id,
    status: "active",
    parentCommentId: { $in: commentIds },
  }).populate("authorId", "fullName profilePicture");

  // Organize replies by parent comment
  const commentsWithReplies: CommentWithReplies[] = comments.map((comment) => {
    const commentObj = comment.toObject() as CommentWithReplies;
    commentObj.replies = replies.filter(
      (reply) =>
        reply.parentCommentId?.toString() === (comment._id as unknown as string)
    );
    return commentObj;
  });

  // Get reactions for the post
  const reactions = await ReactionModel.find({
    contentType: "post",
    contentId: post._id,
  });

  // Check if the logged-in user has reacted to the post
  let userReaction = null;
  if (user) {
    userReaction = await ReactionModel.findOne({
      contentType: "post",
      contentId: post._id,
      userId: user._id,
    });
  }

  // Format reaction data
  const reactionTypes = ["like", "love", "laugh", "sad", "angry"];
  const reactionCounts = reactionTypes.reduce(
    (acc: Record<string, number>, type) => {
      acc[type] = reactions.filter((r) => r.reactionType === type).length;
      return acc;
    },
    {}
  );

  return {
    post,
    comments: commentsWithReplies,
    reactions: {
      total: reactions.length,
      types: reactionCounts,
      userReaction: userReaction ? userReaction.reactionType : null,
    },
  };
};

// Create a new post
export const createPostService = async ({
  body,
  user,
  files,
}: {
  body: any;
  user?: any;
  files?: Express.Multer.File[];
}) => {
  const { title, content, tags, petIds, visibility } = body;

  // Validate content
  if (!content || content.trim() === "") {
    throw new BadRequestException("Post content is required");
  }

  // Check if user exists
  if (!user?._id) {
    throw new ForbiddenException("Authentication required");
  }

  // Check if all pet IDs belong to the user (if provided)
  if (petIds && petIds.length > 0) {
    const petIdsArray = petIds.split(",");

    for (const petId of petIdsArray) {
      // Skip empty values
      if (!petId.trim()) continue;

      const pet = await PetModel.findById(petId.trim());
      if (!pet) {
        throw new BadRequestException(`Pet with ID ${petId} not found`);
      }

      if (
        pet.ownerId.toString() !== user._id.toString() &&
        user.role !== "admin"
      ) {
        throw new BadRequestException(
          `Pet with ID ${petId} does not belong to you`
        );
      }
    }
  }

  // Create the post
  const post = await PostModel.create({
    authorId: user._id,
    title: title || undefined, // Allow title to be optional
    content,
    tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
    petIds: petIds
      ? petIds
          .split(",")
          .map((id: string) => id.trim())
          .filter(Boolean)
      : [],
    visibility: visibility || "public",
    status: user.role === "admin" ? "active" : "active", // Admins can post directly, others might need approval in the future
    stats: {
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
    },
  });

  // Process uploaded media files
  if (files && files.length > 0) {
    const mediaItems: IMedia[] = files.map((file: Express.Multer.File) => ({
      type: file.mimetype.startsWith("image/") ? "image" : "video",
      url: file.path,
      publicId: file.filename,
    }));

    post.media = mediaItems;
    await post.save();
  }

  // Return populated post
  const populatedPost = await PostModel.findById(post._id)
    .populate("authorId", "fullName profilePicture")
    .populate("petIds", "name species breed profilePicture");

  return { post: populatedPost };
};

// Update a post
export const updatePostService = async ({
  postId,
  body,
  user,
}: {
  postId: string;
  body: any;
  user?: any;
}) => {
  const { title, content, tags, petIds, visibility, status } = body;

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  // Check if user is authorized to update this post
  const isAuthor = post.authorId.toString() === user?._id.toString();
  const isAdmin = user?.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenException("Not authorized to update this post");
  }

  // Only admin can update post status
  if (status && !isAdmin) {
    throw new ForbiddenException("Only admins can update post status");
  }

  // Check if all pet IDs belong to the user (if provided)
  if (petIds && isAuthor) {
    const petIdsArray = petIds.split(",");

    for (const petId of petIdsArray) {
      // Skip empty values
      if (!petId.trim()) continue;

      const pet = await PetModel.findById(petId.trim());
      if (!pet) {
        throw new BadRequestException(`Pet with ID ${petId} not found`);
      }

      if (pet.ownerId.toString() !== user?._id.toString()) {
        throw new BadRequestException(
          `Pet with ID ${petId} does not belong to you`
        );
      }
    }

    post.petIds = petIdsArray.filter(Boolean);
  }

  // Update fields
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (tags !== undefined) {
    post.tags = tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean);
  }
  if (visibility !== undefined) post.visibility = visibility;
  if (status !== undefined && isAdmin) {
    post.status = status;
  }

  // Save the updated post
  const updatedPost = await post.save();

  // Return populated post
  const populatedPost = await PostModel.findById(updatedPost._id)
    .populate("authorId", "fullName profilePicture")
    .populate("petIds", "name species breed profilePicture");

  return { post: populatedPost };
};

// Delete a post
export const deletePostService = async ({
  postId,
  user,
}: {
  postId: string;
  user?: any;
}) => {
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  // Check if user is authorized to delete this post
  const isAuthor = post.authorId.toString() === user?._id.toString();
  const isAdmin = user?.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenException("Not authorized to delete this post");
  }

  // Delete all comments related to this post
  await CommentModel.deleteMany({ postId: post._id });

  // Delete all reactions related to this post
  await ReactionModel.deleteMany({ contentType: "post", contentId: post._id });

  // Delete media files from cloud storage
  if (post.media && post.media.length > 0) {
    for (const mediaItem of post.media) {
      try {
        const publicId = mediaItem.publicId;
        if (publicId) {
          await deleteFile(publicId);
        }
      } catch (deleteError) {
        console.error("Error deleting media file:", deleteError);
      }
    }
  }

  // Delete the post
  await post.deleteOne();

  return { message: "Post removed successfully" };
};

// Admin: Get all posts for moderation
export const getPostsForModerationService = async ({
  query,
  user,
}: {
  query: ModerationQuery;
  user?: any;
}) => {
  // Check if user is admin
  if (user?.role !== "admin") {
    throw new ForbiddenException("Admin access required");
  }

  const {
    page = 1,
    limit = 20,
    status = "all",
    reportCount = 0,
    sortBy = "createdAt",
    sortDirection = "desc",
  } = query;

  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};

  if (status && status !== "all") {
    filter.status = status;
  }

  if (reportCount > 0) {
    filter["stats.reportCount"] = { $gte: reportCount };
  }

  // Create sort object
  const sort: any = {};
  sort[sortBy] = sortDirection === "asc" ? 1 : -1;

  // If sorting by reports, make sure we have it in the schema
  if (sortBy === "reportCount") {
    sort["stats.reportCount"] = sortDirection === "asc" ? 1 : -1;
  }

  // Get posts with pagination
  const posts = await PostModel.find(filter)
    .populate("authorId", "fullName profilePicture email")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalPosts = await PostModel.countDocuments(filter);

  return {
    posts,
    pagination: {
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    },
  };
};

// Admin: Update post status (moderate)
export const updatePostStatusService = async ({
  postId,
  body,
  user,
}: {
  postId: string;
  body: any;
  user?: any;
}) => {
  // Check if user is admin
  if (user?.role !== "admin") {
    throw new ForbiddenException("Admin access required");
  }

  const { status, moderationNote } = body;

  if (!["active", "under-review", "blocked"].includes(status)) {
    throw new BadRequestException("Invalid status value");
  }

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  // Update status
  post.status = status;

  // Add moderation note if provided
  if (moderationNote) {
    if (!post.moderationNotes) {
      post.moderationNotes = [];
    }

    post.moderationNotes.push({
      moderatorId: user._id,
      note: moderationNote,
      createdAt: new Date(),
    });
  }

  await post.save();

  // Notify author if post is blocked
  if (status === "blocked") {
    const author = await UserModel.findById(post.authorId);

    //Todo: Send notification email
  }

  return {
    message: `Post status updated to ${status}`,
    post,
  };
};

// Report a post
export const reportPostService = async ({
  postId,
  body,
  user,
}: {
  postId: string;
  body: any;
  user?: any;
}) => {
  const { reason, details } = body;

  if (!reason) {
    throw new BadRequestException("Reason is required");
  }

  // Check if user exists
  if (!user?._id) {
    throw new ForbiddenException("Authentication required");
  }

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  // Check if user has already reported this post
  if (
    post.reports &&
    post.reports.some(
      (report) => report.userId.toString() === user._id.toString()
    )
  ) {
    throw new BadRequestException("You have already reported this post");
  }

  // Add report
  if (!post.reports) {
    post.reports = [];
  }

  const newReport: IReport = {
    userId: user._id,
    reason,
    details: details || "",
    createdAt: new Date(),
    status: "pending",
  };

  post.reports.push(newReport);

  // Update report count in stats
  if (!post.stats.reportCount) {
    post.stats.reportCount = 0;
  }

  post.stats.reportCount += 1;

  // If reports exceed threshold, change status to under-review
  const reportThreshold = 5; // This could be a configurable setting
  if (post.stats.reportCount >= reportThreshold && post.status === "active") {
    post.status = "under-review";
  }

  await post.save();

  // Notify admins about the report (this could be done via a notification system)

  return {
    message: "Post reported successfully",
    reportCount: post.stats.reportCount,
  };
};

// Admin: Get reported posts
export const getReportedPostsService = async ({
  query,
  user,
}: {
  query: ReportedPostsQuery;
  user?: any;
}) => {
  // Check if user is admin
  if (user?.role !== "admin") {
    throw new ForbiddenException("Admin access required");
  }

  const {
    page = 1,
    limit = 20,
    status = "pending",
    sortBy = "reportCount",
    sortDirection = "desc",
  } = query;

  const skip = (page - 1) * limit;

  // Build filter for posts with reports
  const filter: any = {
    "stats.reportCount": { $gt: 0 },
  };

  // Additional filters for report status
  if (status && status !== "all") {
    filter["reports.status"] = status;
  }

  // Create sort object
  const sort: any = {};

  if (sortBy === "reportCount") {
    sort["stats.reportCount"] = sortDirection === "asc" ? 1 : -1;
  } else {
    sort[sortBy] = sortDirection === "asc" ? 1 : -1;
  }

  // Get posts with pagination
  const posts = await PostModel.find(filter)
    .populate("authorId", "fullName profilePicture email")
    .populate({
      path: "reports.userId",
      select: "fullName email",
    })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalPosts = await PostModel.countDocuments(filter);

  return {
    posts,
    pagination: {
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    },
  };
};

// Admin: Resolve a post report
export const resolveReportService = async ({ 
  postId, 
  reportId, 
  body, 
  user 
}: { 
  postId: string; 
  reportId: string;
  body: any; 
  user?: any;
}) => {
  // Check if user is admin
  if (user?.role !== 'admin') {
    throw new ForbiddenException('Admin access required');
  }
  
  const { status, response } = body;
  
  if (!['resolved', 'rejected'].includes(status)) {
    throw new BadRequestException('Invalid status value');
  }
  
  const post = await PostModel.findById(postId);
  
  if (!post) {
    throw new NotFoundException('Post not found');
  }
  
  // Find the specific report
  const reportIndex = post.reports?.findIndex(
    report => (report._id as unknown as string)=== reportId
  );
  
  if (reportIndex === undefined || reportIndex === -1) {
    throw new NotFoundException('Report not found');
  }
  
  // Update report status
  if (post.reports) {
    post.reports[reportIndex].status = status;
    post.reports[reportIndex].response = response || '';
    post.reports[reportIndex].resolvedAt = new Date();
    post.reports[reportIndex].resolvedBy = user._id;
  }
  
  await post.save();
  
  return {
    message: `Report marked as ${status}`,
    post
  };
};

// Get featured posts (for homepage)
export const getFeaturedPostsService = async ({ 
  limit = 5 
}: { 
  limit?: number;
}) => {
  // Get most popular posts (by view count, likes, comments)
  const featuredPosts = await PostModel.find({
    status: 'active',
    visibility: 'public',
    isFeatured: true // You'd need to add this field to your schema
  })
    .populate('authorId', 'fullName profilePicture')
    .populate('petIds', 'name species breed profilePicture')
    .sort({ 'stats.viewCount': -1, 'stats.likeCount': -1 })
    .limit(limit);
  
  // If not enough featured posts, add popular ones
  if (featuredPosts.length < limit) {
    const remainingLimit = limit - featuredPosts.length;
    
    // Get popular posts that aren't already featured
    const featuredIds = featuredPosts.map(post => post._id);
    
    const popularPosts = await PostModel.find({
      _id: { $nin: featuredIds },
      status: 'active',
      visibility: 'public'
    })
      .populate('authorId', 'fullName profilePicture')
      .populate('petIds', 'name species breed profilePicture')
      .sort({ 'stats.viewCount': -1, 'stats.likeCount': -1 })
      .limit(remainingLimit);
    
    featuredPosts.push(...popularPosts);
  }
  
  return { posts: featuredPosts };
};

// Admin: Set a post as featured
export const setPostFeatureService = async ({
  postId,
  featured,
  user,
}: {
  postId: string;
  featured: boolean;
  user?: any;
}) => {
  // Check if user is admin
  if (user?.role !== "admin") {
    throw new ForbiddenException("Admin access required");
  }

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  // Set featured status
  post.isFeatured = featured;

  await post.save();

  return {
    message: featured ? "Post set as featured" : "Post removed from featured",
    post,
  };
};

// Get user's own posts
export const getUserPostsService = async ({
  query,
  user,
}: {
  query: PostQuery;
  user?: any;
}) => {
  // Check if user exists
  if (!user?._id) {
    throw new ForbiddenException("Authentication required");
  }

  const {
    page = 1,
    limit = 10,
    status = "all",
    sortBy = "createdAt",
    sortDirection = "desc",
  } = query;

  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = {
    authorId: user._id,
  };

  if (status && status !== "all") {
    filter.status = status;
  }

  // Create sort object
  const sort: any = {};
  sort[sortBy] = sortDirection === "asc" ? 1 : -1;

  // Get posts with pagination
  const posts = await PostModel.find(filter)
    .populate("petIds", "name species breed profilePicture")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalPosts = await PostModel.countDocuments(filter);

  // Get engagement stats for each post
  const postsWithStats = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await CommentModel.countDocuments({
        postId: post._id,
      });
      const reactionCount = await ReactionModel.countDocuments({
        contentType: "post",
        contentId: post._id,
      });

      const postObj = post.toObject();
      postObj.engagementStats = {
        commentCount,
        reactionCount,
      };

      return postObj;
    })
  );

  return {
    posts: postsWithStats,
    pagination: {
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    },
  };
};
