/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  getUserProfileService,
  deleteAccountService,
  changePasswordService,
} from "../services/AuthService";
import PersonIcon from "@mui/icons-material/Person";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [changePassOpen, setChangePassOpen] = useState(false);
  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passMessage, setPassMessage] = useState(null);
  const [passErrors, setPassErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    fullName: localStorage.getItem("fullName") || "Kullanıcı",
    email: localStorage.getItem("userEmail") || "Yükleniyor...",
  });

  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [showPassword3, setShowPassword3] = React.useState(false);

  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const handleShowPassword1 = () => setShowPassword1((prev) => !prev);
  const handleShowPassword2 = () => setShowPassword2((prev) => !prev);
  const handleShowPassword3 = () => setShowPassword3((prev) => !prev);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getUserProfileService();

      if (result.success) {
        const { fullName, email } = result.data;

        setUserData({ fullName, email });

        localStorage.setItem("fullName", fullName);
        localStorage.setItem("userEmail", email);
      }
    };

    fetchProfile();
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();

    setLogoutSnackbarOpen(true);

    setTimeout(() => {
      localStorage.clear();
      navigate("/");
    }, 2000);
  };

  const openDeleteDialog = () => {
    handleClose();
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const openChangePassDialog = () => {
    handleClose();
    setPassData({ current: "", new: "", confirm: "" });
    setPassMessage(null);
    setChangePassOpen(true);
  };

  const closeChangePassDialog = () => {
    setChangePassOpen(false);
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassData({ ...passData, [name]: value });

    if (passErrors[name]) {
      setPassErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validatePassword = () => {
    let errors = {};
    let isValid = true;

    if (!passData.current) {
      errors.current = "Mevcut şifrenizi girmelisiniz.";
      isValid = false;
    }

    if (!passData.new) {
      errors.new = "Yeni şifre boş olamaz.";
      isValid = false;
    }

    if (passData.new !== passData.confirm) {
      errors.confirm = "Şifreler eşleşmiyor.";
      isValid = false;
    }

    setPassErrors(errors); // Hataları state'e bas
    return isValid;
  };

  const handleSubmitPassword = async () => {
    setPassMessage(null);

    if (!validatePassword()) return;

    setLoading(true);

    const result = await changePasswordService(passData.current, passData.new);

    if (result.success) {
      setPassMessage({
        type: "success",
        text: "Şifreniz başarıyla değiştirildi!",
      });
      setTimeout(() => {
        closeChangePassDialog();
      }, 1500);
    } else {
      // Backend hatası (Örn: Mevcut şifre yanlış) genel mesaj olarak gösterilir
      // VEYA "Mevcut şifre yanlış" hatasını spesifik input altına da basabilirsin:
      if (result.error.includes("Mevcut şifre")) {
        setPassErrors({ current: "Mevcut şifreniz hatalı." });
      } else {
        setPassMessage({ type: "error", text: result.error });
      }
    }
    setLoading(false);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);

    const result = await deleteAccountService();

    if (result.success) {
      localStorage.clear();
      navigate("/");
    } else {
      alert("Hesap silinirken bir hata oluştu!");
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          sx={{
            width: 45,
            height: 45,
            bgcolor: "transparent",
            fontSize: "1.2rem",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <PersonIcon sx={{ fontSize: 30, color: "white" }} />{" "}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: 220,
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" noWrap fontWeight="bold">
            {userData.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {userData.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={openChangePassDialog}>
          <ListItemIcon>
            <LockResetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Şifremi Değiştir</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Çıkış Yap</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={openDeleteDialog} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Hesabı Sil" />
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1E293B",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0px 10px 40px rgba(0,0,0,0.5)",
              minWidth: "400px",
              "& .MuiDialogContentText-root": {
                color: "#CBD5E1", // Hafif kırık beyaz (Slate 300)
              },
            },
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(2px)",
            },
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
          }}
        >
          <WarningAmberIcon />
          Hesabı Sil?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hesabınızı kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz
            ve tüm CV'leriniz, analizleriniz silinecektir.
            <br />
            <br />
            <strong>Devam etmek istiyor musunuz?</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            color="primary"
            disabled={isDeleting}
          >
            Vazgeç
          </Button>
          <Button
            onClick={confirmDeleteAccount}
            color="error"
            variant="contained"
            autoFocus
            disabled={isDeleting}
            startIcon={
              isDeleting ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isDeleting ? "Siliniyor..." : "Evet, Hesabı Sil"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={changePassOpen}
        onClose={closeChangePassDialog}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1E293B",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              minWidth: "400px",
              "& .MuiTypography-root": { color: "#F8FAFC" },
            },
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LockResetIcon /> Şifremi Değiştir
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Mevcut Şifre"
              type={showPassword1 ? "text" : "password"}
              name="current"
              fullWidth
              sx={{ background: "white", borderRadius: "4px" }}
              variant="filled"
              onChange={handlePassChange}
              error={!!passErrors.current}
              helperText={passErrors.current}
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
              label="Yeni Şifre"
              type={showPassword2 ? "text" : "password"}
              name="new"
              fullWidth
              sx={{
                background: "white",
                borderRadius: "4px",
              }}
              variant="filled"
              value={passData.new}
              onChange={handlePassChange}
              error={!!passErrors.new}
              helperText={passErrors.new}
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

            <TextField
              label="Yeni Şifre (Tekrar)"
              type={showPassword3 ? "text" : "password"}
              name="confirm"
              fullWidth
              sx={{ background: "white", borderRadius: "4px" }}
              variant="filled"
              value={passData.confirm}
              onChange={handlePassChange}
              error={!!passErrors.confirm}
              helperText={passErrors.confirm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword3}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword3 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {passMessage && (
              <Alert severity={passMessage.type} sx={{ mt: 1 }}>
                {passMessage.text}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeChangePassDialog}
            sx={{ color: "rgba(255,255,255,0.6)" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmitPassword}
            variant="contained"
            sx={{ bgcolor: "#1976D2" }}
            disabled={loading}
          >
            {loading ? "Değiştiriliyor..." : "Değiştir"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={logoutSnackbarOpen}
        autoHideDuration={2000} // 2 saniye sonra otomatik kapanır (zaten yönlenecek)
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Üst ortada çıksın
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Çıkış başarılı. Yönlendiriliyorsunuz...
        </Alert>
      </Snackbar>
    </Box>
  );
}
