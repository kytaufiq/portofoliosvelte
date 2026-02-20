<script>
    import { onMount, onDestroy } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    // ─── Refs ────────────────────────────────────────────────────────────────
    let section;
    let header;
    let svgPath;
    let svgGlowPath;
    let progressBar;
    let progressLabel;
    let cardEls = [];
    let nodeEls = [];
    let connectorEls = [];
    let badgeEls = [];

    // ─── Data ────────────────────────────────────────────────────────────────
    const experiences = [
        {
            id: 1,
            step: "01",
            level: "Intern",
            role: "Web Development Intern",
            company: "Software House DEF",
            period: "2019 – 2020",
            type: "Internship",
            description:
                "Started my professional journey learning web development fundamentals and contributing to real-world client projects under senior developer guidance.",
            highlights: [
                "Built 3 internal tools",
                "Team collaboration & code reviews",
                "Agile sprint participation",
            ],
            technologies: ["HTML", "CSS", "JavaScript", "PHP"],
            effect: null,
            side: "left",
        },
        {
            id: 2,
            step: "02",
            level: "Mid-Level",
            role: "Frontend Developer",
            company: "Freelance",
            period: "2020 – 2021",
            type: "Contract",
            description:
                "Worked with multiple startups and businesses to design and build modern, responsive web applications and landing pages that convert.",
            highlights: [
                "15+ clients served",
                "Portfolio & e-commerce builds",
                "Avg. 4.9★ client rating",
            ],
            technologies: ["JavaScript", "React", "SCSS", "Firebase"],
            effect: "ladder",
            effectLabel: "Career Jump — Intern → Frontend",
            side: "right",
        },
        {
            id: 3,
            step: "03",
            level: "Full Stack",
            role: "Full Stack Developer",
            company: "Digital Agency ABC",
            period: "2021 – 2023",
            type: "Full-time",
            description:
                "Built and maintained scalable web applications for clients across e-commerce, healthcare, and fintech — owning the full product lifecycle.",
            highlights: [
                "20+ projects delivered",
                "98% client satisfaction",
                "Reduced load times by 40%",
            ],
            technologies: ["Vue.js", "Node.js", "PostgreSQL", "AWS"],
            effect: "pivot",
            effectLabel: "Tech Pivot — React → Vue + Node.js",
            side: "left",
        },
        {
            id: 4,
            step: "04",
            level: "Senior",
            role: "Senior Frontend Developer",
            company: "Tech Startup XYZ",
            period: "2023 – Present",
            type: "Full-time",
            description:
                "Leading frontend architecture for a SaaS platform with 10K+ active users. Building design systems, optimizing performance, and mentoring junior engineers.",
            highlights: [
                "Led React → Next.js migration",
                "50% performance improvement",
                "Mentored 3 junior devs",
            ],
            technologies: ["React", "TypeScript", "GraphQL", "Tailwind"],
            effect: "ladder",
            effectLabel: "Career Jump — Full Stack → Senior Lead",
            side: "right",
        },
    ];

    // The SVG snake path definition — shared by main path and glow copy
    const snakePath = `
        M 100 30
        C 25 30, 25 200, 100 300
        C 175 400, 175 560, 100 660
        C 25 760, 25 920, 100 1020
        C 175 1120, 175 1250, 100 1320
    `.trim();

    // ─── onMount ─────────────────────────────────────────────────────────────
    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        // ── 1. Header reveal ────────────────────────────────────────────────
        gsap.fromTo(
            header,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 45%",
                    scrub: 0.8,
                },
            },
        );

        // ── 2. SVG path draw ─────────────────────────────────────────────────
        if (svgPath) {
            const len = svgPath.getTotalLength();
            gsap.set([svgPath, svgGlowPath], {
                strokeDasharray: len,
                strokeDashoffset: len,
            });
            gsap.to([svgPath, svgGlowPath], {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top 65%",
                    end: "bottom 15%",
                    scrub: 1.2,
                },
            });
        }

        // ── 3. Progress sidebar ──────────────────────────────────────────────
        ScrollTrigger.create({
            trigger: section,
            start: "top 65%",
            end: "bottom 15%",
            scrub: true,
            onUpdate: (self) => {
                const pct = Math.round(self.progress * 100);
                if (progressBar) progressBar.style.height = pct + "%";
                if (progressLabel) progressLabel.textContent = pct + "%";
            },
        });

        // ── 4. Cards, nodes & connectors ─────────────────────────────────────
        experiences.forEach((exp, i) => {
            const card = cardEls[i];
            const node = nodeEls[i];
            const connector = connectorEls[i];
            if (!card || !node) return;

            const isLeft = exp.side === "left";

            // Set initial states
            gsap.set(card, {
                x: isLeft ? -100 : 100,
                opacity: 0,
                rotateY: isLeft ? -10 : 10,
            });
            gsap.set(node, { scale: 0, opacity: 0 });
            if (connector) {
                gsap.set(connector, {
                    scaleX: 0,
                    opacity: 0,
                    transformOrigin: isLeft ? "right center" : "left center",
                });
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "top 50%",
                    scrub: 0.9,
                    toggleActions: "play reverse play reverse",
                },
            });

            // Node pops in first
            tl.to(
                node,
                {
                    scale: 1.15,
                    opacity: 1,
                    ease: "back.out(2.5)",
                    duration: 0.3,
                },
                0,
            ).to(node, { scale: 1, duration: 0.15 }, 0.3);

            // Connector draws toward card
            if (connector) {
                tl.to(
                    connector,
                    {
                        scaleX: 1,
                        opacity: 1,
                        ease: "power2.out",
                        duration: 0.25,
                    },
                    0.1,
                );
            }

            // Card slides in with subtle 3D tilt
            tl.to(
                card,
                {
                    x: 0,
                    opacity: 1,
                    rotateY: 0,
                    ease: "power3.out",
                    duration: 0.55,
                },
                0.15,
            );
        });

        // ── 5. Effect badges animate in ──────────────────────────────────────
        badgeEls.forEach((badge) => {
            if (!badge) return;
            gsap.fromTo(
                badge,
                { scaleY: 0, opacity: 0, transformOrigin: "top center" },
                {
                    scaleY: 1,
                    opacity: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: badge,
                        start: "top 85%",
                        end: "top 60%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse",
                    },
                },
            );
        });

        // ── 6. Parallax grid ─────────────────────────────────────────────────
        const grid = section?.querySelector(".bg-grid");
        if (grid) {
            gsap.to(grid, {
                y: -90,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }
    });

    onDestroy(() => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
    });

    // ─── Hover helpers ────────────────────────────────────────────────────────
    function onCardEnter(i) {
        const node = nodeEls[i];
        const connector = connectorEls[i];
        if (node) {
            gsap.to(node, { scale: 1.22, duration: 0.25, ease: "back.out(2)" });
        }
        if (connector) {
            gsap.to(connector, { opacity: 1, duration: 0.2 });
        }
    }

    function onCardLeave(i) {
        const node = nodeEls[i];
        const connector = connectorEls[i];
        if (node) {
            gsap.to(node, { scale: 1, duration: 0.22 });
        }
        if (connector) {
            gsap.to(connector, { opacity: 0.55, duration: 0.2 });
        }
    }
</script>

<section id="experience" bind:this={section}>
    <!-- Parallax grid background -->
    <div class="bg-grid"></div>

    <!-- Ambient orbs -->
    <div class="orb orb-1" aria-hidden="true"></div>
    <div class="orb orb-2" aria-hidden="true"></div>

    <!-- Progress indicator (fixed right) -->
    <div class="progress-sidebar" aria-hidden="true">
        <div class="progress-track">
            <div class="progress-fill" bind:this={progressBar}></div>
        </div>
        <div class="progress-info">
            <span class="progress-pct" bind:this={progressLabel}>0%</span>
            <span class="progress-text">Journey</span>
        </div>
    </div>

    <div class="container">
        <!-- Section Header -->
        <div bind:this={header} class="section-header">
            <div class="section-label">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    aria-hidden="true"
                >
                    <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3" />
                </svg>
                Career Path
            </div>
            <h2 class="section-title">
                Work <span class="gradient-text">Experience</span>
            </h2>
            <p class="section-subtitle">
                A winding journey through the world of web development
            </p>
        </div>

        <!-- Snake Layout -->
        <div class="snake-layout">
            <!-- ─── SVG Snake Path ─────────────────────────────────────── -->
            <svg
                class="snake-svg"
                viewBox="0 0 200 1350"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="pathGrad"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#6366f1" />
                        <stop offset="40%" stop-color="#a855f7" />
                        <stop offset="75%" stop-color="#ec4899" />
                        <stop offset="100%" stop-color="#f43f5e" />
                    </linearGradient>
                    <filter
                        id="glowFilter"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <!-- Glow layer -->
                <path
                    bind:this={svgGlowPath}
                    d={snakePath}
                    fill="none"
                    stroke="url(#pathGrad)"
                    stroke-width="6"
                    stroke-linecap="round"
                    opacity="0.25"
                    filter="url(#glowFilter)"
                />
                <!-- Main path -->
                <path
                    bind:this={svgPath}
                    d={snakePath}
                    fill="none"
                    stroke="url(#pathGrad)"
                    stroke-width="3"
                    stroke-linecap="round"
                />
            </svg>

            <!-- ─── Experience Items ────────────────────────────────────── -->
            {#each experiences as exp, i}
                <!-- ── Row ────────────────────────────────────────────────── -->
                <div class="exp-row {exp.side}">
                    <!-- ── Effect badge (sits at top of row = between rows) ── -->
                    {#if exp.effect === "ladder"}
                        <div
                            class="effect-badge ladder"
                            bind:this={badgeEls[i]}
                            title={exp.effectLabel}
                        >
                            <div class="effect-line"></div>
                            <div class="effect-icon">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </div>
                            <div class="effect-tooltip">{exp.effectLabel}</div>
                        </div>
                    {:else if exp.effect === "pivot"}
                        <div
                            class="effect-badge pivot"
                            bind:this={badgeEls[i]}
                            title={exp.effectLabel}
                        >
                            <div class="effect-curve">
                                <svg
                                    viewBox="0 0 60 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 35 C 10 10, 50 30, 55 5"
                                        stroke="url(#pivotGrad)"
                                        stroke-width="2"
                                        stroke-dasharray="4 3"
                                        stroke-linecap="round"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="pivotGrad"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop
                                                offset="0%"
                                                stop-color="#a855f7"
                                            />
                                            <stop
                                                offset="100%"
                                                stop-color="#ec4899"
                                            />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div class="effect-icon pivot-icon">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path d="M17 1l4 4-4 4" />
                                    <path d="M3 11V9a4 4 0 014-4h14" />
                                    <path d="M7 23l-4-4 4-4" />
                                    <path d="M21 13v2a4 4 0 01-4 4H3" />
                                </svg>
                            </div>
                            <div class="effect-tooltip">{exp.effectLabel}</div>
                        </div>
                    {:else}
                        <div
                            bind:this={badgeEls[i]}
                            class="effect-spacer"
                        ></div>
                    {/if}
                    <!-- Node -->
                    <div class="node-area">
                        <div class="node-wrap" bind:this={nodeEls[i]}>
                            <div class="node-glow"></div>
                            <div class="node-ring">
                                <div class="node-inner">
                                    <span class="step-num">{exp.step}</span>
                                </div>
                            </div>
                            <div class="level-badge">{exp.level}</div>
                        </div>
                    </div>

                    <!-- Connector line -->
                    <div
                        class="connector {exp.side}"
                        bind:this={connectorEls[i]}
                    ></div>

                    <!-- Experience Card -->
                    <article
                        class="exp-card"
                        bind:this={cardEls[i]}
                        on:mouseenter={() => onCardEnter(i)}
                        on:mouseleave={() => onCardLeave(i)}
                    >
                        <!-- Faded step number in background -->
                        <div class="bg-step-num" aria-hidden="true">
                            {exp.step}
                        </div>

                        <!-- Card header -->
                        <div class="card-top">
                            <div class="card-meta">
                                <h3 class="role">{exp.role}</h3>
                                <p class="company">@ {exp.company}</p>
                            </div>
                            <div class="card-side">
                                <span class="period">{exp.period}</span>
                                <span class="type-badge">{exp.type}</span>
                            </div>
                        </div>

                        <!-- Description -->
                        <p class="description">{exp.description}</p>

                        <!-- Highlights -->
                        <ul class="highlights">
                            {#each exp.highlights as hl}
                                <li class="highlight">
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2.5"
                                        aria-hidden="true"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {hl}
                                </li>
                            {/each}
                        </ul>

                        <!-- Tech stack -->
                        <div class="tech-tags">
                            {#each exp.technologies as tech}
                                <span class="tech-tag">{tech}</span>
                            {/each}
                        </div>

                        <!-- Hover border gradient overlay -->
                        <div class="card-border-glow" aria-hidden="true"></div>
                    </article>
                </div>
            {/each}
        </div>
        <!-- /snake-layout -->
    </div>
    <!-- /container -->
</section>

<style>
    /* ─────────────────────────────────────────────────────────────────────────
       BASE
    ───────────────────────────────────────────────────────────────────────── */
    section {
        padding: 130px 0 180px;
        position: relative;
        overflow: hidden;
    }

    /* ─────────────────────────────────────────────────────────────────────────
       BACKGROUND
    ───────────────────────────────────────────────────────────────────────── */
    .bg-grid {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                rgba(99, 102, 241, 0.035) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(99, 102, 241, 0.035) 1px,
                transparent 1px
            );
        background-size: 56px 56px;
        pointer-events: none;
        will-change: transform;
    }

    .orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(90px);
    }

    .orb-1 {
        width: 500px;
        height: 500px;
        background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.12),
            transparent 70%
        );
        top: 5%;
        left: -10%;
    }

    .orb-2 {
        width: 400px;
        height: 400px;
        background: radial-gradient(
            circle,
            rgba(236, 72, 153, 0.09),
            transparent 70%
        );
        bottom: 10%;
        right: -8%;
    }

    /* ─────────────────────────────────────────────────────────────────────────
       PROGRESS SIDEBAR
    ───────────────────────────────────────────────────────────────────────── */
    .progress-sidebar {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        z-index: 50;
        pointer-events: none;
    }

    .progress-track {
        width: 3px;
        height: 130px;
        background: rgba(99, 102, 241, 0.12);
        border-radius: 100px;
        position: relative;
        overflow: hidden;
    }

    .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 0%;
        background: linear-gradient(180deg, #6366f1, #a855f7, #ec4899);
        border-radius: 100px;
        box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
    }

    .progress-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
    }

    .progress-pct {
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.72rem;
        font-weight: 700;
        color: #a855f7;
    }

    .progress-text {
        font-size: 0.58rem;
        color: #52525b;
        writing-mode: vertical-rl;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    /* ─────────────────────────────────────────────────────────────────────────
       CONTAINER
    ───────────────────────────────────────────────────────────────────────── */
    .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 24px;
        position: relative;
        z-index: 1;
    }

    /* ─────────────────────────────────────────────────────────────────────────
       HEADER
    ───────────────────────────────────────────────────────────────────────── */
    .section-header {
        text-align: center;
        margin-bottom: 90px;
    }

    .section-label {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 20px;
        background: rgba(99, 102, 241, 0.08);
        border: 1px solid rgba(99, 102, 241, 0.22);
        border-radius: 100px;
        font-size: 0.82rem;
        font-weight: 600;
        color: #818cf8;
        margin-bottom: 20px;
        letter-spacing: 0.04em;
    }

    .section-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2.2rem, 5.5vw, 3.4rem);
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 16px;
        line-height: 1.1;
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

    .section-subtitle {
        font-size: 1.05rem;
        color: #a1a1aa;
        max-width: 460px;
        margin: 0 auto;
        line-height: 1.6;
    }

    /* ─────────────────────────────────────────────────────────────────────────
       SNAKE LAYOUT
    ───────────────────────────────────────────────────────────────────────── */
    .snake-layout {
        position: relative;
        min-height: 1350px;
    }

    /* ─── SVG path ─── */
    .snake-svg {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 180px;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    }

    /* ─── Effect spacer ─── */
    .effect-spacer {
        height: 0;
        margin: 0;
    }

    /* ─────────────────────────────────────────────────────────────────────────
       EFFECT BADGES (Ladder / Pivot)
       Badges are inside .exp-row and anchored to the top-center,
       so they appear "between" the previous row and this one.
    ───────────────────────────────────────────────────────────────────────── */
    .effect-badge {
        position: absolute;
        top: -44px; /* floats above the row, sits in gap between rows */
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 8;
        cursor: default;
    }

    .effect-spacer {
        display: none;
    }

    .effect-line {
        width: 2px;
        height: 32px;
        background: linear-gradient(180deg, #6366f1, #a855f7);
        border-radius: 1px;
        opacity: 0.7;
    }

    .effect-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.15);
        border: 1px solid rgba(99, 102, 241, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #818cf8;
        backdrop-filter: blur(8px);
        box-shadow: 0 0 14px rgba(99, 102, 241, 0.25);
    }

    .effect-curve {
        width: 60px;
        height: 40px;
        margin-bottom: 4px;
        opacity: 0.7;
        pointer-events: none;
    }

    .pivot-icon {
        background: rgba(168, 85, 247, 0.15);
        border-color: rgba(168, 85, 247, 0.35);
        color: #c084fc;
        box-shadow: 0 0 14px rgba(168, 85, 247, 0.25);
    }

    .effect-tooltip {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 10, 20, 0.92);
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 8px;
        padding: 5px 13px;
        font-size: 0.7rem;
        font-weight: 500;
        color: #c084fc;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 20;
    }

    .effect-badge:hover .effect-tooltip {
        opacity: 1;
    }

    /* ─────────────────────────────────────────────────────────────────────────
       EXP ROW
    ───────────────────────────────────────────────────────────────────────── */
    .exp-row {
        position: relative;
        display: flex;
        align-items: center;
        height: 300px;
        z-index: 1;
        /* Extra top margin gives room for the effect badge to float above */
        margin-top: 20px;
    }

    .exp-row:first-of-type {
        margin-top: 0;
    }

    .exp-row.left {
        flex-direction: row-reverse;
        justify-content: flex-end; /*  card on the LEFT   */
    }

    .exp-row.right {
        flex-direction: row;
        justify-content: flex-end; /*  card on the RIGHT  */
    }

    /* ─────────────────────────────────────────────────────────────────────────
       NODE
    ───────────────────────────────────────────────────────────────────────── */
    .node-area {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
    }

    .node-wrap {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        will-change: transform;
    }

    .node-glow {
        position: absolute;
        inset: -14px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.45) 0%,
            transparent 70%
        );
        animation: pulseGlow 2.8s ease-in-out infinite;
        pointer-events: none;
    }

    @keyframes pulseGlow {
        0%,
        100% {
            opacity: 0.5;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.45);
        }
    }

    .node-ring {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: conic-gradient(#6366f1, #a855f7, #ec4899, #6366f1);
        padding: 2.5px;
        box-shadow:
            0 0 0 1px rgba(99, 102, 241, 0.2),
            0 0 22px rgba(168, 85, 247, 0.55),
            0 0 45px rgba(99, 102, 241, 0.2);
        position: relative;
        z-index: 1;
        animation: spinRing 10s linear infinite;
    }

    @keyframes spinRing {
        to {
            filter: hue-rotate(360deg);
        }
    }

    .node-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #0d0d18;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .step-num {
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.82rem;
        font-weight: 800;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 0.02em;
    }

    .level-badge {
        background: rgba(168, 85, 247, 0.12);
        border: 1px solid rgba(168, 85, 247, 0.28);
        border-radius: 20px;
        padding: 3px 11px;
        font-size: 0.64rem;
        font-weight: 700;
        color: #c084fc;
        white-space: nowrap;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        backdrop-filter: blur(8px);
    }

    /* ─────────────────────────────────────────────────────────────────────────
       CONNECTOR
    ───────────────────────────────────────────────────────────────────────── */
    .connector {
        position: absolute;
        top: 50%;
        height: 1.5px;
        width: 105px;
        transform: translateY(-50%);
        z-index: 2;
        will-change: transform;
    }

    .connector.left {
        right: calc(50% + 28px);
        background: linear-gradient(
            90deg,
            rgba(168, 85, 247, 0.55),
            transparent
        );
        transform-origin: right center;
        transform: translateY(-50%) scaleX(1);
    }

    .connector.right {
        left: calc(50% + 28px);
        background: linear-gradient(
            90deg,
            transparent,
            rgba(168, 85, 247, 0.55)
        );
        transform-origin: left center;
        transform: translateY(-50%) scaleX(1);
    }

    /* ─────────────────────────────────────────────────────────────────────────
       CARD
    ───────────────────────────────────────────────────────────────────────── */
    .exp-card {
        position: relative;
        width: calc(50% - 118px);
        background: rgba(15, 15, 28, 0.72);
        border: 1px solid rgba(255, 255, 255, 0.065);
        border-radius: 22px;
        padding: 26px 28px 24px;
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        overflow: hidden;
        cursor: default;
        transition:
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            transform 0.35s ease;
        transform-style: preserve-3d;
        will-change: transform, opacity;
        box-shadow:
            0 4px 32px rgba(0, 0, 0, 0.45),
            0 1px 0 rgba(255, 255, 255, 0.04) inset;
    }

    .exp-row.left .exp-card {
        margin-right: auto;
    }

    .exp-row.right .exp-card {
        margin-left: auto;
    }

    .exp-card:hover {
        border-color: rgba(168, 85, 247, 0.38);
        box-shadow:
            0 8px 48px rgba(168, 85, 247, 0.22),
            0 0 0 1px rgba(168, 85, 247, 0.12),
            0 1px 0 rgba(255, 255, 255, 0.07) inset;
        transform: translateY(-5px) !important;
    }

    /* Gradient border glow overlay */
    .card-border-glow {
        position: absolute;
        inset: 0;
        border-radius: 22px;
        background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.05) 0%,
            transparent 50%,
            rgba(168, 85, 247, 0.05) 100%
        );
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.35s ease;
    }

    .exp-card:hover .card-border-glow {
        opacity: 1;
    }

    /* ── Background step number ── */
    .bg-step-num {
        position: absolute;
        top: -14px;
        right: 8px;
        font-family: "Space Grotesk", sans-serif;
        font-size: 6rem;
        font-weight: 900;
        color: rgba(99, 102, 241, 0.055);
        line-height: 1;
        pointer-events: none;
        user-select: none;
        letter-spacing: -0.06em;
    }

    /* ── Card header ── */
    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 14px;
        flex-wrap: wrap;
    }

    .role {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.12rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 4px;
        line-height: 1.25;
    }

    .company {
        font-size: 0.88rem;
        color: #818cf8;
        font-weight: 500;
    }

    .card-side {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 5px;
        flex-shrink: 0;
    }

    .period {
        font-size: 0.78rem;
        color: #71717a;
        font-weight: 400;
    }

    .type-badge {
        padding: 3px 11px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 100px;
        font-size: 0.68rem;
        color: #818cf8;
        font-weight: 600;
        letter-spacing: 0.03em;
    }

    /* ── Description ── */
    .description {
        font-size: 0.875rem;
        color: #a1a1aa;
        line-height: 1.7;
        margin-bottom: 16px;
    }

    /* ── Highlights ── */
    .highlights {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin-bottom: 16px;
        padding: 0;
    }

    .highlight {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.79rem;
        font-weight: 500;
        color: #4ade80;
    }

    .highlight svg {
        flex-shrink: 0;
        color: #4ade80;
    }

    /* ── Tech tags ── */
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .tech-tag {
        padding: 4px 12px;
        background: rgba(255, 255, 255, 0.045);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 100px;
        font-size: 0.72rem;
        font-weight: 500;
        color: #71717a;
        transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
    }

    .exp-card:hover .tech-tag {
        color: #a1a1aa;
        border-color: rgba(168, 85, 247, 0.2);
        background: rgba(168, 85, 247, 0.06);
    }

    /* ─────────────────────────────────────────────────────────────────────────
       RESPONSIVE — TABLET (max-width: 900px)
    ───────────────────────────────────────────────────────────────────────── */
    @media (max-width: 900px) {
        .exp-card {
            width: calc(50% - 100px);
        }
        .connector {
            width: 82px;
        }
        .connector.left {
            right: calc(50% + 24px);
        }
        .connector.right {
            left: calc(50% + 24px);
        }
    }

    /* ─────────────────────────────────────────────────────────────────────────
       RESPONSIVE — MOBILE (max-width: 768px)
    ───────────────────────────────────────────────────────────────────────── */
    @media (max-width: 768px) {
        section {
            padding: 80px 0 120px;
        }

        .progress-sidebar {
            display: none;
        }

        .orb-1,
        .orb-2 {
            display: none;
        }

        /* Simplified left-side vertical line */
        .snake-layout {
            min-height: auto;
            padding-left: 60px;
        }

        .snake-svg {
            left: 28px;
            transform: none;
            width: 56px;
        }

        /* All rows stack vertically, full-width */
        .exp-row,
        .exp-row.left,
        .exp-row.right {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            height: auto;
            margin-bottom: 52px;
        }

        /* Node sits above the card on the left rail */
        .node-area {
            position: absolute;
            left: -28px; /* align to the line center */
            top: 0;
            transform: translateX(-50%);
        }

        /* Hide horizontal connector on mobile */
        .connector {
            display: none;
        }

        /* Cards take full remaining width */
        .exp-card {
            width: 100% !important;
            margin: 54px 0 0 0 !important;
        }

        /* Effect badges center above the node area */
        .effect-badge {
            left: -28px;
            transform: translateX(-50%);
            top: -48px;
        }

        .effect-spacer {
            display: none;
        }

        .bg-step-num {
            font-size: 4rem;
        }
    }

    @media (max-width: 480px) {
        .snake-layout {
            padding-left: 50px;
        }

        .snake-svg {
            left: 22px;
            width: 44px;
        }

        .node-area {
            left: -22px;
        }

        .node-ring {
            width: 42px;
            height: 42px;
        }

        .exp-card {
            padding: 20px 18px;
            border-radius: 16px;
        }

        .role {
            font-size: 1rem;
        }

        .card-top {
            flex-direction: column;
            gap: 8px;
        }

        .card-side {
            flex-direction: row;
            align-items: center;
            gap: 8px;
        }

        .section-header {
            margin-bottom: 60px;
        }
    }
</style>
