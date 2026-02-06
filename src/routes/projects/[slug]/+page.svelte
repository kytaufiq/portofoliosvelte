<script>
    import { onMount } from "svelte";
    import gsap from "gsap";

    export let data;
    const { project } = data;

    let pageContainer;
    let mediaSection;
    let infoSection;
    let detailsPanel;

    onMount(() => {
        // Page entrance animations
        gsap.set(pageContainer, { opacity: 0 });
        gsap.set(mediaSection, { y: 40, opacity: 0 });
        gsap.set(infoSection, { y: 60, opacity: 0 });
        gsap.set(detailsPanel, { x: 40, opacity: 0 });

        const tl = gsap.timeline();

        tl.to(pageContainer, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
        })
            .to(
                mediaSection,
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "-=0.1",
            )
            .to(
                infoSection,
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "-=0.4",
            )
            .to(
                detailsPanel,
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power3.out",
                },
                "-=0.3",
            );
    });
</script>

<svelte:head>
    <title>{project.title} | Portfolio</title>
    <meta name="description" content={project.shortDescription} />
</svelte:head>

<div class="project-page" bind:this={pageContainer}>
    <!-- Background Effects -->
    <div class="page-bg">
        <div class="gradient-blob blob-1"></div>
        <div class="gradient-blob blob-2"></div>
    </div>

    <!-- Navigation Back -->
    <nav class="page-nav">
        <a href="/#projects" class="back-link">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Projects</span>
        </a>
    </nav>

    <main class="page-content">
        <!-- Hero Media Section -->
        <div class="media-hero" bind:this={mediaSection}>
            <div class="media-frame">
                <div class="frame-header">
                    <div class="frame-dots">
                        <span class="dot red"></span>
                        <span class="dot yellow"></span>
                        <span class="dot green"></span>
                    </div>
                    <div class="frame-url">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path
                                d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                            />
                        </svg>
                        <span>{project.websiteUrl}</span>
                    </div>
                </div>
                <div class="frame-content">
                    {#if project.mediaType === "video"}
                        <video
                            autoplay
                            muted
                            loop
                            playsinline
                            src={project.mediaUrl}
                            class="hero-media"
                        >
                            <track kind="captions" />
                        </video>
                    {:else}
                        <img
                            src={project.mediaUrl}
                            alt={project.title}
                            class="hero-media"
                        />
                    {/if}
                </div>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
            <!-- Left: Project Information -->
            <div class="info-column" bind:this={infoSection}>
                <h1 class="project-title">
                    <span class="title-accent">{project.title}</span>
                </h1>

                <div class="project-description">
                    {#each project.description as paragraph}
                        <p>{paragraph}</p>
                    {/each}
                </div>

                <div class="project-tags">
                    {#each project.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            </div>

            <!-- Right: Project Details Panel -->
            <div class="details-column" bind:this={detailsPanel}>
                <div class="details-card">
                    <h3 class="details-title">Project Details</h3>

                    <div class="detail-item">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Published on {project.publishedDate}</span>
                    </div>

                    <div class="details-actions">
                        <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="action-btn primary"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path
                                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                                />
                            </svg>
                            <span>Visit Website</span>
                        </a>

                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="action-btn secondary"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            <span>View on GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    .project-page {
        min-height: 100vh;
        position: relative;
        padding-bottom: 80px;
    }

    /* Background Effects */
    .page-bg {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    }

    .gradient-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(120px);
    }

    .blob-1 {
        width: 600px;
        height: 600px;
        background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.15) 0%,
            rgba(139, 92, 246, 0.1) 100%
        );
        top: -200px;
        right: -100px;
    }

    .blob-2 {
        width: 500px;
        height: 500px;
        background: linear-gradient(
            225deg,
            rgba(168, 85, 247, 0.1) 0%,
            rgba(99, 102, 241, 0.08) 100%
        );
        bottom: -100px;
        left: -150px;
    }

    /* Navigation */
    .page-nav {
        padding: 24px 40px;
        position: relative;
        z-index: 10;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #a1a1aa;
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 500;
        padding: 10px 16px;
        border-radius: 100px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s ease;
    }

    .back-link:hover {
        color: #ffffff;
        background: rgba(99, 102, 241, 0.1);
        border-color: rgba(99, 102, 241, 0.3);
    }

    /* Main Content */
    .page-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 40px;
    }

    /* Media Hero Section */
    .media-hero {
        margin-bottom: 60px;
    }

    .media-frame {
        background: rgba(20, 20, 30, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
    }

    .frame-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 20px;
        background: rgba(30, 30, 45, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .frame-dots {
        display: flex;
        gap: 8px;
    }

    .dot {
        width: 12px;
        height: 12px;
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

    .frame-url {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        padding: 8px 16px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        font-size: 0.85rem;
        color: #9ca3af;
    }

    .frame-content {
        aspect-ratio: 16 / 9;
        overflow: hidden;
    }

    .hero-media {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Content Grid */
    .content-grid {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 60px;
        align-items: start;
    }

    /* Info Column */
    .info-column {
        padding-right: 20px;
    }

    .project-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2rem, 4vw, 2.8rem);
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 32px;
        line-height: 1.2;
    }

    .title-accent {
        background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .project-description {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 40px;
    }

    .project-description p {
        font-size: 1.05rem;
        line-height: 1.8;
        color: #d1d5db;
    }

    .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .tag {
        padding: 8px 18px;
        background: rgba(99, 102, 241, 0.08);
        border: 1px solid rgba(99, 102, 241, 0.25);
        border-radius: 100px;
        font-size: 0.9rem;
        color: #d1d5db;
        transition: all 0.3s ease;
    }

    .tag:hover {
        border-color: rgba(99, 102, 241, 0.5);
        background: rgba(99, 102, 241, 0.15);
    }

    /* Details Column */
    .details-column {
        position: sticky;
        top: 100px;
    }

    .details-card {
        background: rgba(26, 26, 37, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 32px;
        backdrop-filter: blur(20px);
    }

    .details-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.3rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 24px;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        color: #9ca3af;
        font-size: 0.95rem;
    }

    .detail-item svg {
        color: #6366f1;
        flex-shrink: 0;
    }

    .details-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 28px;
    }

    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .action-btn.primary {
        background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.15) 0%,
            rgba(139, 92, 246, 0.15) 100%
        );
        border: 1px solid rgba(99, 102, 241, 0.3);
        color: #ffffff;
    }

    .action-btn.primary:hover {
        background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.25) 0%,
            rgba(139, 92, 246, 0.25) 100%
        );
        border-color: rgba(99, 102, 241, 0.5);
        transform: translateY(-2px);
    }

    .action-btn.secondary {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #d1d5db;
    }

    .action-btn.secondary:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }

    /* Responsive - Tablet */
    @media (max-width: 1024px) {
        .page-content {
            padding: 0 24px;
        }

        .content-grid {
            grid-template-columns: 1fr;
            gap: 40px;
        }

        .details-column {
            position: relative;
            top: 0;
        }

        .info-column {
            padding-right: 0;
        }
    }

    /* Responsive - Mobile */
    @media (max-width: 768px) {
        .page-nav {
            padding: 20px 20px;
        }

        .page-content {
            padding: 0 20px;
        }

        .media-hero {
            margin-bottom: 40px;
        }

        .media-frame {
            border-radius: 12px;
        }

        .frame-header {
            padding: 10px 16px;
        }

        .dot {
            width: 10px;
            height: 10px;
        }

        .frame-url {
            font-size: 0.75rem;
            padding: 6px 12px;
        }

        .project-title {
            font-size: 1.8rem;
            margin-bottom: 24px;
        }

        .project-description p {
            font-size: 1rem;
        }

        .tag {
            padding: 6px 14px;
            font-size: 0.85rem;
        }

        .details-card {
            padding: 24px;
            border-radius: 16px;
        }
    }

    /* Responsive - Small Mobile */
    @media (max-width: 480px) {
        .page-nav {
            padding: 16px;
        }

        .back-link {
            padding: 8px 12px;
            font-size: 0.9rem;
        }

        .page-content {
            padding: 0 16px;
        }

        .frame-header {
            gap: 10px;
        }

        .frame-url span {
            display: none;
        }

        .project-title {
            font-size: 1.5rem;
        }

        .project-description {
            gap: 16px;
            margin-bottom: 30px;
        }

        .project-description p {
            font-size: 0.95rem;
        }

        .project-tags {
            gap: 8px;
        }

        .tag {
            padding: 5px 12px;
            font-size: 0.8rem;
        }

        .details-card {
            padding: 20px;
        }

        .details-title {
            font-size: 1.15rem;
        }

        .action-btn {
            padding: 14px 20px;
            font-size: 0.9rem;
        }
    }
</style>
