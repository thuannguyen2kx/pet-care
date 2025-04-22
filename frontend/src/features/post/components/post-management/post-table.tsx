import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  ShieldAlert,
  MessageCircle,
  ThumbsUp, 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PostStatusBadge } from "../post-status-badge";
import { PostType } from "@/features/post/types/api.types";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostListTableProps {
  posts: PostType[];
  onView: (post: PostType) => void;
  onEdit: (post: PostType) => void;
  onDelete: (postId: string) => void;
  onUpdateStatus?: (post: PostType) => void;
  onSetFeatured?: (post: PostType, featured: boolean) => void;
}

export function PostListTable({ 
  posts, 
  onView, 
  onEdit, 
  onDelete,
  onUpdateStatus,
  onSetFeatured
}: PostListTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-slate-200">
            <TableHead className="font-semibold">Nội dung</TableHead>
            <TableHead className="font-semibold">Tác giả</TableHead>
            <TableHead className="font-semibold">Thời gian</TableHead>
            <TableHead className="font-semibold">Trạng thái</TableHead>
            <TableHead className="font-semibold">Tương tác</TableHead>
            <TableHead className="text-right font-semibold">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const author = typeof post.authorId === 'object' ? post.authorId : { fullName: 'Không xác định', profilePicture: { url: "" } };
            const createdAt = new Date(post.createdAt);
            
            return (
              <TableRow key={post._id} className="group hover:bg-muted/50">
                <TableCell className="font-medium cursor-pointer" onClick={() => onView(post)}>
                  {post.title ? (
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">{post.title}</div>
                      <div className="text-muted-foreground truncate max-w-60 text-sm">{post.content}</div>
                    </div>
                  ) : (
                    <div className="truncate max-w-60 group-hover:text-primary transition-colors">{post.content}</div>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant={"secondary"} className="text-xs px-1 py-0">
                          #{tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={author.profilePicture?.url || ""} 
                        alt={author.fullName} 
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {author.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{author.fullName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(createdAt, { addSuffix: true, locale: vi })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PostStatusBadge status={post.status} />
                    {post.isFeatured && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              <span className="text-xs">Nổi bật</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Bài viết được đánh dấu nổi bật</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="inline-flex items-center">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {post.stats.viewCount}
                      </span>
                      <span className="inline-flex items-center ml-2">
                       <ThumbsUp className="h-3.5 w-3.5 mr-1" /> 
                        {post.stats.likeCount}
                      </span>
                      <span className="inline-flex items-center ml-2">
                        <MessageCircle className="h-3.5 w-3.5 mr-1" />
                        {post.stats.commentCount}
                      </span>
                    </div>
                    {( (post.stats.reportCount || 0) > 0) && (
                      <Badge variant="destructive" className="w-fit text-xs">
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        {post.stats.reportCount} báo cáo
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(post)} className="cursor-pointer gap-2">
                        <Eye className="h-4 w-4" />
                        <span>Xem chi tiết</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(post)} className="cursor-pointer gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      {onUpdateStatus && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(post)} className="cursor-pointer gap-2">
                          <ShieldAlert className="h-4 w-4" />
                          <span>Kiểm duyệt</span>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      {onSetFeatured && (
                        <DropdownMenuItem
                          onClick={() => onSetFeatured(post, !post.isFeatured)}
                          className="cursor-pointer gap-2"
                        >
                          <Star className={`h-4 w-4 ${post.isFeatured ? "text-amber-500" : ""}`} />
                          <span>{post.isFeatured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}</span>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        onClick={() => onDelete(post._id)}
                        className="text-red-600 focus:text-red-600 cursor-pointer gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Xóa bài viết</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}