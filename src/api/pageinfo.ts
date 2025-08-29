import type { ResponseConfig } from "@/types/axios";
import axios from "@/utils/request";

export function getPageInfo(pageName: string): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/index/page", {
    id: pageName,
  });
}
