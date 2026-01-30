import { Moon, Search, Sun } from 'lucide-react';

import { EmployeeNotificationDropdown } from '@/features/notification/employee-app/notification-list/ui/notification-dropdown';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useThemeStore } from '@/stores/theme.store';

type Props = {
  title: string;
  description?: string;
};
export const EmployeeDashboardHeader = ({ title, description }: Props) => {
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
            className="bg-muted/50 w-64 border-0 pl-9 focus-visible:ring-1"
            placeholder="Tìm kiếm..."
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

        <EmployeeNotificationDropdown />
      </div>
    </header>
  );
};
