/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Register.css";
import { Container, Box, Button, TextField, Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const handleShowPassword1 = () => setShowPassword1((prev) => !prev);
  const handleShowPassword2 = () => setShowPassword2((prev) => !prev);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    const { name, surname, email, password, password2 } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email zorunludur.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Geçerli bir email formatı girin.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Lütfen Şifre Giriniz.";
      isValid = false;
    }

    if (password !== password2) {
      newErrors.password2 = "Şifreler eşleşmiyor.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    const { name, surname, email, password } = formData;
    const result = await registerService(name, surname, email, password);

    if (result.success) {
      setToken(result.token);
      localStorage.setItem("token", result.token);

      setMessage({
        type: "success",
        text: "Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz...",
      });

      setTimeout(() => {
        navigate("/mainpage");
      }, 1500);
    } else {
      setMessage({
        type: "error",
        text:
          result.message ||
          "Kayıt işlemi sırasında beklenmedik bir hata oluştu.",
      });
    }

    setLoading(false);
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <h2 className="register-title">Kayıt Ol</h2>
        <div className="register-divider" />
        
        {/* Name Field */}
        <TextField
          className="register-field"
          label="AD"
          sx={{ background: "white", borderRadius: "4px" }}
          name="name" 
          id="name"
          variant="filled"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          className="register-field"
          name="surname" 
          id="surname"
          variant="filled"
          label="SOYAD"
          sx={{ background: "white", borderRadius: "4px" }}
          value={formData.surname}
          onChange={handleChange}
          error={!!errors.surname}
          helperText={errors.surname}
        />

        <TextField
          className="register-field"
          label="EMAİL"
          type="email"
          sx={{ background: "white", borderRadius: "4px" }}
          name="email"
          id="email"
          variant="filled"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          className="register-field"
          label="ŞİFRE"
          type={showPassword1 ? "text" : "password"}
          sx={{ background: "white", borderRadius: "4px" }}
          name="password"
          id="password"
          variant="filled"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword1}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword1 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          className="register-field"
          label="ŞİFRE (TEKRAR)"
          type={showPassword2 ? "text" : "password"}
          sx={{ background: "white", borderRadius: "4px" }}
          name="password2"
          id="password2"
          variant="filled"
          value={formData.password2}
          onChange={handleChange}
          error={!!errors.password2}
          helperText={errors.password2}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword2}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          size="medium"
          variant="contained"
          sx={{
            padding: "6px 16px",
            background: "#FFFFFF",
            color: "#404040",
            marginLeft: "30%",
          }}
        >
          <strong>KAYIT OL</strong>
        </Button>
        {message && (
          <Alert
            severity={message.type}
            sx={{ width: "45%", mt: 2 }}
          >
            {message.text}
          </Alert>
        )}
      </Box>
    </Container>
  );
}