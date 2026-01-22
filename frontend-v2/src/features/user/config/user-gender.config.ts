import type { UserGender } from '@/features/user/domain/user.entity';

type UserGenderConfig = {
  label: string;
};
export const USER_GENDER_CONFIG: Record<UserGender, UserGenderConfig> = {
  MALE: {
    label: 'Nam',
  },
  FEMALE: {
    label: 'Nu',
  },
};

export const getUserGenderConfig = (gender: UserGender) => USER_GENDER_CONFIG[gender];
export const formatUserGender = (gender: UserGender) => USER_GENDER_CONFIG[gender].label;
