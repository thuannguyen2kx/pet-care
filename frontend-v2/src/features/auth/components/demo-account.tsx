import { ShieldCheck, Stethoscope, User, ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

interface DemoAccount {
  role: string;
  email: string;
  password: string;
  icon: React.ReactNode;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'Admin',
    email: 'admin@petcare.vn',
    password: 'Admin@123456',
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    role: 'Bác sĩ',
    email: 'bacsi.hai@petcare.vn',
    password: 'Employee@123',
    icon: <Stethoscope className="h-4 w-4" />,
  },
  {
    role: 'Khách hàng',
    email: 'nguyenvana@gmail.com',
    password: 'Customer@123',
    icon: <User className="h-4 w-4" />,
  },
];

interface DemoAccountsProps {
  onSelectAccount: (email: string, password: string) => void;
}

export const DemoAccounts = ({ onSelectAccount }: DemoAccountsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const handleSelect = (account: DemoAccount) => {
    setActiveRole(account.role);
    onSelectAccount(account.email, account.password);
    // Reset visual feedback sau 1s
    setTimeout(() => setActiveRole(null), 1000);
  };

  return (
    <div className="w-full">
      {/* Trigger Button - Minimalist Style */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group text-muted-foreground hover:text-foreground flex w-full items-center justify-between py-2 text-xs font-medium transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="text-primary/70 h-3.5 w-3.5" />
          <span>Dùng tài khoản trải nghiệm</span>
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-300',
            isOpen ? 'rotate-180' : 'text-muted-foreground/50',
          )}
        />
      </button>

      {/* Content Area - Smooth Collapse */}
      <div
        className={cn(
          'grid gap-2 overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'mt-2 max-h-50 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((account) => {
            const isActive = activeRole === account.role;
            return (
              <button
                key={account.email}
                type="button"
                onClick={() => handleSelect(account)}
                className={cn(
                  'border-border/40 bg-background relative flex flex-col items-center justify-center gap-2 rounded-lg border py-3 transition-all duration-200',

                  'hover:border-primary/30 hover:background/90 hover:shadow-sm',
                  'active:scale-[0.98]',
                  isActive && 'border-primary bg-primary/5 ring-primary/20 ring-1',
                )}
              >
                <div
                  className={cn(
                    'bg-secondary/50 text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    isActive && 'bg-primary text-primary-foreground',
                  )}
                >
                  {account.icon}
                </div>
                <div className="text-center">
                  <div className="text-foreground text-[11px] leading-none font-medium">
                    {account.role}
                  </div>
                  {isActive && (
                    <span className="animate-in fade-in slide-in-from-top-1 text-primary absolute inset-x-0 -bottom-4 text-[10px] font-medium">
                      Đã điền!
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-muted-foreground/60 px-1 text-[10px] italic">
          *Click để tự động điền email & mật khẩu
        </p>
      </div>
    </div>
  );
};
