<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { projects } from "$lib/projectsData.js";

    let section;
    let header;
    let projectCards = [];

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
                        start: `top ${75 - index * 5}%`,
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
</script>

<section id="projects" bind:this={section}>
    <div class="container">
        <div bind:this={header} class="section-header">
            <h2 class="section-title">
                Featured <span class="gradient-text">Projects</span>
            </h2>
            <p class="section-subtitle">
                A selection of my recent work, ranging from web applications to
                interactive 3D experiments.
            </p>
        </div>

        <div class="projects-grid">
            {#each projects as project, i (project.id)}
                <a
                    href="/projects/{project.slug}"
                    bind:this={projectCards[i]}
                    class="project-card"
                >
                    <!-- Media Preview -->
                    <div class="project-media">
                        <div class="media-wrapper">
                            {#if project.mediaType === "video"}
                                <video
                                    autoplay
                                    muted
                                    loop
                                    playsinline
                                    src={project.mediaUrl}
                                    class="project-video"
                                >
                                    <track kind="captions" />
                                </video>
                            {:else}
                                <img
                                    src={project.mediaUrl}
                                    alt={project.title}
                                    class="project-image"
                                    loading="lazy"
                                />
                            {/if}
                            <div class="media-overlay">
                                <div class="overlay-content">
                                    <div class="view-project">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                            />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line
                                                x1="10"
                                                y1="14"
                                                x2="21"
                                                y2="3"
                                            />
                                        </svg>
                                        <span>View Project</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Browser Frame Effect -->
                        <div class="browser-dots">
                            <span class="dot red"></span>
                            <span class="dot yellow"></span>
                            <span class="dot green"></span>
                        </div>
                    </div>

                    <!-- Project Info -->
                    <div class="project-info">
                        <h3 class="project-title">{project.title}</h3>

                        <div class="project-tags">
                            {#each project.tags.slice(0, 6) as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                            {#if project.tags.length > 6}
                                <span class="tag tag-more"
                                    >+{project.tags.length - 6}</span
                                >
                            {/if}
                        </div>

                        <p class="project-description">
                            {project.shortDescription}
                        </p>

                        <div class="project-meta">
                            {#each project.description.slice(0, 2) as paragraph}
                                <p class="meta-paragraph">{paragraph}</p>
                            {/each}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<style>
    section {
        padding: 120px 0;
        position: relative;
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .section-header {
        text-align: center;
        margin-bottom: 80px;
    }

    .section-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 700;
        margin-bottom: 20px;
        color: #ffffff;
        font-style: italic;
    }

    .gradient-text {
        background: linear-gradient(
            135deg,
            #a855f7 0%,
            #6366f1 50%,
            #a855f7 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .section-subtitle {
        font-size: 1.15rem;
        color: #a1a1aa;
        max-width: 700px;
        margin: 0 auto;
        font-style: italic;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
    }

    .project-card {
        text-decoration: none;
        color: inherit;
        display: block;
        transition: transform 0.4s ease;
    }

    .project-card:hover {
        transform: translateY(-8px);
    }

    /* Media Preview Container */
    .project-media {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        background: rgba(20, 20, 30, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 24px;
    }

    .browser-dots {
        position: absolute;
        top: 12px;
        left: 16px;
        display: flex;
        gap: 6px;
        z-index: 10;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }

    .dot.red {
        background: #ff5f57;
    }

    .dot.yellow {
        background: #ffbd2e;
    }

    .dot.green {
        background: #28c840;
    }

    .media-wrapper {
        position: relative;
        padding-top: 32px;
        aspect-ratio: 16 / 10;
        overflow: hidden;
    }

    .project-image,
    .project-video {
        position: absolute;
        top: 32px;
        left: 0;
        width: 100%;
        height: calc(100% - 32px);
        object-fit: cover;
        transition: transform 0.6s ease;
    }

    .project-card:hover .project-image,
    .project-card:hover .project-video {
        transform: scale(1.05);
    }

    .media-overlay {
        position: absolute;
        inset: 32px 0 0 0;
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.8) 100%
        );
        opacity: 0;
        transition: opacity 0.4s ease;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 30px;
    }

    .project-card:hover .media-overlay {
        opacity: 1;
    }

    .overlay-content {
        transform: translateY(20px);
        transition: transform 0.4s ease;
    }

    .project-card:hover .overlay-content {
        transform: translateY(0);
    }

    .view-project {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        background: rgba(99, 102, 241, 0.9);
        border-radius: 100px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
        backdrop-filter: blur(10px);
        transition:
            background 0.3s ease,
            transform 0.3s ease;
    }

    .view-project:hover {
        background: rgba(139, 92, 246, 1);
        transform: scale(1.05);
    }

    /* Project Info Section */
    .project-info {
        padding: 0 8px;
    }

    .project-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.6rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 16px;
        transition: color 0.3s ease;
    }

    .project-card:hover .project-title {
        color: #a855f7;
    }

    .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    }

    .tag {
        padding: 6px 14px;
        background: rgba(99, 102, 241, 0.08);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 100px;
        font-size: 0.8rem;
        color: #a1a1aa;
        transition: all 0.3s ease;
    }

    .project-card:hover .tag {
        border-color: rgba(99, 102, 241, 0.4);
        color: #d1d1d6;
    }

    .tag-more {
        background: rgba(168, 85, 247, 0.15);
        border-color: rgba(168, 85, 247, 0.3);
        color: #a855f7;
    }

    .project-description {
        font-size: 1rem;
        color: #d1d5db;
        line-height: 1.6;
        margin-bottom: 16px;
        font-weight: 500;
    }

    .project-meta {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .meta-paragraph {
        font-size: 0.9rem;
        color: #9ca3af;
        line-height: 1.7;
    }

    /* Responsive - Tablet */
    @media (max-width: 1024px) {
        .projects-grid {
            gap: 32px;
        }

        .project-title {
            font-size: 1.4rem;
        }
    }

    /* Responsive - Mobile */
    @media (max-width: 768px) {
        section {
            padding: 80px 0;
        }

        .section-header {
            margin-bottom: 50px;
        }

        .projects-grid {
            grid-template-columns: 1fr;
            gap: 48px;
        }

        .project-media {
            border-radius: 12px;
        }

        .project-title {
            font-size: 1.3rem;
        }

        .project-description {
            font-size: 0.95rem;
        }

        .meta-paragraph {
            font-size: 0.85rem;
        }
    }

    /* Responsive - Small Mobile */
    @media (max-width: 480px) {
        section {
            padding: 60px 0;
        }

        .container {
            padding: 0 16px;
        }

        .section-header {
            margin-bottom: 40px;
        }

        .project-media {
            margin-bottom: 20px;
        }

        .browser-dots {
            top: 10px;
            left: 12px;
        }

        .dot {
            width: 8px;
            height: 8px;
        }

        .media-wrapper {
            padding-top: 28px;
        }

        .project-image,
        .project-video {
            top: 28px;
            height: calc(100% - 28px);
        }

        .media-overlay {
            inset: 28px 0 0 0;
        }

        .project-info {
            padding: 0 4px;
        }

        .project-title {
            font-size: 1.2rem;
            margin-bottom: 12px;
        }

        .project-tags {
            gap: 6px;
            margin-bottom: 12px;
        }

        .tag {
            padding: 5px 10px;
            font-size: 0.75rem;
        }

        .project-description {
            font-size: 0.9rem;
            margin-bottom: 12px;
        }

        .view-project {
            padding: 10px 18px;
            font-size: 0.85rem;
        }
    }

    @media (max-width: 380px) {
        .project-card:hover {
            transform: translateY(-4px);
        }

        .project-title {
            font-size: 1.1rem;
        }

        .meta-paragraph {
            font-size: 0.8rem;
        }
    }
</style>
