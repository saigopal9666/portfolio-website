/* ============================================
   MAYUR SOFT@SONIC — PREMIUM JS
   Terminal typing, counters, reveals, glow cards
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========== NAV SCROLL ========== */
    const navbar = document.getElementById('navbar');
    const navPills = document.querySelectorAll('.nav-pill');
    const indicator = document.getElementById('navIndicator');
    const sections = document.querySelectorAll('.section');

    function moveIndicator(el) {
        if (!el || !indicator) return;
        const rect = el.getBoundingClientRect();
        const parent = el.parentElement.getBoundingClientRect();
        indicator.style.width = rect.width + 'px';
        indicator.style.left = (rect.left - parent.left) + 'px';
    }

    // Initial indicator
    const activePill = document.querySelector('.nav-pill.active');
    if (activePill) moveIndicator(activePill);

    window.addEventListener('scroll', () => {
        // Navbar bg
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        // Active section
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
        });
        navPills.forEach(pill => {
            pill.classList.toggle('active', pill.dataset.section === current);
            if (pill.dataset.section === current) moveIndicator(pill);
        });
    });

    window.addEventListener('resize', () => {
        const active = document.querySelector('.nav-pill.active');
        if (active) moveIndicator(active);
    });

    /* ========== MOBILE MENU ========== */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ========== SMOOTH SCROLL ========== */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ========== TERMINAL TYPING + SQL ========== */
    const termBody = document.getElementById('terminalBody');
    const codeSnippets = [
        [
            { text: '# Mayur Soft@sonic — Data Pipeline', cls: 'tc' },
            { text: '' },
            { text: 'from', cls: 'tk', rest: ' pyspark.sql ' },
            { text: 'import', cls: 'tk', rest: ' SparkSession' },
            { text: 'from', cls: 'tk', rest: ' delta.tables ' },
            { text: 'import', cls: 'tk', rest: ' DeltaTable' },
            { text: '' },
            { text: 'spark = SparkSession.builder \\' },
            { text: '    .appName(', rest: '' },
            { text: '"MayurPipeline"', cls: 'ts', rest: ')' },
            { text: '    .getOrCreate()' },
            { text: '' },
            { text: '# Read → Transform → Write', cls: 'tc' },
            { text: 'df = spark.read.format("delta").load("raw")' },
            { text: 'df_clean = df.dropDuplicates().fillna(0)' },
            { text: 'df_clean.write.mode("overwrite").saveAsTable("gold")' },
            { text: '' },
            { text: 'print', cls: 'tk', rest: '(' },
            { text: '"✅ Pipeline complete!"', cls: 'ts', rest: ')' }
        ],
        [
            { text: '-- Mayur Soft@sonic — SQL Analytics', cls: 'tc' },
            { text: '' },
            { text: 'SELECT', cls: 'tk', rest: ' category,' },
            { text: '    COUNT', cls: 'tk', rest: '(*) as skill_count,' },
            { text: '    AVG', cls: 'tk', rest: '(proficiency) as avg_score' },
            { text: 'FROM', cls: 'tk', rest: ' my_portfolio.skills' },
            { text: 'WHERE', cls: 'tk', rest: ' is_active = ' },
            { text: 'TRUE', cls: 'tk', rest: '' },
            { text: 'GROUP BY', cls: 'tk', rest: ' category' },
            { text: 'ORDER BY', cls: 'tk', rest: ' avg_score ' },
            { text: 'DESC', cls: 'tk', rest: ';' },
            { text: '' },
            { text: '-- Executing query...', cls: 'tc' },
            { text: '✅ Query successful (0.012s)', cls: 'ts', rest: '' }
        ],
        [
            { text: '# Mayur Soft@sonic — Machine Learning', cls: 'tc' },
            { text: '' },
            { text: 'import', cls: 'tk', rest: ' pandas ' },
            { text: 'as', cls: 'tk', rest: ' pd' },
            { text: 'from', cls: 'tk', rest: ' sklearn.ensemble ' },
            { text: 'import', cls: 'tk', rest: ' RandomForestRegressor' },
            { text: '' },
            { text: 'model = RandomForestRegressor(n_estimators=100)' },
            { text: 'model.fit(X_train, y_train)' },
            { text: 'predictions = model.predict(X_test)' },
            { text: '' },
            { text: 'print', cls: 'tk', rest: '(' },
            { text: '"✅ Model trained! Accuracy: 98.4%"', cls: 'ts', rest: ')' }
        ]
    ];

    if (termBody) {
        let snippetIdx = 0;
        let lineIdx = 0;
        let currentLineHtml = '';
        let isSqlMode = false;
        let typeTimer;
        const cursorHTML = '<span class="cursor" style="animation: blink 1s step-end infinite;">_</span>';

        function startInteractiveSQL() {
            isSqlMode = true;
            clearTimeout(typeTimer);
            
            const sqlModeBtn = document.getElementById('sqlModeBtn');
            const termBackBtn = document.getElementById('termBackBtn');
            if (sqlModeBtn) sqlModeBtn.style.display = 'none';
            if (termBackBtn) termBackBtn.style.display = 'flex';
            
            termBody.innerHTML = '';
            
            const bootLines = [
                '<span class="tk">mayur@db</span><span class="tw">:</span><span class="ts">~</span>$ Initializing SQL Engine...',
                'Loading schema my_portfolio...',
                'Schema loaded. 4 tables found.',
                'Entering Interactive Mode...',
                '<br>'
            ];
            
            let bIdx = 0;
            function bootStep() {
                if (bIdx >= bootLines.length) {
                    termBody.innerHTML += `
                        <div id="termOutput"></div>
                        <div class="term-input-line">
                            <span class="tk">sql</span><span class="tw">></span> 
                            <input type="text" id="termInput" autocomplete="off" spellcheck="false">
                        </div>
                    `;
                    
                    const termInput = document.getElementById('termInput');
                    const termOutput = document.getElementById('termOutput');
                    
                    if (termInput) {
                        termInput.value = 'SELECT * FROM skills;';
                        termInput.focus();
                        termInput.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') {
                                const val = termInput.value.trim();
                                termInput.value = '';
                                if (!val) return;
                                termOutput.innerHTML += `<span class="tk">sql</span><span class="tw">></span> ${val}<br>`;
                                const lower = val.toLowerCase();
                                if (lower.includes('select') && lower.includes('from') && lower.includes('skills')) {
                                    termOutput.innerHTML += `
                                        <table class="sql-table">
                                            <tr><th>id</th><th>skill_name</th><th>proficiency</th></tr>
                                            <tr><td>1</td><td>PySpark</td><td>92%</td></tr>
                                            <tr><td>2</td><td>Fabric</td><td>88%</td></tr>
                                            <tr><td>3</td><td>SQL</td><td>95%</td></tr>
                                            <tr><td>4</td><td>Databricks</td><td>85%</td></tr>
                                        </table><span style="color:#34d399">4 rows returned (0.012 sec)</span><br><br>
                                    `;
                                } else if (lower.includes('drop') || lower.includes('delete')) {
                                    termOutput.innerHTML += `<span style="color:#f97316">Error: Permission denied. Nice try! 😉</span><br><br>`;
                                } else {
                                    termOutput.innerHTML += `<span style="color:#f97316">Unknown command. Try: SELECT * FROM skills;</span><br><br>`;
                                }
                                termBody.scrollTop = termBody.scrollHeight;
                            }
                        });
                    }
                    termBody.scrollTop = termBody.scrollHeight;
                    return;
                }
                termBody.innerHTML += bootLines[bIdx] + '<br>';
                bIdx++;
                termBody.scrollTop = termBody.scrollHeight;
                setTimeout(bootStep, 150); // fast booting effect
            }
            bootStep();
        }

        const termBackBtn = document.getElementById('termBackBtn');
        if (termBackBtn) {
            termBackBtn.addEventListener('click', () => {
                isSqlMode = false;
                const sqlModeBtn = document.getElementById('sqlModeBtn');
                if (sqlModeBtn) sqlModeBtn.style.display = 'flex';
                termBackBtn.style.display = 'none';
                
                // Restart animation loop
                lineIdx = 0;
                currentLineHtml = '';
                termBody.innerHTML = '';
                typeChar();
            });
        }

        const sqlModeBtn = document.getElementById('sqlModeBtn');
        if (sqlModeBtn) {
            sqlModeBtn.addEventListener('click', startInteractiveSQL);
        }

        function typeChar() {
            if (isSqlMode) return;
            
            const currentCodeLines = codeSnippets[snippetIdx];
            if (lineIdx >= currentCodeLines.length) {
                // Loop the animation! Reset after a 2 second pause
                typeTimer = setTimeout(() => {
                    if (isSqlMode) return;
                    lineIdx = 0;
                    snippetIdx = (snippetIdx + 1) % codeSnippets.length;
                    currentLineHtml = '';
                    termBody.innerHTML = '';
                    
                    // Update terminal title slightly to match context
                    const termTitle = document.querySelector('.term-title');
                    if (termTitle) {
                        if (snippetIdx === 0) termTitle.textContent = 'mayur@sonic ~ pipeline.py';
                        else if (snippetIdx === 1) termTitle.textContent = 'mayur@sonic ~ analytics.sql';
                        else termTitle.textContent = 'mayur@sonic ~ train_model.py';
                    }
                    
                    typeChar();
                }, 2000);
                return;
            }

            const line = currentCodeLines[lineIdx];
            if (line.text === '') {
                currentLineHtml += '<br>';
                termBody.innerHTML = currentLineHtml + cursorHTML;
                lineIdx++;
                typeTimer = setTimeout(typeChar, 30);
                return;
            }

            const fullText = line.cls ? `<span class="${line.cls}">${line.text}</span>${line.rest || ''}` : (line.text + (line.rest || ''));
            currentLineHtml += fullText + '<br>';
            termBody.innerHTML = currentLineHtml + cursorHTML;
            termBody.scrollTop = termBody.scrollHeight;
            lineIdx++;
            
            typeTimer = setTimeout(typeChar, Math.random() * 60 + 20);
        }

        typeTimer = setTimeout(typeChar, 400);
    }

    /* ========== LIVE DATA COUNTER ========== */
    const liveCounter = document.getElementById('liveDataCounter');
    if (liveCounter) {
        let count = 1420500;
        setInterval(() => {
            count += Math.floor(Math.random() * 5) + 1; // Increment by 1-5
            liveCounter.textContent = count.toLocaleString();
        }, 1200);
    }

    /* ========== COUNTERS ========== */
    const counters = document.querySelectorAll('.hm-num[data-count]');
    let countersDone = false;

    function animateCounters() {
        if (countersDone) return;
        countersDone = true;
        counters.forEach(el => {
            const target = +el.getAttribute('data-count');
            if (isNaN(target)) return;
            const dur = 2200;
            const start = performance.now();
            (function tick(now) {
                const t = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.floor(ease * target);
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            })(start);
        });
    }

    const metricsEl = document.querySelector('.hero-metrics');
    if (metricsEl) {
        new IntersectionObserver(([e]) => { if (e.isIntersecting) animateCounters(); }, { threshold: .5 }).observe(metricsEl);
    }

    /* ========== SCROLL REVEAL ========== */
    const reveals = document.querySelectorAll('.reveal-el');
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                // stagger siblings
                const siblings = e.target.parentElement.querySelectorAll('.reveal-el');
                let idx = Array.from(siblings).indexOf(e.target);
                e.target.style.transitionDelay = `${idx * 0.1}s`;
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));

    /* ========== SKILL BARS (mobile) ========== */
    const sbRows = document.querySelectorAll('.sb-row');
    const sbObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('animated');
                sbObs.unobserve(e.target);
            }
        });
    }, { threshold: .3 });
    sbRows.forEach(r => sbObs.observe(r));

    /* ========== CARD GLOW FOLLOW ========== */
    document.querySelectorAll('.card-glow').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ========== CONTACT FORM — EmailJS ========== */
    // ⚠️ SETUP: Replace these with your EmailJS credentials
    // 1. Go to https://www.emailjs.com/ and create free account
    // 2. Create an Email Service (Gmail)
    // 3. Create an Email Template
    // 4. Copy your IDs below:
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';    // Replace this
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';    // Replace this
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // Replace this

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const orig = btn.innerHTML;

        // Loading state
        btn.innerHTML = '<span>⏳ Sending...</span>';
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';

        // Check if EmailJS is configured
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            // Send via EmailJS
            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
                .then(() => {
                    btn.innerHTML = '<span>✅ Message Sent!</span>';
                    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
                    btn.style.opacity = '1';
                    form.reset();
                    setTimeout(() => {
                        btn.innerHTML = orig;
                        btn.style.background = '';
                        btn.style.pointerEvents = '';
                    }, 3000);
                })
                .catch((err) => {
                    btn.innerHTML = '<span>❌ Failed. Try again.</span>';
                    btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
                    btn.style.opacity = '1';
                    console.error('EmailJS error:', err);
                    setTimeout(() => {
                        btn.innerHTML = orig;
                        btn.style.background = '';
                        btn.style.pointerEvents = '';
                    }, 3000);
                });
        } else {
            // Demo mode — EmailJS not configured yet
            setTimeout(() => {
                btn.innerHTML = '<span>✅ Message Sent! (Demo Mode)</span>';
                btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
                btn.style.opacity = '1';
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    btn.style.pointerEvents = '';
                }, 3000);
            }, 1000);
        }
    });

    /* ========== PROJECT CARD TILT ========== */
    document.querySelectorAll('.proj-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            card.style.transform = `perspective(1200px) rotateX(${(y-.5)*3}deg) rotateY(${(x-.5)*-3}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});

/* ============================================
   ATS RESUME BUILDER — ANALYSIS ENGINE
   ============================================ */

// ----- AI Resume Generator Logic -----
async function generateAIResume() {
    const promptInput = document.getElementById('aiResumePrompt');
    const btn = document.getElementById('generateResumeBtn');
    const jdArea = document.getElementById('atsJD');
    const resumeArea = document.getElementById('atsResume');
    
    if (!promptInput.value.trim()) {
        alert("Please enter a role and tools first. (e.g., DevOps Engineer with AWS)");
        return;
    }
    
    // UI Loading State
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = '<span class="pulse-dot small" style="background:#fff;"></span> Generating...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    try {
        const formData = new FormData();
        formData.append('promptText', promptInput.value.trim());
        
        const response = await fetch('http://localhost:8000/api/generate-resume', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || "Failed to generate resume");
        }
        
        const data = await response.json();
        
        // Populate textareas
        jdArea.value = data.jd;
        resumeArea.value = data.resume;
        
        // Visual feedback animation
        resumeArea.style.transition = 'border-color 0.3s, box-shadow 0.3s';
        jdArea.style.transition = 'border-color 0.3s, box-shadow 0.3s';
        
        const highlightStyle = 'border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);';
        const normalStyle = 'border-color: rgba(255,255,255,0.1); box-shadow: none;';
        
        resumeArea.style.cssText += highlightStyle;
        jdArea.style.cssText += highlightStyle;
        
        setTimeout(() => {
            resumeArea.style.cssText = resumeArea.style.cssText.replace(highlightStyle, normalStyle);
            jdArea.style.cssText = jdArea.style.cssText.replace(highlightStyle, normalStyle);
        }, 800);
        
    } catch (error) {
        console.error("Generator Error:", error);
        alert("Error generating resume: " + error.message);
    } finally {
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

// ----- ATS Matcher AI Integration -----
async function analyzeATS() {
    if (!checkUsageLimit()) return;
    const jdText = document.getElementById('atsJD').value.trim();
    const resumeText = document.getElementById('atsResume').value.trim();

    if (!jdText || !resumeText) {
        alert('Please paste both a Job Description and your Resume to analyze.');
        return;
    }

    const btn = document.getElementById('atsAnalyzeBtn');
    const origBtnHtml = btn.innerHTML;
    
    const progressContainer = document.getElementById('atsProgressBarContainer');
    const progressBar = document.getElementById('atsProgressBar');
    const progressText = document.getElementById('atsProgressText');
    
    // Loading state
    btn.innerHTML = 'Analyzing...';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';
    
    progressContainer.style.display = 'block';
    progressText.style.display = 'block';
    progressBar.style.width = '0%';

    let progress = 0;
    const progressTexts = ["Reading Job Description...", "Extracting Skills...", "Sending to Gemini AI...", "Computing Match Score...", "Finalizing Report..."];
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 8; // Random increment
        if (progress >= 95) progress = 95; // Hold at 95% until fetch completes
        
        progressBar.style.width = `${progress}%`;
        
        const phase = Math.min(Math.floor(progress / 20), 4);
        if (progressText) {
            progressText.textContent = `${progressTexts[phase]} (${Math.floor(progress)}%)`;
        }
    }, 250);

    try {
        const formData = new FormData();
        formData.append('jobDesc', jdText);
        formData.append('resumeText', resumeText);

        const response = await fetch('http://localhost:8000/api/analyze-resume', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Failed to analyze resume.');
        }

        const data = await response.json();
        
        // data contains: score, grade, grade_msg, matched_keywords, missing_keywords, tips
        const score = data.score || 0;
        const grade = data.grade || 'N/A';
        const gradeMsg = data.grade_msg || '';
        const matched = data.matched_keywords || [];
        const missing = data.missing_keywords || [];
        const tips = data.tips || [];

        // Hide empty state, show results
        document.getElementById('atsEmptyState').style.display = 'none';
        document.getElementById('atsScoreCard').style.display = 'block';
        document.getElementById('atsKeywords').style.display = 'block';
        document.getElementById('atsTips').style.display = 'block';

        // Animate gauge
        const circumference = 326.73;
        const offset = circumference - (score / 100) * circumference;
        const gaugeFill = document.getElementById('gaugeFill');
        const gaugeNum = document.getElementById('gaugeNum');

        // Reset first
        gaugeFill.style.transition = 'none';
        gaugeFill.setAttribute('stroke-dashoffset', circumference);
        gaugeNum.textContent = '0';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                gaugeFill.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)';
                gaugeFill.setAttribute('stroke-dashoffset', offset);

                // Animate number
                const dur = 1500;
                const start = performance.now();
                (function tick(now) {
                    const t = Math.min((now - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - t, 3);
                    gaugeNum.textContent = Math.round(ease * score);
                    if (t < 1) requestAnimationFrame(tick);
                })(start);
            });
        });

        // Grade mapping
        const gradeEl = document.getElementById('atsGrade');
        let gradeIcon = '🎯';
        let gradeClass = 'excellent';
        if (score < 80 && score >= 60) { gradeIcon = '✅'; gradeClass = 'good'; }
        else if (score < 60 && score >= 40) { gradeIcon = '⚠️'; gradeClass = 'fair'; }
        else if (score < 40) { gradeIcon = '❌'; gradeClass = 'poor'; }
        
        gradeEl.textContent = `${gradeIcon} Grade ${grade}`;
        gradeEl.className = 'ats-grade ' + gradeClass;
        document.getElementById('atsGradeMsg').textContent = gradeMsg;

        // Matched chips
        document.getElementById('matchedCount').textContent = matched.length;
        const matchedContainer = document.getElementById('matchedChips');
        matchedContainer.innerHTML = matched.map((kw, i) =>
            `<span class="kw-chip match" style="animation-delay:${(i%10) * 0.04}s">${kw}</span>`
        ).join('');

        // Missing chips
        document.getElementById('missingCount').textContent = missing.length;
        const missingContainer = document.getElementById('missingChips');
        missingContainer.innerHTML = missing.map((kw, i) =>
            `<span class="kw-chip miss" style="animation-delay:${(i%10) * 0.04}s">${kw}</span>`
        ).join('');

        // Tips
        const tipsList = document.getElementById('atsTipsList');
        tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');

        // Scroll to results on mobile
        if (window.innerWidth < 1024) {
            document.getElementById('atsScoreCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    } catch (error) {
        clearInterval(loadingInterval);
        alert('API Error: ' + error.message + '\n\nMake sure the Python backend is running!');
    } finally {
        clearInterval(loadingInterval);
        btn.innerHTML = origBtnHtml;
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
        progressContainer.style.display = 'none';
        progressText.style.display = 'none';
    }
}

function capitalize(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* ============================================
   AI ASSISTANT CHATBOT ENGINE
   ============================================ */
(function() {
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const chatClose = document.getElementById('aiChatClose');
    const chatBody = document.getElementById('aiChatBody');
    const chatInput = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSendBtn');

    if (!chatBtn) return;

    const KB = {
        courses: '📚 We offer <strong>4 courses</strong>:<br><br>1️⃣ <strong>Python for Data Engineering</strong> — ₹2,999 (6 weeks)<br>2️⃣ <strong>PySpark & Fabric Mastery</strong> — ₹6,999 (10 weeks) 🔥<br>3️⃣ <strong>Azure Data Engineer (DP-203)</strong> — ₹8,999 (12 weeks)<br>4️⃣ <strong>Full Stack Data Engineer</strong> — ₹14,999 (6 months)<br><br>All include hands-on projects, interview prep & lifetime access!',
        pricing: '💰 <strong>Current Pricing:</strong><br><br>• Python: <strong>₹2,999</strong> <s>₹5,999</s> (50% OFF)<br>• PySpark & Fabric: <strong>₹6,999</strong> <s>₹12,999</s> (46% OFF)<br>• Azure DE: <strong>₹8,999</strong> <s>₹15,999</s> (44% OFF)<br>• Full Stack Bundle: <strong>₹14,999</strong> <s>₹34,997</s> (57% OFF)<br><br>🔥 Limited time offer! EMI options available.',
        placement: '💼 <strong>Placement Support:</strong><br><br>✅ Resume review & ATS optimization<br>✅ Mock interviews (technical + HR)<br>✅ Job referrals to partner companies<br>✅ LinkedIn profile optimization<br>✅ 92% placement rate!<br><br>Companies: TCS, Infosys, Wipro, Cognizant & more.',
        duration: '⏰ <strong>Course Durations:</strong><br><br>• Python: <strong>6 weeks</strong> (40+ videos)<br>• PySpark & Fabric: <strong>10 weeks</strong> (80+ videos)<br>• Azure DE: <strong>12 weeks</strong> (100+ videos)<br>• Full Stack: <strong>6 months</strong> (220+ videos)<br><br>All with <strong>lifetime access</strong> — learn at your own pace!',
        contact: '📞 <strong>Contact Mayur:</strong><br><br>📧 Email: mayur@softsonic.in.org<br>💬 WhatsApp: Click the green button →<br>🔗 LinkedIn: linkedin.com/in/mayur<br><br>We respond within 2 hours!',
        demo: '🎬 Yes! <strong>Free demo class</strong> available!<br><br>📹 Watch a sample PySpark lesson<br>📋 Get the complete syllabus<br>💬 Live Q&A session<br><br>Contact via WhatsApp to schedule!',
        hello: '👋 Hello! Welcome to Mayur Soft@sonic!<br><br>📚 Course information<br>💰 Pricing & offers<br>💼 Placement support<br>🎬 Free demo<br><br>What would you like to know?',
        default: '🤔 Great question! For detailed queries:<br><br>💬 Chat on <strong>WhatsApp</strong> (green button)<br>📧 Email: mayur@softsonic.in.org<br>📝 Or use the contact form<br><br>We respond within 2 hours!'
    };

    chatBtn.addEventListener('click', () => chatWindow.classList.toggle('open'));
    chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

    document.querySelectorAll('.ai-quick').forEach(btn => {
        btn.addEventListener('click', () => {
            addUserMsg(btn.textContent);
            respondBot(btn.dataset.q);
        });
    });

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        addUserMsg(text);
        chatInput.value = '';
        const lower = text.toLowerCase();
        let intent = 'default';
        if (/course|offer|program|learn|class|syllabus/i.test(lower)) intent = 'courses';
        else if (/price|cost|fee|discount|emi|pay|₹/i.test(lower)) intent = 'pricing';
        else if (/place|job|hire|career|company|package|salary/i.test(lower)) intent = 'placement';
        else if (/duration|week|month|long|time|video|access/i.test(lower)) intent = 'duration';
        else if (/contact|email|phone|whatsapp|reach|call/i.test(lower)) intent = 'contact';
        else if (/demo|free|try|sample|preview/i.test(lower)) intent = 'demo';
        else if (/hi|hello|hey|namaste/i.test(lower)) intent = 'hello';
        respondBot(intent);
    }

    function addUserMsg(text) {
        const div = document.createElement('div');
        div.className = 'ai-msg user';
        const p = document.createElement('p');
        p.textContent = text;
        div.appendChild(p);
        chatBody.appendChild(div);
        scrollChat();
    }

    function respondBot(intent) {
        const typing = document.createElement('div');
        typing.className = 'ai-msg bot';
        typing.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
        chatBody.appendChild(typing);
        scrollChat();
        setTimeout(() => {
            typing.remove();
            const div = document.createElement('div');
            div.className = 'ai-msg bot';
            div.innerHTML = '<p>' + (KB[intent] || KB.default) + '</p>';
            chatBody.appendChild(div);
            scrollChat();
        }, 800 + Math.random() * 600);
    }

    function scrollChat() {
        setTimeout(() => chatBody.scrollTop = chatBody.scrollHeight, 50);
    }

    /* ========== GITHUB GRAPH GENERATOR ========== */
    const githubGrid = document.getElementById('githubGrid');
    if (githubGrid) {
        // Generate 365 days (52 weeks * 7 days)
        let html = '';
        const today = new Date();
        for (let i = 0; i < 364; i++) {
            let lvl = 0;
            const rand = Math.random();
            if (rand > 0.4 && rand <= 0.7) lvl = 1;
            else if (rand > 0.7 && rand <= 0.85) lvl = 2;
            else if (rand > 0.85 && rand <= 0.95) lvl = 3;
            else if (rand > 0.95) lvl = 4;
            
            const cellDate = new Date(today);
            cellDate.setDate(today.getDate() - (364 - i));
            const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const commits = lvl === 0 ? 'No' : (lvl * Math.floor(Math.random() * 5 + 2));
            const tooltip = `${commits} contributions on ${dateStr}`;
            const delay = Math.random() * 2;
            
            html += `<div class="gh-cell lvl-${lvl}" data-tip="${tooltip}" style="animation-delay: ${delay}s"></div>`;
        }
        githubGrid.innerHTML = html;
        const wrapper = document.querySelector('.gh-grid-wrapper');
        if (wrapper) wrapper.scrollLeft = wrapper.scrollWidth;
    }
})();
/* ========== ARCHITECTURE MODALS (Global) ========== */
function openArchModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}
function closeArchModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Video promo logic replaced by direct link to bypass CORS issues on local files

// ============================================
//   AI MOCK INTERVIEW ROOM
// ============================================

let interviewHistory = [];
let interviewQuestionCount = 0;
let interviewRole = "";
let recognition = null;
let isRecording = false;

function openInterviewModal() {
    document.getElementById('interviewModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInterviewModal(event) {
    if (event && event.target !== document.getElementById('interviewModalOverlay')) return;
    document.getElementById('interviewModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function forceCloseInterviewModal() {
    document.getElementById('interviewModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

async function startInterview() {
    const roleInput = document.getElementById('interviewRoleInput').value.trim();
    if (!roleInput) {
        alert("Please enter a job role first.");
        return;
    }
    
    interviewRole = roleInput;
    interviewHistory = [];
    interviewQuestionCount = 0;
    
    document.getElementById('interviewSetup').style.display = 'none';
    document.getElementById('interviewChat').style.display = 'flex';
    document.getElementById('interviewChatLog').innerHTML = '';
    document.getElementById('interviewPremiumLock').style.display = 'none';
    document.getElementById('interviewInputArea').style.display = 'flex';
    
    appendInterviewMessage("model", "Setting up your interview room... 🕒", true);
    await callMockInterviewAPI();
}

async function sendInterviewAnswer() {
    const inputEl = document.getElementById('interviewAnswerInput');
    const answer = inputEl.value.trim();
    if (!answer) return;
    
    inputEl.value = '';
    
    appendInterviewMessage("user", answer);
    interviewHistory.push({ role: "user", text: answer });
    
    interviewQuestionCount++;
    document.getElementById('interviewQuestionCount').innerText = `Free Demo: Question ${Math.min(interviewQuestionCount + 1, 5)}/5`;
    
    if (interviewQuestionCount >= 5) {
        document.getElementById('interviewInputArea').style.display = 'none';
        document.getElementById('interviewPremiumLock').style.display = 'block';
        appendInterviewMessage("model", "Thank you for completing the Free Demo! Our AI is evaluating your final score...", true);
        await callMockInterviewAPI(true);
        return;
    }
    
    appendInterviewMessage("model", "Typing...", true);
    await callMockInterviewAPI();
}

async function callMockInterviewAPI(isFinal = false) {
    try {
        const response = await fetch('http://localhost:8000/api/mock-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: interviewRole,
                history: interviewHistory
            })
        });
        
        if (!response.ok) throw new Error("Failed to connect to AI Interviewer");
        
        const data = await response.json();
        
        const log = document.getElementById('interviewChatLog');
        if (log.lastChild && log.lastChild.classList.contains('typing-indicator')) {
            log.removeChild(log.lastChild);
        }
        
        appendInterviewMessage("model", data.response);
        interviewHistory.push({ role: "model", text: data.response });
        
    } catch (error) {
        console.error(error);
        appendInterviewMessage("model", "Oops! The connection to the interviewer dropped. Please check the backend server.");
    }
}

function appendInterviewMessage(role, text, isTyping = false) {
    const log = document.getElementById('interviewChatLog');
    const msgDiv = document.createElement('div');
    
    msgDiv.style.maxWidth = '80%';
    msgDiv.style.padding = '12px 16px';
    msgDiv.style.borderRadius = '12px';
    msgDiv.style.lineHeight = '1.5';
    msgDiv.style.fontSize = '0.9rem';
    
    if (isTyping) msgDiv.className = "typing-indicator";
    
    if (role === 'user') {
        msgDiv.style.alignSelf = 'flex-end';
        msgDiv.style.background = 'linear-gradient(135deg, #a855f7, #6366f1)';
        msgDiv.style.color = '#fff';
        msgDiv.style.borderBottomRightRadius = '2px';
    } else {
        msgDiv.style.alignSelf = 'flex-start';
        msgDiv.style.background = 'rgba(255,255,255,0.05)';
        msgDiv.style.border = '1px solid rgba(255,255,255,0.1)';
        msgDiv.style.color = '#cbd5e1';
        msgDiv.style.borderBottomLeftRadius = '2px';
    }
    
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    log.appendChild(msgDiv);
    log.scrollTop = log.scrollHeight;
}

function toggleVoiceRecord() {
    const btn = document.getElementById('voiceRecordBtn');
    const inputEl = document.getElementById('interviewAnswerInput');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support Voice Input. Please use Chrome.");
        return;
    }
    
    if (isRecording) {
        if (recognition) recognition.stop();
        return;
    }
    
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
        isRecording = true;
        btn.style.background = 'rgba(239, 68, 68, 0.2)'; 
        btn.style.borderColor = '#ef4444';
        btn.style.color = '#ef4444';
        inputEl.placeholder = "Listening...";
    };
    
    recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript) {
            inputEl.value += (inputEl.value ? ' ' : '') + finalTranscript;
        }
    };
    
    recognition.onerror = (e) => console.error("Speech Error:", e);
    
    recognition.onend = () => {
        isRecording = false;
        btn.style.background = 'rgba(168,85,247,0.2)';
        btn.style.borderColor = '#a855f7';
        btn.style.color = '#a855f7';
        inputEl.placeholder = "Type your answer or use voice...";
    };
    
    recognition.start();
}

// ============================================
//   GLOBAL JOB SEARCH AGGREGATOR
// ============================================

const MOCK_JOBS = [
    { id: 1, title: "Data Analyst", company: "TCS", location: "Hyderabad", salary: "₹5L - ₹8L", source: "LinkedIn", color: "#0077b5", match: 92, exp: "0-1" },
    { id: 2, title: "React Developer", company: "Infosys", location: "Bangalore (Remote)", salary: "₹6L - ₹10L", source: "Naukri", color: "#f26b52", match: 88, exp: "1-3" },
    { id: 3, title: "Python Backend Engineer", company: "Wipro", location: "Pune", salary: "₹8L - ₹12L", source: "Indeed", color: "#003a9b", match: 85, exp: "3+" },
    { id: 4, title: "Data Engineer (PySpark)", company: "Accenture", location: "Hyderabad", salary: "Not Disclosed", source: "LinkedIn", color: "#0077b5", match: 95, exp: "1-3" },
    { id: 5, title: "Frontend SDE-1", company: "Amazon", location: "Hyderabad", salary: "₹18L - ₹24L", source: "Monster", color: "#6b46c1", match: 78, exp: "0-1" },
    { id: 6, title: "Full Stack Developer", company: "T-Hub Startup", location: "Hyderabad", salary: "₹10L - ₹15L", source: "Wellfound", color: "#e34a26", match: 82, exp: "1-3" },
    { id: 7, title: "Machine Learning Intern", company: "Microsoft", location: "Remote", salary: "Stipend: ₹40k", source: "Internshala", color: "#1295c9", match: 96, exp: "0-1" },
    { id: 8, title: "Senior DevOps Engineer", company: "Google", location: "Bangalore", salary: "₹35L+", source: "Glassdoor", color: "#0caa41", match: 70, exp: "3+" }
];

async function searchJobs() {
    const searchInput = document.getElementById('jobSearchInput').value.trim();
    const expFilter = document.getElementById('jobExpFilter').value;
    const sourceFilter = document.getElementById('jobSourceFilter').value;
    const countryFilter = document.getElementById('jobCountryFilter').value;
    
    document.getElementById('jobEmptyState').style.display = 'none';
    document.getElementById('jobResultsGrid').innerHTML = '';
    document.getElementById('jobLoadingState').style.display = 'block';

    try {
        // Fetch from our new FastAPI endpoint with country filter
        const response = await fetch(`/api/jobs?q=${encodeURIComponent(searchInput)}&country=${encodeURIComponent(countryFilter)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const apiJobs = data.jobs || [];

        // Apply local UI filters
        let filteredJobs = apiJobs.filter(job => {
            // Source matching (Himalayas vs others if we add more APIs later)
            const matchSource = sourceFilter === 'all' || job.source.toLowerCase() === sourceFilter;
            // Experience matching (The API doesn't provide strict experience, so we fake it based on title or randomly assign it if not present, but for now we'll just ignore exp filter for live jobs or let it pass)
            return matchSource; 
        });
        
        // Fallback to mock jobs if the API returned 0 and search input was empty
        if (filteredJobs.length === 0 && searchInput === '') {
            filteredJobs = MOCK_JOBS.filter(job => (sourceFilter === 'all' || job.source.toLowerCase() === sourceFilter));
        }

        document.getElementById('jobLoadingState').style.display = 'none';
        const grid = document.getElementById('jobResultsGrid');
        
        if (filteredJobs.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px; background: rgba(15,23,42,0.5); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">No jobs found matching your criteria. Try adjusting the filters.</div>`;
            return;
        }

        filteredJobs.forEach((job, index) => {
            const card = document.createElement('div');
            card.className = "job-card";
            
            // Randomize match for live jobs if it doesn't exist
            const matchScore = job.match || Math.floor(Math.random() * (99 - 70 + 1) + 70); 
            let matchColor = matchScore >= 90 ? '#22c55e' : (matchScore >= 80 ? '#38bdf8' : '#f59e0b');
            
            // Random color for source if not provided
            const sourceColors = { "LinkedIn": "#0077b5", "Naukri": "#f26b52", "Indeed": "#003a9b", "Monster": "#6b46c1", "Wellfound": "#e34a26", "Himalayas": "#22c55e" };
            const jobColor = job.color || sourceColors[job.source] || "#38bdf8";
            
            const salaryText = job.salary || job.type || "Not Disclosed";
            const locationText = job.location || "Remote";

            card.innerHTML = `
                <div style="position: absolute; top: 0; right: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-top: none; padding: 6px 12px; border-radius: 0 0 8px 8px; font-size: 0.75rem; font-weight: bold; color: ${jobColor}; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); backdrop-filter: blur(4px);">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: ${jobColor}; box-shadow: 0 0 5px ${jobColor};"></span> ${job.source}
                </div>
                
                <h3 style="margin: 25px 0 8px 0; font-size: 1.3rem; letter-spacing: -0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${job.title}">${job.title}</h3>
                <div style="color: #cbd5e1; font-weight: 600; margin-bottom: 12px; font-size: 0.95rem;">${job.company}</div>
                
                <div style="display: flex; gap: 15px; font-size: 0.85rem; color: #94a3b8; margin-bottom: 25px;">
                    <span style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${locationText}</span>
                    <span style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> ${salaryText}</span>
                </div>
                
                <div style="margin-top: auto; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">AI Match</span>
                        <span style="color: ${matchColor}; font-weight: bold; font-size: 1.2rem; text-shadow: 0 0 10px ${matchColor}40;">${matchScore}%</span>
                    </div>
                    <button id="applyBtn_${index}" onclick="applyForJob(${index}, '${job.url}')" class="btn-glow" style="padding: 10px 24px; font-size: 0.9rem; background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.5);">
                        Apply with AI ✨
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching live jobs:", error);
        document.getElementById('jobLoadingState').style.display = 'none';
        const grid = document.getElementById('jobResultsGrid');
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 40px; background: rgba(15,23,42,0.5); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">Failed to fetch live jobs. Is the backend server running?</div>`;
    }
}

function applyForJob(jobId, url) {
    const btn = document.getElementById(`applyBtn_${jobId}`);
    
    // Original state
    const originalText = btn.innerHTML;
    
    // Loading state
    btn.innerHTML = `<span class="pulse-dot" style="display: inline-block; margin-right: 5px;"></span> Applying...`;
    btn.disabled = true;
    btn.style.opacity = '0.8';
    
    // Simulate AI filling out form
    setTimeout(() => {
        btn.innerHTML = `Filling Details...`;
    }, 1000);
    
    setTimeout(() => {
        btn.innerHTML = `Attaching Resume...`;
    }, 2000);
    
    setTimeout(() => {
        // Success state
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Applied`;
        btn.style.background = 'rgba(34, 197, 94, 0.2)';
        btn.style.borderColor = '#22c55e';
        btn.style.color = '#22c55e';
        
        // After simulating auto-apply, actually open the URL in a new tab if it's a real live job
        if (url && url !== '#') {
            setTimeout(() => {
                window.open(url, '_blank');
            }, 1000);
        }
    }, 3500);
}

/* ============================================
   REAL-TIME DYNAMIC TECH & AI NEWS ENGINE
   ============================================ */

const TECH_IMAGE_MATRIX = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop"
];

let GLOBAL_TECH_NEWS_DATABASE = [
    {
        id: "n_in1",
        tag: "INDIA SEMICONDUCTOR",
        category: "Global & Geopolitics",
        title: "India Semiconductor Mission: Tata-PSMC & Micron Chip Fabs Begin Production in Gujarat & Assam",
        date: "Just Now",
        readTime: "4 min read",
        link: "https://pib.gov.in",
        img_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
        desc: "India's ₹1.2 Lakh Crore Semiconductor Mission accelerates local assembly, testing, and packaging (ATMP) for domestic automotive, AI, and EV telecom chips.",
        takeaway: "Local chip manufacturing strengthens India's hardware supply chain independence and lowers cloud server procurement costs."
    },
    {
        id: "n_in2",
        tag: "BHARAT AI MISSION",
        category: "AI Breakthroughs",
        title: "India AI Mission Deploys 10,000+ GPU Sovereign Cloud Clusters Across Hyderabad & Bengaluru",
        date: "10 mins ago",
        readTime: "4 min read",
        link: "https://indiaai.gov.in",
        img_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        desc: "Sovereign AI initiative builds localized Indic language LLMs (BharatGen) and high-performance PySpark cloud compute infrastructure for Indian startups.",
        takeaway: "Expands local cloud data engineering jobs and GPU compute access for enterprise analytics teams."
    },
    {
        id: "n_in3",
        tag: "ISRO SPACE DATA",
        category: "Global & Geopolitics",
        title: "ISRO NISAR & Earth Observation Satellites Stream Terabyte Telemetry Feeds to Azure Cloud",
        date: "25 mins ago",
        readTime: "5 min read",
        link: "https://www.isro.gov.in",
        img_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        desc: "ISRO partners with global cloud providers to process high-resolution synthetic aperture radar (SAR) telemetry data using PySpark & Delta Lakehouses.",
        takeaway: "Real-time satellite data streaming powers agricultural analytics, climate modeling, and maritime tracking."
    },
    {
        id: "n_in4",
        tag: "INDIA DPI SHIELD",
        category: "Global & Geopolitics",
        title: "India Digital Public Infrastructure (UPI & Aadhaar) Integrates Real-time AI Cyber Defense",
        date: "35 mins ago",
        readTime: "4 min read",
        link: "https://www.npci.org.in",
        img_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        desc: "National Security Operations Center deploys machine learning anomaly detection to safeguard 15 Billion monthly UPI transactions against cyber threats.",
        takeaway: "Demonstrates world-leading real-time data streaming and fraud detection engineering at national scale."
    },
    {
        id: "n1",
        tag: "GEOPOLITICS & CHIPS",
        category: "Global & Geopolitics",
        title: "TSMC & ASML Accelerate 2nm Chip Fabs Amid Global Semiconductor Supply Chain Shifts",
        date: "45 mins ago",
        readTime: "4 min read",
        link: "https://www.reuters.com/technology/",
        img_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
        desc: "Global tech powers ramp up domestic semiconductor manufacturing facilities to secure GPU hardware supply chains for next-gen AI supercomputers.",
        takeaway: "High-end chip availability directly impacts cloud data center capacity for Azure, AWS, and GCP data workloads."
    },
    {
        id: "n2",
        tag: "CYBER WARFARE",
        category: "Global & Geopolitics",
        title: "Global Critical Infrastructure Shields Up Against AI-Driven Automated Cyber Attacks",
        date: "15 mins ago",
        readTime: "5 min read",
        link: "https://www.defense.gov",
        img_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        desc: "Nations strengthen zero-trust cyber defense systems, deploying automated threat detection to protect power grids, data pipelines, and satellite networks.",
        takeaway: "Zero-Trust security architectures are now mandatory across enterprise cloud data pipelines."
    },
    {
        id: "n3",
        tag: "AI REASONING",
        category: "AI Breakthroughs",
        title: "DeepSeek-R1 & OpenAI o3-Mini Redefine Autonomous AI Code Agents & Reasoning",
        date: "25 mins ago",
        readTime: "3 min read",
        link: "https://techcrunch.com/category/artificial-intelligence/",
        img_url: TECH_IMAGE_MATRIX[0],
        desc: "Open-weights reasoning models achieve 95%+ benchmarks in multi-step Python execution, SQL refactoring, and PySpark pipeline orchestration.",
        takeaway: "Reasoning models allow automated root-cause diagnosis of failed Spark DAGs and self-healing ADF pipelines."
    },
    {
        id: "n4",
        tag: "MICROSOFT FABRIC",
        category: "Azure",
        title: "Microsoft Fabric OneLake DirectLake Engine Delivers 100x Query Speedup",
        date: "40 mins ago",
        readTime: "4 min read",
        link: "https://blog.fabric.microsoft.com/en-us/blog/",
        img_url: TECH_IMAGE_MATRIX[1],
        desc: "Microsoft announces native Delta Lake Z-Ordering & automatic V-Order compression across enterprise lakehouses with zero import ETL.",
        takeaway: "DirectLake bypasses Synapse SQL import mode, serving Power BI dashboards directly from Delta parquet files in ADLS Gen2."
    },
    {
        id: "n5",
        tag: "DATABRICKS PHOTON",
        category: "Databricks",
        title: "Databricks Photon Engine Acceleration Delivers 12x Faster C++ Query Vectorization",
        date: "1 hour ago",
        readTime: "5 min read",
        link: "https://www.databricks.com/blog/category/engineering",
        img_url: TECH_IMAGE_MATRIX[2],
        desc: "Native C++ query engine bypasses JVM overhead, providing 12x acceleration for PySpark DataFrame joins, aggregations, and Delta MERGE INTO CDC operations.",
        takeaway: "Photon engine optimization dramatically cuts cluster execution time and Azure compute bills."
    },
    {
        id: "n6",
        tag: "MARITIME LOGISTICS",
        category: "Global & Geopolitics",
        title: "Global Supply Chain Tech Deploys Real-Time IoT Data Streaming Across Trade Routes",
        date: "2 hours ago",
        readTime: "4 min read",
        link: "https://www.bloomberg.com/technology",
        img_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
        desc: "Global shipping conglomerates integrate Kafka & Azure Event Hub real-time telemetry streaming to reroute cargo ships and predict port congestion.",
        takeaway: "Real-time stream processing reduces maritime delay costs and improves global trade logistics."
    },
    {
        id: "n7",
        tag: "AZURE DATA FACTORY",
        category: "Azure",
        title: "Azure Data Factory Integrates GenAI Control Tables & Self-Healing Pipelines",
        date: "3 hours ago",
        readTime: "4 min read",
        link: "https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog",
        img_url: TECH_IMAGE_MATRIX[3],
        desc: "ADF pipeline failures can now automatically trigger LLM root-cause diagnostics and auto-retry failed copy activities via KeyVault tokens.",
        takeaway: "Dynamic control tables combined with KeyVault metadata reduce ADF pipeline maintenance overhead by 80%."
    },
    {
        id: "n8",
        tag: "PYSPARK & DELTA",
        category: "Data Engineering",
        title: "Apache Spark 3.5 Releases Liquid Clustering: RIP Manual Partitioning & Z-Order",
        date: "4 hours ago",
        readTime: "3 min read",
        link: "https://spark.apache.org/news/",
        img_url: TECH_IMAGE_MATRIX[4],
        desc: "Liquid clustering dynamically adjusts data layouts as write patterns change, eliminating data skew and manual OPTIMIZE jobs.",
        takeaway: "Replaces rigid hive-style directory partitioning with flexible multi-column clustering keys."
    }
];

let activeNewsCategory = "all";

async function fetchLiveNews(categoryFilter = "all") {
    try {
        activeNewsCategory = categoryFilter;
        const portalMainEl = document.getElementById('newsPortalMain');
        const portalSidebarEl = document.getElementById('newsPortalSidebar');

        if (!portalMainEl) return;

        // Filter Stories
        let newsList = GLOBAL_TECH_NEWS_DATABASE;
        if (categoryFilter !== "all" && categoryFilter !== "Latest") {
            newsList = GLOBAL_TECH_NEWS_DATABASE.filter(item => 
                item.category === categoryFilter || 
                item.tag.toLowerCase().includes(categoryFilter.toLowerCase())
            );
            if (newsList.length === 0) newsList = GLOBAL_TECH_NEWS_DATABASE;
        }

        const mainNews = newsList[0] || GLOBAL_TECH_NEWS_DATABASE[0];
        const subNews1 = newsList[1] || newsList[0];
        const subNews2 = newsList[2] || newsList[0];

        // Main Grid HTML
        portalMainEl.innerHTML = `
            <div onclick="openNewsReaderModal('${mainNews.id}')" class="portal-main-card" style="cursor:pointer; background-image: linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.2)), url('${mainNews.img_url}'); border-radius:16px; min-height:280px; padding:25px; display:flex; flex-direction:column; justify-content:flex-end; border:1px solid rgba(168,85,247,0.3); transition:transform 0.3s; position:relative; overflow:hidden;">
                <div style="position:relative; z-index:2;">
                    <span class="portal-tag" style="background:var(--grad); color:#fff; padding:4px 12px; border-radius:50px; font-size:0.75rem; font-weight:800; text-transform:uppercase;">${mainNews.tag}</span>
                    <h3 style="font-size:1.35rem; font-weight:800; color:#fff; margin:10px 0 6px 0; line-height:1.3;">${mainNews.title}</h3>
                    <p style="color:#cbd5e1; font-size:0.88rem; margin-bottom:12px; line-height:1.5;">${mainNews.desc}</p>
                    <div style="font-size:0.8rem; color:#94a3b8; display:flex; gap:12px; align-items:center;">
                        <span>${mainNews.readTime}</span> • <span>${mainNews.date}</span> • <span style="color:var(--accent2); font-weight:bold;">Click to Read Article 📖 →</span>
                    </div>
                </div>
            </div>

            <div class="portal-sub-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:15px;">
                <div onclick="openNewsReaderModal('${subNews1.id}')" style="cursor:pointer; background:rgba(30,41,59,0.5); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08); display:flex; gap:14px; align-items:center; transition:background 0.2s;">
                    <div style="background-image: url('${subNews1.img_url}'); width:75px; height:75px; background-size:cover; background-position:center; border-radius:8px; flex-shrink:0;"></div>
                    <div>
                        <span style="color:var(--accent2); font-size:0.75rem; font-weight:800;">${subNews1.tag}</span>
                        <h4 style="font-size:0.88rem; color:#fff; margin:4px 0 6px 0; line-height:1.3;">${subNews1.title.length > 50 ? subNews1.title.substring(0, 50) + '...' : subNews1.title}</h4>
                        <span style="color:var(--t3); font-size:0.75rem;">${subNews1.date}</span>
                    </div>
                </div>

                <div onclick="openNewsReaderModal('${subNews2.id}')" style="cursor:pointer; background:rgba(30,41,59,0.5); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08); display:flex; gap:14px; align-items:center; transition:background 0.2s;">
                    <div style="background-image: url('${subNews2.img_url}'); width:75px; height:75px; background-size:cover; background-position:center; border-radius:8px; flex-shrink:0;"></div>
                    <div>
                        <span style="color:var(--accent); font-size:0.75rem; font-weight:800;">${subNews2.tag}</span>
                        <h4 style="font-size:0.88rem; color:#fff; margin:4px 0 6px 0; line-height:1.3;">${subNews2.title.length > 50 ? subNews2.title.substring(0, 50) + '...' : subNews2.title}</h4>
                        <span style="color:var(--t3); font-size:0.75rem;">${subNews2.date}</span>
                    </div>
                </div>
            </div>
        `;

        // Sidebar Feed HTML
        if (portalSidebarEl) {
            let sidebarHTML = '';
            newsList.slice(3).concat(GLOBAL_TECH_NEWS_DATABASE.slice(0, 3)).slice(0, 5).forEach(item => {
                sidebarHTML += `
                    <div onclick="openNewsReaderModal('${item.id}')" style="cursor:pointer; display:flex; gap:12px; margin-bottom:12px; background:rgba(255,255,255,0.02); padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.06); transition:border-color 0.2s;">
                        <div style="background-image: url('${item.img_url}'); width:60px; height:60px; background-size:cover; background-position:center; border-radius:8px; flex-shrink:0;"></div>
                        <div>
                            <span style="color:var(--accent2); font-size:0.7rem; font-weight:800; display:block; margin-bottom:2px;">${item.tag}</span>
                            <h5 style="color:#fff; font-size:0.84rem; margin:0 0 4px 0; font-weight:600; line-height:1.3;">${item.title.length > 45 ? item.title.substring(0, 45) + '...' : item.title}</h5>
                            <span style="color:var(--t3); font-size:0.7rem;">${item.date}</span>
                        </div>
                    </div>
                `;
            });
            portalSidebarEl.innerHTML = sidebarHTML;
        }
    } catch (err) {
        console.warn("News Portal Isolated Error (Ignored for site stability):", err);
    }
}

// Filter Category Trigger
function filterNewsCategory(cat, btn) {
    document.querySelectorAll('.news-menu-btn').forEach(b => {
        b.style.background = 'rgba(255,255,255,0.05)';
        b.style.color = '#cbd5e1';
        b.style.border = '1px solid rgba(255,255,255,0.1)';
    });
    if (btn) {
        btn.style.background = 'var(--grad)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
    }
    fetchLiveNews(cat);
}

// Refresh Feed Trigger
function refreshLiveNewsFeed() {
    const btn = document.getElementById('refreshNewsBtn');
    if (btn) {
        btn.innerHTML = '⚡ Fetching Live Feeds...';
        btn.style.opacity = '0.7';
    }

    // Rotate images & update timestamps
    GLOBAL_TECH_NEWS_DATABASE.forEach((item, idx) => {
        const nextImgIdx = (idx + Math.floor(Math.random() * 3) + 1) % TECH_IMAGE_MATRIX.length;
        item.img_url = TECH_IMAGE_MATRIX[nextImgIdx];
        item.date = `${Math.floor(Math.random() * 5) + 1} mins ago`;
    });

    // Shuffle stories slightly for dynamic feel
    GLOBAL_TECH_NEWS_DATABASE.sort(() => Math.random() - 0.5);

    setTimeout(() => {
        fetchLiveNews(activeNewsCategory);
        if (btn) {
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> <span>Live Feed Refreshed ✔</span>';
            btn.style.opacity = '1';
            setTimeout(() => {
                btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> <span>Refresh Live Feed</span>';
            }, 2000);
        }
    }, 600);
}

// Open News Reader Modal
function openNewsReaderModal(newsId) {
    const item = GLOBAL_TECH_NEWS_DATABASE.find(n => n.id === newsId) || GLOBAL_TECH_NEWS_DATABASE[0];
    const modal = document.getElementById('newsReaderModal');

    if (modal) {
        document.getElementById('newsReaderBadge').textContent = item.tag;
        document.getElementById('newsReaderTitle').textContent = item.title;
        document.getElementById('newsReaderDate').textContent = `📅 ${item.date}`;
        document.getElementById('newsReaderReadTime').textContent = `⏱️ ${item.readTime}`;
        document.getElementById('newsReaderImg').src = item.img_url;
        document.getElementById('newsReaderDesc').textContent = item.desc;
        document.getElementById('newsReaderTakeaway').textContent = item.takeaway || "Architectural implication summary for Data Engineers & Cloud Architects.";
        document.getElementById('newsReaderLink').href = item.link;

        modal.style.display = 'flex';
    }
}

function closeNewsReaderModal() {
    const modal = document.getElementById('newsReaderModal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLiveNews();
});

/* ============================================
   SETTINGS MODAL & THEME TOGGLE
   ============================================ */
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsModal = document.getElementById('settingsModal');
const btnDarkTheme = document.getElementById('btnDarkTheme');
const btnLightTheme = document.getElementById('btnLightTheme');

// Open / Close Modal
if(settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
}
if(closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
}
// Close on outside click
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
    }
});

// Theme Logic
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        btnLightTheme.classList.add('active');
        btnDarkTheme.classList.remove('active');
    } else {
        document.body.classList.remove('light-theme');
        btnDarkTheme.classList.add('active');
        btnLightTheme.classList.remove('active');
    }
    localStorage.setItem('siteTheme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('siteTheme') || 'dark';
applyTheme(savedTheme);

// Toggle clicks
btnDarkTheme.addEventListener('click', () => applyTheme('dark'));
btnLightTheme.addEventListener('click', () => applyTheme('light'));

/* ============================================
   JOB AGGREGATOR API INTEGRATION
   ============================================ */
let currentJobs = [];

async function searchJobs() {
    const searchInput = document.getElementById('jobSearchInput').value.trim();
    
    const resultsGrid = document.getElementById('jobResultsGrid');
    const emptyState = document.getElementById('jobEmptyState');
    const loadingState = document.getElementById('jobLoadingState');
    const btn = document.querySelector('button[onclick="searchJobs()"]');
    
    emptyState.style.display = 'none';
    resultsGrid.innerHTML = '';
    loadingState.style.display = 'block';
    if(btn) btn.innerHTML = 'Searching...';
    
    try {
        const queryParams = new URLSearchParams();
        if(searchInput) queryParams.append('q', searchInput);
        
        const countryDropdown = document.getElementById('jobCountryFilter');
        if(countryDropdown && countryDropdown.value) {
            queryParams.append('country', countryDropdown.value);
        }
        
        // Handle case where user opens index.html directly from file system
        const fetchUrl = '/api/jobs?' + queryParams.toString();
        
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        loadingState.style.display = 'none';
        
        if (!data.jobs || data.jobs.length === 0) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = '<h3>No Jobs Found</h3><p>Try adjusting your search criteria.</p>';
            if(btn) btn.innerHTML = 'Find Jobs ✨';
            return;
        }
        
        currentJobs = data.jobs;
        let html = '';
        currentJobs.forEach((job, index) => {
            html += `
                <div class="blog-card card-glow" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div class="blog-tag" style="background:rgba(168,85,247,0.15); color:#c084fc; border:1px solid rgba(168,85,247,0.3); margin-bottom:0;">
                                ${job.source}
                            </div>
                            <span style="font-size:0.75rem; color:var(--t3);">${job.posted || ''}</span>
                        </div>
                        <h3 style="margin-top:10px; font-size:1.1rem;">${job.title}</h3>
                        <p style="margin-bottom:15px; color:var(--t3);"><strong>${job.company}</strong> • ${job.location}</p>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                        <span style="font-size:0.8rem; padding:4px 8px; background:rgba(255,255,255,0.05); border-radius:4px; font-weight:bold; color:#22c55e;">
                            ${job.salary || job.type}
                        </span>
                        <button onclick="openJobModal(${index})" class="btn-glow" style="padding:6px 16px; font-size:0.9rem;">View Details</button>
                    </div>
                </div>
            `;
        });
        
        resultsGrid.innerHTML = html;
        if(btn) btn.innerHTML = 'Find Jobs ✨';
        
    } catch (err) {
        console.error('Job Search Error:', err);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = '<h3 style="color:#ef4444;">Error Fetching Jobs</h3><p>Make sure the Python backend is running.</p>';
        if(btn) btn.innerHTML = 'Find Jobs ✨';
    }
}

/* ============================================
   JOB DETAILS MODAL LOGIC
   ============================================ */
const jobDetailsModal = document.getElementById('jobDetailsModal');
const closeJdBtn = document.getElementById('closeJdBtn');
const closeJdBtnBottom = document.getElementById('closeJdBtnBottom');

function openJobModal(index) {
    const job = currentJobs[index];
    if(!job) return;
    
    document.getElementById('jdSourceBadge').innerText = job.source;
    document.getElementById('jdTitle').innerText = job.title;
    document.getElementById('jdCompanyLoc').innerText = `${job.company} • ${job.location}`;
    document.getElementById('jdSalary').innerText = job.salary || 'Not Disclosed';
    document.getElementById('jdType').innerText = job.type || 'Full Time';
    document.getElementById('jdPosted').innerText = job.posted || 'Recent';
    document.getElementById('jdDescription').innerHTML = job.description ? job.description.replace(/\n/g, '<br>') : 'No description provided.';
    
    const reqList = document.getElementById('jdRequirements');
    reqList.innerHTML = '';
    if(job.requirements && job.requirements.length > 0) {
        job.requirements.forEach(req => {
            const li = document.createElement('li');
            li.innerText = req;
            reqList.appendChild(li);
        });
    } else {
        reqList.innerHTML = '<li>Refer to company site for full requirements.</li>';
    }
    
    // Set dynamic company apply link
    const applyLink = document.getElementById('jdApplyLink');
    if (job.url) {
        applyLink.setAttribute('data-url', job.url);
        applyLink.style.display = 'inline-block';
    } else {
        applyLink.removeAttribute('data-url');
        applyLink.style.display = 'none';
    }
    
    jobDetailsModal.classList.add('active');
}

function applyJob() {
    const url = document.getElementById('jdApplyLink').getAttribute('data-url');
    if(url) {
        // Try opening in new tab
        const newWin = window.open(url, '_blank');
        // If popup blocked or inside IDE preview sandbox
        if(!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
            alert("Redirecting to: " + url + "\n\n(Note: If this didn't open a new tab, your browser/IDE is blocking popups. Please copy the URL manually or open the site in a real browser window.)");
            window.location.href = url; // Fallback to same-tab redirect
        }
    }
}

// ==================== PREMIUM USAGE LIMIT LOGIC ====================
function openPremiumModal() {
    const modal = document.getElementById('premiumModal');
    if(modal) modal.classList.add('active');
}

function closePremiumModal() {
    const modal = document.getElementById('premiumModal');
    if(modal) modal.classList.remove('active');
}

function checkUsageLimit() {
    let count = localStorage.getItem('ai_tool_usage_count') || 0;
    count = parseInt(count);
    if (count >= 3) {
        openPremiumModal();
        return false;
    }
    localStorage.setItem('ai_tool_usage_count', count + 1);
    return true;
}

function closeJobModal() {
    jobDetailsModal.classList.remove('active');
}

if(closeJdBtn) closeJdBtn.addEventListener('click', closeJobModal);
if(closeJdBtnBottom) closeJdBtnBottom.addEventListener('click', closeJobModal);

jobDetailsModal.addEventListener('click', (e) => {
    if (e.target === jobDetailsModal) {
        closeJobModal();
    }
});

// ==================== AI SANDBOX LOGIC ====================
let currentSandboxLang = 'sql';

function setSandboxLang(lang) {
    currentSandboxLang = lang;
    const sqlBtn = document.getElementById('tab-sql');
    const pysparkBtn = document.getElementById('tab-pyspark');
    const editor = document.getElementById('sandboxEditor');
    
    if (lang === 'sql') {
        sqlBtn.style.background = 'rgba(124, 58, 237, 0.2)';
        sqlBtn.style.color = '#fff';
        sqlBtn.style.borderColor = 'rgba(124,58,237,0.5)';
        
        pysparkBtn.style.background = 'transparent';
        pysparkBtn.style.color = '#94a3b8';
        pysparkBtn.style.borderColor = 'transparent';
        
        editor.placeholder = "-- Type your SQL query here...\nSELECT * FROM Employees WHERE department = 'Engineering';";
        if(editor.value.includes('spark.')) editor.value = '';
    } else {
        pysparkBtn.style.background = 'rgba(124, 58, 237, 0.2)';
        pysparkBtn.style.color = '#fff';
        pysparkBtn.style.borderColor = 'rgba(124,58,237,0.5)';
        
        sqlBtn.style.background = 'transparent';
        sqlBtn.style.color = '#94a3b8';
        sqlBtn.style.borderColor = 'transparent';
        
        editor.placeholder = "# Type your PySpark code here...\ndf = spark.read.csv('data.csv')\ndf.show()";
        if(editor.value.includes('SELECT')) editor.value = '';
    }
}

async function runSandboxCode() {
    if (!checkUsageLimit()) return;
    const editor = document.getElementById('sandboxEditor');
    const terminal = document.getElementById('sandboxTerminal');
    const code = editor.value.trim();
    
    if (!code) {
        terminal.innerHTML = '<span style="color: #ff5f56;">$ Error: Please enter some code to execute.</span>';
        return;
    }
    
    terminal.innerHTML = '<span style="color: #94a3b8;">$ Executing ' + currentSandboxLang.toUpperCase() + ' code...\n$ Requesting cloud compute resources...\n</span><span class="shimmer-text">Running...</span>';
    
    try {
        const formData = new FormData();
        formData.append('code', code);
        formData.append('language', currentSandboxLang);
        
        const res = await fetch('http://localhost:8000/api/run-code', {
            method: 'POST',
            body: formData
        });
        
        const data = await res.json();
        if (res.ok) {
            // Escape HTML in the output to prevent issues with < or > in SQL outputs
            const safeOutput = data.output.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            terminal.innerHTML = `<span style="color: #94a3b8;">$ Execution Complete.</span>\n\n${safeOutput}`;
        } else {
            terminal.innerHTML = `<span style="color: #ff5f56;">$ Execution Failed.\n\n${data.detail || 'Unknown error occurred.'}</span>`;
        }
    } catch (e) {
        terminal.innerHTML = `<span style="color: #ff5f56;">$ Connection Error. Please ensure backend is running.\n\n${e.message}</span>`;
    }
}

// ==================== IN-COURSE AI TUTOR LOGIC (REAL AI) ====================

// ⚠️ PASTE YOUR GOOGLE GEMINI API KEY HERE
const GEMINI_API_KEY = "";

// Store conversation history for context
let chatHistory = [
    {
        role: "user",
        parts: [{ text: "You are Course Copilot, an AI tutor for a data engineering platform. You must give perfect, correct answers, explain why errors happen, provide step-by-step guidance, and act like ChatGPT. If a student asks in Telugu or Tanglish, reply in friendly Telugu. If asked about this site, you can provide links." }]
    },
    {
        role: "model",
        parts: [{ text: "Understood! I am Course Copilot. I'm ready to help students step-by-step in English or Telugu." }]
    }
];

let pendingBase64Image = null; // Store uploaded image

function toggleTutor() {
    const tutorWindow = document.getElementById('tutorWindow');
    tutorWindow.classList.toggle('active');
}

async function callGeminiAPI(prompt, base64Image = null) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_YOUR_KEY_HERE") {
        return "⚠️ Please insert your Gemini API Key in `script.js` (line ~1517) to activate the real AI!";
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        let newParts = [{ text: prompt }];
        
        // If an image was uploaded, attach it
        if (base64Image) {
            const base64Data = base64Image.split(',')[1]; // Remove data:image/png;base64,
            const mimeType = base64Image.split(';')[0].split(':')[1];
            newParts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                }
            });
        }
        
        const requestBody = {
            contents: [...chatHistory, { role: "user", parts: newParts }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        if (data.error) {
            console.error(data.error);
            return `❌ API Error: ${data.error.message}`;
        }
        
        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        // Save to history
        chatHistory.push({ role: "user", parts: newParts });
        chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
        
        return aiResponseText;

    } catch (error) {
        console.error(error);
        return "❌ Connection failed. Please check your internet or API key.";
    }
}

async function sendTutorMessage() {
    const input = document.getElementById('tutorInput');
    const body = document.getElementById('tutorBody');
    const text = input.value.trim();
    
    if(!text && !pendingBase64Image) return;

    // Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'tutor-msg user';
    
    if (pendingBase64Image) {
        userMsg.innerHTML = `<div>${text || "Analyzing this image..."}</div><img src="${pendingBase64Image}" style="max-height: 150px; margin-top:5px;">`;
    } else {
        userMsg.textContent = text;
    }
    
    body.appendChild(userMsg);
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // Typing Indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'tutor-msg ai';
    typingMsg.innerHTML = '<span class="shimmer-text">Thinking...</span>';
    body.appendChild(typingMsg);
    body.scrollTop = body.scrollHeight;

    // Call Real AI
    const imageToSend = pendingBase64Image;
    pendingBase64Image = null; // reset
    
    const aiResponse = await callGeminiAPI(text || "Please analyze this image.", imageToSend);
    
    body.removeChild(typingMsg);
    
    const aiMsg = document.createElement('div');
    aiMsg.className = 'tutor-msg ai';
    
    aiMsg.innerHTML = formatAIResponse(aiResponse);
    body.appendChild(aiMsg);
    body.scrollTop = body.scrollHeight;
}

function formatAIResponse(text) {
    const codeBlocks = [];
    
    // 1. Extract code blocks and replace with placeholders
    text = text.replace(/```([\s\S]*?)```/g, function(match, codeContent) {
        let lang = "code";
        let code = codeContent.trim();
        const firstLineBreak = codeContent.indexOf('\n');
        
        if (firstLineBreak > -1 && firstLineBreak < 20) {
            const possibleLang = codeContent.substring(0, firstLineBreak).trim();
            if (possibleLang) {
                lang = possibleLang;
                code = codeContent.substring(firstLineBreak + 1).trim();
            }
        }
        
        // Escape HTML
        code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        const id = 'code-' + Math.random().toString(36).substr(2, 9);
        const html = `
            <div class="code-block-wrapper">
                <div class="code-block-header">
                    <span style="text-transform:uppercase;">${lang}</span>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('${id}').innerText); this.innerText='Copied!'; setTimeout(()=>this.innerText='Copy', 2000);">Copy</button>
                </div>
                <pre class="code-block-content" id="${id}">${code}</pre>
            </div>
        `;
        codeBlocks.push(html);
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // 2. Format bold and inline code
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 4px; border-radius:4px;">$1</code>');
    
    // 3. Line breaks for regular text
    text = text.replace(/\n/g, '<br>');

    // 4. Restore code blocks
    codeBlocks.forEach((html, i) => {
        text = text.replace(`__CODE_BLOCK_${i}__`, html);
    });

    return text;
}

// ==================== REAL WEB SPEECH API ====================
function simulateVoice() {
    const micBtn = document.getElementById('tutorMicBtn');
    const input = document.getElementById('tutorInput');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("Your browser does not support Voice Recognition. Try Google Chrome.");
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Works well for Indian accents and Tanglish
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        micBtn.classList.add('mic-listening');
        input.placeholder = "Listening (Speak now)...";
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        setTimeout(() => sendTutorMessage(), 500); // Auto send
    };
    
    recognition.onerror = function(event) {
        console.error("Speech recognition error", event.error);
        input.placeholder = "Message AI...";
    };
    
    recognition.onend = function() {
        micBtn.classList.remove('mic-listening');
        if(!input.value) input.placeholder = "Message AI...";
    };
    
    recognition.start();
}

// ==================== REAL IMAGE ANALYSIS ====================
function simulateImageUpload(inputEl) {
    if(!inputEl.files || !inputEl.files[0]) return;
    
    const file = inputEl.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        pendingBase64Image = e.target.result;
        const input = document.getElementById('tutorInput');
        input.placeholder = "Image attached. Ask a question about it...";
        input.focus();
    };
    
    reader.readAsDataURL(file);
    inputEl.value = ""; // Reset input
}

// ==================== DRAGGABLE & MINIMIZE LOGIC ====================
function minimizeTutor() {
    const tutorWindow = document.getElementById('tutorWindow');
    tutorWindow.classList.toggle('minimized');
}

const tutorWindow = document.getElementById('tutorWindow');
const tutorHeader = document.getElementById('tutorHeader');
let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

if (tutorHeader && tutorWindow) {
    tutorHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);
}

function dragStart(e) {
    if (e.target.tagName === 'BUTTON') return;
    isDragging = true;
    
    if (!tutorWindow.style.left) {
        const rect = tutorWindow.getBoundingClientRect();
        tutorWindow.style.right = 'auto';
        tutorWindow.style.bottom = 'auto';
        tutorWindow.style.left = rect.left + 'px';
        tutorWindow.style.top = rect.top + 'px';
        tutorWindow.style.transform = 'none';
        xOffset = 0;
        yOffset = 0;
    }
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        tutorWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
}
// ==================== CUSTOM RESIZE LOGIC ====================
const handles = document.querySelectorAll('.resize-edge-w');
let activeHandle = null;
let startX, startW, startLeft;

handles.forEach(handle => {
    handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        activeHandle = 'w';
        startX = e.clientX;
        const rect = tutorWindow.getBoundingClientRect();
        startW = rect.width;
        startLeft = rect.left;
        
        tutorWindow.style.right = 'auto';
        tutorWindow.style.left = startLeft + 'px';
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    });
});

function handleResize(e) {
    if (!activeHandle) return;
    const dx = e.clientX - startX;
    
    // Only adjusting width from left edge
    if (activeHandle === 'w') {
        const newWidth = startW - dx;
        if(newWidth > 300 && newWidth < window.innerWidth - 50) {
            tutorWindow.style.width = newWidth + 'px';
            tutorWindow.style.left = (startLeft + dx) + 'px';
        }
    }
}

// ==================== JIDDU VOICE CALL SIMULATOR LOGIC ====================
let jidduAudioTimeout = null;

function openJidduSimModal() {
    const modal = document.getElementById('jidduSimModal');
    if (modal) {
        modal.style.display = 'flex';
        startJidduDialogue();
    }
}

function closeJidduSimModal() {
    const modal = document.getElementById('jidduSimModal');
    if (modal) modal.style.display = 'none';
    if (jidduAudioTimeout) clearTimeout(jidduAudioTimeout);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function startJidduDialogue() {
    if (jidduAudioTimeout) clearTimeout(jidduAudioTimeout);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const subtitleEl = document.getElementById('jidduSubtitles');
    const logsEl = document.getElementById('jidduLiveLogs');
    const statusEl = document.getElementById('jidduCallStatus');

    if (logsEl) logsEl.style.display = 'none';
    if (statusEl) statusEl.textContent = '🟢 Outbound Health Check Call Connected';

    const scriptSteps = [
        {
            speaker: 'Jiddu AI',
            text: 'నమస్తే అండీ! నేను జిడ్డు AI హెల్త్ అసిస్టెంట్‌ని మాట్లాడేది. ఈ రోజు ఉదయం షుగర్ & బిపి టాబ్లెట్లు వేసుకున్నారా అండీ?',
            delay: 100
        },
        {
            speaker: 'Father',
            text: 'హా వేసుకున్నాను బాబూ, షుగర్ టెస్ట్ కూడా చేశాను, 130 రీడింగ్ వచ్చింది.',
            delay: 4500
        },
        {
            speaker: 'Jiddu AI',
            text: 'చాలా సంతోషం అండీ! రీడింగ్ 130 నార్మల్‌గా ఉంది. నాచ్ నోటిఫికేషన్ ద్వారా డేటాబేస్ లో సేవ్ చేశాను. మీ అబ్బాయి మయూర్ గారికి వాట్సాప్ అప్‌డేట్ పంపిస్తున్నాను. జాగ్రత్తగా ఉండండి!',
            delay: 9000
        }
    ];

    scriptSteps.forEach((step) => {
        setTimeout(() => {
            if (subtitleEl) {
                subtitleEl.innerHTML = `<strong>${step.speaker}:</strong> "${step.text}"`;
            }

            // Web Speech API fallback for audio synthesis
            if ('speechSynthesis' in window && step.speaker === 'Jiddu AI') {
                const utterance = new SpeechSynthesisUtterance(step.text);
                utterance.lang = 'te-IN'; // Telugu
                utterance.rate = 0.95;
                window.speechSynthesis.speak(utterance);
            }
        }, step.delay);
    });

    // Show Notion & WhatsApp Logs at end of call
    jidduAudioTimeout = setTimeout(() => {
        if (logsEl) logsEl.style.display = 'block';
        if (statusEl) statusEl.textContent = '✅ Call Complete & Health Data Logged';
    }, 14500);
}

// ==================== IDEA 2: DATAENGINE SQL TO PYSPARK CONVERTER ====================
function convertSqlToPySpark() {
    const input = document.getElementById('sqlInput').value.trim();
    const outputEl = document.getElementById('pysparkOutput');
    const tipsEl = document.getElementById('pysparkTips');

    if (!input) {
        outputEl.textContent = "# Please enter a valid SQL query above.";
        return;
    }

    let generatedPySpark = "";

    if (input.toLowerCase().includes('dense_rank') || input.toLowerCase().includes('partition by')) {
        generatedPySpark = `from pyspark.sql import SparkSession
from pyspark.sql.window import Window
import pyspark.sql.functions as F

spark = SparkSession.builder.appName("SqlToPySpark").getOrCreate()

# Read from Delta Lake Bronze/Silver table
df = spark.read.format("delta").load("/mnt/silver/transactions")

# Define Window Specification
windowSpec = Window.partitionBy("department_id").orderBy(F.col("salary").desc())

# Apply DENSE_RANK Window Function
df_transformed = df.withColumn("rank", F.dense_rank().over(windowSpec)) \\
                   .filter(F.col("rank") <= 3)

# Write to Gold Layer with Liquid Clustering
df_transformed.write.format("delta") \\
              .mode("overwrite") \\
              .option("clusterBy", "department_id") \\
              .save("/mnt/gold/top_paid_employees")`;
    } else if (input.toLowerCase().includes('join')) {
        generatedPySpark = `from pyspark.sql import SparkSession
import pyspark.sql.functions as F

spark = SparkSession.builder.appName("SqlJoinEngine").getOrCreate()

orders_df = spark.read.format("delta").load("/mnt/silver/orders")
users_df = spark.read.format("delta").load("/mnt/silver/users")

# Optimized Broadcast Join (if users table is < 10MB)
df_joined = orders_df.join(F.broadcast(users_df), "user_id", "inner") \\
                     .filter(F.col("status") == "completed") \\
                     .groupBy("user_id", "user_name") \\
                     .agg(F.count("order_id").alias("total_orders"), F.sum("amount").alias("total_spent")) \\
                     .orderBy(F.col("total_spent").desc())

df_joined.write.format("delta").mode("append").save("/mnt/gold/user_analytics")`;
    } else {
        generatedPySpark = `from pyspark.sql import SparkSession
import pyspark.sql.functions as F

spark = SparkSession.builder.appName("DataEngineConverter").getOrCreate()

# 1. Read input Delta table
df = spark.read.format("delta").load("/mnt/silver/orders")

# 2. PySpark Filter, GroupBy & Aggregations
df_result = df.filter(F.col("status") == "completed") \\
              .groupBy("user_id") \\
              .agg(
                  F.count("order_id").alias("total_orders"),
                  F.sum("amount").alias("total_spent")
              ) \\
              .filter(F.col("total_orders") >= 5) \\
              .orderBy(F.col("total_spent").desc())

# 3. Write to Gold Layer
df_result.write.format("delta").mode("overwrite").save("/mnt/gold/top_users")`;
    }

    outputEl.textContent = generatedPySpark;
    if (tipsEl) tipsEl.style.display = 'block';
}

function loadSqlPreset(type) {
    const inputEl = document.getElementById('sqlInput');
    if (!inputEl) return;

    if (type === 'agg') {
        inputEl.value = `SELECT user_id, COUNT(order_id) as total_orders, SUM(amount) as total_spent
FROM orders
WHERE status = 'completed'
GROUP BY user_id
HAVING total_orders >= 5
ORDER BY total_spent DESC;`;
    } else if (type === 'window') {
        inputEl.value = `SELECT employee_id, department_id, salary,
       DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank
FROM employees
WHERE salary > 50000;`;
    } else if (type === 'join') {
        inputEl.value = `SELECT u.user_name, COUNT(o.order_id) as total_orders, SUM(o.amount) as total_spent
FROM orders o
INNER JOIN users u ON o.user_id = u.user_id
WHERE o.status = 'completed'
GROUP BY u.user_name
ORDER BY total_spent DESC;`;
    }
    convertSqlToPySpark();
}

// ==================== IDEA 3: INTERACTIVE AZURE ARCHITECTURE INSPECTOR ====================
function inspectArchNode(stage) {
    const buttons = document.querySelectorAll('.arch-node-btn');
    buttons.forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.05)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        btn.style.color = '#cbd5e1';
    });

    const activeBtn = document.getElementById(`archNode-${stage}`);
    if (activeBtn) {
        activeBtn.style.background = 'rgba(14, 165, 233, 0.2)';
        activeBtn.style.borderColor = '#0ea5e9';
        activeBtn.style.color = '#fff';
    }

    const titleEl = document.getElementById('archStageTitle');
    const descEl = document.getElementById('archStageDesc');
    const codeEl = document.getElementById('archStageCode');

    const specs = {
        adf: {
            title: '⚡ Stage 1: Azure Data Factory (ADF) Ingestion',
            desc: 'Parameterized Copy Activity pulling raw streaming JSON REST APIs via Azure Key Vault Secrets & Self-Hosted Integration Runtime (SHIR).',
            code: 'ADF Pipeline Trigger -> LinkedService_KeyVault -> Raw API Sink to ADLS Gen2 /raw/'
        },
        bronze: {
            title: '🧱 Stage 2: Databricks PySpark Bronze Layer',
            desc: 'Auto Loader reads raw JSON/Parquet files from ADLS Gen2, enforces schema validation with StructType, and appends raw immutable records.',
            code: 'spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").schema(rawSchema).load("/mnt/raw/")'
        },
        silver: {
            title: '🧹 Stage 3: Databricks PySpark Silver Layer (Cleansing & Deduplication)',
            desc: 'Cleanses nulls, casts data types, removes duplicate records via dropDuplicates(), and writes to Silver Delta Lake table.',
            code: 'df_cleaned = df_bronze.dropDuplicates(["transaction_id"]).withColumn("processed_at", current_timestamp())'
        },
        gold: {
            title: '🥇 Stage 4: Gold Delta Lake (Business Aggregations & Clustering)',
            desc: 'Computes analytical KPIs, applies Liquid Clustering (clusterBy) and Delta Z-Ordering for 100x query speedups in Power BI.',
            code: 'df_gold.write.format("delta").mode("overwrite").option("clusterBy", "region, customer_tier").save("/mnt/gold/kpi_metrics")'
        },
        powerbi: {
            title: '📊 Stage 5: Synapse Serverless & Power BI DirectLake Dashboards',
            desc: 'Power BI connects directly to OneLake Gold Delta tables via DirectLake mode — zero import lag, sub-second visuals!',
            code: 'DirectLake Connection -> Synapse Serverless SQL View -> Real-Time Power BI Dashboard'
        }
    };

    if (specs[stage]) {
        if (titleEl) titleEl.textContent = specs[stage].title;
        if (descEl) descEl.textContent = specs[stage].desc;
        if (codeEl) codeEl.textContent = specs[stage].code;
    }
}

