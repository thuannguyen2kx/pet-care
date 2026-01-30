import { Moon, Search, Sun } from 'lucide-react';

import { AdminNotificationDropdown } from '@/features/notification/admin-app/notification-list/ui/notification-dropdown';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useThemeStore } from '@/stores/theme.store';

type Props = {
  title: string;
  description?: string;
};

export function DashboardHeader({ title, description }: Props) {
  const { isDark, toggleDarkMode } = useThemeStore();
  return (
    <header className="bg-card border-border flex items-center justify-between border-b px-6 py-3">
      <div>
        <h1 className="h5-bold text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Tìm kiếm"
            className="bg-muted/50 focus-visible::ring-1 w-64 border-0 pl-9"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-muted-foreground"
        >
          {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>

        <AdminNotificationDropdown />
      </div>
    </header>
  );
}
