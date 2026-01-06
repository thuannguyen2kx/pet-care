// map-query-to-search-params.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapQueryToSearchParams(query: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return params;
}
