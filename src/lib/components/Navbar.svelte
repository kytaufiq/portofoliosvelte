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

    // Lock body scroll when drawer is open
    $: {
        if (typeof document !== "undefined") {
            if (isMobileMenuOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }
    }

    const navItems = [
        { href: "#home", key: "home" },
        { href: "#about", key: "about" },
        { href: "#skills", key: "skills" },
        { href: "#projects", key: "projects" },
        { href: "#experience", key: "experience" },
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

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.body.style.overflow = "";
        };
    });

    function updateIndicator(index) {
        if (links[index] && activeIndicator) {
            const link = links[index];
            const rect = link.getBoundingClientRect();
            const navLinksEl = navbar.querySelector(".nav-links");
            if (!navLinksEl) return;
            const navRect = navLinksEl.getBoundingClientRect();

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

    // Magnetic effect for links (desktop only)
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

<nav
    bind:this={navbar}
    class:scrolled={isScrolled}
    class:menu-open={isMobileMenuOpen}
    data-theme={currentTheme}
>
    <div class="nav-container">
        <!-- Logo -->
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

        <!-- Desktop Navigation Links with sliding indicator -->
        <div class="nav-links-wrapper desktop-nav">
            <ul class="nav-links">
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

        <!-- Right Side Actions -->
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

            <!-- Theme Toggle -->
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

            <!-- Hamburger Button (mobile only) -->
            <button
                class="mobile-toggle"
                on:click={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
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

<!-- Mobile Drawer Backdrop -->
{#if isMobileMenuOpen}
    <button
        class="mobile-backdrop"
        on:click={closeMobileMenu}
        aria-label="Close menu"
        tabindex="-1"
    ></button>
{/if}

<!-- Mobile Drawer -->
<aside
    class="mobile-drawer"
    class:open={isMobileMenuOpen}
    aria-hidden={!isMobileMenuOpen}
>
    <!-- Drawer Header -->
    <div class="drawer-header">
        <a href="#home" class="drawer-logo" on:click={closeMobileMenu}>
            <span class="logo-bracket">&lt;</span><span class="logo-slash"
                >/</span
            ><span class="logo-bracket">&gt;</span>
            <span class="logo-name">Jak</span><span class="logo-accent"
                >Dev</span
            >
        </a>
        <button
            class="drawer-close"
            on:click={closeMobileMenu}
            aria-label="Close navigation"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
    </div>

    <!-- Drawer Nav Links -->
    <nav class="drawer-nav" aria-label="Mobile navigation">
        <ul class="drawer-links">
            {#each navItems as item, i}
                <li>
                    <a
                        href={item.href}
                        class="drawer-link"
                        class:active={activeSection === item.key}
                        on:click={() => handleNavClick(i)}
                    >
                        <span class="drawer-link-num">0{i + 1}</span>
                        <span class="drawer-link-text">{t.nav[item.key]}</span>
                        <span class="drawer-link-arrow">→</span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <!-- Drawer Footer -->
    <div class="drawer-footer">
        <div class="drawer-divider"></div>
        <p class="drawer-tagline">Building digital experiences ✨</p>
    </div>
</aside>

<style>
    /* ── NAVBAR BASE ─────────────────────────────────────────────────────────── */
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

    /* Lower z-index when mobile drawer is open to prevent bleed-through */
    nav.menu-open {
        z-index: 990;
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

    /* ── LOGO ────────────────────────────────────────────────────────────────── */
    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        position: relative;
        transition: transform 0.3s ease;
        flex-shrink: 0;
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

    /* ── DESKTOP NAV LINKS ───────────────────────────────────────────────────── */
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

    /* ── RIGHT ACTIONS ───────────────────────────────────────────────────────── */
    .nav-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
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

    /* ── HAMBURGER ───────────────────────────────────────────────────────────── */
    .mobile-toggle {
        display: none;
        background: var(--action-btn-bg, rgba(255, 255, 255, 0.05));
        border: 1px solid var(--action-btn-border, rgba(255, 255, 255, 0.08));
        border-radius: 10px;
        cursor: pointer;
        padding: 8px 10px;
        z-index: 1001;
        position: relative;
        transition: all 0.3s ease;
    }

    .mobile-toggle:hover {
        background: rgba(99, 102, 241, 0.1);
        border-color: rgba(99, 102, 241, 0.3);
    }

    .hamburger {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 22px;
    }

    .hamburger span {
        width: 100%;
        height: 2px;
        background: var(--text-primary, #ffffff);
        border-radius: 2px;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
        display: block;
    }

    .hamburger.open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }

    .hamburger.open span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
    }

    .hamburger.open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }

    /* ── MOBILE BACKDROP ─────────────────────────────────────────────────────── */
    .mobile-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 1090;
        border: none;
        cursor: pointer;
        animation: fadeIn 0.25s ease forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* ── MOBILE DRAWER ───────────────────────────────────────────────────────── */
    .mobile-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 80%;
        max-width: 320px;
        height: 100vh;
        height: 100dvh;
        background: #09090f;
        border-left: 1px solid rgba(99, 102, 241, 0.2);
        z-index: 1100;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
        overscroll-behavior: contain;
    }

    .mobile-drawer.open {
        transform: translateX(0);
    }

    /* ── DRAWER HEADER ───────────────────────────────────────────────────────── */
    .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 20px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: #09090f;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .drawer-logo {
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: "Space Grotesk", sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        text-decoration: none;
        color: inherit;
    }

    .drawer-logo .logo-bracket {
        font-family: "Fira Code", monospace;
        font-size: 1rem;
        color: #6366f1;
    }

    .drawer-logo .logo-slash {
        font-family: "Fira Code", monospace;
        font-size: 1rem;
        color: #a855f7;
        margin: 0 1px;
    }

    .drawer-logo .logo-name {
        color: var(--text-primary, #fff);
        font-size: 1.1rem;
        margin-left: 6px;
    }

    .drawer-logo .logo-accent {
        font-size: 1.1rem;
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .drawer-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: var(--text-secondary, #9ca3af);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .drawer-close:hover {
        background: rgba(239, 68, 68, 0.15);
        border-color: rgba(239, 68, 68, 0.3);
        color: #f87171;
    }

    /* ── DRAWER NAV LINKS ────────────────────────────────────────────────────── */
    .drawer-nav {
        flex: 1;
        padding: 16px 0;
    }

    .drawer-links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .drawer-link {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 24px;
        color: var(--text-secondary, #9ca3af);
        text-decoration: none;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.25s ease;
        border-left: 2px solid transparent;
        position: relative;
    }

    .drawer-link:hover,
    .drawer-link.active {
        color: var(--text-primary, #ffffff);
        background: rgba(99, 102, 241, 0.07);
        border-left-color: #6366f1;
    }

    .drawer-link.active {
        background: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0.12),
            rgba(168, 85, 247, 0.06)
        );
        border-left-color: #a855f7;
        color: #c4b5fd;
    }

    .drawer-link-num {
        font-family: "Fira Code", monospace;
        font-size: 0.72rem;
        color: rgba(168, 85, 247, 0.55);
        font-weight: 600;
        flex-shrink: 0;
        min-width: 22px;
    }

    .drawer-link.active .drawer-link-num {
        color: #a855f7;
    }

    .drawer-link-text {
        flex: 1;
        letter-spacing: 0.01em;
    }

    .drawer-link-arrow {
        opacity: 0;
        transform: translateX(-6px);
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .drawer-link:hover .drawer-link-arrow,
    .drawer-link.active .drawer-link-arrow {
        opacity: 1;
        transform: translateX(0);
    }

    /* ── DRAWER FOOTER ───────────────────────────────────────────────────────── */
    .drawer-footer {
        padding: 20px 24px 32px;
    }

    .drawer-divider {
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(99, 102, 241, 0.3),
            transparent
        );
        margin-bottom: 20px;
    }

    .drawer-tagline {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.3);
        text-align: center;
        margin: 0;
        letter-spacing: 0.03em;
    }

    /* ── RESPONSIVE ──────────────────────────────────────────────────────────── */
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

        /* Hide desktop pill nav on mobile */
        .desktop-nav {
            display: none;
        }

        .nav-container {
            gap: 8px;
        }
    }

    @media (max-width: 480px) {
        .nav-container {
            padding: 0 16px;
        }

        .logo-icon {
            display: none;
        }

        /* Hide language button on small screens to prevent overflow */
        .lang-btn {
            display: none;
        }

        .nav-actions {
            gap: 8px;
        }
    }

    @media (max-width: 360px) {
        .nav-container {
            padding: 0 12px;
        }

        .theme-btn {
            width: 38px;
            height: 38px;
        }
    }
</style>
