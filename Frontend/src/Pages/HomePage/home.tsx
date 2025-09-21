import React from "react";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      {/* Navbar */ }
      <header className={styles.navbar}>
        <div className={styles.logo}>Thinkora</div> {/*thiking +bright future*/}
        <nav>
          <ul>
            <li>Home</li>
            <li>Resources</li>
            <li>Quiz</li>
            <li>Summarizer</li>
            <li>Chatbot</li>
          </ul>
        </nav>
      </header>

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
          <button>Chat</button>
        </div>

        <div className={styles.card}>
          <h2>📚 Resource Finder</h2>
          <p>Discover curated learning resources.</p>
          <input type="text" placeholder="Enter topic..." />
          <button>Find Resources</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
