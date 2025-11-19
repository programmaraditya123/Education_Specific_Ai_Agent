import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import robot from "./Adobe Express - file.png";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <section className={styles.container}>
      
        <div className={styles.textBlock}>
          <h1>Empower Your Learning Journey with AI </h1>
          <p>
            Smart tools that summarize, chat, and guide you — making studying
            simpler, faster, and smarter.
          </p>
        </div>

        
        <div className={styles.mainContent}>
        
          <div className={styles.robotSection}>
            <img src={robot} alt="AI Robot" className={styles.robotImage} />
          </div>

       
          <div className={styles.cardsSection}>
            <div className={`${styles.card} ${styles.glow}`}>
              <h2>PDF Summarizer</h2>
              <p>Upload a document and get instant AI-powered summaries.</p>
              <button onClick={() => navigate("/summarizer")}>Summarize</button>
            </div>

            <div className={`${styles.card} ${styles.glow}`}>
              <h2>Career Guidance</h2>
              <p>Get proper guidance on how to build your career in any field.</p>
              <button onClick={() => navigate("/career-guidance")}>
                Career Guidance
              </button>
            </div>

            <div className={`${styles.card} ${styles.glow}`}>
              <h2>AI Assistant</h2>
              <p>Ask questions and get instant AI responses.</p>
              <button onClick={() => navigate("/chatbot")}>Chat</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
