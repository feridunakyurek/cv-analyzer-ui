import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth/login";

export const loginService = async (email, password) => {
  try {
    const response = await axios.post(API_URL, {
      email,
      password,
    });

    return {
      success: true,
      token: response.data.token,
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.",
    };
  }
};
