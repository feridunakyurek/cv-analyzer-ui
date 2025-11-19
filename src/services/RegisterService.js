import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth/register";

export const registerService = async (name, surname, email, password) => {
  try {
    const response = await axios.post(API_URL, {
      name,
      surname,
      email,
      password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return {
      success: true,
      token: response.data.token,
      message: "Kayıt işlemi başarıyla tamamlandı.",
    };
  } catch (error) {
    const backendMessage = error.response?.data?.message;

    return {
      success: false,
      message:
        backendMessage || "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
};
