export interface ResponseConfig<T> {
  code: number;
  msg: string;
  errcode: number;
  info?: string;
  data: T;
}

export interface ListConfig<T> {
  list: T[];
  total: number;
}
