// frontend/src/components/UploadResume.js

import React, { useState } from 'react';
import axios from 'axios';

const UploadResume = () => {
  const [resume, setResume] = useState(null);
  const [response, setResponse] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setResponse(res.data);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Resume for Screening</h2>
      <input type="file" onChange={(e) => setResume(e.target.files[0])} />
      <button onClick={handleUpload}>Submit</button>

      {response && (
        <div>
          <h3>Result:</h3>
          <p>Decision: {response.decision}</p>
          <p>Score: {response.score}</p>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
