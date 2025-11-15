/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import {
  uploadCvService,
  deleteCvService,
  getMyCvsService,
} from "../services/CvService";
import { useNavigate } from "react-router";

export default function CustomDropzone({ onFileSelect }) {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Tokenı sil
    navigate("/"); // Login sayfasına yönlendir
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // ACCEPTED FILES
    acceptedFiles.forEach((file) => {
      const tempId = `${file.name}-${Date.now()}`;

      // Add to local state immediately
      setFiles((prev) => [
        ...prev,
        {
          id: tempId,
          file,
          name: file.name,
          size: file.size,
          status: "loading",
          progress: 0,
        },
      ]);

      // Call service
      uploadCvService(file, (progressPercent) => {
        // Progress update
        setFiles((prev) =>
          prev.map((f) =>
            f.id === tempId ? { ...f, progress: progressPercent } : f
          )
        );
      }).then((result) => {
        if (result.success) {
          const returned = result.data || {};

          setFiles((prev) =>
            prev.map((f) =>
              f.id === tempId
                ? {
                    ...f,
                    id: returned.id || tempId,
                    status: "complete",
                    progress: 100,
                    remote: !!returned.id,
                  }
                : f
            )
          );

          // Refresh list
          try {
            fetchMyCvs();
          } catch {}
        } else {
          // Failed upload
          setFiles((prev) =>
            prev.map((f) =>
              f.id === tempId
                ? {
                    ...f,
                    status: "failed",
                    progress: 100,
                    error: result.error,
                  }
                : f
            )
          );
        }
      });
    });

    // REJECTED FILES
    rejectedFiles.forEach((r) => {
      setFiles((prev) => [
        ...prev,
        {
          id: `${r.file.name}-${Date.now()}`,
          file: r.file,
          name: r.file.name,
          size: r.file.size,
          status: "failed",
          progress: 100,
          error: r.errors[0]?.message || "Dosya yüklenemedi (Geçersiz format)",
        },
      ]);
    });
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

  useEffect(() => {
    if (typeof onFileSelect === "function") {
      onFileSelect(
        files.map((f) => ({
          id: f.id,
          name: f.name || "Unnamed",
          size: f.size || 0,
          status: f.status,
        }))
      );
    }
  }, [files]);

  const handleRemove = async (id) => {
    const result = await deleteCvService(id);

    if (result.success) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      console.error("Silme hatası:", result.error);
    }
  };

  // Load previously uploaded CVs from backend on mount
  useEffect(() => {
    let mounted = true;

    getMyCvsService().then((result) => {
      if (!mounted) return;

      if (result.success) {
        const list = result.data.map((item) => ({
          id: item.id || item._id || item.filename || Date.now().toString(),
          name:
            item.name ||
            item.originalName ||
            item.filename ||
            item.fileName ||
            "Unnamed",
          size: item.size || 0,
          status: "complete",
          progress: 100,
          remote: true,
        }));

        setFiles((prev) => [...list, ...prev]);
      }
    });

    return () => (mounted = false);
  }, []);

  // Fetch user's CVs from backend and merge into state
  const fetchMyCvs = () => {
    let mounted = true;

    getMyCvsService().then((result) => {
      if (!mounted) return;

      if (result.success) {
        const list = result.data.map((item) => ({
          id:
            item.id ||
            item._id ||
            item.filename ||
            item.fileId ||
            item.name ||
            Date.now().toString(),
          name:
            item.name ||
            item.originalName ||
            item.filename ||
            item.fileName ||
            "Unnamed",
          size: item.size || 0,
          status: "complete",
          progress: 100,
          remote: true,
        }));

        setFiles((prev) => {
          const localPending = prev.filter(
            (p) => !p.remote && p.status !== "complete"
          );
          return [...list, ...localPending];
        });
      }
    });

    return () => (mounted = false);
  };

  // call initially
  useEffect(() => {
    fetchMyCvs();
  }, []);

  return (
    <Box>
      <button
        onClick={handleLogout}
        style={{
          padding: "8px 14px",
          background: "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Çıkış Yap
      </button>

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
              {(() => {
                const displayName = f.name || "Unnamed";
                return (
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
                      : displayName.length > 40
                      ? displayName.substring(0, 37) + "..."
                      : displayName}
                  </Typography>
                );
              })()}
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
                {((f.size || 0) / 1024).toFixed(0)} KB •{" "}
                {f.status === "failed"
                  ? "Yükleme Başarısız"
                  : f.status === "loading"
                  ? "Yükleniyor..."
                  : "Tamamlandı"}
                {f.status === "failed"
                  ? " (Geçerli bir PDF/DOCX dosyası yükleyin.)"
                  : ""}
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

            <IconButton onClick={() => handleRemove(f.id)}>
              <DeleteIcon color="action" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
