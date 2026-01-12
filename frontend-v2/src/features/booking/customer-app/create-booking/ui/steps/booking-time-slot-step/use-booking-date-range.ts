export function useBookingDateRange(days = 14) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return {
      iso: date.toISOString().split('T')[0],
      day: date.getDate(),
      weekday: date.getDay(),
      isToday: i === 0,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });
}
