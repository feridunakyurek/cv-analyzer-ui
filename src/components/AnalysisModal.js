import React from "react";
import { Modal, Box, Typography, Divider } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "900px",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

export default function CvAnalysisModal({ open, onClose, data }) {
  if (!data) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          CV Analizi
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" fontWeight="bold">
          Skor: {data.score} / 100
        </Typography>

        <Typography sx={{ mt: 2 }}>{data.analysisSummary}</Typography>
      </Box>
    </Modal>
  );
}
