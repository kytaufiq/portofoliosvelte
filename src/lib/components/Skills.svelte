<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { language, translations } from "$lib/stores.js";

    let section;
    let header;
    let skillCards = [];

    $: currentLang = $language;
    $: t = translations[currentLang];

    const skillCategories = [
        {
            id: "core",
            name: "CORE SKILLS",
            icon: "⚡",
            color: "#06b6d4",
            gradientFrom: "#06b6d4",
            gradientTo: "#a855f7",
            skills: [
                { name: "Full-Stack Web Development", level: 95 },
                { name: "Landing Page Development", level: 87 },
                { name: "Workflow Automation", level: 74 },
                { name: "System Design & Architecture", level: 78 },
                { name: "API Integration", level: 89 },
            ],
        },
        {
            id: "frontend",
            name: "FRONTEND",
            icon: "🎨",
            color: "#a855f7",
            gradientFrom: "#a855f7",
            gradientTo: "#ec4899",
            skills: [
                { name: "Responsive Web Design", level: 90, hasIcon: false },
                {
                    name: "Web Animations & Interactive UI",
                    level: 85,
                    hasIcon: false,
                },
                {
                    name: "Next.js",
                    level: 92,
                    hasIcon: true,
                    iconType: "nextjs",
                },
                { name: "React", level: 86, hasIcon: true, iconType: "react" },
                {
                    name: "Tailwind CSS",
                    level: 87,
                    hasIcon: true,
                    iconType: "tailwind",
                },
            ],
        },
        {
            id: "backend",
            name: "BACKEND",
            icon: "⚙️",
            color: "#10b981",
            gradientFrom: "#10b981",
            gradientTo: "#06b6d4",
            skills: [
                {
                    name: "Authentication & Authorization",
                    level: 86,
                    hasIcon: false,
                },
                { name: "Database Design", level: 80, hasIcon: false },
                { name: "REST API Development", level: 71, hasIcon: false },
                { name: "Node.js", level: 88, hasIcon: true, iconType: "node" },
                {
                    name: "Laravel",
                    level: 94,
                    hasIcon: true,
                    iconType: "laravel",
                },
            ],
        },
        {
            id: "tools",
            name: "TOOLS & PLATFORMS",
            icon: "🛠️",
            color: "#f59e0b",
            gradientFrom: "#f59e0b",
            gradientTo: "#ec4899",
            skills: [
                {
                    name: "PostgreSQL",
                    level: 92,
                    hasIcon: true,
                    iconType: "postgresql",
                },
                {
                    name: "Prisma ORM",
                    level: 79,
                    hasIcon: true,
                    iconType: "prisma",
                },
                {
                    name: "GitHub",
                    level: 97,
                    hasIcon: true,
                    iconType: "github",
                },
                { name: "Git", level: 90, hasIcon: true, iconType: "git" },
                {
                    name: "Vercel",
                    level: 72,
                    hasIcon: true,
                    iconType: "vercel",
                },
            ],
        },
    ];

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Set initial states
        gsap.set(header, { y: 60, opacity: 0 });
        gsap.set(".skill-card", { y: 80, opacity: 0 });
        gsap.set(".progress-fill", {
            scaleX: 0,
            transformOrigin: "left center",
        });

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

        // Cards stagger animation with smooth scrub
        const cards = document.querySelectorAll(".skill-card");
        cards.forEach((card, index) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: section,
                    start: `top ${80 - index * 5}%`,
                    end: "top 20%",
                    scrub: 0.8,
                    toggleActions: "play reverse play reverse",
                },
                y: 0,
                opacity: 1,
                ease: "power2.out",
            });
        });

        // Progress bars animation with smooth reveal
        gsap.to(".progress-fill", {
            scrollTrigger: {
                trigger: section,
                start: "top 50%",
                end: "top 10%",
                scrub: 1,
                toggleActions: "play reverse play reverse",
            },
            scaleX: 1,
            stagger: 0.03,
            ease: "power2.out",
        });

        // Exit animation when scrolling past
        ScrollTrigger.create({
            trigger: section,
            start: "bottom 50%",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.to([header, ".skill-card"], {
                    opacity: 1 - progress * 0.5,
                    y: -progress * 20,
                    duration: 0.1,
                    ease: "none",
                });
            },
        });
    });

    // Icon components
    const renderIcon = (iconType) => {
        return iconType;
    };
</script>

<section id="skills" bind:this={section}>
    <div class="container">
        <div bind:this={header} class="section-header">
            <div class="section-label">
                <span class="label-icon">✨</span>
                {currentLang === "EN"
                    ? "Technical Skills & Capabilities"
                    : "Keahlian Teknis & Kemampuan"}
            </div>
            <h2 class="section-title">
                {currentLang === "EN"
                    ? "Skills and technologies used to build"
                    : "Skill dan teknologi untuk membangun"}
                <span class="gradient-text">
                    {currentLang === "EN"
                        ? "scalable web solutions"
                        : "solusi web scalable"}
                </span>
            </h2>
        </div>

        <!-- Skills Grid - 2x2 Layout -->
        <div class="skills-grid">
            {#each skillCategories as category, cardIndex}
                <div
                    class="skill-card"
                    style="--card-color: {category.color}; --gradient-from: {category.gradientFrom}; --gradient-to: {category.gradientTo};"
                    bind:this={skillCards[cardIndex]}
                >
                    <!-- Card Border Gradient -->
                    <div class="card-border"></div>

                    <!-- Card Content -->
                    <div class="card-content">
                        <!-- Category Header -->
                        <div class="card-header">
                            <div class="category-icon">{category.icon}</div>
                            <h3 class="category-name">{category.name}</h3>
                        </div>

                        <!-- Skills List -->
                        <div class="skills-list">
                            {#each category.skills as skill, skillIndex}
                                <div
                                    class="skill-item"
                                    style="--delay: {skillIndex * 0.1}s"
                                >
                                    <div class="skill-header">
                                        <div class="skill-name-wrapper">
                                            {#if skill.hasIcon}
                                                <span
                                                    class="skill-icon"
                                                    data-type={skill.iconType}
                                                >
                                                    {#if skill.iconType === "react"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                                                            />
                                                            <ellipse
                                                                cx="12"
                                                                cy="12"
                                                                rx="10"
                                                                ry="4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="1"
                                                            />
                                                            <ellipse
                                                                cx="12"
                                                                cy="12"
                                                                rx="10"
                                                                ry="4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="1"
                                                                transform="rotate(60 12 12)"
                                                            />
                                                            <ellipse
                                                                cx="12"
                                                                cy="12"
                                                                rx="10"
                                                                ry="4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="1"
                                                                transform="rotate(-60 12 12)"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "tailwind"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "nextjs"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "node"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76l-2.03-1.17a.27.27 0 0 1-.14-.23V7.7c0-.1.05-.18.14-.23l7.44-4.3a.27.27 0 0 1 .27 0l7.44 4.3a.27.27 0 0 1 .14.23v8.58c0 .09-.05.18-.14.23l-7.44 4.3a.27.27 0 0 1-.27 0l-1.88-1.12c-.08-.04-.17-.05-.25 0-.68.39-.81.44-1.45.67-.16.06-.4.15.09.42l2.45 1.45c.24.14.5.21.78.21.27 0 .54-.07.78-.21l7.44-4.3c.48-.28.78-.8.78-1.36V7.7c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.24-.13-.5-.2-.78-.2z"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "laravel"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.006-.043-.012-.063-.026L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.014-.023a.37.37 0 0 1 .091-.086c.005-.004.007-.012.013-.016L4.5.051a.375.375 0 0 1 .375 0L8.84 2.661c.006.004.008.012.013.016.033.024.062.052.091.086l.014.023c.008.011.019.02.023.033.01.019.017.038.023.058.004.012.011.02.014.032.009.032.014.065.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.011.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.014-.023a.37.37 0 0 1 .091-.086c.005-.004.007-.012.013-.016l3.965-2.61a.375.375 0 0 1 .375 0l3.965 2.61c.006.004.008.012.013.016.033.024.062.052.091.086.005.007.01.016.014.023.008.011.019.02.023.033.01.019.017.038.023.058.004.012.011.02.014.032z"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "postgresql"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02a10.922 10.922 0 0 0-1.612.291l-.076.019-.254.073c-1.33-.453-2.79-.652-4.27-.583-1.89.087-3.502.667-4.8 1.725-.582.475-1.1 1.069-1.474 1.777-.4.756-.64 1.614-.73 2.613-.04.443-.054.975-.037 1.535.044 1.418.323 2.998.857 4.66.478 1.487 1.072 2.905 1.694 4.039.311.566.627 1.073.939 1.494.327.44.649.793.979 1.032.348.251.709.385 1.113.385.364 0 .705-.111 1.01-.276.236-.128.467-.298.708-.503 0 0 .01.256.01.366-.003 1.106.06 2.024.311 2.844.25.816.663 1.525 1.294 2.083.673.595 1.592.95 2.737 1.04l.157.011c.942.058 1.896-.116 2.689-.518a4.35 4.35 0 0 0 1.494-1.192c.063-.078.125-.159.187-.244.04.027.08.056.12.083.526.362 1.084.596 1.66.674.547.074 1.096-.01 1.66-.263.505-.226.998-.571 1.453-.996.479-.446.949-.988 1.336-1.584.464-.715.827-1.508 1.06-2.34.219-.786.336-1.61.336-2.441 0-.394-.03-.78-.09-1.162-.057-.382-.143-.757-.258-1.127.34-.9.517-1.91.517-2.87 0-.553-.043-1.096-.124-1.625-.092-.592-.219-1.145-.383-1.677-.178-.584-.392-1.126-.64-1.655a9.57 9.57 0 0 0-.857-1.468 8.348 8.348 0 0 0-1.113-1.33 9.008 9.008 0 0 0-1.325-1.002A9.594 9.594 0 0 0 17.128 0z"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "prisma"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M21.807 18.285L13.553.756a1.324 1.324 0 0 0-1.129-.754 1.31 1.31 0 0 0-1.206.626L1.24 16.143a1.322 1.322 0 0 0-.045 1.32 1.32 1.32 0 0 0 1.067.7l18.52 1.94a1.323 1.323 0 0 0 1.024-2.318zm-2.36.252l-14.46-1.52a.16.16 0 0 1-.1-.27l8.544-11.42a.16.16 0 0 1 .291.068l2.006 12.756a.16.16 0 0 1-.18.186z"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "github"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "git"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.6 0 1.846 1.846 0 0 1-.404-1.996L12.86 8.955v6.525a1.841 1.841 0 1 1-1.516-.082V8.835a1.843 1.843 0 0 1-.998-2.41L7.617 3.696.452 10.86a1.55 1.55 0 0 0 0 2.188l10.48 10.477a1.55 1.55 0 0 0 2.186 0l10.428-10.428a1.549 1.549 0 0 0 0-2.167"
                                                            />
                                                        </svg>
                                                    {:else if skill.iconType === "vercel"}
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M24 22.525H0l12-21.05 12 21.05z"
                                                            />
                                                        </svg>
                                                    {/if}
                                                </span>
                                            {/if}
                                            <span class="skill-name"
                                                >{skill.name}</span
                                            >
                                        </div>
                                        <span class="skill-level"
                                            >{skill.level}%</span
                                        >
                                    </div>
                                    <div class="progress-bar">
                                        <div
                                            class="progress-fill"
                                            style="--progress: {skill.level}%; --gradient-from: {category.gradientFrom}; --gradient-to: {category.gradientTo};"
                                        ></div>
                                    </div>
                                </div>
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
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 32px;
        position: relative;
        z-index: 2;
    }

    /* Header */
    .section-header {
        text-align: center;
        margin-bottom: 72px;
    }

    .section-label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 24px;
        background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.15) 0%,
            rgba(168, 85, 247, 0.15) 100%
        );
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 100px;
        font-size: 0.9rem;
        font-weight: 500;
        color: #a5b4fc;
        margin-bottom: 20px;
        backdrop-filter: blur(10px);
    }

    .label-icon {
        font-size: 1rem;
    }

    .section-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(2rem, 4.5vw, 3.2rem);
        font-weight: 700;
        margin-bottom: 0;
        color: #ffffff;
        line-height: 1.25;
    }

    .gradient-text {
        display: block;
        background: linear-gradient(
            135deg,
            #6366f1 0%,
            #a855f7 40%,
            #ec4899 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Skills Grid - 2x2 Layout */
    .skills-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
        align-items: start;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* Skill Card */
    .skill-card {
        position: relative;
        border-radius: 24px;
        padding: 1px;
        background: transparent;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 1;
        visibility: visible;
    }

    .skill-card::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 24px;
        padding: 1px;
        background: linear-gradient(
            135deg,
            var(--gradient-from),
            var(--gradient-to)
        );
        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0.15;
        transition: opacity 0.4s ease;
    }

    .skill-card:hover::before {
        opacity: 0.35;
    }

    .skill-card:hover {
        transform: translateY(-8px);
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(var(--card-color), 0.08);
    }

    .card-content {
        background: transparent;
        border-radius: 22px;
        padding: 28px;
        height: 100%;
        position: relative;
        overflow: visible;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .card-content::before {
        display: none;
    }

    /* Card Header */
    .card-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 28px;
        position: relative;
        z-index: 1;
    }

    .category-icon {
        font-size: 1.5rem;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            135deg,
            rgba(var(--card-color), 0.2) 0%,
            rgba(var(--card-color), 0.05) 100%
        );
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .category-name {
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--card-color);
        letter-spacing: 2px;
        margin: 0;
        text-transform: uppercase;
    }

    /* Skills List */
    .skills-list {
        display: flex;
        flex-direction: column;
        gap: 22px;
        position: relative;
        z-index: 1;
    }

    .skill-item {
        display: block;
    }

    .skill-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .skill-name-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .skill-icon {
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--card-color);
        flex-shrink: 0;
        opacity: 0.9;
    }

    .skill-icon svg {
        width: 100%;
        height: 100%;
    }

    .skill-name {
        font-size: 0.95rem;
        font-weight: 500;
        color: #e4e4e7;
        line-height: 1.3;
    }

    .skill-level {
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.05);
        padding: 4px 10px;
        border-radius: 8px;
    }

    /* Progress Bar */
    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
    }

    .progress-fill {
        height: 100%;
        width: var(--progress);
        background: linear-gradient(
            90deg,
            var(--gradient-from) 0%,
            var(--gradient-to) 100%
        );
        border-radius: 10px;
        position: relative;
        transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
            0 0 20px var(--gradient-from),
            0 0 40px rgba(var(--gradient-from), 0.3);
    }

    .progress-fill::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
        );
        animation: shimmer 2.5s infinite;
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .skills-grid {
            gap: 24px;
        }

        .card-content {
            padding: 28px;
        }
    }

    @media (max-width: 900px) {
        section {
            padding: 100px 0;
        }

        .skills-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .skill-card {
            border-radius: 20px;
        }

        .card-content {
            padding: 24px;
            border-radius: 18px;
        }

        .skills-list {
            gap: 18px;
        }

        .section-header {
            margin-bottom: 56px;
        }
    }

    @media (max-width: 600px) {
        section {
            padding: 80px 0;
        }

        .container {
            padding: 0 20px;
        }

        .card-content {
            padding: 20px;
        }

        .card-header {
            margin-bottom: 22px;
        }

        .category-icon {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
            border-radius: 10px;
        }

        .category-name {
            font-size: 0.85rem;
            letter-spacing: 1.5px;
        }

        .skill-name {
            font-size: 0.9rem;
        }

        .skill-icon {
            width: 18px;
            height: 18px;
        }

        .progress-bar {
            height: 6px;
        }

        .skills-list {
            gap: 16px;
        }
    }

    @media (max-width: 400px) {
        section {
            padding: 60px 0;
        }

        .container {
            padding: 0 14px;
        }

        .skills-grid {
            padding: 0;
        }

        .card-content {
            padding: 16px;
        }

        .card-header {
            gap: 10px;
            margin-bottom: 18px;
        }

        .category-icon {
            width: 36px;
            height: 36px;
            font-size: 1rem;
            border-radius: 8px;
        }

        .category-name {
            font-size: 0.75rem;
            letter-spacing: 1px;
        }

        .skill-name-wrapper {
            flex: 1;
            min-width: 0;
        }

        .skill-name {
            font-size: 0.82rem;
            word-break: break-word;
        }

        .skill-icon {
            width: 16px;
            height: 16px;
        }

        .skill-level {
            font-size: 0.75rem;
            padding: 3px 8px;
            flex-shrink: 0;
        }

        .progress-bar {
            height: 5px;
        }

        .section-label {
            padding: 8px 16px;
            font-size: 0.8rem;
        }

        .section-title {
            font-size: 1.5rem;
        }
    }
</style>
