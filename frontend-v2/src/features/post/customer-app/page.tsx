import { useCreatePostController } from '@/features/post/customer-app/feeds/application/use-create-post-controller';
import { CreatePostDialog } from '@/features/post/customer-app/feeds/dialog/create-post/create-post-dialog';
import { CreatePostWidget } from '@/features/post/customer-app/feeds/ui/create-post';
import { PostList } from '@/features/post/customer-app/feeds/widget/post-list';

export default function CustomerFeedsPage() {
  const createPostController = useCreatePostController();

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="space-y-6">
          <CreatePostWidget onCreate={createPostController.actions.openCreateDialog} />
          <PostList />
        </div>
      </div>
      <CreatePostDialog
        open={createPostController.state.isOpenCreateDialog}
        form={createPostController.form}
        onOpenChange={(open) => {
          if (!open) createPostController.actions.closeCreateDialog();
        }}
        isSubmitting={createPostController.state.isSubmitting}
        onSubmit={createPostController.actions.submitPost}
      />
    </>
  );
}
