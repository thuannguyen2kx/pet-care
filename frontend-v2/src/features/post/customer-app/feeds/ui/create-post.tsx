import { Camera, ImagePlus, Send, Smile } from 'lucide-react';

import { useUser } from '@/shared/lib/auth';
import { getInitials } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';

type Props = {
  onCreate: () => void;
};
export function CreatePostWidget({ onCreate }: Props) {
  const user = useUser();
  const profile = user.data?.profile;
  return (
    <Card className="rounded-none border-none p-4 shadow-none" onClick={onCreate}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatarUrl ?? undefined} />
            <AvatarFallback>{getInitials(profile?.displayName ?? '')}</AvatarFallback>
          </Avatar>
          <div className="group flex-1">
            <Textarea
              placeholder="Chia sẻ khoảnh khắc với thú cưng của bạn..."
              className="bg-secondary/50 focus:bg-background resize-none border-transparent"
              rows={2}
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1 transition-all duration-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary h-9 w-9"
                >
                  <ImagePlus className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary h-9 w-9"
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary h-9 w-9"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Send className="mr-1 h-4 w-4" />
                  Đăng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
