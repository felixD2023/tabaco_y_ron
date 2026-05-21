import { useMutation } from "@tanstack/react-query";

import uploadsService from "@/services/uploads.service";

const useUploadsService = () => {
  const useUploadImagen = () => useMutation({ mutationFn: uploadsService.uploadImagen });

  return { useUploadImagen };
};

export default useUploadsService;
