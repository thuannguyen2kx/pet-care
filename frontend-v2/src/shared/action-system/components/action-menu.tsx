import { MoreVertical } from 'lucide-react';

import type { AdminAction } from '@/shared/action-system/types';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export function ActionMenu<T, K extends string = string>({
  actions,
  onActionClick,
}: {
  actions: AdminAction<T, K>[];
  onActionClick: (action: AdminAction<T, K>) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => onActionClick(action)}
            className={action.variant === 'destructive' ? 'text-destructive' : ''}
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
