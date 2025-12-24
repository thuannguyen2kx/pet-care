import { Icons } from '@/shared/components/icons';
import { AUTH_ENDPOINTS } from '@/shared/config/api-endpoints';
import { env } from '@/shared/config/env';
import { Button } from '@/shared/ui/button';

export const GoogleOauthButton = ({ label }: { label: string }) => {
  const handleClick = () => {
    window.location.href = `${env.API_URL}${AUTH_ENDPOINTS.GOOGLE_OAUTH}`;
  };
  return (
    <Button onClick={handleClick} type="button" variant="outline" className="w-full bg-transparent">
      <Icons.google className="mr-2 h-4 w-4" />
      {label} với Google
    </Button>
  );
};
