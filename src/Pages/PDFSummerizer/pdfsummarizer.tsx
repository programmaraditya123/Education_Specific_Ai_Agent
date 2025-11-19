import React, { useState, useRef } from "react";
import styles from "./PdfSummarizerPage.module.scss";
import axios from "axios";

const PdfSummarizerPage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("Upload a PDF and I’ll summarize it here.");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL =
    "https://education-specific-ai-agent-710178903619.asia-south1.run.app";


  const handleFileUpload = async (file: File) => {
    setPdfFile(file);
    setSummary(`📂 ${file.name} uploaded. Summarizing...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BACKEND_URL}/summarize`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(res.data.summary || "No summary generated.");
    } catch (err) {
      console.error(err);
      setSummary("❌ Failed to summarize the PDF.");
    }
  };

  const removePdf = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPdfFile(null);
    setSummary("Upload a PDF and I’ll summarize it here.");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles["pdf-page"]}>
     
      <div className={styles.leftPanel}>
        <h3>Upload PDF</h3>

        <label
          className={styles.dropZone}
          onClick={triggerFileInput}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0];
              if (file.type === "application/pdf") {
                handleFileUpload(file);
              } else {
                alert("Please upload a PDF file only.");
              }
            }
          }}
        >
          {pdfFile ? (
            <>
              <iframe
                src={URL.createObjectURL(pdfFile)}
                title="PDF Preview"
                className={styles.pdfPreviewFrame}
              />

              <button className={styles.removeFileBtn} onClick={removePdf}>
                ✖
              </button>
            </>
          ) : (
            <span>Click or drop your PDF here</span>
          )}

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            ref={fileInputRef}
          />
        </label>

        {!pdfFile && (
          <button className={styles.uploadBtn} onClick={triggerFileInput}>
            Upload PDF
          </button>
        )}
      </div>


      <div className={styles.rightPanel}>
        <h3>Summary</h3>
        <div className={styles.summaryContent}>{summary}</div>
      </div>
    </div>
  );
};

export default PdfSummarizerPage;
