import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query-keys";
import valoracionesService from "@/services/valoraciones.service";

const useValoracionesService = () => {
  const queryClient = useQueryClient();

  const useList = (productoId?: number) =>
    useQuery({
      queryKey: QUERY_KEYS.valoraciones(productoId),
      queryFn: () => valoracionesService.list({ producto_id: productoId }),
    });

  const useCreate = () =>
    useMutation({
      mutationFn: valoracionesService.create,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["valoraciones"] });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.producto(variables.producto_id) });
      },
    });

  return { useList, useCreate };
};

export default useValoracionesService;
