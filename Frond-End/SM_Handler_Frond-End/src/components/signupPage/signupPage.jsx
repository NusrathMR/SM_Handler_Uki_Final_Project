import "./signupPage.css"

function signupPage(){
    return(
        <>
            <div class="su-page">

                {/* <!-- Left panel --> */}
                <aside class="su-left">
                    <div>
                    <div class="su-top">
                        <div class="su-brand">
                        <span class="su-logo">✦</span>
                        <span class="su-brand-name">Socialynk</span>
                        <span class="su-tag">AI SOCIAL SUITE</span>
                        </div>
                        <span class="su-live"><i></i> v2.4 Live</span>
                    </div>

                    <h1>Create your Socialynk workspace.</h1>
                    <p class="su-left-text">
                        Create content, improve it with AI, add your branding, and manage your social media publishing from one simple workspace.
                    </p>

                    <div class="su-image-box">
                        <img src="https://picsum.photos/720/300?grayscale" alt="Preview image" />
                    </div>
                    </div>

                    <div class="su-left-footer">
                    <span>Everything you need to manage your social content.</span>
                    <span class="mono">&copy; 2026 Socialynk Inc. All rights reserved.</span>
                    </div>
                </aside>

                {/* <!-- Right panel --> */}
                <main class="su-right">
                    <p class="su-login-link">Already have an account? <a href="#">Log in</a></p>

                    <div class="su-form-wrap">
                    <h2>Create your account</h2>
                    <p class="su-sub">Start creating and managing your social media content with Socialynk.</p>

                    <form>
                        <label for="name">FULL NAME</label>
                        <div class="su-field">
                        <input type="text" id="name" value="Nusrat Ahmed"/>
                        <span class="su-field-icon">&#9786;</span>
                        </div>

                        <label for="email">EMAIL ADDRESS</label>
                        <div class="su-field">
                        <input type="email" id="email" value="nusrat@socialynk.io"/>
                        <span class="su-field-icon">&#9993;</span>
                        </div>

                        <label for="password">PASSWORD</label>
                        <div class="su-field">
                        <input type="password" id="password" placeholder="password123"/>
                        <span class="su-field-icon">&#9673;</span>
                        </div>

                        <div class="su-strength-head">
                        <span>Password strength</span>
                        <b class="su-strong">STRONG</b>
                        </div>
                        <div class="su-bars">
                        <i></i><i></i><i></i><i></i>
                        </div>

                        <ul class="su-rules">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One number</li>
                        <li>One special character</li>
                        </ul>

                        <label for="confirm">CONFIRM PASSWORD</label>
                        <div class="su-field">
                        <input type="password" id="confirm" placeholder="password123"/>
                        <span class="su-field-icon">&#9673;</span>
                        </div>

                        <label class="su-agree">
                        <input type="checkbox" checked/>
                        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </label>

                        <button type="submit" class="su-btn-main">Create Account &rarr;</button>

                        <div class="su-or"><span>OR</span></div>

                        <div class="su-social-row">
                        <button type="button" class="su-social"><b class="g">G</b> Continue with Google</button>
                        <button type="button" class="su-social"><b class="f">f</b> Continue with Facebook</button>
                        </div>
                    </form>
                    </div>

                    <div class="su-right-footer">
                    <span>&#9737; SOC2 Type II Certified &amp; 256-Bit Encrypted</span>
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

export default signupPage;