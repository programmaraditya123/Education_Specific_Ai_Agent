// CareerGuidanceDark.tsx
import React, { useState } from "react";
import styles from "./CareerGuidance.module.scss";
import axios from "axios";

type ApiResponse = {
  summary_and_advice?: string;
  potential_career_paths?: { path_title: string; description: string }[];
  actionable_roadmap?: {
    phase_1_fundamentals: string[];
    phase_2_framework: string[];
    phase_3_specialize: string[];
  };
  final_conclusion?: string;
};

const MOCK_RESPONSE: ApiResponse = {
  summary_and_advice:
    "(Mock) Based on your education and interests, a frontend-specialized full-stack path looks promising.",
  potential_career_paths: [
    { path_title: "Frontend Engineer", description: "Focus on React, performance, and UI/UX." },
    { path_title: "Full-stack Engineer", description: "Combine frontend with Node/DB skills." },
  ],
  actionable_roadmap: {
    phase_1_fundamentals: ["JavaScript & TypeScript fundamentals", "Data structures & algorithms (basics)"],
    phase_2_framework: ["React + hooks + testing", "Next.js (SSG/SSR)", "Build small UI projects"],
    phase_3_specialize: ["Performance engineering", "3D/graphics if interested", "Open source contributions"],
  },
  final_conclusion:
    "(Mock) Start with fundamentals, build small projects, then pick one specialization to master.",
};

const CareerGuidance: React.FC = () => {
  const [education, setEducation] = useState("");
  const [interests, setInterests] = useState("");
  const [query, setQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetAll = () => {
    setEducation("");
    setInterests("");
    setQuery("");
    setResponse(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Try real API but fall back to mock if it fails
      const res = await axios.post(
        // "https://education-specific-ai-agent-710178903619.asia-south1.run.app/career-guidance",
        "http://localhost:8000/career-guidance",
        { education, interests, query },
        { timeout: 70000 }
      );

      // Expect res.data.advice to be the object; defensive checks included
      const advice = res?.data?.advice;
      if (advice) {
        setResponse(advice);
      } else {
        // If API returned no usable payload, fallback to mock but note it as an error
        setError("API responded with unexpected data. Showing fallback guidance.");
        setResponse(MOCK_RESPONSE);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reach the career guidance API. Showing offline guidance.");
      setResponse(MOCK_RESPONSE);
    } finally {
      setIsLoading(false);
    }
  };

  // When response is present we render a separate 'page' (full-screen card) with Reset
  if (response) {
    return (
      <div className={styles.resultPage}>
        <div className={styles.card} role="region" aria-live="polite">
          <header className={styles.cardHeader}>
            <h2>Your Career Plan</h2>
            <div className={styles.controls}>
              <button className={styles.resetBtn} onClick={resetAll}>
                Reset
              </button>
            </div>
          </header>

          {error && <div className={styles.warning}>{error}</div>}

          <section className={styles.summary}>
            <h3>Summary & Advice</h3>
            <p>{response.summary_and_advice}</p>
          </section>

          <section className={styles.paths}>
            <h3>Potential Career Paths</h3>
            <div className={styles.pathGrid}>
              {response.potential_career_paths?.map((p) => (
                <article key={p.path_title} className={styles.pathCard}>
                  <strong>{p.path_title}</strong>
                  <p>{p.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.roadmap}>
            <h3>Actionable Roadmap</h3>
            <div className={styles.phases}>
              <div>
                <h4>Phase 1 • Fundamentals</h4>
                <ul>
                  {response.actionable_roadmap?.phase_1_fundamentals.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4>Phase 2 • Frameworks</h4>
                <ul>
                  {response.actionable_roadmap?.phase_2_framework.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4>Phase 3 • Specialize</h4>
                <ul>
                  {response.actionable_roadmap?.phase_3_specialize.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <footer className={styles.cardFooter}>
            <p>Good luck — remember to build small projects and iterate fast.</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Career Guidance</h2>

        <label className={styles.field}>
          <span>Your Education</span>
          <input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. B.Tech in Computer Science" required />
        </label>

        <label className={styles.field}>
          <span>Your Interests</span>
          <textarea value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. React, 3D graphics" required />
        </label>

        <label className={styles.field}>
          <span>Your Main Query / Dilemma</span>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. frontend vs full-stack" required />
        </label>

        <div className={styles.actions}>
          <button type="submit" className={styles.primary} disabled={isLoading}>
            {isLoading ? "Generating Plan..." : "Get My Career Plan"}
          </button>
          <button type="button" className={styles.secondary} onClick={resetAll}>
            Reset
          </button>
        </div>

        <p className={styles.footerNote}>We try the live API first; if it's unreachable we show a safe offline plan.</p>
      </form>
    </div>
  );
};

export default CareerGuidance;


/* --- CareerGuidanceDark.module.scss ---

Place this file alongside the component and import as shown.

*/

/* CSS/SCSS content below */











// import { useState } from "react";
// import styles from "./CareerGuidance.module.scss";
// import axios from "axios";

// const CareerGuidance = () => {
//   const [education, setEducation] = useState("");
//   const [interests, setInterests] = useState("");
//   const [query, setQuery] = useState("");

//   const [isLoading, setIsLoading] = useState(false);
//   const [responded, setResponded] = useState(false);
//   const [response, setResponse] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         "https://education-specific-ai-agent-710178903619.asia-south1.run.app/career-guidance",
//         {
//           education: education,
//           interests: interests,
//           query: query,
//         }
//       );
//       console.log("response", response);
//       setResponded(true);
//       setResponse(response.data.advice);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.CareerGuidance}>
//       <form onSubmit={handleSubmit} className={styles.careerform}>
//         <label>
//           Your Education:
//           <input
//             type="text"
//             value={education}
//             onChange={(e) => setEducation(e.target.value)}
//             placeholder="e.g., 'B.Tech in Computer Science'"
//             required
//           />
//         </label>
//         <label>
//           Your Interests:
//           <textarea
//             value={interests}
//             onChange={(e) => setInterests(e.target.value)}
//             placeholder="e.g., 'React, 3D graphics, building cool UIs'"
//             required
//           />
//         </label>
//         <label>
//           Your Main Query/Dilemma:
//           <textarea
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="e.g., 'I'm not sure if I should focus on full-stack or specialize in frontend.'"
//             required
//           />
//         </label>
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Generating Plan..." : "Get My Career Plan"}
//         </button>
//       </form>

//       {responded && (
//         <div className={styles.CareerGuidanceResponse}>
//           {responded && response && (
//             <div className={styles.CareerGuidanceResponse}>
//               <div className={styles.SAndAd}>
//                 <h3>Summary & Advice</h3>
//                 <p>{response.summary_and_advice}</p>
//               </div>

//               <div className={styles.PCPaths}>
//                 <h3>Potential Career Paths</h3>
//                 {response.potential_career_paths.map((path) => (
//                   // We add a 'key' for React to track each item
//                   <div key={path.path_title} className={styles.careerPathItem}>
//                     <strong>{path.path_title}</strong>
//                     <p>{path.description}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className={styles.ARM}>
//                 <h3>Your Actionable Roadmap</h3>

//                 <div className={styles.roadmapPhase}>
//                   <h4>Phase 1: Fundamentals</h4>
//                   <ul>
//                     {response.actionable_roadmap.phase_1_fundamentals.map(
//                       (item, index) => (
//                         <li key={index}>{item}</li>
//                       )
//                     )}
//                   </ul>
//                 </div>

//                 <div className={styles.roadmapPhase}>
//                   <h4>Phase 2: Frameworks</h4>
//                   <ul>
//                     {response.actionable_roadmap.phase_2_framework.map(
//                       (item, index) => (
//                         <li key={index}>{item}</li>
//                       )
//                     )}
//                   </ul>
//                 </div>

//                 <div className={styles.roadmapPhase}>
//                   <h4>Phase 3: Specialization</h4>
//                   <ul>
//                     {response.actionable_roadmap.phase_3_specialize.map(
//                       (item, index) => (
//                         <li key={index}>{item}</li>
//                       )
//                     )}
//                   </ul>
//                 </div>
//               </div>

//               {/* 4. Conclusion (This was already correct) */}
//               <div className={styles.FC}>
//                 <h3>Final Conclusion</h3>
//                 <p>{response.final_conclusion}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CareerGuidance;
