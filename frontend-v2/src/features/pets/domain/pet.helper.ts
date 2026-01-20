export function formatWeight(value?: number) {
  if (!value) return '—';
  return `${value} kg`;
}

export function formatAllergies(allergies?: { value: string }[]) {
  if (!allergies || allergies.length === 0) return 'Không có';
  return allergies.map((a) => a.value).join(', ');
}

export function getPetAge(dateOfBirth: Date): string {
  const now = new Date();
  const years = now.getFullYear() - dateOfBirth.getFullYear();
  const months = now.getMonth() - dateOfBirth.getMonth();

  if (years < 1) {
    const totalMonths = years * 12 + months;
    return totalMonths <= 0 ? 'Dưới 1 tháng' : `${totalMonths} tháng tuổi`;
  }

  if (months < 0) {
    return `${years - 1} tuổi`;
  }

  return `${years} tuổi`;
}
