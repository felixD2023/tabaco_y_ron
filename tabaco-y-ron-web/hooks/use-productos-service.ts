import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query-keys";
import productosService from "@/services/productos.service";
import type { ProductosListParams } from "@/types/api";

const useProductosService = () => {
  const queryClient = useQueryClient();

  const useList = (params?: ProductosListParams) =>
    useQuery({
      queryKey: QUERY_KEYS.productos(params as Record<string, unknown> | undefined),
      queryFn: () => productosService.list(params),
      placeholderData: (prev) => prev, // mantiene la página previa mientras llega la nueva
    });

  const useGetById = (id: number, enabled: boolean = true) =>
    useQuery({
      queryKey: QUERY_KEYS.producto(id),
      queryFn: () => productosService.getById(id),
      enabled,
    });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["productos"] });
  };

  const useCreate = () =>
    useMutation({ mutationFn: productosService.create, onSuccess: invalidateAll });

  const useUpdate = () =>
    useMutation({
      mutationFn: productosService.update,
      onSuccess: (_, variables) => {
        invalidateAll();
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.producto(variables.id) });
      },
    });

  const useRemove = () =>
    useMutation({ mutationFn: productosService.remove, onSuccess: invalidateAll });

  return { useList, useGetById, useCreate, useUpdate, useRemove };
};

export default useProductosService;
