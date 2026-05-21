import axiosInstance, { setAuthToken } from "@/lib/axios";
import type { Token, User } from "@/types/api";

class AuthService {
  login = async (credentials: { email: string; password: string }) => {
    const form = new URLSearchParams();
    form.append("username", credentials.email);
    form.append("password", credentials.password);

    const resp = await axiosInstance.post<Token>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    setAuthToken(resp.data.access_token);
    return resp.data;
  };

  logout = () => {
    setAuthToken(null);
  };

  me = async () => {
    const resp = await axiosInstance.get<User>("/users/me");
    return resp.data;
  };
}

export default new AuthService();
