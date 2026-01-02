export function mapDateRangeToApiParams(range: { startDate: Date; endDate: Date }) {
  return {
    startDate: range.startDate.toISOString(),
    endDate: range.endDate.toISOString(),
  };
}
