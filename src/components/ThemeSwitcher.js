import React from "react";
import { IconButton, useTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton 
      sx={{ ml: 1 }} 
      onClick={toggleColorMode} 
      color="inherit"
      aria-label="tema değiştir"
    >
      {theme.palette.mode === "dark" ? (
        <Brightness7Icon sx={{ color: "orange" }} />
      ) : (
        <Brightness4Icon sx={{ color: "mavi" }} />
      )}
    </IconButton>
  );
};

export default ThemeSwitcher;