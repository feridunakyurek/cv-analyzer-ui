/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";

export default function CustomDropzone({ onFileSelect }) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const newFiles = [];

    // Başarılı dosyalar
    acceptedFiles.forEach((file) => {
      newFiles.push({
        file,
        name: file.name,
        size: file.size,
        status: "loading",
      });

      // Simüle edilmiş yükleme
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "complete" } : f
          )
        );
      }, 2000);
    });

    // Hatalı dosyalar
    rejectedFiles.forEach((file) => {
      newFiles.push({
        file: file.file,
        name: file.file.name,
        size: file.file.size,
        status: "failed",
        error: file.errors[0]?.message || "Dosya yüklenemedi (Geçersiz format)",
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const handleRemove = (name) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          backgroundColor: isDragActive
            ? "rgba(227, 242, 253, 0.1)"
            : "rgba(10, 15, 37, 0.4) ",
          "&:hover": { backgroundColor: "#E3F2FD" },
        }}
      >
        <input {...getInputProps()} />
        <UploadFileRoundedIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Typography variant="h6" color="primary">
          <strong>Dosya yükle veya sürükleyip bırak</strong>
        </Typography>
        <Typography variant="body2" color="#ADADAD">
          <strong> PDF veya DOCX (max. 5MB)</strong>
        </Typography>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {files.map((f, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body2"
                color={f.status === "failed" ? "error" : "text.primary"}
                sx={{
                  fontWeight: f.status === "failed" ? 600 : 400,
                  color: "#FFFFFF",
                }}
              >
                {f.status === "failed"
                  ? "Upload failed."
                  : f.name.length > 40
                  ? f.name.substring(0, 37) + "..."
                  : f.name}
              </Typography>
              <Typography
                variant="caption"
                color={
                  f.status === "failed"
                    ? "error"
                    : f.status === "complete"
                    ? "#81C784"
                    : "#FFFFFF"
                }
              >
                {(f.size / 1024).toFixed(0)} KB •{' '}
                {f.status === "failed"
                  ? 'Yükleme Başarısız'
                  : f.status === "loading"
                  ? 'Yükleniyor...'
                  : 'Tamamlandı'}
                {f.status === "failed"
                  ? ' (Geçerli bir PDF/DOCX dosyası yükleyin.)'
                  : ''}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={
                  f.status === "complete"
                    ? 100
                    : f.status === "failed"
                    ? 100
                    : 60
                }
                sx={{
                  mt: 0.5,
                  height: 6,
                  borderRadius: 1,
                  backgroundColor:
                    f.status === "failed"
                      ? "rgba(244,67,54,0.2)"
                      : "rgba(144,202,249,0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      f.status === "failed"
                        ? "#EF5350"
                        : f.status === "loading"
                        ? "#64B5F6"
                        : "#81C784",
                  },
                }}
              />
            </Box>

            <IconButton onClick={() => handleRemove(f.name)}>
              <DeleteIcon color="action" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
