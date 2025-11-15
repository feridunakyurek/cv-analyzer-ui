/* eslint-disable no-unused-vars */
import React from "react";
import { Box } from "@mui/material";
import CustomDropzone from "../components/CustomDropzone";

export default function MainPage() {
  const [files, setFiles] = React.useState([]);

  const handleFileSelect = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  return (
    <div className="mainpage-center">
      <Box sx={{ p: 4 }}>
        <CustomDropzone onFileSelect={handleFileSelect} />
      </Box>
    </div>
  );
}
