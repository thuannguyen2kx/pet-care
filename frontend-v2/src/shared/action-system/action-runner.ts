import type { ActionContext, AdminAction } from '@/shared/action-system/types';
import type { useConfirmDialog } from '@/shared/components/confirm';

export async function runAdminAction<T, K extends string = string>(
  action: AdminAction<T, K>,
  ctx: ActionContext<T, K>,
  confirm: ReturnType<typeof useConfirmDialog>,
) {
  if (action.confirm) {
    const ok = await confirm({
      title: action.confirm.title,
      message: action.confirm.description,
      confirmText: action.confirm.confirmText,
    });
    if (!ok) return;
  }
  if (action.enabled && !action.enabled(ctx)) return;
  await action.run(ctx);
}
