export const PET_TYPES = ["dog", "cat"] as const;
export type PetType = (typeof PET_TYPES)[number];

export const PET_GENDERS = ["male", "female"] as const;
export type PetGender = (typeof PET_GENDERS)[number];
