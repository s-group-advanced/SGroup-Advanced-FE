interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloud_name: string;
  api_key: string;
  folder: string;
}

const getApiUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
};

export const getUploadSignature = async (): Promise<CloudinarySignature> => {
  const response = await fetch(getApiUrl("/upload/signature"), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to get Cloudinary signature");
  }

  return response.json();
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const signatureData = await getUploadSignature();

    // 2. Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signatureData.signature);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("api_key", signatureData.api_key);
    formData.append("folder", signatureData.folder);

    // 3. Upload to Cloudinary with signature (NOT backend!)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error:", errorData);
      throw new Error(
        errorData.error?.message || "Failed to upload image to Cloudinary",
      );
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
