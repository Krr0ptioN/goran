/**
 * @template T - Data type
 * @param array - Data
 * @param pageSize - Size of the page
 * @param pageNumber - Page index
 * @returns Paginated data
 */
export function paginateArray<T>(
  array: T[],
  pageSize: number,
  pageNumber: number
) {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}
