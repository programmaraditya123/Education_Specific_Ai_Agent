import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage/home";
import ChatPage from "./Pages/Chatbot/ChatPage";
import Header from "./Pages/header/header"; // Make sure the component is named Header
import PdfSummarizerPage from "./Pages/PDFSummerizer/pdfsummarizer";
import CareerGuidance from "./pages/CareerGuidance/CareerGuidance";
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
        <Route path="/career-guidance" element={<CareerGuidance />} />
      </Routes>
    </Router>
  );
}

export default App;
