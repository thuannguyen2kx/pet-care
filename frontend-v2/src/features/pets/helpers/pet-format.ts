import {
  PET_GENDER_CONFIG,
  PET_TYPE_CONFIG,
  type TPetGender,
  type TPetType,
} from '@/features/pets/constants';

export function formatPetType(type?: TPetType) {
  if (!type) return '—';
  return PET_TYPE_CONFIG[type].label;
}

export function formatGender(gender?: TPetGender) {
  if (!gender) return '—';
  return PET_GENDER_CONFIG[gender].label;
}

export function formatWeight(value?: string) {
  if (!value) return '—';
  return `${value} kg`;
}

export function formatAllergies(allergies?: { value: string }[]) {
  if (!allergies || allergies.length === 0) return 'Không có';
  return allergies.map((a) => a.value).join(', ');
}

export function getPetAge(dateOfBirth: string): string {
  const birth = new Date(dateOfBirth);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();

  if (years < 1) {
    const totalMonths = years * 12 + months;
    return totalMonths <= 0 ? 'Dưới 1 tháng' : `${totalMonths} tháng tuổi`;
  }

  if (months < 0) {
    return `${years - 1} tuổi`;
  }

  return `${years} tuổi`;
}
