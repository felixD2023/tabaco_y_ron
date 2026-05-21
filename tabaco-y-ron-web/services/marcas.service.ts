import axiosInstance from "@/lib/axios";
import type { Marca, MarcaCreate, MarcaUpdate } from "@/types/api";

class MarcasService {
  list = async () => {
    const resp = await axiosInstance.get<Marca[]>("/marcas");
    return resp.data;
  };

  getById = async (id: number) => {
    const resp = await axiosInstance.get<Marca>(`/marcas/${id}`);
    return resp.data;
  };

  create = async (payload: MarcaCreate) => {
    const resp = await axiosInstance.post<Marca>("/marcas", payload);
    return resp.data;
  };

  createBulk = async (payload: MarcaCreate[]) => {
    const resp = await axiosInstance.post<Marca[]>("/marcas/bulk", payload);
    return resp.data;
  };

  update = async ({ id, payload }: { id: number; payload: MarcaUpdate }) => {
    const resp = await axiosInstance.patch<Marca>(`/marcas/${id}`, payload);
    return resp.data;
  };

  remove = async (id: number) => {
    await axiosInstance.delete(`/marcas/${id}`);
    return { id };
  };
}

export default new MarcasService();
