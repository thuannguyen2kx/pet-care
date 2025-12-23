const THEME = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

type TTheme = (typeof THEME)[keyof typeof THEME];

export { THEME, type TTheme };
