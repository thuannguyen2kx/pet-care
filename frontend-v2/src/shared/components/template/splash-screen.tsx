import { Logo } from '@/shared/ui/logo';

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 h-dvh w-full">
      <div className="flex h-full w-full items-center justify-center">
        <Logo />
      </div>
    </div>
  );
};
