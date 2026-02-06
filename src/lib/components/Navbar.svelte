<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { theme, language, translations } from "$lib/stores.js";

    let navbar;
    let links = [];
    let activeIndicator;
    let isScrolled = false;
    let isMobileMenuOpen = false;
    let activeSection = "home";

    $: currentTheme = $theme;
    $: currentLang = $language;
    $: t = translations[currentLang];

    const navItems = [
        { href: "#home", key: "home" },
        { href: "#about", key: "about" },
        { href: "#skills", key: "skills" },
        { href: "#projects", key: "projects" },
        { href: "#experience", key: "experience" },
        { href: "#blog", key: "blog" },
        { href: "#contact", key: "contact" },
    ];

    onMount(() => {
        // Initialize theme on mount
        document.documentElement.setAttribute("data-theme", $theme);

        // Animate navbar on load
        gsap.from(navbar, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        // Stagger animate nav links
        gsap.from(links, {
            y: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            delay: 0.5,
            ease: "power2.out",
        });

        // Handle scroll for navbar background
        const handleScroll = () => {
            isScrolled = window.scrollY > 50;

            // Update active section based on scroll position
            const sections = navItems.map((item) =>
                document.querySelector(item.href),
            );
            sections.forEach((section, index) => {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        activeSection = navItems[index].key;
                        updateIndicator(index);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);

        // Initial indicator position
        setTimeout(() => updateIndicator(0), 100);

        return () => window.removeEventListener("scroll", handleScroll);
    });

    function updateIndicator(index) {
        if (links[index] && activeIndicator) {
            const link = links[index];
            const rect = link.getBoundingClientRect();
            const navRect = navbar
                .querySelector(".nav-links")
                .getBoundingClientRect();

            gsap.to(activeIndicator, {
                x: rect.left - navRect.left,
                width: rect.width,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }

    function handleNavClick(index) {
        activeSection = navItems[index].key;
        updateIndicator(index);
        closeMobileMenu();
    }

    const toggleMobileMenu = () => {
        isMobileMenuOpen = !isMobileMenuOpen;
    };

    const closeMobileMenu = () => {
        isMobileMenuOpen = false;
    };

    const toggleTheme = () => {
        theme.toggle();
    };

    const toggleLang = () => {
        language.toggle();
    };

    // Magnetic effect for links
    function handleMouseMove(e, index) {
        const link = links[index];
        if (!link) return;

        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(link, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: "power2.out",
        });
    }

    function handleMouseLeave(index) {
        gsap.to(links[index], {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
        });
    }
</script>

<nav bind:this={navbar} class:scrolled={isScrolled} data-theme={currentTheme}>
    <div class="nav-container">
        <!-- Logo with animation -->
        <a href="#home" class="logo" on:click={() => handleNavClick(0)}>
            <div class="logo-icon">
                <span class="logo-bracket">&lt;</span>
                <span class="logo-slash">/</span>
                <span class="logo-bracket">&gt;</span>
            </div>
            <div class="logo-text">
                <span class="logo-name">Jak</span><span class="logo-accent"
                    >Dev</span
                >
            </div>
        </a>

        <!-- Navigation Links with sliding indicator -->
        <div class="nav-links-wrapper">
            <ul class="nav-links" class:open={isMobileMenuOpen}>
                <div bind:this={activeIndicator} class="active-indicator"></div>
                {#each navItems as item, i}
                    <li
                        bind:this={links[i]}
                        on:mousemove={(e) => handleMouseMove(e, i)}
                        on:mouseleave={() => handleMouseLeave(i)}
                    >
                        <a
                            href={item.href}
                            on:click={() => handleNavClick(i)}
                            class:active={activeSection === item.key}
                        >
                            {t.nav[item.key]}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Right Side Actions with enhanced styling -->
        <div class="nav-actions">
            <!-- Language Selector -->
            <button
                class="action-btn lang-btn"
                on:click={toggleLang}
                aria-label="Toggle language"
                title={currentLang === "EN"
                    ? "Switch to Indonesian"
                    : "Ganti ke Bahasa Inggris"}
            >
                <div class="btn-content">
                    <svg
                        width="16"
                        height="16"
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
                    <span class="lang-text">{currentLang}</span>
                </div>
                <div class="btn-glow"></div>
            </button>

            <!-- Theme Toggle with sun/moon animation -->
            <button
                class="action-btn theme-btn"
                on:click={toggleTheme}
                aria-label="Toggle theme"
                title={currentTheme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"}
            >
                <div class="theme-icon-wrapper">
                    <div
                        class="theme-icon"
                        class:rotated={currentTheme === "light"}
                    >
                        {#if currentTheme === "dark"}
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                                />
                            </svg>
                        {:else}
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line
                                    x1="18.36"
                                    y1="18.36"
                                    x2="19.78"
                                    y2="19.78"
                                />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line
                                    x1="4.22"
                                    y1="19.78"
                                    x2="5.64"
                                    y2="18.36"
                                />
                                <line
                                    x1="18.36"
                                    y1="5.64"
                                    x2="19.78"
                                    y2="4.22"
                                />
                            </svg>
                        {/if}
                    </div>
                </div>
                <div class="btn-glow"></div>
            </button>

            <!-- Mobile Menu Toggle -->
            <button
                class="mobile-toggle"
                on:click={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <div class="hamburger" class:open={isMobileMenuOpen}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
        </div>
    </div>

    <!-- Gradient border line -->
    <div class="nav-border" class:visible={isScrolled}></div>
</nav>

{#if isMobileMenuOpen}
    <button
        class="mobile-overlay"
        on:click={closeMobileMenu}
        aria-label="Close menu"
    ></button>
{/if}

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 16px 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    nav.scrolled {
        background: var(--nav-bg, rgba(10, 10, 15, 0.85));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        padding: 10px 0;
    }

    .nav-border {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(99, 102, 241, 0.5),
            rgba(168, 85, 247, 0.5),
            transparent
        );
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .nav-border.visible {
        opacity: 1;
    }

    .nav-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    /* Logo Styles */
    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        position: relative;
        transition: transform 0.3s ease;
    }

    .logo:hover {
        transform: scale(1.02);
    }

    .logo-icon {
        display: flex;
        align-items: center;
        font-family: "Fira Code", monospace;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .logo-bracket {
        color: #6366f1;
        transition: color 0.3s ease;
    }

    .logo-slash {
        color: #a855f7;
        animation: pulse-slash 2s ease-in-out infinite;
    }

    @keyframes pulse-slash {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .logo:hover .logo-bracket {
        color: #a855f7;
    }

    .logo-text {
        display: flex;
        align-items: center;
    }

    .logo-name {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text-primary, #ffffff);
        transition: color 0.3s ease;
    }

    .logo-accent {
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.3rem;
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Navigation Links */
    .nav-links-wrapper {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 4px;
        list-style: none;
        margin: 0;
        padding: 6px;
        background: var(--nav-links-bg, rgba(255, 255, 255, 0.03));
        border: 1px solid var(--nav-links-border, rgba(255, 255, 255, 0.06));
        border-radius: 16px;
        position: relative;
    }

    .active-indicator {
        position: absolute;
        top: 6px;
        bottom: 6px;
        left: 0;
        background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.2),
            rgba(168, 85, 247, 0.2)
        );
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 10px;
        pointer-events: none;
        z-index: 0;
    }

    .nav-links li {
        position: relative;
        z-index: 1;
    }

    .nav-links a {
        display: block;
        padding: 8px 14px;
        color: var(--text-secondary, #9ca3af);
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 500;
        border-radius: 10px;
        transition: color 0.3s ease;
        white-space: nowrap;
    }

    .nav-links a:hover {
        color: var(--text-primary, #ffffff);
    }

    .nav-links a.active {
        color: var(--text-primary, #ffffff);
    }

    /* Right Actions */
    .nav-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .action-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: var(--action-btn-bg, rgba(255, 255, 255, 0.05));
        border: 1px solid var(--action-btn-border, rgba(255, 255, 255, 0.08));
        border-radius: 12px;
        color: var(--text-secondary, #9ca3af);
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: inherit;
        overflow: hidden;
    }

    .btn-content {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        position: relative;
        z-index: 1;
    }

    .btn-glow {
        position: absolute;
        inset: -1px;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        border-radius: inherit;
        opacity: 0;
        z-index: 0;
        transition: opacity 0.3s ease;
    }

    .action-btn:hover {
        border-color: transparent;
        color: var(--text-primary, #ffffff);
    }

    .action-btn:hover .btn-glow {
        opacity: 0.15;
    }

    .lang-text {
        font-weight: 600;
        font-size: 0.85rem;
    }

    .theme-btn {
        width: 42px;
        height: 42px;
    }

    .theme-btn .btn-content {
        padding: 0;
    }

    .theme-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
    }

    .theme-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .theme-icon.rotated {
        transform: rotate(360deg);
    }

    /* Mobile Toggle */
    .mobile-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        z-index: 1001;
    }

    .hamburger {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 24px;
    }

    .hamburger span {
        width: 100%;
        height: 2px;
        background: var(--text-primary, #ffffff);
        border-radius: 2px;
        transition: all 0.3s ease;
        transform-origin: center;
    }

    .hamburger.open span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.open span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
    }

    .hamburger.open span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }

    .mobile-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 998;
        border: none;
        cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 1100px) {
        .nav-links-wrapper {
            position: static;
            transform: none;
        }

        .nav-links {
            gap: 2px;
            padding: 4px;
        }

        .nav-links a {
            padding: 8px 10px;
            font-size: 0.82rem;
        }
    }

    @media (max-width: 900px) {
        .mobile-toggle {
            display: block;
        }

        .nav-links-wrapper {
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: var(--mobile-menu-bg, rgba(18, 18, 26, 0.98));
            backdrop-filter: blur(20px);
            transition: right 0.3s ease;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-links-wrapper:has(.nav-links.open) {
            right: 0;
        }

        .nav-links {
            flex-direction: column;
            background: transparent;
            border: none;
            gap: 8px;
            padding: 24px;
        }

        .nav-links.open {
            right: 0;
        }

        .active-indicator {
            display: none;
        }

        .nav-links a {
            font-size: 1.1rem;
            padding: 16px 24px;
            text-align: center;
        }

        .nav-links a.active {
            background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.2),
                rgba(168, 85, 247, 0.2)
            );
            border-radius: 12px;
        }
    }

    @media (max-width: 480px) {
        .nav-container {
            padding: 0 16px;
        }

        .logo-icon {
            display: none;
        }

        .logo-text {
            font-size: 1.1rem;
        }

        .lang-btn .btn-content {
            padding: 8px 10px;
        }

        .theme-toggle {
            width: 38px;
            height: 38px;
        }

        .hamburger {
            width: 34px;
            height: 34px;
        }

        .hamburger span {
            width: 18px;
        }

        .nav-links-wrapper {
            width: 260px;
        }

        .nav-links a {
            font-size: 1rem;
            padding: 14px 20px;
        }
    }

    @media (max-width: 400px) {
        .nav-container {
            padding: 0 14px;
        }

        .logo-text {
            font-size: 1rem;
        }

        .logo-bracket {
            font-size: 1rem;
        }

        .nav-controls {
            gap: 6px;
        }

        .lang-btn .btn-content {
            padding: 6px 8px;
            font-size: 0.75rem;
        }

        .lang-btn .btn-content svg {
            width: 14px;
            height: 14px;
        }

        .theme-toggle {
            width: 34px;
            height: 34px;
        }

        .theme-toggle svg {
            width: 16px;
            height: 16px;
        }

        .hamburger {
            width: 32px;
            height: 32px;
        }
    }

    @media (max-width: 360px) {
        .nav-container {
            padding: 0 12px;
        }

        .logo-text {
            font-size: 0.95rem;
        }

        .lang-btn .btn-content {
            padding: 5px 6px;
        }

        .lang-btn span:not(.btn-content):not(:last-child) {
            display: none;
        }

        .theme-toggle {
            width: 32px;
            height: 32px;
        }
    }
</style>
