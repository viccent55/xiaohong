export interface ResponseConfig<T> {
  code: number;
  msg: string;
  errcode: number;
  info?: string;
  data: T[];
}

export interface ListConfig<T> {
  items: T[];
  total: number;
}
