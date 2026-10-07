import "./dashBoard.css"

function DashBoard(){
    return(
        <>
            <div class="db-layout">

                {/* <!-- Sidebar --> */}
                <aside class="db-sidebar">
                    <div>
                    <div class="db-brand">
                        <span class="db-logo">✦</span>
                        <div>
                        <strong>Socialynk</strong>
                        <small>ENTERPRISE SUITE</small>
                        </div>
                    </div>

                    <a href="#" class="db-create-btn">+ Create New</a>

                    <nav class="db-menu">
                        <a href="#" class="active">⌂ Home</a>
                        <a href="#">✎ Create</a>
                        <a href="#">▦ Publish</a>
                        <a href="#">▣ Templates</a>
                        <a href="#">▬ Pricing</a>
                    </nav>
                    </div>

                    <div>
                    <div class="db-channels-head">
                        <span>CONNECTED CHANNELS</span>
                        <span>+</span>
                    </div>
                    <div class="db-channel-icons">
                        <i>✻</i><i>◎</i><i>|</i><i>in</i><i>♪</i><i>▶</i>
                    </div>

                    <div class="db-user-card">
                        <span class="db-avatar-light">MA</span>
                        <div>
                        <strong>M. R. Nusrat Ahmed</strong>
                        <small>Free Plan</small>
                        </div>
                        <span class="db-dots">⋮</span>
                    </div>
                    </div>
                </aside>

                {/* <!-- Main --> */}
                <main class="db-main">

                    {/* <!-- Top bar --> */}
                    <header class="db-topbar">
                    <div>
                        <h1>Good morning, Nusrat 👋</h1>
                        <p>Create. Edit. Publish. Grow. All in one place.</p>
                    </div>
                    <div class="db-top-actions">
                        <div class="db-search">
                        <span>⌕ Search anything...</span>
                        <kbd>⌘K</kbd>
                        </div>
                        <span class="db-bell">🔔</span>
                        <span class="db-avatar-dark">NA</span>
                    </div>
                    </header>

                    {/* <!-- Stats --> */}
                    <section class="db-stats">
                    <div class="db-stat">
                        <div class="db-stat-top"><span class="db-stat-icon">▣</span><span>···</span></div>
                        <h2>2,000</h2>
                        <p>Week Streak</p>
                        <div class="db-stat-foot"><span class="db-chip">+12%</span> from last week</div>
                    </div>

                    <div class="db-stat">
                        <div class="db-stat-top"><span class="db-stat-icon">◎</span><span>···</span></div>
                        <h2>1</h2>
                        <p>Posting Goals</p>
                        <div class="db-progress-text"><span>Completed</span><b>0 remaining</b></div>
                        <div class="db-progress"><i></i></div>
                    </div>

                    <div class="db-stat">
                        <div class="db-stat-top"><span class="db-stat-icon">▭</span><span>···</span></div>
                        <h2>50</h2>
                        <p>Comment Score</p>
                        <div class="db-stat-foot"><span class="db-chip">+8%</span> from last week</div>
                    </div>

                    <div class="db-stat">
                        <div class="db-stat-top"><span class="db-stat-icon">▤</span><span>···</span></div>
                        <h2>1</h2>
                        <p>Pending Posts</p>
                        <div class="db-stat-foot"><span class="db-chip dark">1 scheduled</span> in queue</div>
                    </div>
                    </section>

                    {/* <!-- Steps --> */}
                    <div class="db-section-head">
                    <h3>Steps to post</h3>
                    <a href="#">Quick setup guide</a>
                    </div>

                    <section class="db-steps">
                    <div class="db-step">
                        <div class="db-step-top"><span class="db-step-num">01</span><span>→</span></div>
                        <h4>Connect a channel</h4>
                        <p>First, connect your social media pages to publish your content.</p>
                        <div class="db-step-icons"><i>✻</i><i>X</i><i>in</i><i>◎</i></div>
                        <a href="#" class="db-step-btn">Connect channels →</a>
                    </div>

                    <div class="db-step">
                        <div class="db-step-top"><span class="db-step-num">02</span><span>→</span></div>
                        <h4>Create a post</h4>
                        <p>Create your social media content using the Socialynk editor.</p>
                        <div class="db-step-lines"><i></i><i></i><i></i></div>
                        <a href="#" class="db-step-btn">Go to create page →</a>
                    </div>

                    <div class="db-step">
                        <div class="db-step-top"><span class="db-step-num">03</span><span>✦</span></div>
                        <h4>Explore AI tools</h4>
                        <p>Improve your content, generate ideas and edit images with AI.</p>
                        <div class="db-ai-box">◎ AI Assistant ready</div>
                        <a href="#" class="db-step-btn">Explore AI tools →</a>
                    </div>
                    </section>

                    {/* <!-- Comments + Pending --> */}
                    <div class="db-section-head">
                    <h3>Comments and Pending Schedules</h3>
                    </div>

                    <section class="db-bottom">

                    <div class="db-box">
                        <div class="db-box-head">
                        <h4>▭ Latest Comments</h4>
                        <a href="#">View all</a>
                        </div>

                        <div class="db-comment">
                        <span class="db-avatar-light">AP</span>
                        <div class="db-comment-text">
                            <strong>Ayesha Perera <small>2h ago</small></strong>
                            <p>Nice post! Keep going! 👏</p>
                        </div>
                        <span>···</span>
                        </div>

                        <div class="db-comment">
                        <span class="db-avatar-light">KS</span>
                        <div class="db-comment-text">
                            <strong>Kasun Silva <small>4h ago</small></strong>
                            <p>Great content! 🔥</p>
                        </div>
                        <span>···</span>
                        </div>

                        <div class="db-comment">
                        <span class="db-avatar-light">TJ</span>
                        <div class="db-comment-text">
                            <strong>Tharindu Jayawardena <small>6h ago</small></strong>
                            <p>This is so helpful. Thank you!</p>
                        </div>
                        <span>···</span>
                        </div>
                    </div>

                    <div class="db-box">
                        <div class="db-box-head">
                        <h4>▷ Pending Posts</h4>
                        <span class="db-chip dark">Scheduled</span>
                        </div>

                        <div class="db-post-image">
                        <img src="https://picsum.photos/600/300?grayscale" alt="Post image"/>
                        <span class="db-attached">▣ 1 Image Attached</span>
                        </div>

                        <h5>The Future of Technology</h5>
                        <p class="db-post-text">The future of technology is closer than you think. Let's build it together.</p>
                        <p class="db-post-date">◷ October 1, 2026 · 10:00 AM</p>

                        <div class="db-post-buttons">
                        <a href="#" class="db-btn-light">Edit Post</a>
                        <a href="#" class="db-btn-dark">Reschedule</a>
                        </div>
                    </div>

                    </section>
                </main>
            </div>
        </>
    )
}

export default DashBoard;