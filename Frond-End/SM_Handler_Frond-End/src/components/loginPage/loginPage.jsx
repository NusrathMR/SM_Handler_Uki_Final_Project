import "./loginPage.css";
import { useState } from "react";
import ForgotPasswordModal from "../forgetPassword/forgetPassword.jsx";


function LoginPage(){

    const [showForgot, setShowForgot] = useState(false);


    return(
        <>
          <div class="login-page">

            {/* <!-- Left panel --> */}
            <aside class="left-panel">
                <div class="left-top">
                <div class="left-brand">
                    <span class="left-logo">✦</span>
                    <span class="left-brand-name">Socialynk</span>
                    <span class="left-tag">AI SOCIAL SUITE</span>
                </div>

                <h1>Create once.<br /><span class="muted">Improve with AI.</span><br />Publish everywhere.</h1>

                <p class="left-text">
                    Create, improve, brand, schedule, and publish your social media content from one simple workspace.
                </p>

                <div class="flow-box">
                    <div class="flow-header">
                    <span class="status"><i class="green-dot"></i> Unified Orchestration</span>
                    <span class="delivery">⚡ 99.98% Multi-Network Delivery</span>
                    </div>

                    <div class="step">
                    <span class="step-num">1</span>
                    <div class="step-text">
                        <strong>Create</strong>
                        <small>Draft &amp; Media Assets</small>
                    </div>
                    <span class="step-icon">✎</span>
                    </div>

                    <div class="step active">
                    <span class="step-num">2</span>
                    <div class="step-text">
                        <strong>AI Assist <em>v2.4</em></strong>
                        <small>Smart Hook &amp; Tone Optimization</small>
                    </div>
                    <span class="step-icon">✦</span>
                    </div>

                    <div class="step">
                    <span class="step-num">3</span>
                    <div class="step-text">
                        <strong>Brand</strong>
                        <small>Watermark, Preset &amp; Footers</small>
                    </div>
                    <span class="step-icon">◐</span>
                    </div>

                    <div class="step">
                    <span class="step-num">4</span>
                    <div class="step-text">
                        <strong>Schedule</strong>
                        <small>Optimal AI Time Slots</small>
                    </div>
                    <span class="step-icon">▦</span>
                    </div>

                    <div class="step">
                    <span class="step-num">5</span>
                    <div class="step-text">
                        <strong>Publish</strong>
                        <small>Multi-Channel Sync</small>
                    </div>
                    <span class="mini-tags">
                        <b>X</b><b>in</b><b>ig</b><b>fb</b>
                    </span>
                    </div>
                </div>
                </div>

                <div class="left-footer">
                <span>YOUR SOCIAL MEDIA WORKFLOW, SIMPLIFIED.</span>
                <span>&copy; 2026 Socialynk Inc. All rights reserved.</span>
                </div>
            </aside>

            {/* <!-- Right panel --> */}
            <main class="right-panel">
                <div class="form-wrap">
                <h2>Welcome back</h2>
                <p class="form-sub">Log in to continue managing your social media content with Socialynk.</p>

                <form>
                    <label for="email">EMAIL ADDRESS</label>
                    <input type="email" id="email" placeholder="alex.chen@socialynk.io" />

                    <label for="password">PASSWORD</label>
                    <div class="password-box">
                    <input type="password" id="password" placeholder="password1234" />
                    <span class="eye">◉</span>
                    </div>

                    <div class="form-row">
                    <label class="remember">
                        <input type="checkbox" checked /> Remember me
                    </label>
                    <a href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            setShowForgot(true);
                        }}>Forgot password?</a>

                        {showForgot && (
                            <ForgotPasswordModal onClose={() => setShowForgot(false)} />
                        )}
                    </div>

                    <button type="submit" class="login-btn">Log In</button>

                    <div class="or-line"><span>OR</span></div>

                    <button type="button" class="social-btn">
                    <b class="g-icon">G</b> Continue with Google
                    </button>
                    <button type="button" class="social-btn">
                    <b class="f-icon">f</b> Continue with Facebook
                    </button>

                    <p class="signup-text">Don't have an account? <a href="#">Create an account</a></p>
                </form>
                </div>

                <div class="right-footer">
                <span>SOC2 Type II Certified &amp; 256-Bit Encrypted</span>
                <div>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">System Status</a>
                </div>
                </div>
            </main>

            </div>  
        </>
    )
}

export default LoginPage;