<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    let section;
    let header;
    let formContainer;
    let contactInfo = [];

    const contacts = [
        {
            icon: "📧",
            label: "Email",
            value: "hello@zaky.dev",
            link: "mailto:hello@zaky.dev",
        },
        {
            icon: "📍",
            label: "Location",
            value: "Indonesia",
            link: null,
        },
        {
            icon: "💼",
            label: "LinkedIn",
            value: "linkedin.com/in/zaky",
            link: "https://linkedin.com",
        },
    ];

    const socials = [
        { name: "GitHub", icon: "gh", link: "#" },
        { name: "Twitter", icon: "tw", link: "#" },
        { name: "LinkedIn", icon: "li", link: "#" },
        { name: "Instagram", icon: "ig", link: "#" },
    ];

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Set initial states
        gsap.set(header, { y: 60, opacity: 0 });
        gsap.set(formContainer, { x: 60, opacity: 0 });

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

        // Contact info cards animation with stagger and smooth scrub
        contactInfo.forEach((card, index) => {
            if (card) {
                gsap.set(card, { x: -60, opacity: 0 });
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: section,
                        start: `top ${80 - index * 3}%`,
                        end: "top 30%",
                        scrub: 0.8,
                        toggleActions: "play reverse play reverse",
                    },
                    x: 0,
                    opacity: 1,
                    ease: "power2.out",
                });
            }
        });

        // Form container animation with smooth scrub
        gsap.to(formContainer, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 30%",
                scrub: 0.8,
                toggleActions: "play reverse play reverse",
            },
            x: 0,
            opacity: 1,
            ease: "power2.out",
        });
    });

    function handleSubmit(e) {
        e.preventDefault();
        // Handle form submission
        alert("Thank you for your message! I'll get back to you soon.");
    }
</script>

<section id="contact" bind:this={section}>
    <div class="container">
        <div bind:this={header} class="section-header">
            <div class="section-label">Contact</div>
            <h2 class="section-title">
                Let's Work <span class="gradient-text">Together</span>
            </h2>
            <p class="section-subtitle">
                Have a project in mind? I'd love to hear from you. Let's create
                something amazing!
            </p>
        </div>

        <div class="contact-grid">
            <div class="contact-info">
                <h3 class="info-title">Get in Touch</h3>
                <p class="info-text">
                    I'm currently available for freelance projects and full-time
                    opportunities. Feel free to reach out if you want to
                    collaborate or just say hi!
                </p>

                <div class="contact-cards">
                    {#each contacts as contact, i}
                        <div bind:this={contactInfo[i]} class="contact-card">
                            <span class="contact-icon">{contact.icon}</span>
                            <div class="contact-details">
                                <span class="contact-label"
                                    >{contact.label}</span
                                >
                                {#if contact.link}
                                    <a href={contact.link} class="contact-value"
                                        >{contact.value}</a
                                    >
                                {:else}
                                    <span class="contact-value"
                                        >{contact.value}</span
                                    >
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="social-links">
                    <p class="social-label">Follow me on</p>
                    <div class="socials">
                        {#each socials as social}
                            <a
                                href={social.link}
                                class="social-link"
                                aria-label={social.name}
                            >
                                {#if social.icon === "gh"}
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                        />
                                    </svg>
                                {:else if social.icon === "tw"}
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                                        />
                                    </svg>
                                {:else if social.icon === "li"}
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                        />
                                    </svg>
                                {:else if social.icon === "ig"}
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                        />
                                    </svg>
                                {/if}
                            </a>
                        {/each}
                    </div>
                </div>
            </div>

            <div bind:this={formContainer} class="contact-form-wrapper">
                <form class="contact-form" on:submit={handleSubmit}>
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            placeholder="Project Inquiry"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            placeholder="Tell me about your project..."
                            required
                        ></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <p class="copyright">
                © 2024 Zaky. Crafted with 💜 using Svelte & GSAP
            </p>
        </div>
    </footer>
</section>

<style>
    section {
        padding: 120px 0 0;
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

    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: start;
    }

    .info-title {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.8rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 16px;
    }

    .info-text {
        font-size: 1rem;
        color: #a1a1aa;
        line-height: 1.7;
        margin-bottom: 32px;
    }

    .contact-cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 32px;
    }

    .contact-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: rgba(26, 26, 37, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        transition: all 0.3s ease;
    }

    .contact-card:hover {
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateX(8px);
    }

    .contact-icon {
        font-size: 1.8rem;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 14px;
    }

    .contact-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .contact-label {
        font-size: 0.85rem;
        color: #71717a;
    }

    .contact-value {
        font-size: 1rem;
        color: #ffffff;
        text-decoration: none;
        font-weight: 500;
    }

    a.contact-value:hover {
        color: #6366f1;
    }

    .social-links {
        margin-top: 32px;
    }

    .social-label {
        font-size: 0.9rem;
        color: #71717a;
        margin-bottom: 16px;
    }

    .socials {
        display: flex;
        gap: 12px;
    }

    .social-link {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(26, 26, 37, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        color: #a1a1aa;
        transition: all 0.3s ease;
    }

    .social-link:hover {
        border-color: rgba(99, 102, 241, 0.5);
        color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
        transform: translateY(-4px);
    }

    .contact-form-wrapper {
        background: rgba(26, 26, 37, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 24px;
        padding: 40px;
        backdrop-filter: blur(20px);
    }

    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group label {
        font-size: 0.9rem;
        color: #a1a1aa;
        font-weight: 500;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 16px 20px;
        background: rgba(10, 10, 15, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        color: #ffffff;
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.3s ease;
        outline: none;
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
        color: #52525b;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .form-group textarea {
        resize: vertical;
        min-height: 140px;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 18px 32px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 1rem;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }

    .btn-primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 0 50px rgba(99, 102, 241, 0.5);
    }

    .footer {
        margin-top: 100px;
        padding: 32px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .copyright {
        text-align: center;
        font-size: 0.9rem;
        color: #71717a;
    }

    @media (max-width: 968px) {
        .contact-grid {
            grid-template-columns: 1fr;
            gap: 48px;
        }
    }

    @media (max-width: 480px) {
        .contact-form-wrapper {
            padding: 24px;
        }
    }
</style>
