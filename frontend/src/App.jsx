import { useState } from "react";

function App() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    const formData = new FormData();

    for (let file of files) {
      formData.append("files", file);
    }

    formData.append("job_description", jd);

    const res = await fetch("http://127.0.0.1:8000/rank/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResults(data.ranking);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "30px", background: "#1e5ebd37", minHeight: "100vh" }}>
      
      <h1 style={{ textAlign: "center" }}>🚀 AI Resume Ranker</h1>

      <div style={{ background: "Brown", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        <br /><br />

        <textarea
          rows="5"
          placeholder="Paste Job Description..."
          style={{ width: "100%", padding: "10px" }}
          onChange={(e) => setJd(e.target.value)}
        />

        <br /><br />

        <button 
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Rank Candidates
        </button>
      </div>

      <h2>🏆 Rankings</h2>

      {results.map((r, index) => (
        <div 
          key={index}
          style={{
            background: "white",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <strong>#{index + 1} {r.filename}</strong>

          <div style={{ marginTop: "10px" }}>
            <div 
              style={{
                height: "10px",
                width: "100%",
                background: "#ddd",
                borderRadius: "5px"
              }}
            >
              <div 
                style={{
                  height: "10px",
                  width: `${r.score}%`,
                  background: "#4CAF50",
                  borderRadius: "5px"
                }}
              />
            </div>
            <p>{r.score}% match</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;