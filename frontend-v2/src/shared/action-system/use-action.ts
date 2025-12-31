import { runAdminAction } from '@/shared/action-system/action-runner';
import type { ActionContext, AdminAction } from '@/shared/action-system/types';
import { useConfirmDialog } from '@/shared/components/confirm';

export function useAdminActions<T, K extends string = string>(
  actions: AdminAction<T, K>[],
  entity: T,
  options: {
    handlers: ActionContext<T, K>['handlers'];
    onClose?: () => void;
  },
) {
  const confirm = useConfirmDialog();

  const ctx: ActionContext<T, K> = {
    entity,
    close: options.onClose ?? (() => {}),
    handlers: options.handlers,
  };

  const visibleActions = actions.filter((action) => action.visible?.(ctx) ?? true);

  const onActionClick = async (action: AdminAction<T, K>) => {
    await runAdminAction(action, ctx, confirm);
  };
  return {
    actions: visibleActions,
    onActionClick,
  };
}
