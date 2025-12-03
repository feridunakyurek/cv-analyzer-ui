/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import "../styles/CustomDropzone.css";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import {
  uploadCvService,
  deleteCvService,
  getMyCvsService,
  deleteEvaluationService,
} from "../services/CvService";
import { useNavigate } from "react-router";
import InfoIcon from "@mui/icons-material/Info";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function CustomDropzone({ onFileSelect, onInfoClick }) {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [analyzingId, setAnalyzingId] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      const tempId = `${file.name}-${Date.now()}`;

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
          const realId = returned.id || tempId;

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

          if (onFileSelect && returned.id) {
            setAnalyzingId((prev) => [...prev, realId]);

            Promise.resolve(
              onFileSelect(returned)
                .then(() => {
                  setAnalyzingId((prev) => prev.filter((id) => id !== realId));
                })
                .catch(() => {
                  setAnalyzingId((prev) => prev.filter((id) => id !== realId));
                })
            );
          }

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
          error: r.errors[0]?.message || t("invalid_file"),
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

  const handleRemove = async (id) => {
    await deleteEvaluationService(id);
    const result = await deleteCvService(id);

    if (result.success) {
      setFiles((prev) => prev.filter((f) => f.id !== id));

      setSnackbar({
        open: true,
        message: t("delete_success"),
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: t("delete_error"),
        severity: "error",
      });
    }
  };

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
          size: item.size || item.fileSize || 0,
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchMyCvs();
  }, []);

  return (
    <Box>
      <Paper
        className={`dropzone ${isDragActive ? "active" : ""}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadFileRoundedIcon className="upload-icon" />
        <Typography variant="h6" color="primary">
          <strong>{t("upload_title")}</strong>
        </Typography>
        <Typography variant="body2" color="#ADADAD">
          <strong>{t("upload_desc")}</strong>
        </Typography>
      </Paper>

      <Box className="files">
        {files.map((f, index) => (
          <Box key={index} className="files-element">
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              {(() => {
                const displayName = f.name || "Unnamed";
                return (
                  <Typography
                    variant="body2"
                    color={f.status === "failed" ? "error" : "text.primary"}
                    sx={{
                      fontWeight: f.status === "failed" ? 600 : 400,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {f.status === "failed"
                      ? t("upload_failed")
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
                    : analyzingId.includes(f.id)
                    ? "#64B5F6"
                    : f.status === "complete"
                    ? "#81C784"
                    : "#FFFFFF"
                }
              >
                {((f.size || 0) / 1024).toFixed(0)} KB •{" "}
                {f.status === "failed"
                  ? t("upload_failed")
                  : f.status === "loading"
                  ? t("loading")
                  : analyzingId.includes(f.id)
                  ? t("analysis")
                  : t("completed")}
                {f.status === "failed" ? ` (${t("invalid_type_msg")})` : ""}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={
                  f.status === "complete" || f.status === "failed" ? 100 : 60
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
                        : analyzingId.includes(f.id)
                        ? "#64B5F6"
                        : "#81C784",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title={t("delete_file")}>
                <IconButton onClick={() => handleRemove(f.id)}>
                  <DeleteIcon
                    sx={{ color: "#8C8C8C", "&:hover": { color: "#FFFFFF" } }}
                  />
                </IconButton>
              </Tooltip>

              {analyzingId.includes(f.id) ? (
                <Tooltip title={t("icon_title")}>
                  <Box
                    sx={{ position: "relative", display: "inline-flex", p: 1 }}
                  >
                    <CircularProgress size={24} sx={{ color: "#4fc3f7" }} />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 14, color: "white" }} />
                    </Box>
                  </Box>
                </Tooltip>
              ) : (
                f.status === "complete" && (
                  <Tooltip title={t("analysis_result")}>
                    <IconButton onClick={() => onInfoClick(f.id)}>
                      <InfoIcon
                        sx={{
                          color: "#8C8C8C",
                          "&:hover": { color: "#FFFFFF" },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )
              )}
            </Box>
          </Box>
        ))}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
