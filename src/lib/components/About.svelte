<script>
    import { onMount, onDestroy } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { language, translations } from "$lib/stores.js";

    // --- Reactive Language ---
    $: currentLang = $language;
    $: t = translations[currentLang];

    // --- Element refs ---
    let section;
    let badgeEl;
    let headlineEl;
    let subTextEl;
    let leftCol;
    let rightCol;
    let profileImg;
    let cardEls = [];
    let strengthItems = [];
    let ctaEl;
    let canvasEl;

    // --- Mouse tilt state ---
    let tiltX = 0;
    let tiltY = 0;
    let isDesktop = true;
    let animCtx;

    // Personality blocks
    const personalities = [
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5"/><path d="M2 10.5V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5.5"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
            title: "UI/UX Thinker",
            titleID: "Pemikir UI/UX",
            desc: "Crafting interfaces that are beautiful and intuitive at the same time.",
            descID: "Membuat antarmuka yang indah dan intuitif sekaligus.",
            color: "#6366f1",
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
            title: "Motion Enthusiast",
            titleID: "Penggemar Motion",
            desc: "Every interaction should feel alive — smooth, purposeful, delightful.",
            descID: "Setiap interaksi harus terasa hidup — mulus, bermakna, menyenangkan.",
            color: "#a855f7",
        },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
            title: "Performance-Oriented",
            titleID: "Berorientasi Performa",
            desc: "Speed and efficiency built into every line of code I write.",
            descID: "Kecepatan dan efisiensi terbangun di setiap baris kode yang saya tulis.",
            color: "#06b6d4",
        },
    ];

    // Key strengths
    const strengths = [
        { en: "Clean & Scalable Code", id: "Kode Bersih & Skalabel" },
        { en: "Interactive UI Animations", id: "Animasi UI Interaktif" },
        { en: "Responsive-first Approach", id: "Pendekatan Responsive-first" },
        {
            en: "Backend Integration Knowledge",
            id: "Pengetahuan Integrasi Backend",
        },
    ];

    // --- Particles canvas ---
    function initParticles(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1,
        }));

        let raf;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            }
            raf = requestAnimationFrame(draw);
        }
        draw();
        animCtx = { cancel: () => cancelAnimationFrame(raf) };
    }

    // --- Mouse tilt ---
    function handleMouseMove(e) {
        if (!isDesktop || !profileImg) return;
        const rect = profileImg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        tiltX = dy * -10;
        tiltY = dx * 10;
        gsap.to(profileImg, {
            rotateX: tiltX,
            rotateY: tiltY,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 800,
        });
    }

    function handleMouseLeave() {
        gsap.to(profileImg, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "power3.out",
        });
    }

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
        isDesktop = window.innerWidth >= 768;

        // Particle canvas
        initParticles(canvasEl);

        // --- Floating image loop ---
        gsap.to(profileImg, {
            y: -12,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // --- Section header stagger reveal ---
        const headerEls = [badgeEl, headlineEl, subTextEl].filter(Boolean);
        gsap.set(headerEls, { y: 30, opacity: 0 });
        gsap.to(headerEls, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 40%",
                scrub: 0.6,
                toggleActions: "play reverse play reverse",
            },
            y: 0,
            opacity: 1,
            stagger: 0.12,
            ease: "power3.out",
        });

        // --- Left column slide in ---
        gsap.set(leftCol, { x: -60, opacity: 0 });
        gsap.to(leftCol, {
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "top 30%",
                scrub: 0.7,
                toggleActions: "play reverse play reverse",
            },
            x: 0,
            opacity: 1,
            ease: "power3.out",
        });

        // --- Right column cards stagger ---
        gsap.set(cardEls, { x: 40, opacity: 0 });
        gsap.to(cardEls, {
            scrollTrigger: {
                trigger: rightCol,
                start: "top 80%",
                end: "top 30%",
                scrub: 0.7,
                toggleActions: "play reverse play reverse",
            },
            x: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "power3.out",
        });

        // --- Strength items stagger ---
        gsap.set(strengthItems, { x: 30, opacity: 0 });
        gsap.to(strengthItems, {
            scrollTrigger: {
                trigger: rightCol,
                start: "top 70%",
                end: "top 20%",
                scrub: 0.6,
                toggleActions: "play reverse play reverse",
            },
            x: 0,
            opacity: 1,
            stagger: 0.08,
            ease: "power3.out",
        });

        // --- CTA reveal ---
        gsap.set(ctaEl, { y: 20, opacity: 0 });
        gsap.to(ctaEl, {
            scrollTrigger: {
                trigger: ctaEl,
                start: "top 90%",
                end: "top 60%",
                scrub: 0.5,
                toggleActions: "play reverse play reverse",
            },
            y: 0,
            opacity: 1,
            ease: "power3.out",
        });
    });

    onDestroy(() => {
        animCtx?.cancel();
        ScrollTrigger.getAll().forEach((st) => st.kill());
    });
</script>

<section id="about" bind:this={section}>
    <!-- Particle background -->
    <canvas bind:this={canvasEl} class="particles-canvas" aria-hidden="true"
    ></canvas>

    <!-- Ambient glow blobs -->
    <div class="glow-blob glow-blob-1" aria-hidden="true"></div>
    <div class="glow-blob glow-blob-2" aria-hidden="true"></div>

    <div class="container">
        <!-- ── Section Header ── -->
        <div class="section-header">
            <span bind:this={badgeEl} class="about-badge">
                <span class="badge-dot"></span>
                {t.about.label}
            </span>

            <h2 bind:this={headlineEl} class="about-headline">
                {currentLang === "EN" ? "Crafting Interactive" : "Membangun"}
                <span class="gradient-text">
                    {currentLang === "EN"
                        ? "Digital Experiences"
                        : "Pengalaman Digital Interaktif"}
                </span>
            </h2>

            <p bind:this={subTextEl} class="about-subtext">
                {currentLang === "EN"
                    ? "Frontend-focused developer with a passion for motion & performance."
                    : "Developer berfokus frontend dengan passion untuk motion & performa."}
            </p>
        </div>

        <!-- ── 2-Column Main Layout ── -->
        <div class="about-grid">
            <!-- ════ LEFT COLUMN ════ -->
            <div bind:this={leftCol} class="left-col">
                <!-- Profile Image with tilt -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    class="profile-wrap"
                    on:mousemove={handleMouseMove}
                    on:mouseleave={handleMouseLeave}
                >
                    <!-- Glow ring behind image -->
                    <div class="img-glow-ring"></div>

                    <!-- Image -->
                    <div
                        bind:this={profileImg}
                        class="profile-img-box"
                        style="will-change: transform;"
                    >
                        <img
                            src="/img/profile.jpg"
                            alt="Zaky — Frontend Developer"
                        />
                        <div class="img-shimmer"></div>
                    </div>

                    <!-- Orbiting dashed ring (CSS animation) -->
                    <div class="orbit-ring"></div>
                </div>

                <!-- Badges below image -->
                <div class="image-badges">
                    <div class="pill-badge">
                        <span class="pill-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><rect
                                    x="2"
                                    y="7"
                                    width="20"
                                    height="14"
                                    rx="2"
                                /><path
                                    d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
                                /></svg
                            >
                        </span>
                        <span>2+ Years Experience</span>
                    </div>
                    <div class="pill-badge">
                        <span class="pill-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><path
                                    d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
                                /><circle cx="12" cy="10" r="3" /></svg
                            >
                        </span>
                        <span>Indonesia</span>
                    </div>
                </div>
            </div>

            <!-- ════ RIGHT COLUMN ════ -->
            <div bind:this={rightCol} class="right-col">
                <!-- Personality Cards -->
                <div class="cards-grid">
                    {#each personalities as p, i}
                        <div
                            bind:this={cardEls[i]}
                            class="personality-card"
                            style="--card-accent: {p.color};"
                        >
                            <div class="card-icon" style="color: {p.color};">
                                {@html p.icon}
                            </div>
                            <h4 class="card-title">
                                {currentLang === "EN" ? p.title : p.titleID}
                            </h4>
                            <p class="card-desc">
                                {currentLang === "EN" ? p.desc : p.descID}
                            </p>
                            <div class="card-glow"></div>
                        </div>
                    {/each}
                </div>

                <!-- Key Strengths -->
                <div class="strengths-block">
                    <h3 class="strengths-title">
                        {currentLang === "EN"
                            ? "Key Strengths"
                            : "Keunggulan Utama"}
                    </h3>
                    <ul class="strengths-list">
                        {#each strengths as s, i}
                            <li
                                bind:this={strengthItems[i]}
                                class="strength-item"
                            >
                                <span class="strength-dot"></span>
                                <span>{currentLang === "EN" ? s.en : s.id}</span
                                >
                            </li>
                        {/each}
                    </ul>
                </div>

                <!-- CTA Buttons -->
                <div bind:this={ctaEl} class="cta-row">
                    <a href="#contact" class="btn btn-primary">
                        {t.about.letsConnect}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            ><path d="M5 12h14M12 5l7 7-7 7" /></svg
                        >
                    </a>
                    <a href="#projects" class="btn btn-outline">
                        {currentLang === "EN"
                            ? "View My Work"
                            : "Lihat Karya Saya"}
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* ─── Section ─── */
    section {
        padding: 120px 0 80px;
        position: relative;
        overflow: hidden;
    }

    /* ─── Particle canvas ─── */
    .particles-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.6;
    }

    /* ─── Ambient glow blobs ─── */
    .glow-blob {
        position: absolute;
        pointer-events: none;
        border-radius: 50%;
        filter: blur(80px);
        z-index: 0;
    }
    .glow-blob-1 {
        width: 400px;
        height: 400px;
        background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.12),
            transparent 70%
        );
        top: -80px;
        left: -100px;
    }
    .glow-blob-2 {
        width: 350px;
        height: 350px;
        background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.1),
            transparent 70%
        );
        bottom: 0;
        right: -80px;
    }

    /* ─── Container ─── */
    .container {
        position: relative;
        z-index: 1;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    /* ─── Section Header ─── */
    .section-header {
        text-align: center;
        margin-bottom: 72px;
    }

    /* Badge */
    .about-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 18px;
        border-radius: 100px;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: #a78bfa;
        background: rgba(99, 102, 241, 0.08);
        border: 1px solid rgba(99, 102, 241, 0.25);
        margin-bottom: 24px;
        transition:
            box-shadow 0.3s ease,
            border-color 0.3s ease;
    }
    .about-badge:hover {
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);
        border-color: rgba(99, 102, 241, 0.5);
    }
    .badge-dot {
        width: 7px;
        height: 7px;
        background: #a855f7;
        border-radius: 50%;
        animation: pulse-dot 2s ease-in-out infinite;
    }
    @keyframes pulse-dot {
        0%,
        100% {
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.5);
        }
        50% {
            box-shadow: 0 0 0 5px rgba(168, 85, 247, 0);
        }
    }

    /* Headline */
    .about-headline {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2rem, 4.5vw, 3.2rem);
        font-weight: 800;
        color: var(--text-primary, #ffffff);
        letter-spacing: -0.02em;
        line-height: 1.15;
        margin-bottom: 16px;
    }

    .gradient-text {
        background: linear-gradient(
            135deg,
            #6366f1 0%,
            #a855f7 50%,
            #06b6d4 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: block;
    }

    /* Subtext */
    .about-subtext {
        font-size: 1.1rem;
        color: var(--text-secondary, #a1a1aa);
        max-width: 520px;
        margin: 0 auto;
        line-height: 1.7;
        opacity: 0.85;
    }

    /* ─── Grid Layout ─── */
    .about-grid {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        gap: 72px;
        align-items: center;
    }

    /* ════ LEFT COLUMN ════ */
    .left-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
    }

    /* Profile Wrap */
    .profile-wrap {
        position: relative;
        width: 100%;
        max-width: 320px;
    }

    /* Glow ring */
    .img-glow-ring {
        position: absolute;
        inset: -20px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.18) 0%,
            rgba(168, 85, 247, 0.1) 50%,
            transparent 75%
        );
        z-index: 0;
        filter: blur(12px);
    }

    /* Orbit ring (CSS rotate animation) */
    .orbit-ring {
        position: absolute;
        inset: -14px;
        border-radius: 50%;
        border: 1.5px dashed rgba(99, 102, 241, 0.3);
        animation: orbit-spin 30s linear infinite;
        z-index: 0;
    }
    @keyframes orbit-spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Profile image box */
    .profile-img-box {
        position: relative;
        z-index: 1;
        aspect-ratio: 1;
        border-radius: 28px;
        border: 2px solid rgba(99, 102, 241, 0.25);
        background: rgba(26, 26, 37, 0.5);
        overflow: hidden;
        box-shadow:
            0 0 0 1px rgba(99, 102, 241, 0.1),
            0 30px 80px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(99, 102, 241, 0.12);
        transition:
            border-color 0.4s ease,
            box-shadow 0.4s ease;
        transform-style: preserve-3d;
    }
    .profile-img-box:hover {
        border-color: rgba(99, 102, 241, 0.5);
        box-shadow:
            0 0 0 1px rgba(99, 102, 241, 0.2),
            0 30px 80px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(99, 102, 241, 0.25);
    }
    .profile-img-box img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        display: block;
    }

    /* Shimmer overlay */
    .img-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            45deg,
            transparent 40%,
            rgba(99, 102, 241, 0.08) 50%,
            transparent 60%
        );
        animation: shimmer-slide 4s ease-in-out infinite;
        pointer-events: none;
    }
    @keyframes shimmer-slide {
        0% {
            transform: translateX(-100%) skewX(-15deg);
        }
        100% {
            transform: translateX(200%) skewX(-15deg);
        }
    }

    /* Pill badges */
    .image-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
    }

    .pill-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        background: rgba(26, 26, 37, 0.75);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 100px;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-secondary, #a1a1aa);
        transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
    }
    .pill-badge:hover {
        border-color: rgba(99, 102, 241, 0.5);
        box-shadow: 0 0 16px rgba(99, 102, 241, 0.2);
        color: var(--text-primary, #fff);
    }
    .pill-icon {
        display: flex;
        align-items: center;
        color: #6366f1;
    }

    /* ════ RIGHT COLUMN ════ */
    .right-col {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    /* ── Personality Cards ── */
    .cards-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
    }

    .personality-card {
        position: relative;
        overflow: hidden;
        background: rgba(18, 18, 26, 0.6);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 18px;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        cursor: default;
    }
    .personality-card:hover {
        transform: translateY(-6px);
        border-color: rgba(var(--card-accent, 99, 102, 241), 0.4);
        box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.3),
            0 0 30px color-mix(in srgb, var(--card-accent) 20%, transparent);
    }
    .card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--card-accent) 12%, transparent);
        flex-shrink: 0;
    }
    .card-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.92rem;
        font-weight: 700;
        color: var(--text-primary, #fff);
        line-height: 1.3;
    }
    .card-desc {
        font-size: 0.78rem;
        color: var(--text-secondary, #a1a1aa);
        line-height: 1.6;
        margin: 0;
    }
    .card-glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: radial-gradient(
            circle at 50% 0%,
            color-mix(in srgb, var(--card-accent) 8%, transparent),
            transparent 60%
        );
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .personality-card:hover .card-glow {
        opacity: 1;
    }

    /* ── Key Strengths ── */
    .strengths-block {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .strengths-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-primary, #fff);
        letter-spacing: 0.01em;
    }
    .strengths-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .strength-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.95rem;
        color: var(--text-secondary, #a1a1aa);
        transition: color 0.2s ease;
    }
    .strength-item:hover {
        color: var(--text-primary, #fff);
    }
    .strength-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        flex-shrink: 0;
        box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
    }

    /* ── CTA Buttons ── */
    .cta-row {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 13px 26px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        font-family: var(--font-primary, "Inter", sans-serif);
    }

    .btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 0 28px rgba(99, 102, 241, 0.35);
    }
    .btn-primary:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 0 48px rgba(99, 102, 241, 0.55);
    }

    .btn-outline {
        background: transparent;
        color: var(--text-primary, #fff);
        border: 1px solid rgba(255, 255, 255, 0.12);
        position: relative;
        overflow: hidden;
    }
    .btn-outline::before {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(99, 102, 241, 0.1);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
    }
    .btn-outline:hover::before {
        transform: scaleX(1);
    }
    .btn-outline:hover {
        border-color: rgba(99, 102, 241, 0.4);
    }

    /* ─── Responsive ─── */
    @media (max-width: 1024px) {
        .cards-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
    }

    @media (max-width: 900px) {
        .about-grid {
            grid-template-columns: 1fr;
            gap: 56px;
        }
        .left-col {
            order: -1;
        }
        .section-header {
            margin-bottom: 48px;
        }
    }

    @media (max-width: 768px) {
        section {
            padding: 80px 0 64px;
        }
        .about-headline {
            font-size: clamp(1.75rem, 5vw, 2.6rem);
        }
        .cards-grid {
            grid-template-columns: 1fr;
        }
        .profile-wrap {
            max-width: 260px;
        }
        .cta-row {
            flex-direction: column;
        }
        .btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        section {
            padding: 64px 0 48px;
        }
        .container {
            padding: 0 16px;
        }
        .cards-grid {
            gap: 10px;
        }
        .cta-row {
            align-items: center;
        }
    }
</style>
