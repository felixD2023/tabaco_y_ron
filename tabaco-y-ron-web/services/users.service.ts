import axiosInstance from "@/lib/axios";
import type { User, UserCreate, UserUpdate } from "@/types/api";

class UsersService {
  list = async () => {
    const resp = await axiosInstance.get<User[]>("/users");
    return resp.data;
  };

  create = async (payload: UserCreate) => {
    const resp = await axiosInstance.post<User>("/users", payload);
    return resp.data;
  };

  update = async ({ id, payload }: { id: number; payload: UserUpdate }) => {
    const resp = await axiosInstance.patch<User>(`/users/${id}`, payload);
    return resp.data;
  };

  remove = async (id: number) => {
    await axiosInstance.delete(`/users/${id}`);
    return { id };
  };
}

export default new UsersService();
