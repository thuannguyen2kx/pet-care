import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeaturedPostsQuery } from "../hooks/queries/get-features-post";
import { PostType } from "../types/api.types";
import SimpleImageCarousel from "@/components/shared/image-carousel";
import { Link } from "react-router-dom";
import { getAvatarFallbackText } from "@/lib/helper";

interface PostCardProps {
  post: PostType;
}

interface PostFeaturedProps {
  limit?: number;
}

const PostCard = ({ post }: PostCardProps) => {  

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <SimpleImageCarousel media={post.media} aspectRatio="aspect-square" showNoImageMessage />

      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.authorId?.profilePicture?.url || ""} />
            <AvatarFallback>
              {getAvatarFallbackText(post.authorId?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.authorId?.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <CardTitle className="line-clamp-2">
          <Link to={`/posts/${post._id}`} className="hover:text-primary">{post.title}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags &&
            post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </Badge>
            ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span className="text-xs">{post.stats?.viewCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.stats?.likeCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{post.stats?.commentCount || 0}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const PostCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardHeader className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-full mt-2" />
      <Skeleton className="h-4 w-full mt-2" />
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="flex gap-1 mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between">
      <div className="flex gap-3">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </CardFooter>
  </Card>
);

export const PostFeatured = ({ limit = 4 }: PostFeaturedProps) => {
  const { data, isLoading, error } = useFeaturedPostsQuery(limit);

  if(isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(limit).fill(0).map((_, idx) => <PostCardSkeleton key={idx} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-500">Có lỗi xảy ra với bài viết nổi bật</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
         Thử lại 
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Bài viết nổi bật</h2> 
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.posts?.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      
      {data?.posts?.filter(post => post.isFeatured).length === 0 && (
        <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Không có bài viết nổi bật</p>
        </div>
      )}
    </div>
  );
};