/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
    fullName: localStorage.getItem("fullName") || t('user'),
    email: localStorage.getItem("userEmail") || " ",
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
      errors.current = t('errors_passowrd_current');
      isValid = false;
    }

    if (!passData.new) {
      errors.new = t('errors_passowrd_new');
      isValid = false;
    }

    if (passData.new !== passData.confirm) {
      errors.confirm = t('errors_passowrd_confirm');
      isValid = false;
    }

    setPassErrors(errors);
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
        text: t('changed_password'),
      });
      setTimeout(() => {
        closeChangePassDialog();
      }, 1500);
    } else {
      if (result.error.includes(t('current'))) {
        setPassErrors({ current: t('current_password_error') });
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
      alert(t("delete_account_error"));
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
          <ListItemText>{t('change_password')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('logout')}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={openDeleteDialog} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary={t('delete_account')} />
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
                color: "#CBD5E1",
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
          {t('delete_account_title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {t('delete_account_subtitle')}
            <br />
            <br />
            <strong>{t('continue')}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            color="primary"
            disabled={isDeleting}
          >
            {t('cancel')}
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
            {isDeleting ? t('being_deleted') : t('delete_account')}
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
          <LockResetIcon /> {t('change_password')} 
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label={t('current_password')} 
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
              label={t('new_password')} 
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
              label={t('new_password2')} 
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
            {t('cancel')} 
          </Button>
          <Button
            onClick={handleSubmitPassword}
            variant="contained"
            sx={{ bgcolor: "#1976D2" }}
            disabled={loading}
          >
            {loading ? t('being_changed')  : t('change')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={logoutSnackbarOpen}
        autoHideDuration={2000} 
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {t('logout_confirm')} 
        </Alert>
      </Snackbar>
    </Box>
  );
}
