import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query-keys";
import subcategoriasService from "@/services/subcategorias.service";

const useSubcategoriasService = () => {
  const queryClient = useQueryClient();

  const useList = (marcaId?: number) =>
    useQuery({
      queryKey: QUERY_KEYS.subcategorias(marcaId),
      queryFn: () => subcategoriasService.list({ marca_id: marcaId }),
    });

  const useGetById = (id: number, enabled: boolean = true) =>
    useQuery({
      queryKey: QUERY_KEYS.subcategoria(id),
      queryFn: () => subcategoriasService.getById(id),
      enabled,
    });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["subcategorias"] });
  };

  const useCreate = () =>
    useMutation({ mutationFn: subcategoriasService.create, onSuccess: invalidateAll });

  const useUpdate = () =>
    useMutation({
      mutationFn: subcategoriasService.update,
      onSuccess: (_, variables) => {
        invalidateAll();
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subcategoria(variables.id) });
      },
    });

  const useRemove = () =>
    useMutation({ mutationFn: subcategoriasService.remove, onSuccess: invalidateAll });

  return { useList, useGetById, useCreate, useUpdate, useRemove };
};

export default useSubcategoriasService;
