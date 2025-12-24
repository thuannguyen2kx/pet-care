import { useLayoutEffect } from 'react';

import { ROLES, type TRole } from '../constant/roles';
import { THEME, type TTheme } from '../types';

import { useThemeStore } from '@/stores/theme.store';

export const useRoleTheme = (role: TRole) => {
  const setTheme = useThemeStore((s) => s.setTheme);

  useLayoutEffect(() => {
    const themeMap: Record<TRole, TTheme> = {
      [ROLES.ADMIN]: THEME.ADMIN,
      [ROLES.EMPLOYEE]: THEME.EMPLOYEE,
      [ROLES.CUSTOMER]: THEME.CUSTOMER,
    };

    const theme = themeMap[role] || THEME.CUSTOMER;
    setTheme(theme);
  }, [role, setTheme]);
};
