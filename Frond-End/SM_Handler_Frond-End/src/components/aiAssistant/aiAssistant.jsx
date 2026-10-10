import { useState, useEffect, useRef } from "react";
import "./aiAssistant.css";

const chips = ["✦ Generate Caption", "◎ Improve Hook", "✓ Fix Grammar", "# Hashtags", "Fix Tone"];

// First messages shown when the popup opens
const startMessages = [
  {
    id: 1,
    role: "user",
    text: "Help me rewrite this launch post for LinkedIn and Instagram. Make it more engaging, punchy, and include strong hooks.",
    time: "Just now",
  },
  {
    id: 2,
    role: "ai",
    time: "10s ago",
    intro: "Here are 2 high-converting variations tailored for your audience, ready to insert directly into your draft:",
    option: {
      title: "Option 1: Authority & Insight (LinkedIn / X)",
      chars: "~380 characters",
      lines: [
        "Most teams spend 12+ hours every week juggling social tools and disconnected workflows.",
        "We built Socialynk v2.4 to eliminate that friction completely: one unified workspace, AI-assisted copy, and native multi-network publishing in seconds.",
        "What is your biggest roadblock when distributing content at scale? 👇",
      ],
      tags: "#SaaS #Productivity #ContentStrategy #SocialMediaMarketing",
    },
  },
];

function AiAssistant({ onClose, onUseInEditor }) {
  const [messages, setMessages] = useState(startMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Close with the Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Scroll to the newest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text, time: "Just now" },
    ]);
    setInput("");
    setLoading(true);

    // Fake AI reply. Replace this with your real API call.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          time: "Just now",
          intro: "Here is an updated version based on your request:",
          option: {
            title: "Option 1: Short & Punchy",
            chars: "~120 characters",
            lines: ["Stop juggling tools. Start publishing. Socialynk puts everything in one place. 🚀"],
            tags: "#SocialMedia #Productivity",
          },
        },
      ]);
      setLoading(false);
    }, 1000);
  }

  function handleKeyDown(e) {
    // Enter sends, Shift+Enter makes a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="ai-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <header className="ai-header">
          <span className="ai-logo">✦</span>
          <div className="ai-title">
            <h2>AI Assistant <small className="ai-version">v2.4 Turbo</small></h2>
            <p>Create better social content with AI.</p>
          </div>
          <span className="ai-credits">⚡ AI Credits: 42 remaining</span>
          <button className="ai-close" onClick={onClose}>&times;</button>
        </header>

        {/* Context bar */}
        <div className="ai-context">
          <div className="ai-working">
            <span className="ai-green-dot"></span>
            <span>Working with:</span>
            <small>Social Post • Linked to editor caption</small>
          </div>
          <div className="ai-chips">
            {chips.map((chip) => (
              <button key={chip} type="button" onClick={() => setInput(chip.slice(2))}>
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="ai-chat">
          {messages.map((msg) =>
            msg.role === "user" ? (
              <div className="ai-user-msg" key={msg.id}>
                <div className="ai-bubble">{msg.text}</div>
                <small>✓✓ {msg.time}</small>
              </div>
            ) : (
              <div className="ai-reply" key={msg.id}>
                <div className="ai-reply-head">
                  <span className="ai-mini-logo">✦</span>
                  <strong>AI Assistant</strong>
                  <small>• {msg.time}</small>
                  <div className="ai-reply-tools">
                    <button type="button">⧉</button>
                    <button type="button">↻</button>
                  </div>
                </div>

                <p className="ai-intro">{msg.intro}</p>

                <div className="ai-option">
                  <div className="ai-option-head">
                    <div>
                      <span className="ai-recommended">RECOMMENDED</span>
                      <strong>{msg.option.title}</strong>
                    </div>
                    <small className="mono">{msg.option.chars}</small>
                  </div>

                  {msg.option.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <p className="ai-tags">{msg.option.tags}</p>

                  <div className="ai-option-actions">
                    <button
                      type="button"
                      className="ai-btn-dark"
                      onClick={() => onUseInEditor(msg.option.lines.join("\n\n") + "\n\n" + msg.option.tags)}
                    >
                      ✓ Use in Editor
                    </button>
                    <button
                      type="button"
                      className="ai-btn-light"
                      onClick={() => navigator.clipboard.writeText(msg.option.lines.join("\n\n"))}
                    >
                      ⧉ Copy
                    </button>
                    <button type="button" className="ai-btn-light">⚙ Improve</button>
                    <span className="ai-adapt">⎘ Adapt for Reels</span>
                  </div>
                </div>
              </div>
            )
          )}

          {loading && <p className="ai-intro">AI Assistant is typing...</p>}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="ai-input-area">
          <div className="ai-input-box">
            <textarea
              rows="2"
              placeholder="Ask AI to create or improve your content... (e.g. 'Make it shorter and add 3 punchy hooks')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="ai-input-bar">
              <div className="ai-input-left">
                <button type="button" className="ai-icon-btn">⌀</button>
                <button type="button" className="ai-select">🌐 All Platforms ⌄</button>
                <button type="button" className="ai-plain">≡ Tone</button>
              </div>
              <div className="ai-input-right">
                <span>Press Enter ↵</span>
                <button type="button" className="ai-send" onClick={sendMessage}>↑</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AiAssistant;