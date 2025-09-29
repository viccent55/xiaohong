import type { ResponseConfig } from "@/types/axios";
import service from "@/utils/request";

export function articlList(param: object): Promise<EmptyObjectType> {
  return service.post("/scand/select", {});
}
export function articleDtail(
  id: number
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/scand/detail", {
    id: id,
  });
}

export function comments(id: number): Promise<EmptyObjectType> {
  return service.post("/scand/comments", {
    id,
  });
}
export function comment(params: object): Promise<EmptyObjectType> {
  return service.post("/behavior/commentScand", params);
}
export function like(id: number): Promise<EmptyObjectType> {
  return service.post("/behavior/likeScand", {
    id,
  });
}
export function star(id: number): Promise<EmptyObjectType> {
  return service.post("/behavior/starScand", {
    id,
  });
}
