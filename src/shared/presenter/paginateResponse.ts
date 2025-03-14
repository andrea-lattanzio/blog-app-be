import { PaginationResultDto, ResponseStatus } from './pagination.dto';

/**
 * Paginates the response data by structuring it in a standard format.
 *
 * @template T - The type of items being paginated.
 * @param {number} page - The current page index (starting from 1).
 * @param {T[]} items - The array of items to be included in the current page.
 * @param {number} total - The total number of items available (for pagination purposes).
 * @param {boolean} [error=false] - Optional flag to indicate if the response should be marked as an error.
 * @returns {PaginationResultDto<T>} - The formatted pagination response.
 *
 * @example
 * const paginatedResponse = paginateResponse(1, customers, 100);
 */
export function paginateResponse<T>(
  page: number,
  items: T[],
  total: number,
  error: boolean = false,
): PaginationResultDto<T> {
  return {
    status: error ? ResponseStatus.ERROR : ResponseStatus.SUCCESS,
    total,
    page: {
      index: page,
      size: items.length,
      items,
    },
  };
}
