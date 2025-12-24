import { useUser } from '@/shared/lib/auth';

export default function CustomerRoute() {
  const user = useUser();

  console.log('customer', user.data);
  return <div>Customer</div>;
}
