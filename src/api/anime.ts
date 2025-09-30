import type { ResponseConfig } from "@/types/axios";
import service from "@/utils/request";

export function animeList(param: object): Promise<EmptyObjectType> {
  return service.post("/cartoonVideo/select", param);
}
export function animeDetail(
  id: number
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/cartoonVideo/detail", {
    id: id,
  });
}

export function like(id: number): Promise<EmptyObjectType> {
  return service.post("/behavior/likeCartoonVideo", {
    id,
  });
}
export function star(id: number): Promise<EmptyObjectType> {
  return service.post("/behavior/starCartoonVideo", {
    id,
  });
}
