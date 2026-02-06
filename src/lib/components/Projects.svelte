<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    let section;
    let header;
    let projectCards = [];
    let activeFilter = "all";

    const projects = [
        {
            id: 1,
            title: "E-Commerce Platform",
            description:
                "Full-stack e-commerce solution with modern UI, payment integration, and admin dashboard.",
            category: "fullstack",
            tags: ["Next.js", "Node.js", "MongoDB", "Stripe"],
            image: "🛒",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            link: "#",
            github: "#",
        },
        {
            id: 2,
            title: "AI Dashboard",
            description:
                "Analytics dashboard with real-time data visualization and machine learning insights.",
            category: "frontend",
            tags: ["React", "D3.js", "TensorFlow.js", "Tailwind"],
            image: "📊",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            link: "#",
            github: "#",
        },
        {
            id: 3,
            title: "Social Media App",
            description:
                "Real-time social platform with messaging, stories, and content sharing features.",
            category: "fullstack",
            tags: ["Vue.js", "Firebase", "Socket.io", "PWA"],
            image: "💬",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            link: "#",
            github: "#",
        },
        {
            id: 4,
            title: "3D Portfolio",
            description:
                "Interactive 3D portfolio website with immersive animations and creative design.",
            category: "frontend",
            tags: ["Three.js", "GSAP", "Svelte", "WebGL"],
            image: "🎮",
            gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            link: "#",
            github: "#",
        },
        {
            id: 5,
            title: "Task Management",
            description:
                "Collaborative project management tool with kanban boards and team features.",
            category: "fullstack",
            tags: ["SvelteKit", "Prisma", "PostgreSQL", "Auth"],
            image: "📋",
            gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            link: "#",
            github: "#",
        },
        {
            id: 6,
            title: "Weather App",
            description:
                "Beautiful weather application with location-based forecasts and animations.",
            category: "frontend",
            tags: ["React", "Weather API", "Framer Motion"],
            image: "🌤️",
            gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
            link: "#",
            github: "#",
        },
    ];

    const filters = [
        { id: "all", label: "All Projects" },
        { id: "frontend", label: "Frontend" },
        { id: "fullstack", label: "Full Stack" },
    ];

    $: filteredProjects =
        activeFilter === "all"
            ? projects
            : projects.filter((p) => p.category === activeFilter);

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Set initial states
        gsap.set(header, { y: 60, opacity: 0 });

        // Header animation with smooth scrub
        gsap.to(header, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 40%",
                scrub: 0.6,
                toggleActions: "play reverse play reverse",
            },
            y: 0,
            opacity: 1,
            ease: "power2.out",
        });

        // Cards animation with stagger and smooth scrub
        projectCards.forEach((card, index) => {
            if (card) {
                gsap.set(card, { y: 100, opacity: 0 });
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: section,
                        start: `top ${75 - index * 3}%`,
                        end: "top 15%",
                        scrub: 0.8,
                        toggleActions: "play reverse play reverse",
                    },
                    y: 0,
                    opacity: 1,
                    ease: "power2.out",
                });
            }
        });

        // Exit animation when scrolling past
        ScrollTrigger.create({
            trigger: section,
            start: "bottom 50%",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.to(header, {
                    opacity: 1 - progress * 0.5,
                    y: -progress * 20,
                    duration: 0.1,
                    ease: "none",
                });
                projectCards.forEach((card) => {
                    if (card) {
                        gsap.to(card, {
                            opacity: 1 - progress * 0.4,
                            scale: 1 - progress * 0.05,
                            duration: 0.1,
                            ease: "none",
                        });
                    }
                });
            },
        });
    });

    function setFilter(filterId) {
        activeFilter = filterId;
    }
</script>

<section id="projects" bind:this={section}>
    <div class="container">
        <div bind:this={header} class="section-header">
            <div class="section-label">Portfolio</div>
            <h2 class="section-title">
                Featured <span class="gradient-text">Projects</span>
            </h2>
            <p class="section-subtitle">
                A selection of my recent work, showcasing creativity and
                technical expertise
            </p>

            <div class="filter-tabs">
                {#each filters as filter}
                    <button
                        class="filter-btn"
                        class:active={activeFilter === filter.id}
                        on:click={() => setFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                {/each}
            </div>
        </div>

        <div class="projects-grid">
            {#each filteredProjects as project, i (project.id)}
                <div bind:this={projectCards[i]} class="project-card">
                    <div
                        class="project-image"
                        style="background: {project.gradient}"
                    >
                        <span class="project-emoji">{project.image}</span>
                        <div class="project-overlay">
                            <a
                                href={project.link}
                                class="overlay-btn"
                                aria-label="View project"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                    />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                            <a
                                href={project.github}
                                class="overlay-btn"
                                aria-label="View GitHub"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="project-content">
                        <h3 class="project-title">{project.title}</h3>
                        <p class="project-description">{project.description}</p>
                        <div class="project-tags">
                            {#each project.tags as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="view-more">
            <a href="#" class="btn btn-secondary">
                View All Projects
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
        </div>
    </div>
</section>

<style>
    section {
        padding: 120px 0;
        position: relative;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .section-header {
        text-align: center;
        margin-bottom: 60px;
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
        margin-bottom: 16px;
    }

    .section-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 700;
        margin-bottom: 16px;
        color: #ffffff;
    }

    .gradient-text {
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .section-subtitle {
        font-size: 1.1rem;
        color: #a1a1aa;
        max-width: 600px;
        margin: 0 auto 32px;
    }

    .filter-tabs {
        display: flex;
        justify-content: center;
        gap: 12px;
    }

    .filter-btn {
        padding: 10px 24px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 100px;
        color: #a1a1aa;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .filter-btn:hover {
        border-color: rgba(99, 102, 241, 0.5);
        color: #ffffff;
    }

    .filter-btn.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-color: transparent;
        color: #ffffff;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 28px;
        margin-bottom: 48px;
    }

    .project-card {
        background: rgba(26, 26, 37, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 24px;
        overflow: hidden;
        transition: all 0.4s ease;
    }

    .project-card:hover {
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-8px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    }

    .project-image {
        height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .project-emoji {
        font-size: 5rem;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
    }

    .project-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .project-card:hover .project-overlay {
        opacity: 1;
    }

    .overlay-btn {
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .overlay-btn:hover {
        background: #6366f1;
        border-color: #6366f1;
        transform: scale(1.1);
    }

    .project-content {
        padding: 28px;
    }

    .project-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.3rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 12px;
    }

    .project-description {
        font-size: 0.95rem;
        color: #a1a1aa;
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .tag {
        padding: 6px 14px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 100px;
        font-size: 0.8rem;
        color: #a1a1aa;
    }

    .view-more {
        text-align: center;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 16px 28px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 1rem;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
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

    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }

        .filter-tabs {
            flex-wrap: wrap;
        }
    }
</style>
