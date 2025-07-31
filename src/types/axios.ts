export interface ResponseConfig<T> {
  code: number
  msg?: string
  data: T
}

export interface ListConfig<T> {
  list: T[]
  total: number
}
