import type { ResponseConfig } from "@/types/axios";
import axios from "@/utils/request";

export function gePostionAds(
  id: number
): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/advert/getByPosition", {
    position: id,
  });
}

export function adsClick(id: number): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/advert/click", {
    id: id,
  });
}
export function itemAdClick(
  id: number
): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/advert/itemAdClick", {
    id: id,
  });
}
