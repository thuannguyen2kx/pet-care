import { Edit, MoreVertical, Pin, Trash2 } from 'lucide-react';

import type { Post } from '@/features/post/domain/post.entity';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

type Props = {
  post: Post;
  onSetFeatured: (postId: string, featured: boolean) => void;
};
export function AdminPostActions({ post, onSetFeatured }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSetFeatured(post.id, !post.isFeatured)}>
          <Pin className="mr-2 h-4 w-4" />
          {post.isFeatured ? 'Bỏ ghim bài viết' : 'Ghim bài viết'}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem>
          Chuyển sang công khai
          {/* {post.visibility === 'public' ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Chuyển sang riêng tư
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Chuyển sang công khai
            </>
          )} */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="text-destructive mr-2 h-4 w-4" />
          Xóa bài viết
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
