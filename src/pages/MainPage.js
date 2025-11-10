import React from 'react'
import { Box } from "@mui/material";
import { List, ListItem, ListItemText } from "@mui/material";
import CustomDropzone from '../components/CustomDropzone';

export default function MainPage() {
    const [files, setFiles] = React.useState([]);

    const handleFileSelect = (selectedFiles) => {
        setFiles(selectedFiles);
    };

  return (
    <div className="mainpage-center">
      <Box sx={{ p: 4 }}>
      <CustomDropzone onFileSelect={handleFileSelect} />

      {files.length > 0 && (
        <List sx={{ mt: 5 }}>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(2)} KB`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
    </div>
  )
}