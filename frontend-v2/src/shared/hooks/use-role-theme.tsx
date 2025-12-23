import { useLayoutEffect } from 'react';

import { THEME, type TTheme } from '../types';

import { useThemeStore } from '@/stores/theme.store';

export const useRoleTheme = (role: string = 'user') => {
  const setTheme = useThemeStore((s) => s.setTheme);

  useLayoutEffect(() => {
    const themeMap: Record<string, TTheme> = {
      admin: THEME.ADMIN,
      employee: THEME.EMPLOYEE,
      customer: THEME.CUSTOMER,
    };

    const theme = themeMap[role] || THEME.CUSTOMER;
    setTheme(theme);
  }, [role, setTheme]);
};
