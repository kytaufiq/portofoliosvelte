<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    let section;
    let header;
    let blogCards = [];

    const blogs = [
        {
            id: 1,
            title: "Building Performant Web Apps with Modern JavaScript",
            excerpt:
                "Learn the key strategies and best practices for creating fast, responsive web applications using the latest JavaScript features.",
            category: "Development",
            date: "Jan 15, 2024",
            readTime: "8 min read",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            id: 2,
            title: "The Art of UI Animation: A GSAP Guide",
            excerpt:
                "Master the fundamentals of creating smooth, engaging animations that enhance user experience without sacrificing performance.",
            category: "Animation",
            date: "Jan 8, 2024",
            readTime: "12 min read",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        },
        {
            id: 3,
            title: "Designing for Dark Mode: Tips & Best Practices",
            excerpt:
                "Explore the principles behind effective dark mode design and how to implement it seamlessly in your applications.",
            category: "Design",
            date: "Dec 22, 2023",
            readTime: "6 min read",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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

        // Blog cards animation with stagger and smooth scrub
        blogCards.forEach((card, index) => {
            if (card) {
                gsap.set(card, { y: 80, opacity: 0, scale: 0.95 });
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: section,
                        start: `top ${75 - index * 5}%`,
                        end: "top 20%",
                        scrub: 0.8,
                        toggleActions: "play reverse play reverse",
                    },
                    y: 0,
                    opacity: 1,
                    scale: 1,
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
                blogCards.forEach((card) => {
                    if (card) {
                        gsap.to(card, {
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

<section id="blog" bind:this={section}>
    <div class="container">
        <div bind:this={header} class="section-header">
            <div class="section-label">Blog</div>
            <h2 class="section-title">
                Latest <span class="gradient-text">Articles</span>
            </h2>
            <p class="section-subtitle">
                Thoughts, tutorials, and insights from my journey in web
                development
            </p>
        </div>

        <div class="blog-grid">
            {#each blogs as blog, i}
                <article bind:this={blogCards[i]} class="blog-card">
                    <div class="card-image" style="background: {blog.gradient}">
                        <div class="card-category">{blog.category}</div>
                    </div>

                    <div class="card-content">
                        <div class="card-meta">
                            <span class="date">{blog.date}</span>
                            <span class="dot">•</span>
                            <span class="read-time">{blog.readTime}</span>
                        </div>

                        <h3 class="card-title">{blog.title}</h3>
                        <p class="card-excerpt">{blog.excerpt}</p>

                        <a href="#" class="read-more">
                            Read Article
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
                </article>
            {/each}
        </div>

        <div class="view-all">
            <a href="#" class="btn btn-secondary">
                View All Articles
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
        margin: 0 auto;
    }

    .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 28px;
        margin-bottom: 48px;
    }

    .blog-card {
        background: rgba(26, 26, 37, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 24px;
        overflow: hidden;
        transition: all 0.4s ease;
    }

    .blog-card:hover {
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-8px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    }

    .card-image {
        height: 180px;
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 20px;
    }

    .card-category {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 100px;
        font-size: 0.8rem;
        font-weight: 500;
        color: white;
    }

    .card-content {
        padding: 28px;
    }

    .card-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 14px;
        font-size: 0.85rem;
        color: #71717a;
    }

    .dot {
        opacity: 0.5;
    }

    .card-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.25rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 12px;
        line-height: 1.4;
        transition: color 0.3s ease;
    }

    .blog-card:hover .card-title {
        color: #6366f1;
    }

    .card-excerpt {
        font-size: 0.95rem;
        color: #a1a1aa;
        line-height: 1.7;
        margin-bottom: 20px;
    }

    .read-more {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #6366f1;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.3s ease;
    }

    .read-more:hover {
        gap: 12px;
        color: #a855f7;
    }

    .read-more svg {
        transition: transform 0.3s ease;
    }

    .read-more:hover svg {
        transform: translateX(4px);
    }

    .view-all {
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
        .blog-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
