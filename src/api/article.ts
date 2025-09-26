import type { ResponseConfig } from "@/types/axios";
import service from "@/utils/request";

export function articlList(
  param: object
): Promise<EmptyObjectType> {
  return service.post("/scand/select", {});
}
export function articleDtail(
  id: number
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/scand/detail", {
    id: id,
  });
}
