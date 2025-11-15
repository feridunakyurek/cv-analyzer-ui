import axios from "axios";

const API_URL = "http://localhost:8080/api/cv";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadCvService = async (file, onProgress) => {
  if (!file) {
    return {
      success: false,
      error: "Dosya bulunamadı.",
    };
  }

  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "multipart/form-data",
  };

  // Kullanıcı giriş yapmamışsa
  if (!headers.Authorization) {
    return {
      success: false,
      error: "Kullanıcı doğrulanmadı. Lütfen giriş yapın.",
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers,
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    });

    return {
      success: true,
      data: response.data,
    };

  } catch (err) {
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Dosya yüklenirken bir hata oluştu.",
    };
  }
};

export const deleteCvService = async (id) => {
  if (!id) {
    return {
      success: false,
      error: "Silinecek dosya ID'si bulunamadı.",
    };
  }

  const headers = getAuthHeaders();

  if (!headers.Authorization) {
    return {
      success: false,
      error: "Kullanıcı doğrulanmadı. Lütfen giriş yapın.",
    };
  }

  try {
    await axios.delete(`${API_URL}/delete/${id}`, { headers });

    return {
      success: true,
    };

  } catch (err) {
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Dosya silinirken bir hata oluştu.",
    };
  }
};

export const getMyCvsService = async () => {
  const headers = getAuthHeaders();

  if (!headers.Authorization) {
    return { success: false, error: "Kullanıcı doğrulanmadı." };
  }

  try {
    const response = await axios.get(`${API_URL}/user/my-cvs`, { headers });

    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : [],
    };
  } catch (err) {
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "CV listesi alınırken hata oluştu.",
    };
  }
};
