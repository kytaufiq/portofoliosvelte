<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { language, translations } from "$lib/stores.js";

    let section;
    let content;
    let imageWrapper;

    $: currentLang = $language;
    $: t = translations[currentLang];

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Create smooth in/out animation for content
        gsap.set(content, { x: -80, opacity: 0 });
        gsap.set(imageWrapper, { x: 80, opacity: 0 });

        // Animate content from left with smooth scrub
        gsap.to(content, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 20%",
                scrub: 0.8,
                toggleActions: "play reverse play reverse",
            },
            x: 0,
            opacity: 1,
            ease: "power2.out",
        });

        // Animate image from right with smooth scrub
        gsap.to(imageWrapper, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 20%",
                scrub: 0.8,
                toggleActions: "play reverse play reverse",
            },
            x: 0,
            opacity: 1,
            ease: "power2.out",
        });

        // Optional: Add exit animation when leaving section
        ScrollTrigger.create({
            trigger: section,
            start: "bottom 40%",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.to([content, imageWrapper], {
                    opacity: 1 - progress * 0.6,
                    y: -progress * 30,
                    duration: 0.1,
                    ease: "none",
                });
            },
        });
    });
</script>

<section id="about" bind:this={section}>
    <div class="container">
        <div class="about-layout">
            <!-- Profile Image Side -->
            <div bind:this={imageWrapper} class="about-image">
                <div class="image-container">
                    <div class="profile-placeholder">
                        <img src="/img/profile.jpg" alt="Profile" />
                    </div>
                    <div class="image-decoration"></div>
                </div>

                <!-- Quick Info Cards -->
                <div class="quick-info">
                    <div class="info-badge">
                        <span class="badge-icon">📍</span>
                        <span>Indonesia</span>
                    </div>
                    <div class="info-badge">
                        <span class="badge-icon">💼</span>
                        <span>3+ Years</span>
                    </div>
                </div>
            </div>

            <!-- Content Side -->
            <div bind:this={content} class="about-content">
                <span class="section-label">{t.about.label}</span>

                <h2 class="about-title">
                    {currentLang === "EN" ? "Hello! I'm" : "Halo! Saya"}
                    <span class="gradient-text">Zaky</span>
                </h2>

                <p class="about-tagline">
                    {currentLang === "EN"
                        ? "A passionate Web Developer & Designer based in Indonesia"
                        : "Web Developer & Desainer yang passionate, berbasis di Indonesia"}
                </p>

                <div class="about-description">
                    <p>
                        {currentLang === "EN"
                            ? "I specialize in creating modern, responsive, and user-friendly web applications. With a strong foundation in both frontend and backend technologies, I bring ideas to life through clean code and thoughtful design."
                            : "Saya mengkhususkan diri dalam membuat aplikasi web modern, responsif, dan user-friendly. Dengan fondasi kuat di teknologi frontend dan backend, saya mewujudkan ide melalui kode yang bersih dan desain yang thoughtful."}
                    </p>
                    <p>
                        {currentLang === "EN"
                            ? "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge through my blog."
                            : "Saat tidak sedang coding, Anda bisa menemukan saya mengeksplorasi teknologi baru, berkontribusi ke proyek open-source, atau berbagi pengetahuan melalui blog saya."}
                    </p>
                </div>

                <!-- What I Do -->
                <div class="what-i-do">
                    <h3>
                        {currentLang === "EN"
                            ? "What I Do"
                            : "Yang Saya Kerjakan"}
                    </h3>
                    <div class="services-grid">
                        <div class="service-item">
                            <span class="service-icon">🎨</span>
                            <div class="service-info">
                                <h4>UI/UX Design</h4>
                                <p>
                                    {currentLang === "EN"
                                        ? "Creating beautiful interfaces"
                                        : "Membuat antarmuka yang indah"}
                                </p>
                            </div>
                        </div>
                        <div class="service-item">
                            <span class="service-icon">💻</span>
                            <div class="service-info">
                                <h4>Web Development</h4>
                                <p>
                                    {currentLang === "EN"
                                        ? "Building modern web apps"
                                        : "Membangun aplikasi web modern"}
                                </p>
                            </div>
                        </div>
                        <div class="service-item">
                            <span class="service-icon">📱</span>
                            <div class="service-info">
                                <h4>Responsive Design</h4>
                                <p>
                                    {currentLang === "EN"
                                        ? "Mobile-first approach"
                                        : "Pendekatan mobile-first"}
                                </p>
                            </div>
                        </div>
                        <div class="service-item">
                            <span class="service-icon">⚡</span>
                            <div class="service-info">
                                <h4>Performance</h4>
                                <p>
                                    {currentLang === "EN"
                                        ? "Fast & optimized code"
                                        : "Kode cepat & teroptimasi"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CTA Button -->
                <div class="about-cta">
                    <a href="#contact" class="btn btn-primary">
                        {t.about.letsConnect}
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                    <a href="#projects" class="btn btn-secondary">
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
    section {
        padding: 120px 0 60px;
        position: relative;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .about-layout {
        display: grid;
        grid-template-columns: 1fr 1.3fr;
        gap: 80px;
        align-items: center;
    }

    /* Image Side */
    .about-image {
        position: relative;
    }

    .image-container {
        position: relative;
        width: 100%;
        max-width: 350px;
        margin: 0 auto;
    }

    .profile-placeholder {
        aspect-ratio: 1;
        background: linear-gradient(
            145deg,
            rgba(99, 102, 241, 0.1),
            rgba(139, 92, 246, 0.05)
        );
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .profile-placeholder img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        border-radius: 24px;
    }

    .profile-placeholder::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            45deg,
            transparent 40%,
            rgba(99, 102, 241, 0.1) 50%,
            transparent 60%
        );
        animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    .avatar-emoji {
        font-size: 8rem;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
    }

    .image-decoration {
        position: absolute;
        inset: -10px;
        border: 2px dashed rgba(99, 102, 241, 0.2);
        border-radius: 32px;
        animation: rotate 30s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .quick-info {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 24px;
    }

    .info-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        background: var(--bg-card, rgba(26, 26, 37, 0.6));
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
        border-radius: 100px;
        font-size: 0.9rem;
        color: var(--text-secondary, #a1a1aa);
    }

    /* Content Side */
    .about-content {
        max-width: 600px;
    }

    .section-label {
        display: inline-block;
        padding: 8px 16px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 100px;
        font-size: 0.85rem;
        font-weight: 500;
        color: #6366f1;
        margin-bottom: 20px;
    }

    .about-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2rem, 4vw, 2.8rem);
        font-weight: 700;
        color: var(--text-primary, #ffffff);
        margin-bottom: 12px;
    }

    .gradient-text {
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .about-tagline {
        font-size: 1.15rem;
        color: var(--text-secondary, #a1a1aa);
        margin-bottom: 24px;
        font-weight: 500;
    }

    .about-description {
        margin-bottom: 32px;
    }

    .about-description p {
        font-size: 1rem;
        color: var(--text-secondary, #a1a1aa);
        line-height: 1.8;
        margin-bottom: 16px;
    }

    .about-description p:last-child {
        margin-bottom: 0;
    }

    /* What I Do */
    .what-i-do {
        margin-bottom: 32px;
    }

    .what-i-do h3 {
        font-size: 1.1rem;
        color: var(--text-primary, #ffffff);
        margin-bottom: 16px;
        font-weight: 600;
    }

    .services-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .service-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: var(--bg-card, rgba(26, 26, 37, 0.6));
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
        border-radius: 14px;
        transition: all 0.3s ease;
    }

    .service-item:hover {
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-2px);
    }

    .service-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }

    .service-info h4 {
        font-size: 0.9rem;
        color: var(--text-primary, #ffffff);
        font-weight: 600;
        margin-bottom: 2px;
    }

    .service-info p {
        font-size: 0.8rem;
        color: var(--text-muted, #71717a);
        margin: 0;
    }

    /* CTA */
    .about-cta {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
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
        background: var(--bg-card, rgba(255, 255, 255, 0.05));
        color: var(--text-primary, #ffffff);
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    }

    .btn-secondary:hover {
        background: rgba(99, 102, 241, 0.1);
        border-color: rgba(99, 102, 241, 0.3);
    }

    /* Responsive */
    @media (max-width: 900px) {
        .about-layout {
            grid-template-columns: 1fr;
            gap: 48px;
            text-align: center;
        }

        .about-image {
            order: -1;
        }

        .image-container {
            max-width: 280px;
        }

        .about-content {
            max-width: 100%;
        }

        .about-cta {
            justify-content: center;
        }
    }

    @media (max-width: 600px) {
        section {
            padding: 80px 0 50px;
        }

        .services-grid {
            grid-template-columns: 1fr;
        }

        .about-cta {
            flex-direction: column;
            align-items: center;
        }

        .btn {
            width: 100%;
            justify-content: center;
            max-width: 280px;
        }

        .about-title {
            font-size: 1.8rem;
        }

        .about-tagline {
            font-size: 1rem;
        }
    }

    @media (max-width: 400px) {
        .container {
            padding: 0 14px;
        }

        .image-container {
            max-width: 220px;
        }

        .quick-info {
            flex-wrap: wrap;
            gap: 10px;
        }

        .info-badge {
            padding: 8px 14px;
            font-size: 0.8rem;
        }

        .service-item {
            padding: 12px 14px;
        }

        .service-icon {
            font-size: 1.3rem;
        }

        .service-info h4 {
            font-size: 0.85rem;
        }

        .about-description p {
            font-size: 0.9rem;
        }
    }
</style>
