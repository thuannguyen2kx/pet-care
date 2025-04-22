import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, MessageSquare, Flag, Share2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PostType } from "@/features/post/types/api.types";
import { PostStatusBadge } from "../post-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostType;
  onClick?: (post: PostType) => void;
  compact?: boolean;
}

export function PostCard({ post, onClick, compact = false }: PostCardProps) {
  const handleClick = () => {
    if (onClick) onClick(post);
  };

  const isReported = post.stats.reportCount && post.stats.reportCount > 0;
  const author = typeof post.authorId === 'object' ? post.authorId : { fullName: 'Người dùng ẩn danh', profilePicture: {url: ""} };
  
  // Format creation date
  const createdAtDate = new Date(post.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true, locale: vi });

  return (
    <Card 
      className={cn(
        "w-full overflow-hidden transition-all hover:bg-accent/5",
        onClick ? "cursor-pointer" : "",
        compact ? "shadow-sm" : "shadow"
      )}
      onClick={handleClick}
    >
      <CardHeader className="py-3 flex flex-row justify-between items-center space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={author.profilePicture?.url || ""} alt={author.fullName} />
            <AvatarFallback>{author.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{author.fullName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {post.isFeatured && (
            <Badge className="bg-purple-500 text-white hover:bg-purple-600">Nổi bật</Badge>
          )}
          <PostStatusBadge status={post.status} />
        </div>
      </CardHeader>
      
      <CardContent className={compact ? "py-2" : "py-4"}>
        {post.title && <h3 className="font-semibold mb-2">{post.title}</h3>}
        <p className={`text-gray-700 ${compact ? "line-clamp-2" : "line-clamp-4"}`}>
          {post.content}
        </p>
        
        {!compact && post.media && post.media.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {post.media.slice(0, 2).map((item, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-md">
                {item.type === 'image' ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">Video</span>
                  </div>
                )}
              </div>
            ))}
            {post.media.length > 2 && (
              <div className="col-span-2 text-sm text-muted-foreground mt-1">
                +{post.media.length - 2} nội dung khác
              </div>
            )}
          </div>
        )}
        
        {!compact && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="py-3 border-t flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.stats.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.stats.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.stats.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{post.stats.shareCount || 0}</span>
          </div>
        </div>
        
        {isReported && (
          <div className="flex items-center gap-1 text-red-500">
            <Flag className="w-4 h-4" />
            <span>{post.stats.reportCount}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}