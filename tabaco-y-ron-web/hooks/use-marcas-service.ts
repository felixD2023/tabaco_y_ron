import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query-keys";
import marcasService from "@/services/marcas.service";

const useMarcasService = () => {
  const queryClient = useQueryClient();

  const useList = () => useQuery({ queryKey: QUERY_KEYS.marcas, queryFn: marcasService.list });

  const useGetById = (id: number, enabled: boolean = true) =>
    useQuery({
      queryKey: QUERY_KEYS.marca(id),
      queryFn: () => marcasService.getById(id),
      enabled,
    });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marcas });
  };

  const useCreate = () =>
    useMutation({ mutationFn: marcasService.create, onSuccess: invalidateAll });

  const useCreateBulk = () =>
    useMutation({ mutationFn: marcasService.createBulk, onSuccess: invalidateAll });

  const useUpdate = () =>
    useMutation({
      mutationFn: marcasService.update,
      onSuccess: (_, variables) => {
        invalidateAll();
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marca(variables.id) });
      },
    });

  const useRemove = () =>
    useMutation({ mutationFn: marcasService.remove, onSuccess: invalidateAll });

  return { useList, useGetById, useCreate, useCreateBulk, useUpdate, useRemove };
};

export default useMarcasService;
