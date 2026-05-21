import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query-keys";
import authService from "@/services/auth.service";

const useAuthService = () => {
  const queryClient = useQueryClient();

  const useMe = (enabled: boolean = true) =>
    useQuery({ queryKey: QUERY_KEYS.me, queryFn: authService.me, enabled });

  const useLogin = () =>
    useMutation({
      mutationFn: authService.login,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
      },
    });

  const useLogout = () =>
    useMutation({
      mutationFn: async () => authService.logout(),
      onSuccess: () => {
        queryClient.clear();
      },
    });

  return { useMe, useLogin, useLogout };
};

export default useAuthService;
