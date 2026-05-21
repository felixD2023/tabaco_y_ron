import axiosInstance from "@/lib/axios";
import type {
  Producto,
  ProductoCreate,
  ProductoDetail,
  ProductoListResponse,
  ProductoUpdate,
  ProductosListParams,
} from "@/types/api";

class ProductosService {
  list = async (params?: ProductosListParams) => {
    const resp = await axiosInstance.get<ProductoListResponse>("/productos", {
      params,
      // Axios serializa arrays como `marca_id[]=1`; FastAPI espera `marca_id=1&marca_id=2`.
      paramsSerializer: { indexes: null },
    });
    return resp.data;
  };

  getById = async (id: number) => {
    const resp = await axiosInstance.get<ProductoDetail>(`/productos/${id}`);
    return resp.data;
  };

  create = async (payload: ProductoCreate) => {
    const resp = await axiosInstance.post<Producto>("/productos", payload);
    return resp.data;
  };

  update = async ({ id, payload }: { id: number; payload: ProductoUpdate }) => {
    const resp = await axiosInstance.patch<Producto>(`/productos/${id}`, payload);
    return resp.data;
  };

  remove = async (id: number) => {
    await axiosInstance.delete(`/productos/${id}`);
    return { id };
  };
}

export default new ProductosService();
