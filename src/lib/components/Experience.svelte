<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    let section;
    let header;
    let timelineItems = [];

    const experiences = [
        {
            id: 1,
            role: "Senior Frontend Developer",
            company: "Tech Startup XYZ",
            period: "2023 - Present",
            type: "Full-time",
            description:
                "Leading frontend development for a SaaS platform serving 10K+ users. Implementing design systems and mentoring junior developers.",
            highlights: [
                "Led React migration",
                "50% performance improvement",
                "Mentored 3 developers",
            ],
            technologies: ["React", "TypeScript", "GraphQL", "Tailwind"],
        },
        {
            id: 2,
            role: "Full Stack Developer",
            company: "Digital Agency ABC",
            period: "2021 - 2023",
            type: "Full-time",
            description:
                "Built and maintained web applications for various clients across different industries, from e-commerce to healthcare.",
            highlights: [
                "20+ projects delivered",
                "Client satisfaction 98%",
                "Agile methodology",
            ],
            technologies: ["Vue.js", "Node.js", "PostgreSQL", "AWS"],
        },
        {
            id: 3,
            role: "Frontend Developer",
            company: "Freelance",
            period: "2020 - 2021",
            type: "Contract",
            description:
                "Worked with multiple startups and businesses to create modern, responsive web applications and landing pages.",
            highlights: [
                "15+ clients served",
                "Portfolio websites",
                "E-commerce solutions",
            ],
            technologies: ["JavaScript", "React", "SCSS", "Firebase"],
        },
        {
            id: 4,
            role: "Web Development Intern",
            company: "Software House DEF",
            period: "2019 - 2020",
            type: "Internship",
            description:
                "Started my professional journey learning web development fundamentals and contributing to real-world projects.",
            highlights: [
                "Learning fundamentals",
                "Team collaboration",
                "Code reviews",
            ],
            technologies: ["HTML", "CSS", "JavaScript", "PHP"],
        },
    ];

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

        // Timeline items animation with stagger and smooth scrub
        timelineItems.forEach((item, index) => {
            if (item) {
                gsap.set(item, { x: -80, opacity: 0 });
                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        end: "top 40%",
                        scrub: 0.8,
                        toggleActions: "play reverse play reverse",
                    },
                    x: 0,
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
                timelineItems.forEach((item) => {
                    if (item) {
                        gsap.to(item, {
                            opacity: 1 - progress * 0.4,
                            y: -progress * 15,
                            duration: 0.1,
                            ease: "none",
                        });
                    }
                });
            },
        });
    });
</script>

<section id="experience" bind:this={section}>
    <div class="container">
        <div bind:this={header} class="section-header">
            <div class="section-label">Career Path</div>
            <h2 class="section-title">
                Work <span class="gradient-text">Experience</span>
            </h2>
            <p class="section-subtitle">
                My professional journey in the world of web development
            </p>
        </div>

        <div class="timeline">
            <div class="timeline-line"></div>

            {#each experiences as exp, i}
                <div bind:this={timelineItems[i]} class="timeline-item">
                    <div class="timeline-dot">
                        <div class="dot-inner"></div>
                    </div>

                    <div class="timeline-card">
                        <div class="card-header">
                            <div class="header-left">
                                <h3 class="role">{exp.role}</h3>
                                <p class="company">{exp.company}</p>
                            </div>
                            <div class="header-right">
                                <span class="period">{exp.period}</span>
                                <span class="type">{exp.type}</span>
                            </div>
                        </div>

                        <p class="description">{exp.description}</p>

                        <div class="highlights">
                            {#each exp.highlights as highlight}
                                <div class="highlight">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {highlight}
                                </div>
                            {/each}
                        </div>

                        <div class="technologies">
                            {#each exp.technologies as tech}
                                <span class="tech-tag">{tech}</span>
                            {/each}
                        </div>
                    </div>
                </div>
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
        max-width: 900px;
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
        margin: 0 auto;
    }

    .timeline {
        position: relative;
    }

    .timeline-line {
        position: absolute;
        left: 20px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, #6366f1, #a855f7, transparent);
    }

    .timeline-item {
        position: relative;
        padding-left: 60px;
        margin-bottom: 40px;
    }

    .timeline-item:last-child {
        margin-bottom: 0;
    }

    .timeline-dot {
        position: absolute;
        left: 10px;
        top: 24px;
        width: 22px;
        height: 22px;
        background: #0a0a0f;
        border: 2px solid #6366f1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dot-inner {
        width: 8px;
        height: 8px;
        background: #6366f1;
        border-radius: 50%;
    }

    .timeline-card {
        background: rgba(26, 26, 37, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 20px;
        padding: 28px;
        backdrop-filter: blur(20px);
        transition: all 0.3s ease;
    }

    .timeline-card:hover {
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateX(8px);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 16px;
        flex-wrap: wrap;
    }

    .role {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.3rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 4px;
    }

    .company {
        font-size: 1rem;
        color: #6366f1;
        font-weight: 500;
    }

    .header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
    }

    .period {
        font-size: 0.9rem;
        color: #a1a1aa;
    }

    .type {
        padding: 4px 12px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 100px;
        font-size: 0.75rem;
        color: #8b5cf6;
        font-weight: 500;
    }

    .description {
        font-size: 0.95rem;
        color: #a1a1aa;
        line-height: 1.7;
        margin-bottom: 20px;
    }

    .highlights {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;
    }

    .highlight {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: #22c55e;
    }

    .highlight svg {
        flex-shrink: 0;
    }

    .technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .tech-tag {
        padding: 6px 14px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 100px;
        font-size: 0.8rem;
        color: #71717a;
    }

    @media (max-width: 640px) {
        section {
            padding: 80px 0;
        }

        .container {
            padding: 0 16px;
        }

        .card-header {
            flex-direction: column;
        }

        .header-right {
            align-items: flex-start;
            flex-direction: row;
            gap: 12px;
        }

        .timeline-item {
            padding-left: 50px;
        }

        .timeline-card {
            padding: 22px;
        }

        .role {
            font-size: 1.15rem;
        }

        .description {
            font-size: 0.9rem;
        }

        .highlights {
            gap: 10px;
        }

        .highlight {
            font-size: 0.8rem;
        }
    }

    @media (max-width: 480px) {
        section {
            padding: 60px 0;
        }

        .container {
            padding: 0 14px;
        }

        .section-header {
            margin-bottom: 40px;
        }

        .timeline-line {
            left: 14px;
        }

        .timeline-item {
            padding-left: 40px;
            margin-bottom: 28px;
        }

        .timeline-dot {
            left: 4px;
            width: 20px;
            height: 20px;
        }

        .dot-inner {
            width: 6px;
            height: 6px;
        }

        .timeline-card {
            padding: 18px;
            border-radius: 16px;
        }

        .role {
            font-size: 1.05rem;
        }

        .company {
            font-size: 0.9rem;
        }

        .period {
            font-size: 0.8rem;
        }

        .type {
            padding: 3px 10px;
            font-size: 0.7rem;
        }

        .description {
            font-size: 0.85rem;
            margin-bottom: 16px;
        }

        .tech-tag {
            padding: 5px 10px;
            font-size: 0.75rem;
        }
    }

    @media (max-width: 380px) {
        .timeline-item {
            padding-left: 36px;
        }

        .timeline-card {
            padding: 16px;
        }

        .role {
            font-size: 1rem;
        }

        .highlights {
            flex-direction: column;
            gap: 8px;
        }
    }
</style>
