export type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  count: number;
  currentPage: number;
  pageCount: number;
};
