import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { PostStatusBadge } from "../post-status-badge";
import { PostType } from "@/features/post/types/api.types";

interface PostListTableProps {
  posts: PostType[];
  onView: (post: PostType) => void;
  onEdit: (post: PostType) => void;
  onDelete: (post: PostType) => void;
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
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title/Content</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const author = typeof post.authorId === 'object' ? post.authorId : { fullName: 'Unknown' };
            const createdAt = new Date(post.createdAt);
            
            return (
              <TableRow key={post._id}>
                <TableCell className="font-medium">
                  {post.title ? (
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-gray-500 truncate max-w-60">{post.content}</div>
                    </div>
                  ) : (
                    <div className="truncate max-w-60">{post.content}</div>
                  )}
                </TableCell>
                <TableCell>{author.fullName}</TableCell>
                <TableCell>{formatDistanceToNow(createdAt, { addSuffix: true })}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PostStatusBadge status={post.status} />
                    {post.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">👁️ {post.stats.viewCount}</span>
                    <span className="text-sm">👍 {post.stats.likeCount}</span>
                    <span className="text-sm">💬 {post.stats.commentCount}</span>
                    {post.stats.reportCount && post.stats.reportCount > 0 && (
                      <span className="text-sm text-red-500">🚩 {post.stats.reportCount}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(post)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      {onUpdateStatus && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(post)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Moderate</span>
                        </DropdownMenuItem>
                      )}
                      {onSetFeatured && (
                        <DropdownMenuItem
                          onClick={() => onSetFeatured(post, !post.isFeatured)}
                        >
                          <span className="mr-2">⭐</span>
                          <span>{post.isFeatured ? 'Unfeature' : 'Feature'}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete(post)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
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
