import axiosInstance from "@/lib/axios";
import type { Subcategoria, SubcategoriaCreate, SubcategoriaUpdate } from "@/types/api";

class SubcategoriasService {
  list = async (params?: { marca_id?: number }) => {
    const resp = await axiosInstance.get<Subcategoria[]>("/subcategorias", { params });
    return resp.data;
  };

  getById = async (id: number) => {
    const resp = await axiosInstance.get<Subcategoria>(`/subcategorias/${id}`);
    return resp.data;
  };

  create = async (payload: SubcategoriaCreate) => {
    const resp = await axiosInstance.post<Subcategoria>("/subcategorias", payload);
    return resp.data;
  };

  update = async ({ id, payload }: { id: number; payload: SubcategoriaUpdate }) => {
    const resp = await axiosInstance.patch<Subcategoria>(`/subcategorias/${id}`, payload);
    return resp.data;
  };

  remove = async (id: number) => {
    await axiosInstance.delete(`/subcategorias/${id}`);
    return { id };
  };
}

export default new SubcategoriasService();
