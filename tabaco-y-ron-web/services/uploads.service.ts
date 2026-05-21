import axiosInstance from "@/lib/axios";
import type { UploadImagenResponse } from "@/types/api";

class UploadsService {
  uploadImagen = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const resp = await axiosInstance.post<UploadImagenResponse>("/uploads/imagen", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
  };
}

export default new UploadsService();
