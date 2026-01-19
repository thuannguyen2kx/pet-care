import { Image, Send } from 'lucide-react';

import { MyPostsWidget } from '@/features/customer/customer-app/profile/widgets/my-posts';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  onCreatePost: () => void;
};
export function MyPostsTab({ onCreatePost }: Props) {
  return (
    <div className="bg-card p-4">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="border-border space-y-3 rounded-xl border p-4">
          <Textarea
            placeholder="Chia sẻ khoảnh khắc với thú cưng của bạn..."
            className="min-h-20 resize-none border-0 p-0 focus-visible:ring-0"
            onFocus={onCreatePost}
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
              <Image className="h-4 w-4" />
              Thêm ảnh
            </Button>
            <Button size="sm" className="gap-2" onClick={onCreatePost}>
              <Send className="h-4 w-4" />
              Đăng
            </Button>
          </div>
        </div>
        <MyPostsWidget />
      </div>
    </div>
  );
}
