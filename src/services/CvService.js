import axios from "axios";

const API_URL = "http://localhost:8080/api/cv";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadCvService = async (file, onProgress) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, error: "Kullanıcı doğrulanmadı." };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(
      "http://localhost:8080/api/cv/upload",
      formData,
      { headers, onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        }
      }
    );

    return {
      success: true,
      data: res.data.cvUpload
    };

  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || "Yükleme hatası"
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

export const analyzeCvService = async (cvId) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const res = await axios.post(
      `http://localhost:8080/api/v1/evaluations/analyze/${cvId}`,
      {},
      { headers }
    );

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || "Analiz yapılamadı."
    };
  }
};
