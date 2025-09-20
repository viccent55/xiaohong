import type { ResponseConfig } from "@/types/axios";
import service from "@/utils/request";

export function adsClick(id: number): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/advert/click", {
    id: id,
  });
}
export function itemAdClick(
  id: number
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/advert/itemAdClick", {
    id: id,
  });
}
