import { useState, useEffect, useRef } from "react";
import "./aiAssistant.css";
import api from "../../api/api.js";

const chips = ["✦ Generate Caption", "◎ Improve Hook", "✓ Fix Grammar", "# Hashtags", "Fix Tone"];

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function AiAssistant({ onClose, onUseInEditor }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      text: "Hi! What would you like help creating?",
      time: getCurrentTime(),
      welcome: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const chatEndRef = useRef(null);
  const copiedTimeoutRef = useRef(null);

  // Close with the Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    return () => window.clearTimeout(copiedTimeoutRef.current);
  }, []);

  // Scroll to the newest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text, time: getCurrentTime() },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/generate-caption", { prompt: text }, {
        validateStatus: () => true,
      });
      const data = response.data;

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          data?.message || data?.error || `Request failed (${response.status}).`
        );
      }

      if (typeof data?.suggestion !== "string") {
        throw new Error("The server response did not include a suggestion.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: data.suggestion,
          time: getCurrentTime(),
        },
      ]);
    } catch (error) {
      console.error("Could not generate a caption:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: error instanceof Error ? error.message : "Unable to generate a caption.",
          time: getCurrentTime(),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage(messageId, text) {
    try {
      await navigator.clipboard.writeText(text);
      window.clearTimeout(copiedTimeoutRef.current);
      setCopiedMessageId(messageId);
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error("Could not copy the AI response:", error);
    }
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
                    <button
                      type="button"
                      onClick={() => copyMessage(msg.id, msg.text)}
                    >
                      {copiedMessageId === msg.id ? "✓ Copied" : "⧉ Copy"}
                    </button>
                    <button type="button">↻</button>
                  </div>
                </div>

                {msg.error || msg.welcome ? (
                  <p className={msg.error ? "ai-error ai-message-text" : "ai-message-text"}>
                    {msg.text}
                  </p>
                ) : (
                  <>
                    <p className="ai-intro">Here is your generated caption:</p>

                    <div className="ai-option">
                      <div className="ai-option-head">
                        <div>
                          <span className="ai-recommended">RECOMMENDED</span>
                          <strong>Generated caption</strong>
                        </div>
                        <small className="mono">{msg.text.length} characters</small>
                      </div>

                      <p className="ai-message-text">{msg.text}</p>

                      <div className="ai-option-actions">
                        <button
                          type="button"
                          className="ai-btn-dark"
                          onClick={() => onUseInEditor(msg.text)}
                        >
                          ✓ Use in Editor
                        </button>
                        <button
                          type="button"
                          className="ai-btn-light"
                          onClick={() => copyMessage(msg.id, msg.text)}
                        >
                          {copiedMessageId === msg.id ? "✓ Copied" : "⧉ Copy"}
                        </button>
                        <button type="button" className="ai-btn-light">⚙ Improve</button>
                        <span className="ai-adapt">⎘ Adapt for Reels</span>
                      </div>
                    </div>
                  </>
                )}
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
                <button type="button" className="ai-select">🌐 All Platforms</button>
                <button type="button" className="ai-plain">≡ Tone</button>
              </div>
              <div className="ai-input-right">
                <span>Press Enter ↵</span>
                <button
                  type="button"
                  className="ai-send"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AiAssistant;