import React from "react";
import "./Register.css";
import { Container } from "@mui/material";
import { Box, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Register() {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);

  const handleShowPassword1 = () => setShowPassword1((prev) => !prev);
  const handleShowPassword2 = () => setShowPassword2((prev) => !prev);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <h2 className="register-title">Kayıt Ol</h2>
        <div className="register-divider" />
        <TextField
          className="register-field"
          label="AD"
          sx={{ background: "white", borderRadius: "4px" }}
          id="name"
          variant="filled"
        />
        <TextField
          className="register-field"
          id="surname"
          variant="filled"
          label="SOYAD"
          sx={{ background: "white", borderRadius: "4px" }}
        />
        <TextField
          className="register-field"
          label="EMAİL"
          type="email"
          sx={{ background: "white", borderRadius: "4px" }}
          id="email"
          variant="filled"
        />
        <TextField
          className="register-field"
          label="ŞİFRE"
          type={showPassword1 ? "text" : "password"}
          sx={{ background: "white", borderRadius: "4px" }}
          id="password"
          variant="filled"
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
          id="password2"
          variant="filled"
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
          size="medium"
          sx={{
            padding: "6px 16px",
            background: "#FFFFFF",
            color: "#404040",
            marginLeft: "30%",
          }}
          variant="contained"
        >
          <strong>Kayıt Ol</strong>
        </Button>
      </Box>
    </Container>
  );
}
