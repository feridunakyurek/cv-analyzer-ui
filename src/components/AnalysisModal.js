/* eslint-disable no-unused-vars */
import React from "react";
import {
  Modal,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Icon,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "#0F172A",
  color: "white",
  borderRadius: "16px",
  boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.5)",
  p: 4,
  outline: "none",
};

export default function CvAnalysisModal({ open, onClose, data }) {
  const { t } = useTranslation();

  if (!data) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "#4CAF50";
    if (score >= 50) return "#FF9800";
    return "#F44336";
  };

  const scoreColor = getScoreColor(data.score);

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(2px)",
          },
        },
      }}
    >
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#94A3B8",
            "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            sx={{
              width: 50,
              height: 50,
              display: "flex",
              borderRadius: "12px",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.05)",
            }}
          >
            <PsychologyIcon sx={{ fontSize: 30, color: "#E2E8F0" }} />
          </Box>

          <Box>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              sx={{ lineHeight: 1.2 }}
            >
              {t("modal_title")}
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              fontWeight="bold"
              sx={{ color: "#94A3B8" }}
            >
              {t("modal_subtitle")}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 1, color: "#E2E8F0" }}>
          {data.fileName || data.cvUpload?.fileName || " "}
        </Typography>

        <Box
          sx={{
            display: "inline-block",
            bgcolor: "rgba(16, 185, 129, 0.1)",
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            mb: 1,
            border: `1px solid ${"rgba(16, 185, 129, 0.2)"}`,
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ color: scoreColor }}
          >
            {t("score")}: {data.score}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={data.score}
          sx={{
            height: 8,
            borderRadius: 5,
            bgcolor: "#1E293B",
            mb: 4,
            "& .MuiLinearProgress-bar": {
              backgroundColor: scoreColor,
              borderRadius: 5,
            },
          }}
        />
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#F1F5F9" }}
        >
          {t("modal_lead")}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#94A3B8",
            lineHeight: 1.6,
            backgroundColor: "rgba(255,255,255,0.02)",
            p: 2,
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {data.analysisSummary}
        </Typography>
      </Box>
    </Modal>
  );
}
