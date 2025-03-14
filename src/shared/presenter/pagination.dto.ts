import { IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * DTO for paginated result.
 * @template T - The type of items in the paginated result.
 */
export class PaginationResultDto<T> {
  status: ResponseStatus;
  total: number;
  page: {
    index: number;
    size: number;
    items: T[];
  };
}

/**
 * DTO for pagination query parameters.
 */
export class PaginationQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 0))
  page: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  size: number;
}
