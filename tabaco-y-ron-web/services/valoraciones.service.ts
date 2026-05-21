import axiosInstance from "@/lib/axios";
import type { Valoracion, ValoracionCreate } from "@/types/api";

class ValoracionesService {
  list = async (params?: { producto_id?: number }) => {
    const resp = await axiosInstance.get<Valoracion[]>("/valoraciones", { params });
    return resp.data;
  };

  create = async (payload: ValoracionCreate) => {
    const resp = await axiosInstance.post<Valoracion>("/valoraciones", payload);
    return resp.data;
  };
}

export default new ValoracionesService();
