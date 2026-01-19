import { TabsContent } from '@radix-ui/react-tabs';
import { Plus } from 'lucide-react';

import { AdminCreatePostWidget } from '@/features/post/admin-app/post-list/widgets/create-post';
import { AdminExplorePostWidget } from '@/features/post/admin-app/post-list/widgets/explore-post';
import { FeaturedPostsWidget } from '@/features/post/admin-app/post-list/widgets/featured-posts';
import { AdminMyPostsWidget } from '@/features/post/admin-app/post-list/widgets/my-posts';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export default function AdminPostListPage() {
  return (
    <div className="mx-auto space-y-6 px-4">
      <div className="mx-auto w-full max-w-4xl">
        <Tabs defaultValue="explore-post" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger
              value="explore-post"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-foreground gap-2"
            >
              Khám phá
            </TabsTrigger>
            <TabsTrigger
              value="featured-post"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-foreground gap-2"
            >
              Nổi bật
            </TabsTrigger>
            <TabsTrigger
              value="my-posts"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-foreground gap-2"
            >
              Của bạn
            </TabsTrigger>
            <TabsTrigger
              value="create-post"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-foreground gap-2"
            >
              <Plus className="mr-0.5 h-4 w-4" />
              Tạo bài viết
            </TabsTrigger>
          </TabsList>
          <TabsContent value="explore-post">
            <AdminExplorePostWidget />
          </TabsContent>
          <TabsContent value="featured-post">
            <FeaturedPostsWidget />
          </TabsContent>

          <TabsContent value="my-posts">
            <AdminMyPostsWidget />
          </TabsContent>
          <TabsContent value="create-post">
            <AdminCreatePostWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
