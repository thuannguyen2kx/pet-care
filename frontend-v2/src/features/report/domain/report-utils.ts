import { endOfMonth, formatISO, startOfMonth } from 'date-fns';

export const getDefaultRevenueChartRange = () => {
  const now = new Date();

  return {
    from: formatISO(startOfMonth(now), { representation: 'date' }),
    to: formatISO(endOfMonth(now), { representation: 'date' }),
    groupBy: 'day' as const,
  };
};
