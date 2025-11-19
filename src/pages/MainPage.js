/* eslint-disable no-unused-vars */
import React from "react";
import { Box } from "@mui/material";
import CustomDropzone from "../components/CustomDropzone";
import CvAnalysisModal from "../components/AnalysisModal";
import axios from "axios";

export default function MainPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [analysisData, setAnalysisData] = React.useState(null);

  const handleFileSelect = async (cv) => {
    if (!cv?.id) {
      console.error("CV ID yok!", cv);
      return;
    }

    const id = cv.id;
    console.log("Analize giden ID:", id);

    try {
      const analyzeResponse = await axios.post(
        `http://localhost:8080/api/v1/evaluations/analyze/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAnalysisData(analyzeResponse.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Analiz hatası:", error);
    }
  };

  return (
    <div className="flex-1 mainpage-center">
      <Box sx={{ p: 4 }}>
        <CustomDropzone onFileSelect={handleFileSelect} />
      </Box>
      <CvAnalysisModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={analysisData}
      />
    </div>
  );
}
