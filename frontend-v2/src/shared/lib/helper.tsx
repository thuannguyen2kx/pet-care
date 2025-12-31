type PaginationItemType = { type: 'page'; page: number } | { type: 'ellipsis' };

export function getPaginationItems(current: number, total: number): PaginationItemType[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => ({
      type: 'page',
      page: i + 1,
    }));
  }

  const items: PaginationItemType[] = [];

  // First page
  items.push({ type: 'page', page: 1 });

  // Left ellipsis
  if (current > 3) {
    items.push({ type: 'ellipsis' });
  }

  // Middle pages
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    items.push({ type: 'page', page: i });
  }

  // Right ellipsis
  if (current < total - 2) {
    items.push({ type: 'ellipsis' });
  }

  // Last page
  items.push({ type: 'page', page: total });

  return items;
}
