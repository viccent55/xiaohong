import type { ResponseConfig } from "@/types/axios";
import service from "@/utils/request";

export function animeList(
  param: object
): Promise<EmptyObjectType> {
  return service.post("/cartoonVideo/select", {});
}
export function animeDetail(
  id: number
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/cartoonVideo/detail", {
    id: id,
  });
}
