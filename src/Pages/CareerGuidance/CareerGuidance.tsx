import React, { useState } from "react";
import styles from "./CareerGuidance.module.scss";
import axios from "axios";

const CareerGuidance = () => {
  const [education, setEducation] = useState("");
  const [interests, setInterests] = useState("");
  const [query, setQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://education-specific-ai-agent-710178903619.asia-south1.run.app/career-guidance",
        {
          education: education,
          interests: interests,
          query: query,
        }
      );
      console.log("response", response);
      setResponded(true);
      setResponse(response.data.advice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.CareerGuidance}>
      <form onSubmit={handleSubmit} className={styles.careerform}>
        <label>
          Your Education:
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g., 'B.Tech in Computer Science'"
            required
          />
        </label>
        <label>
          Your Interests:
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., 'React, 3D graphics, building cool UIs'"
            required
          />
        </label>
        <label>
          Your Main Query/Dilemma:
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'I'm not sure if I should focus on full-stack or specialize in frontend.'"
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Generating Plan..." : "Get My Career Plan"}
        </button>
      </form>

      {responded && (
        <div className={styles.CareerGuidanceResponse}>
          {responded && response && (
            <div className={styles.CareerGuidanceResponse}>
              <div className={styles.SAndAd}>
                <h3>Summary & Advice</h3>
                <p>{response.summary_and_advice}</p>
              </div>

              <div className={styles.PCPaths}>
                <h3>Potential Career Paths</h3>
                {response.potential_career_paths.map((path) => (
                  // We add a 'key' for React to track each item
                  <div key={path.path_title} className={styles.careerPathItem}>
                    <strong>{path.path_title}</strong>
                    <p>{path.description}</p>
                  </div>
                ))}
              </div>

              <div className={styles.ARM}>
                <h3>Your Actionable Roadmap</h3>

                <div className={styles.roadmapPhase}>
                  <h4>Phase 1: Fundamentals</h4>
                  <ul>
                    {response.actionable_roadmap.phase_1_fundamentals.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className={styles.roadmapPhase}>
                  <h4>Phase 2: Frameworks</h4>
                  <ul>
                    {response.actionable_roadmap.phase_2_framework.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className={styles.roadmapPhase}>
                  <h4>Phase 3: Specialization</h4>
                  <ul>
                    {response.actionable_roadmap.phase_3_specialize.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* 4. Conclusion (This was already correct) */}
              <div className={styles.FC}>
                <h3>Final Conclusion</h3>
                <p>{response.final_conclusion}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerGuidance;
