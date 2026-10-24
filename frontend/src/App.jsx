import { useState } from "react";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false)
  const [typing, setTyping] = useState(false);

  async function handleExplain() {
    setExplanation("")
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      const data = await response.json();
      // setExplanation(data.explanation);
      setTyping(true)

      const text = data.explanation;

      setExplanation("");

      let index = 0;

      const interval = setInterval(() => {
        setExplanation(text.slice(0, index));

        index++;

        if (index > text.length) {
          clearInterval(interval);
          setTyping(false)
        }
      }, 15);

    } catch (error) {
      setExplanation("Error: Could not get explanation.");
      console.error(error);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="app">

  <div className="header">
    <h1>🤖 AI Code Explainer</h1>
    <p>Understand code instantly using local AI</p>
  </div>

  <div className="workspace">

    <div className="panel">

      <div className="panel-header">
        <h3>Code</h3>

        <select
          className="language-select"
          value={language}
          onChange={(e)=>setLanguage(e.target.value)}
        >
          <option>Python</option>
          <option>JavaScript</option>
          <option>C</option>
          <option>C++</option>
          <option>Java</option>
        </select>
      </div>

      <textarea
        value={code}
        onChange={(e)=>setCode(e.target.value)}
        placeholder="Paste your code..."
      />

    </div>

    <div className="panel">

      <div className="panel-header">
        <h3>Explanation</h3>

        <button
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(explanation);
            setCopied(true);

            setTimeout(() => {
                setCopied(false)
            },2000)
          }}
          disabled = {!explanation}
        >
          {copied ? "✅ Copied!" : "📋 Copy"}
        </button>
      </div>

      <div className="output">
        {explanation || "AI explanation will appear here..."}
        {typing && <span className="cursor">|</span>}
      </div>

      

    </div>

  </div>

  <button
    className="explain-btn"
    onClick={handleExplain}
    disabled={loading}
  >
    {loading ? "Thinking..." : "Explain Code"}
  </button>

</div>
  );
}

export default App;