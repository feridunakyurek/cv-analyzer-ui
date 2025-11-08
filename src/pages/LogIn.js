/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, Container, Input } from "@mui/material";
import { FcGoogle } from "react-icons/fc";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      setToken(response.data.token);
      setMessage("Giriş başarılı! Token alındı.");
      console.log("JWT Token:", response.data.token);
    } catch (error) {
      setMessage("Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.");
      console.error("Giriş hatası:", error.response.data);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <TextField
          label="Kullanıcı Adı"
          id="standard-basic"
          variant="filled"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: "45%", background: "white" }}
        />

        <TextField
          label="Şifre"
          variant="filled"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: "45%", background: "white" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box>
          <Button
            variant="contained"
            startIcon={<FcGoogle />}
            sx={{
              padding: "6px 16px",
              backgroundColor: "#fff",
              color: "#1F1F1F",
              textTransform: "none",
              borderRadius: "30px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Google ile Giriş Yap
          </Button>

          <Button
            size="small"
            sx={{
              marginLeft: "15px",
              padding: "6px 16px",
              background: "#FFFFFF",
              color: "#404040",
            }}
            variant="contained"
            onClick={handleLogin}
          >
            Giriş Yap
          </Button>
        </Box>
        <p className="register-line">Hesabın Yok Mu?
          <a href="/register" className="register-link">Kayıt Ol!</a>
        </p>
      </Box>
    </Container>
  );
}
