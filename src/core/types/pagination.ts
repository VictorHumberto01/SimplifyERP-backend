export type Pagination = {
  page: number;
  limit: number;
};

export type PaginationResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};
