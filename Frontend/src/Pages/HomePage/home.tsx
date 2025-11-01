import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Your Learning Companion 🚀</h1>
        <p>
          Get personalized learning resources, AI-powered document summaries,
          quizzes, and a chatbot to assist your study journey.
        </p>
      </section>

      {/* Feature Cards */}
      <section className={styles.cards}>
        <div className={styles.card}>
          <h2>📄 PDF Summarizer</h2>
          <p>Upload a document and get instant AI-powered summaries.</p>
          <input type="file" />
          <button>Summarize</button>
        </div>

        <div className={styles.card}>
          <h2>❓ Quiz Generator</h2>
          <p>Generate quizzes from topics or documents.</p>
          <input type="text" placeholder="Enter topic..." />
          <button>Generate Quiz</button>
        </div>

        <div className={styles.card}>
          <h2>🤖 Simple Chatbot</h2>
          <p>Ask questions and get instant AI responses.</p>
          <input type="text" placeholder="Type a message..." />
          <button onClick={() => navigate("/chatbot")}>Chat</button>
        </div>

        <div className={styles.card}>
          <h2>Career Guidance</h2>
          <p>Get proper guidance on how to build career in any field</p>
          <input type="text" placeholder="Enter topic..." />
          <button onClick={() => navigate("/career-guidance")}>
            Career-Guidance
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
