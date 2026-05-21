import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query-keys";
import usersService from "@/services/users.service";

const useUsersService = () => {
  const queryClient = useQueryClient();

  const useList = () => useQuery({ queryKey: QUERY_KEYS.users, queryFn: usersService.list });

  const useCreate = () =>
    useMutation({
      mutationFn: usersService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: usersService.update,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(variables.id) });
      },
    });

  const useRemove = () =>
    useMutation({
      mutationFn: usersService.remove,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      },
    });

  return { useList, useCreate, useUpdate, useRemove };
};

export default useUsersService;
