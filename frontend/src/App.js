import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeMood = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResult(data);
      setText("");
      fetchHistory();
    } catch {
      setError("⚠️ Backend not running");
    }

    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API}/history`);
      const data = await res.json();
      setHistory(data);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>🧠 MoodLens</h1>
        <p style={styles.subtitle}>How are you feeling today?</p>

        <textarea
          rows="4"
          style={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Express your thoughts..."
        />

        <button onClick={analyzeMood} style={styles.button} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Mood"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.result}>
            <h2>{result.mood}</h2>
            <p>{result.suggestion}</p>
          </div>
        )}

        <h3 style={{ marginTop: "25px" }}>History</h3>

        <div style={styles.historyBox}>
          {history.length === 0 ? (
            <p style={{ fontSize: "13px" }}>No history yet</p>
          ) : (
            history.map((item, index) => (
              <div key={index} style={styles.historyItem}>
                <span>{item.mood}</span>
                <small>{item.time}</small>
              </div>
            ))
          )}
        </div>

        <p style={styles.warning}>
          ⚠️ This app is not a medical diagnosis tool.
        </p>
      </div>
    </div>
  );
}

export default App;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    width: "90%",
    maxWidth: "500px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "15px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    resize: "none",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#ff7eb3",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.2)",
  },
  historyBox: {
    maxHeight: "150px",
    overflowY: "auto",
    marginTop: "10px",
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
  },
  error: {
    color: "#ffd166",
    fontSize: "13px",
    marginTop: "10px",
  },
  warning: {
    fontSize: "11px",
    marginTop: "15px",
    opacity: 0.8,
  },
};