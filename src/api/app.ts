import type { ResponseConfig } from "@/types/axios";
import service from "@/utils/request";

export function firstVisitInApp(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/app/firstVisitInApp", params);
}


export function installPwa(
  param: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/app/pwaInstalled", param);
}