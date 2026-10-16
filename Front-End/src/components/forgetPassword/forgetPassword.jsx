import { useState, useEffect } from "react";
import "./forgetPassword.css";

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("alex.chen@socialynk.io");

  // Close the popup when the Escape key is pressed
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Send reset link to:", email);
    // call your API here
  }

  return (
    <div className="fp-overlay" onClick={onClose}>
      <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fp-close" onClick={onClose}>&times;</button>

        <div className="fp-icon">↻</div>

        <h2>Forgot your password?</h2>
        <p className="fp-text">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fp-email">EMAIL ADDRESS</label>
          <input
            type="email"
            id="fp-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="fp-send">➤ Send Reset Link</button>
        </form>

        <p className="fp-bottom">
          Remember your password?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;