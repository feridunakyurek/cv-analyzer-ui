/* eslint-disable no-unused-vars */
import React from "react";
import { Box } from "@mui/material";
import CustomDropzone from "../components/CustomDropzone";
import CvAnalysisModal from "../components/AnalysisModal";
import axios from "axios";

export default function MainPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [analysisData, setAnalysisData] = React.useState(null);

  const handleFileSelect = async (file) => {
    if (!file || !file.id) return;

    try {
      const analyzeResponse = await axios.post(
        `http://localhost:8080/api/v1/evaluations/analyze/${file.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const modalData = {
        ...analyzeResponse.data,
        fileName: file.name || file.fileName || file.originalname,
      }

      setAnalysisData(modalData);
      setModalOpen(true);
    } catch (error) {
      console.error("Analiz hatası:", error);
    }
  };

  const handleInfoClick = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/evaluations/analyze/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAnalysisData(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Analiz bilgisi alınamadı:", error);
    }
  };

  return (
    <div className="flex-1 mainpage-center">
      <Box sx={{ p: 4 }}>
        <CustomDropzone
          onFileSelect={handleFileSelect}
          onInfoClick={handleInfoClick}
        />
      </Box>
      <CvAnalysisModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={analysisData}
      />
    </div>
  );
}
