import { AppProvider } from '@/app/providers';
import { AppRouter } from '@/app/router';

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
