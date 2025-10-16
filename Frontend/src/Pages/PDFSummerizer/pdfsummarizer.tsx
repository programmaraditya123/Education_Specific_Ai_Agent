import React, { useState, useRef } from "react";
import styles from "./PdfSummarizerPage.module.scss";

// Define message type
type Message = {
  sender: "user" | "bot";
  text: string;
};

const PdfSummarizerPage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState(
    "Upload a PDF and I’ll summarize it here."
  );
  const [chat, setChat] = useState<Message[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF file upload
  const handleFileUpload = (file: File) => {
    setPdfFile(file);
    setSummary(`📂 ${file.name} uploaded successfully! A summary will appear here.`);
  };

  // Remove PDF
  const removePdf = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering dropZone click
    setPdfFile(null);
    setSummary("Upload a PDF and I’ll summarize it here.");
  };

  // Trigger hidden file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle asking a question
  const handleAsk = () => {
    if (!question.trim()) return;

    setChat((prev) => [...prev, { sender: "user", text: question }]);

    setTimeout(() => {
      const botAnswer = "📄 This is a sample answer based on the uploaded PDF.";
      setChat((prev) => [...prev, { sender: "bot", text: botAnswer }]);
      setSummary("Here’s a short summary extracted from the uploaded PDF (sample).");
    }, 800);

    setQuestion("");
  };

  return (
    <div className={styles["pdf-page"]}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.promptBox}>
          <h2>Ask PDF Questions</h2>
          <div className={styles.chatArea}>
            {chat.map((msg, i) => (
              <div key={i} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Type your question here..."
            />
            <button onClick={handleAsk}>Send</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.uploadBox}>
          <h3>Upload PDF</h3>

          {/* Drop Zone */}
          <label
            className={styles.dropZone}
            onClick={triggerFileInput}
            onDragOver={(e) => e.preventDefault()} // allow drop
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M3 16.74L7.76 12L3 7.26L7.26 3L12 7.76L16.74 3L21 7.26L16.24 12L21 16.74L16.74 21L12 16.24L7.26 21L3 16.74zm9-3.33l4.74 4.75l1.42-1.42L13.41 12l4.75-4.74l-1.42-1.42L12 10.59L7.26 5.84L5.84 7.26L10.59 12l-4.75 4.74l1.42 1.42z"
                    />
                  </svg>
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

          {/* Upload Button */}
          {!pdfFile && (
            <button className={styles.uploadBtn} onClick={triggerFileInput}>
              Upload PDF
            </button>
          )}
        </div>

        <div className={styles.summaryBox}>
          <h3>Summary</h3>
          <div className={styles.summaryContent}>{summary}</div>
        </div>
      </div>
    </div>
  );
};

export default PdfSummarizerPage;
