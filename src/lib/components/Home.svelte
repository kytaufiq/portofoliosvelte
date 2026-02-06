<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    let heroSection;
    let titleLines = [];
    let subtitle;
    let buttons;
    let stats;
    let illustration;
    let typedCode = "";
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let isTyping = true;

    const codeLines = [
        'const developer = "Zaky";',
        "const skills = [",
        '  "Svelte",',
        '  "React",',
        '  "GSAP"',
        "];",
        "",
        'console.log("Hello World!");',
    ];

    const fullCode = codeLines.join("\n");

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Animate title lines
        tl.from(titleLines, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
        })
            .from(
                subtitle,
                {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                },
                "-=0.4",
            )
            .from(
                buttons,
                {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                },
                "-=0.3",
            )
            .from(
                stats,
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                },
                "-=0.2",
            )
            .from(
                illustration,
                {
                    scale: 0.8,
                    opacity: 0,
                    duration: 1,
                    ease: "back.out(1.7)",
                },
                "-=0.8",
            );

        // Exit animation when scrolling past Home section
        ScrollTrigger.create({
            trigger: heroSection,
            start: "center center",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                // Smooth fade out and move up effect when scrolling down
                gsap.to([...titleLines, subtitle, buttons, stats], {
                    opacity: 1 - progress * 0.8,
                    y: -progress * 50,
                    duration: 0.1,
                    ease: "none",
                });
                gsap.to(illustration, {
                    opacity: 1 - progress * 0.7,
                    scale: 1 - progress * 0.15,
                    y: -progress * 30,
                    duration: 0.1,
                    ease: "none",
                });
            },
        });

        // Start typing animation after intro animations
        setTimeout(() => {
            typeCode();
        }, 1500);

        // Floating animation for illustration
        gsap.to(illustration, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    });

    function typeCode() {
        if (currentCharIndex < fullCode.length) {
            typedCode = fullCode.slice(0, currentCharIndex + 1);
            currentCharIndex++;

            // Variable typing speed for more natural effect
            const char = fullCode[currentCharIndex - 1];
            let delay = 50;
            if (char === "\n") delay = 200;
            else if (char === " ") delay = 30;
            else if (char === '"' || char === ";") delay = 100;

            setTimeout(typeCode, delay);
        } else {
            // Reset and restart after a pause
            setTimeout(() => {
                typedCode = "";
                currentCharIndex = 0;
                typeCode();
            }, 3000);
        }
    }

    function formatCode(code) {
        return code
            .replace(/const/g, '<span class="keyword">const</span>')
            .replace(/console/g, '<span class="keyword">console</span>')
            .replace(/log/g, '<span class="function">log</span>')
            .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
            .replace(/(\w+)\s*=/g, '<span class="variable">$1</span> =')
            .replace(/=/g, '<span class="operator">=</span>')
            .replace(/\[/g, '<span class="bracket">[</span>')
            .replace(/\]/g, '<span class="bracket">]</span>')
            .replace(/;/g, '<span class="punctuation">;</span>');
    }

    function getLineNumbers(code) {
        const lines = code.split("\n");
        return lines.map((_, i) => i + 1);
    }

    $: formattedCode = formatCode(typedCode);
    $: lineNumbers = getLineNumbers(typedCode);
</script>

<section id="home" bind:this={heroSection} class="hero">
    <div class="hero-container">
        <div class="hero-content">
            <div class="hero-badge">
                <span class="badge-dot"></span>
                Available for freelance work
            </div>

            <h1 class="hero-title">
                <span bind:this={titleLines[0]} class="title-line"
                    >Hi, I'm <span class="gradient-text">Zaky</span></span
                >
                <span bind:this={titleLines[1]} class="title-line"
                    >Creative Developer</span
                >
                <span bind:this={titleLines[2]} class="title-line accent"
                    >& Designer</span
                >
            </h1>

            <p bind:this={subtitle} class="hero-subtitle">
                I craft beautiful, interactive web experiences with modern
                technologies. Turning complex ideas into elegant, user-friendly
                solutions.
            </p>

            <div bind:this={buttons} class="hero-buttons">
                <a href="#projects" class="btn btn-primary">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    View Projects
                </a>
                <a href="#contact" class="btn btn-secondary">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Contact Me
                </a>
            </div>

            <div bind:this={stats} class="hero-stats">
                <div class="stat">
                    <span class="stat-number">3+</span>
                    <span class="stat-label">Years Experience</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                    <span class="stat-number">50+</span>
                    <span class="stat-label">Projects Completed</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                    <span class="stat-number">30+</span>
                    <span class="stat-label">Happy Clients</span>
                </div>
            </div>
        </div>

        <!-- Animated Code Editor with Typing Effect -->
        <div bind:this={illustration} class="hero-illustration">
            <div class="illustration-container">
                <div class="code-editor">
                    <div class="editor-header">
                        <div class="window-controls">
                            <span class="control close"></span>
                            <span class="control minimize"></span>
                            <span class="control maximize"></span>
                        </div>
                        <div class="tabs">
                            <div class="tab active">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                                </svg>
                                main.js
                            </div>
                        </div>
                    </div>

                    <div class="editor-body">
                        <div class="line-numbers">
                            {#each lineNumbers as num}
                                <span>{num}</span>
                            {/each}
                        </div>
                        <div class="code-content">
                            <pre>{@html formattedCode}<span class="cursor"
                                    >|</span
                                ></pre>
                        </div>
                    </div>

                    <div class="editor-footer">
                        <span class="status-item">JavaScript</span>
                        <span class="status-item">UTF-8</span>
                        <span class="status-item"
                            >Ln {lineNumbers.length}, Col {(typedCode
                                .split("\n")
                                .pop()?.length || 0) + 1}</span
                        >
                    </div>
                </div>

                <!-- Floating Elements -->
                <div class="floating-icon icon-react">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a32.997 32.997 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95z"
                        />
                    </svg>
                </div>
                <div class="floating-icon icon-svelte">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M20.207 4.487c-1.952-2.854-5.873-3.57-8.757-1.603L5.48 7.105a5.62 5.62 0 0 0-2.567 4.058 5.872 5.872 0 0 0 .553 3.193 5.548 5.548 0 0 0-.844 2.138 5.958 5.958 0 0 0 1.02 4.513c1.953 2.854 5.874 3.57 8.758 1.603l5.97-4.22a5.62 5.62 0 0 0 2.566-4.06 5.873 5.873 0 0 0-.553-3.192c.363-.66.585-1.386.645-2.138a5.958 5.958 0 0 0-1.02-4.513zM9.679 19.544a3.573 3.573 0 0 1-3.84-1.563 3.612 3.612 0 0 1-.619-2.738 3.396 3.396 0 0 1 .135-.5l.091-.232.238.164a6.717 6.717 0 0 0 2.032 1.044l.193.057-.018.195a1.087 1.087 0 0 0 .214.756 1.083 1.083 0 0 0 1.166.473 1.015 1.015 0 0 0 .283-.128l5.97-4.22a1.007 1.007 0 0 0 .452-.728 1.095 1.095 0 0 0-.187-.83 1.083 1.083 0 0 0-1.166-.473 1.015 1.015 0 0 0-.283.128l-2.28 1.612a3.348 3.348 0 0 1-.934.42 3.573 3.573 0 0 1-3.84-1.564 3.612 3.612 0 0 1-.619-2.737 3.324 3.324 0 0 1 1.492-2.406l5.97-4.22a3.348 3.348 0 0 1 .934-.42 3.573 3.573 0 0 1 3.84 1.564 3.612 3.612 0 0 1 .619 2.737 3.396 3.396 0 0 1-.135.5l-.091.232-.238-.164a6.717 6.717 0 0 0-2.032-1.044l-.193-.057.018-.195a1.087 1.087 0 0 0-.214-.756 1.083 1.083 0 0 0-1.166-.473 1.015 1.015 0 0 0-.283.128L8.693 9.9a1.007 1.007 0 0 0-.452.728 1.095 1.095 0 0 0 .187.83 1.083 1.083 0 0 0 1.166.473 1.015 1.015 0 0 0 .283-.128l2.28-1.612a3.348 3.348 0 0 1 .934-.42 3.573 3.573 0 0 1 3.84 1.564 3.612 3.612 0 0 1 .619 2.737 3.324 3.324 0 0 1-1.492 2.406l-5.97 4.22a3.348 3.348 0 0 1-.934.42z"
                        />
                    </svg>
                </div>
                <div class="floating-icon icon-code">✨</div>
            </div>
        </div>
    </div>

    <!-- Scroll Indicator (matching the design) -->
    <div class="scroll-indicator">
        <span class="scroll-text">Scroll to explore</span>
        <div class="scroll-arrow">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </div>
    </div>
</section>

<style>
    .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 100px 0 100px;
    }

    .hero-container {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 0 24px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        align-items: center;
        position: relative;
        z-index: 1;
    }

    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 100px;
        font-size: 0.85rem;
        color: #22c55e;
        margin-bottom: 20px;
    }

    .badge-dot {
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
        }
        50% {
            opacity: 0.8;
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
        }
    }

    .hero-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2rem, 4.5vw, 3.2rem);
        font-weight: 700;
        line-height: 1.15;
        margin-bottom: 18px;
    }

    .title-line {
        display: block;
    }

    .title-line.accent {
        color: #a1a1aa;
        font-weight: 500;
    }

    .gradient-text {
        background: linear-gradient(
            135deg,
            #6366f1 0%,
            #a855f7 50%,
            #ec4899 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-subtitle {
        font-size: 1rem;
        color: #a1a1aa;
        line-height: 1.7;
        max-width: 440px;
        margin-bottom: 24px;
    }

    .hero-buttons {
        display: flex;
        gap: 14px;
        margin-bottom: 36px;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 22px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }

    .btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 0 25px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-secondary:hover {
        background: rgba(99, 102, 241, 0.1);
        border-color: rgba(99, 102, 241, 0.3);
    }

    .hero-stats {
        display: flex;
        align-items: center;
        gap: 28px;
    }

    .stat {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .stat-number {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.6rem;
        font-weight: 700;
        background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .stat-label {
        font-size: 0.8rem;
        color: #71717a;
    }

    .stat-divider {
        width: 1px;
        height: 40px;
        background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
    }

    /* Code Editor Illustration */
    .hero-illustration {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .illustration-container {
        position: relative;
        width: 100%;
        max-width: 440px;
    }

    .code-editor {
        background: #0d1117;
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 12px;
        overflow: hidden;
        box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.05),
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(99, 102, 241, 0.1);
    }

    .editor-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 16px;
        background: #161b22;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .window-controls {
        display: flex;
        gap: 8px;
    }

    .control {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .control.close {
        background: #ff5f56;
    }
    .control.minimize {
        background: #ffbd2e;
    }
    .control.maximize {
        background: #27ca40;
    }

    .tabs {
        display: flex;
        gap: 4px;
    }

    .tab {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: #0d1117;
        border-radius: 6px 6px 0 0;
        font-size: 0.8rem;
        color: #8b949e;
    }

    .tab.active {
        color: #c9d1d9;
    }

    .tab svg {
        color: #f7df1e;
    }

    .editor-body {
        display: flex;
        min-height: 200px;
        font-family: "Fira Code", "Consolas", monospace;
        font-size: 0.85rem;
        line-height: 1.6;
    }

    .line-numbers {
        display: flex;
        flex-direction: column;
        padding: 16px 12px;
        background: rgba(0, 0, 0, 0.2);
        color: #484f58;
        text-align: right;
        user-select: none;
        min-width: 40px;
    }

    .line-numbers span {
        height: 1.6em;
    }

    .code-content {
        flex: 1;
        padding: 16px;
        overflow: hidden;
    }

    .code-content pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .code-content :global(.keyword) {
        color: #ff7b72;
    }
    .code-content :global(.variable) {
        color: #79c0ff;
    }
    .code-content :global(.function) {
        color: #d2a8ff;
    }
    .code-content :global(.string) {
        color: #a5d6ff;
    }
    .code-content :global(.operator) {
        color: #ff7b72;
    }
    .code-content :global(.bracket) {
        color: #ffa657;
    }
    .code-content :global(.punctuation) {
        color: #8b949e;
    }

    .cursor {
        color: #6366f1;
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        0%,
        50% {
            opacity: 1;
        }
        51%,
        100% {
            opacity: 0;
        }
    }

    .editor-footer {
        display: flex;
        gap: 16px;
        padding: 8px 16px;
        background: #161b22;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .status-item {
        font-size: 0.75rem;
        color: #8b949e;
    }

    /* Floating Icons */
    .floating-icon {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(22, 27, 34, 0.95);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        animation: float 4s ease-in-out infinite;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .icon-react {
        width: 50px;
        height: 50px;
        top: -15px;
        right: 30px;
        color: #61dafb;
        animation-delay: 0s;
    }

    .icon-react svg {
        width: 28px;
        height: 28px;
    }

    .icon-svelte {
        width: 45px;
        height: 45px;
        bottom: 40px;
        left: -20px;
        color: #ff3e00;
        animation-delay: 1s;
    }

    .icon-svelte svg {
        width: 24px;
        height: 24px;
    }

    .icon-code {
        width: 40px;
        height: 40px;
        top: 50%;
        right: -20px;
        font-size: 1.2rem;
        animation-delay: 2s;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-12px);
        }
    }

    /* Scroll Indicator - matching the design */
    .scroll-indicator {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        z-index: 10;
    }

    .scroll-text {
        font-size: 0.9rem;
        color: #9ca3af;
        letter-spacing: 0.5px;
    }

    .scroll-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
        animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(6px);
        }
    }

    @media (max-width: 968px) {
        .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
        }

        .hero-buttons {
            justify-content: center;
        }

        .hero-stats {
            justify-content: center;
        }

        .hero-illustration {
            order: -1;
            margin-bottom: 20px;
        }

        .illustration-container {
            max-width: 360px;
        }
    }

    @media (max-width: 480px) {
        .hero {
            padding: 80px 0 80px;
        }

        .hero-buttons {
            flex-direction: column;
            align-items: center;
        }

        .hero-stats {
            flex-direction: column;
            gap: 20px;
        }

        .stat-divider {
            width: 50px;
            height: 1px;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
        }

        .hero-illustration {
            display: none;
        }

        .scroll-indicator {
            bottom: 20px;
        }
    }
</style>
