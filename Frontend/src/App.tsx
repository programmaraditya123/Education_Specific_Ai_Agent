import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage/home";
import ChatPage from "./Pages/Chatbot/ChatPage";
import Header from "./Pages/header/header"; // Make sure the component is named Header
import PdfSummarizerPage from "./Pages/PDFSummerizer/pdfsummarizer";
function App() {
  return (
    <Router>
      {/* Header will appear on all pages */}
      <Header />

      {/* Page routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<ChatPage />} />
         <Route path="/summarizer" element={<PdfSummarizerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
