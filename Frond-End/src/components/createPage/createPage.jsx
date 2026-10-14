import "./createPage.css"
import { useState } from "react";
import AIAssistantModal from "../aiAssistant/aiAssistant.jsx"
import ScheduleModal from "../scheduleModel/scheduleModel.jsx";



function CreatePage(){

      const [showAI, setShowAI] = useState(false)
      const [caption, setCaption] = useState("")
      const [showSchedule, setShowSchedule] = useState(false)

      function handleContinue(scheduleData) {
            console.log("Schedule data:", scheduleData);
            setShowSchedule(false);
            // go to the Publish page here (see Step 4)
        }
  
    return(
        <>
            <div class="db-layout">

                {/* <!-- Sidebar (same as dashboard, "Create" is active) --> */}
                <aside class="db-sidebar">
                    <div>
                    <div class="db-brand">
                        <span class="db-logo">✦</span>
                        <div>
                        <strong>Socialynk</strong>
                        <small>Enterprise Suite</small>
                        </div>
                    </div>

                    <a href="#" class="db-create-btn">+ Create New</a>

                    <nav class="db-menu">
                        <a href="dashboard">⌂ Home</a>
                        <a href="#" class="active">✎ Create</a>
                        <a href="publishpage">▦ Publish</a>
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
                        <i>f</i><i>◎</i><i>|</i><i>in</i><i>♪</i><i>▶</i>
                    </div>

                    <div class="db-user-card">
                        <span class="db-avatar-light">MA</span>
                        <div>
                        <strong>M. R. Nusrath Ahamed</strong>
                        <small>Free Plan</small>
                        </div>
                        <span class="db-dots">⇅</span>
                    </div>
                    </div>
                </aside>

                {/* <!-- Main --> */}
                <div class="cr-wrap">

                    {/* <!-- Top bar --> */}
                    <header class="cr-topbar">
                    <div>
                        <h1>Create Content</h1>
                        <p>Turn your ideas into amazing posts with AI.</p>
                    </div>
                    <div class="db-top-actions">
                        <div class="cr-search">⌕ Search anything...</div>
                        <span class="db-bell">🔔</span>
                        <span class="db-avatar-dark">MA</span>
                    </div>
                    </header>

                    <div class="cr-body">

                    {/* <!-- Left column --> */}
                    <div class="cr-left">

                        {/* <!-- Content types --> */}
                        <div class="cr-types">
                        <div class="cr-type active">
                            <span class="cr-type-icon dark">▤</span>
                            <strong>Social Post</strong>
                            <small>Multi-platform text &amp; media</small>
                            <i class="cr-type-dot"></i>
                        </div>
                        <div class="cr-type">
                            <span class="cr-type-icon">▣</span>
                            <strong>Image</strong>
                            <small>Single visual asset</small>
                        </div>
                        <div class="cr-type">
                            <span class="cr-type-icon">▷</span>
                            <strong>Video</strong>
                            <small>Motion &amp; clips</small>
                        </div>
                        <div class="cr-type">
                            <span class="cr-type-icon">◫</span>
                            <strong>Carousel</strong>
                            <small>Slide deck sequence</small>
                        </div>
                        <div class="cr-type">
                            <span class="cr-type-icon">▶</span>
                            <strong>Reel</strong>
                            <small>Vertical 9:16 story</small>
                        </div>
                        </div>

                        {/* <!-- Editor --> */}
                        <div class="cr-editor">
                        <div class="cr-editor-head">
                            <h3>✎ Create your content</h3>
                            <button type="button" class="cr-ai-btn" onClick={() => setShowAI(true)}>✦ AI Assistant</button>
                        </div>

                        <div class="cr-toolbar">
                            <select>
                            <option>Paragraph</option>
                            <option>Heading 1</option>
                            <option>Heading 2</option>
                            </select>
                            <span class="cr-sep"></span>
                            <button type="button"><b>B</b></button>
                            <button type="button"><i>I</i></button>
                            <button type="button"><u>U</u></button>
                            <span class="cr-sep"></span>
                            <button type="button">☰</button>
                            <button type="button">≡</button>
                            <button type="button">⛓</button>
                            <button type="button">☺</button>
                            <button type="button" class="cr-hashtag"># Suggest Hashtags</button>
                        </div>

                        <textarea value={caption}
                                    onChange={(e) => setCaption(e.target.value)} 
                                    placeholder="Write your caption, idea or description here... Type '/' to quickly summon AI prompts or templates."></textarea>

                                     {showAI && (
                                        <AIAssistantModal
                                        onClose={() => setShowAI(false)}
                                        onUseInEditor={(text) => {
                                            setCaption(text);   // put the AI text into the editor
                                            setShowAI(false);   // close the popup
                                        }}
                                        />

      )}
                        <div class="cr-editor-foot">
                            <span>✓ Grammar Check Active &nbsp;•&nbsp; Supports Markdown</span>
                            <span class="mono">0 / 2,200 characters</span>
                        </div>
                        </div>

                        {/* <!-- Image editing --> */}
                        <div class="cr-edit-head">
                        <h3>Image Editing</h3>
                        <div class="cr-edit-links">
                            <a href="#">Add Footer</a>
                            <a href="#">Add Watermark</a>
                            <a href="#">Enhance Image Quality</a>
                        </div>
                        </div>

                        <div class="cr-edit-grid">
                        <div class="cr-upload">
                            <span class="cr-upload-icon">☁</span>
                            <strong>Upload Image</strong>
                            <p>Drag &amp; drop or <a href="#">Select a file</a></p>
                            <small>PNG, JPG, WebP up to 25MB</small>
                        </div>

                        <div class="cr-tool">
                            <span class="cr-tool-icon">⛉</span>
                            <h4>Add Watermark</h4>
                            <p>Protect your content with a custom watermark or logo overlay.</p>
                            <button type="button">+ Add watermark</button>
                        </div>

                        <div class="cr-tool">
                            <span class="cr-tool-icon">▯</span>
                            <h4>Add Footer</h4>
                            <p>Add your logo, website URL, or custom legal disclaimer strip.</p>
                            <button type="button">+ Add footer</button>
                        </div>

                        <div class="cr-tool">
                            <span class="cr-tool-icon">✦</span>
                            <h4>Enhance Image</h4>
                            <p>Improve brightness, clarity, and image quality via neural upscaling.</p>
                            <button type="button">Enhance</button>
                        </div>
                        </div>

                        {/* <!-- Steps bar --> */}
                        <div class="cr-steps">
                        <div class="cr-steps-list">
                            <span class="cr-s active"><b>01</b> Create Content ›</span>
                            <span class="cr-s"><b>02</b> Add Image ›</span>
                            <span class="cr-s"><b>03</b> Add Branding ›</span>
                            <span class="cr-s"><b>04</b> Preview ›</span>
                            <span class="cr-s"><b>05</b> Publish / Schedule</span>
                        </div>
                        <a href="#" class="cr-next" onClick={(e) => {
                            e.preventDefault();
                            setShowSchedule(true);
                            }}>Next &rarr;</a>

                                  {showSchedule && (
                                        <ScheduleModal
                                        postTitle={caption}
                                        onClose={() => setShowSchedule(false)}
                                        onBack={() => setShowSchedule(false)}
                                        onContinue={handleContinue}
                                        />
                                    )}
                        </div>
                    </div>

                    {/* <!-- Right column --> */}
                    <aside class="cr-right">

                        {/* <!-- Templates --> */}
                        <div class="cr-panel">
                        <div class="cr-panel-head">
                            <h3>▦ Templates</h3>
                            <a href="#">View all</a>
                        </div>

                        <div class="cr-template">
                            <span class="cr-thumb dark">▬</span>
                            <div>
                            <strong>Modern Minimal</strong>
                            <p>Clean typography-first architectural layout.</p>
                            <a href="#">Use this template ↗</a>
                            </div>
                        </div>

                        <div class="cr-template">
                            <span class="cr-thumb black">BOLD</span>
                            <div>
                            <strong>Bold Statement</strong>
                            <p>High-contrast monochrome editorial layout.</p>
                            <a href="#">Use this template ↗</a>
                            </div>
                        </div>

                        <div class="cr-template">
                            <span class="cr-thumb light">▲</span>
                            <div>
                            <strong>Nature Vibes</strong>
                            <p>Subtle organic framing and balanced negative space.</p>
                            <a href="#">Use this template ↗</a>
                            </div>
                        </div>

                        <div class="cr-template">
                            <span class="cr-thumb gradient"></span>
                            <div>
                            <strong>Gradient Style</strong>
                            <p>Monochromatic tonal balance with depth.</p>
                            <a href="#">Use this template ↗</a>
                            </div>
                        </div>
                        </div>

                        {/* <!-- Recent drafts --> */}
                        <div class="cr-panel">
                        <div class="cr-panel-head">
                            <h3>▤ Recent Drafts</h3>
                            <a href="#">View all</a>
                        </div>

                        <div class="cr-draft">
                            <span class="cr-draft-icon">▤</span>
                            <div>
                            <strong>Untitled Post</strong>
                            <small>Edited 2 hours ago</small>
                            </div>
                            <span class="cr-dots">⋮</span>
                        </div>

                        <div class="cr-draft">
                            <span class="cr-draft-icon">▣</span>
                            <div>
                            <strong>AI Image Post</strong>
                            <small>Edited 5 hours ago</small>
                            </div>
                            <span class="cr-dots">⋮</span>
                        </div>

                        <div class="cr-draft">
                            <span class="cr-draft-icon">◁</span>
                            <div>
                            <strong>Social Media Caption</strong>
                            <small>Edited 1 day ago</small>
                            </div>
                            <span class="cr-dots">⋮</span>
                        </div>
                        </div>

                        {/* <!-- Pro tip --> */}
                        <div class="cr-tip">
                        <span class="cr-tip-icon">💡</span>
                        <div>
                            <strong>Pro Tip</strong>
                            <p>Posts with 3–5 specific hashtags achieve 28% higher organic reach across LinkedIn and Instagram.</p>
                        </div>
                        </div>

                    </aside>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePage;