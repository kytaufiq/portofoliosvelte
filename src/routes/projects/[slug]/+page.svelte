<script>
    import { onMount, onDestroy } from "svelte";
    import gsap from "gsap";

    export let data;
    const { project } = data;

    let pageContainer;
    let mediaSection;
    let infoSection;
    let detailsPanel;

    // ── Video Player State ──────────────────────────────────────────
    let videoEl;
    let playerWrapper;
    let progressBar;

    let isPlaying = false;
    let isMuted = false;
    let isFullscreen = false;
    let volume = 1;
    let currentTime = 0;
    let duration = 0;
    let buffered = 0;
    let showControls = true;
    let controlsTimer;
    let isDragging = false;

    // Format seconds → "m:ss"
    function formatTime(sec) {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60)
            .toString()
            .padStart(2, "0");
        return `${m}:${s}`;
    }

    function togglePlay() {
        if (!videoEl) return;
        if (videoEl.paused) {
            videoEl.play();
        } else {
            videoEl.pause();
        }
    }

    function toggleMute() {
        if (!videoEl) return;
        videoEl.muted = !videoEl.muted;
        isMuted = videoEl.muted;
    }

    function onVolumeChange() {
        if (!videoEl) return;
        videoEl.volume = volume;
        isMuted = volume === 0;
        videoEl.muted = isMuted;
    }

    function onTimeUpdate() {
        if (!videoEl || isDragging) return;
        currentTime = videoEl.currentTime;
        // Update buffered
        if (videoEl.buffered.length > 0) {
            buffered = videoEl.buffered.end(videoEl.buffered.length - 1);
        }
    }

    function onLoadedMetadata() {
        if (!videoEl) return;
        duration = videoEl.duration;
    }

    function onPlay() {
        isPlaying = true;
    }
    function onPause() {
        isPlaying = false;
    }

    // Progress bar seeking
    function seek(e) {
        if (!progressBar || !videoEl) return;
        const rect = progressBar.getBoundingClientRect();
        const ratio = Math.min(
            Math.max((e.clientX - rect.left) / rect.width, 0),
            1,
        );
        videoEl.currentTime = ratio * duration;
        currentTime = videoEl.currentTime;
    }

    function onProgressMouseDown(e) {
        isDragging = true;
        seek(e);
        window.addEventListener("mousemove", onProgressMouseMove);
        window.addEventListener("mouseup", onProgressMouseUp);
    }
    function onProgressMouseMove(e) {
        if (isDragging) seek(e);
    }
    function onProgressMouseUp(e) {
        isDragging = false;
        window.removeEventListener("mousemove", onProgressMouseMove);
        window.removeEventListener("mouseup", onProgressMouseUp);
    }

    // Touch support for progress bar
    function onProgressTouchStart(e) {
        isDragging = true;
        seekTouch(e);
    }
    function onProgressTouchMove(e) {
        if (isDragging) seekTouch(e);
    }
    function onProgressTouchEnd() {
        isDragging = false;
    }
    function seekTouch(e) {
        if (!progressBar || !videoEl) return;
        const touch = e.touches[0];
        const rect = progressBar.getBoundingClientRect();
        const ratio = Math.min(
            Math.max((touch.clientX - rect.left) / rect.width, 0),
            1,
        );
        videoEl.currentTime = ratio * duration;
        currentTime = videoEl.currentTime;
    }

    // Skip ±10 seconds
    function skip(sec) {
        if (!videoEl) return;
        videoEl.currentTime = Math.min(
            Math.max(videoEl.currentTime + sec, 0),
            duration,
        );
    }

    // Fullscreen
    function toggleFullscreen() {
        if (!playerWrapper) return;
        if (!document.fullscreenElement) {
            playerWrapper.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    function onFullscreenChange() {
        isFullscreen = !!document.fullscreenElement;
    }

    // Auto-hide controls
    function scheduleHideControls() {
        clearTimeout(controlsTimer);
        showControls = true;
        controlsTimer = setTimeout(() => {
            if (isPlaying) showControls = false;
        }, 3000);
    }

    function onPlayerMouseMove() {
        scheduleHideControls();
    }
    function onPlayerMouseLeave() {
        if (isPlaying) {
            controlsTimer = setTimeout(() => {
                showControls = false;
            }, 800);
        }
    }

    // Keyboard shortcuts
    function onKeydown(e) {
        if (!videoEl) return;
        switch (e.key) {
            case " ":
            case "k":
                e.preventDefault();
                togglePlay();
                break;
            case "ArrowRight":
                e.preventDefault();
                skip(10);
                break;
            case "ArrowLeft":
                e.preventDefault();
                skip(-10);
                break;
            case "m":
                toggleMute();
                break;
            case "f":
                toggleFullscreen();
                break;
        }
    }

    // Progress percentages
    $: progressPercent = duration ? (currentTime / duration) * 100 : 0;
    $: bufferedPercent = duration ? (buffered / duration) * 100 : 0;

    // ── Page Animations ─────────────────────────────────────────────
    onMount(() => {
        gsap.set(pageContainer, { opacity: 0 });
        gsap.set(mediaSection, { y: 40, opacity: 0 });
        gsap.set(infoSection, { y: 60, opacity: 0 });
        gsap.set(detailsPanel, { x: 40, opacity: 0 });

        const tl = gsap.timeline();
        tl.to(pageContainer, { opacity: 1, duration: 0.3, ease: "power2.out" })
            .to(
                mediaSection,
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.1",
            )
            .to(
                infoSection,
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.4",
            )
            .to(
                detailsPanel,
                { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
                "-=0.3",
            );

        document.addEventListener("fullscreenchange", onFullscreenChange);
        document.addEventListener("keydown", onKeydown);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                onFullscreenChange,
            );
            document.removeEventListener("keydown", onKeydown);
            window.removeEventListener("mousemove", onProgressMouseMove);
            window.removeEventListener("mouseup", onProgressMouseUp);
            clearTimeout(controlsTimer);
        };
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
                        <!-- ── Custom Video Player ── -->
                        <div
                            class="video-player"
                            class:hide-cursor={!showControls}
                            bind:this={playerWrapper}
                            on:mousemove={onPlayerMouseMove}
                            on:mouseleave={onPlayerMouseLeave}
                        >
                            <!-- Video Element -->
                            <video
                                bind:this={videoEl}
                                src={project.mediaUrl}
                                class="hero-media"
                                muted={isMuted}
                                loop
                                playsinline
                                preload="metadata"
                                on:timeupdate={onTimeUpdate}
                                on:loadedmetadata={onLoadedMetadata}
                                on:play={onPlay}
                                on:pause={onPause}
                                on:click={togglePlay}
                            >
                                <track kind="captions" />
                            </video>

                            <!-- Center Play Button (big overlay when paused) -->
                            {#if !isPlaying}
                                <button
                                    class="center-play"
                                    on:click={togglePlay}
                                    aria-label="Play"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <polygon points="5,3 19,12 5,21" />
                                    </svg>
                                </button>
                            {/if}

                            <!-- Controls Bar -->
                            <div
                                class="controls"
                                class:visible={showControls || !isPlaying}
                            >
                                <!-- Progress Bar -->
                                <div
                                    class="progress-area"
                                    bind:this={progressBar}
                                    on:mousedown={onProgressMouseDown}
                                    on:touchstart|preventDefault={onProgressTouchStart}
                                    on:touchmove|preventDefault={onProgressTouchMove}
                                    on:touchend={onProgressTouchEnd}
                                    role="slider"
                                    aria-label="Video progress"
                                    aria-valuemin="0"
                                    aria-valuemax={duration}
                                    aria-valuenow={currentTime}
                                    tabindex="0"
                                >
                                    <div class="progress-track">
                                        <!-- Buffered -->
                                        <div
                                            class="progress-buffered"
                                            style="width: {bufferedPercent}%"
                                        ></div>
                                        <!-- Played -->
                                        <div
                                            class="progress-played"
                                            style="width: {progressPercent}%"
                                        >
                                            <div class="progress-thumb"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Bottom Controls Row -->
                                <div class="controls-row">
                                    <!-- Left side -->
                                    <div class="controls-left">
                                        <!-- Play/Pause -->
                                        <button
                                            class="ctrl-btn"
                                            on:click={togglePlay}
                                            aria-label={isPlaying
                                                ? "Pause"
                                                : "Play"}
                                        >
                                            {#if isPlaying}
                                                <!-- Pause icon -->
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <rect
                                                        x="6"
                                                        y="4"
                                                        width="4"
                                                        height="16"
                                                        rx="1"
                                                    />
                                                    <rect
                                                        x="14"
                                                        y="4"
                                                        width="4"
                                                        height="16"
                                                        rx="1"
                                                    />
                                                </svg>
                                            {:else}
                                                <!-- Play icon -->
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <polygon
                                                        points="5,3 19,12 5,21"
                                                    />
                                                </svg>
                                            {/if}
                                        </button>

                                        <!-- Skip back 10s -->
                                        <button
                                            class="ctrl-btn"
                                            on:click={() => skip(-10)}
                                            aria-label="Back 10 seconds"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path
                                                    d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
                                                />
                                                <text
                                                    x="8.5"
                                                    y="15.5"
                                                    font-size="5"
                                                    font-weight="bold"
                                                    fill="currentColor"
                                                    text-anchor="middle"
                                                    >10</text
                                                >
                                            </svg>
                                        </button>

                                        <!-- Skip forward 10s -->
                                        <button
                                            class="ctrl-btn"
                                            on:click={() => skip(10)}
                                            aria-label="Forward 10 seconds"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path
                                                    d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"
                                                />
                                                <text
                                                    x="15.5"
                                                    y="15.5"
                                                    font-size="5"
                                                    font-weight="bold"
                                                    fill="currentColor"
                                                    text-anchor="middle"
                                                    >10</text
                                                >
                                            </svg>
                                        </button>

                                        <!-- Volume -->
                                        <div class="volume-group">
                                            <button
                                                class="ctrl-btn"
                                                on:click={toggleMute}
                                                aria-label="Toggle mute"
                                            >
                                                {#if isMuted || volume === 0}
                                                    <!-- Muted -->
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                                                        />
                                                    </svg>
                                                {:else if volume < 0.5}
                                                    <!-- Low volume -->
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"
                                                        />
                                                    </svg>
                                                {:else}
                                                    <!-- Full volume -->
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                                                        />
                                                    </svg>
                                                {/if}
                                            </button>
                                            <input
                                                type="range"
                                                class="volume-slider"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                bind:value={volume}
                                                on:input={onVolumeChange}
                                                aria-label="Volume"
                                            />
                                        </div>

                                        <!-- Time display -->
                                        <span class="time-display">
                                            {formatTime(currentTime)} / {formatTime(
                                                duration,
                                            )}
                                        </span>
                                    </div>

                                    <!-- Right side -->
                                    <div class="controls-right">
                                        <!-- Fullscreen -->
                                        <button
                                            class="ctrl-btn"
                                            on:click={toggleFullscreen}
                                            aria-label="Fullscreen"
                                        >
                                            {#if isFullscreen}
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                                                    />
                                                </svg>
                                            {:else}
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                                                    />
                                                </svg>
                                            {/if}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
        position: relative;
        background: #000;
    }

    .hero-media {
        width: 100%;
        height: 100%;
        object-fit: contain;   /* ✅ Tidak akan terpotong */
    background: #000;
        display: block;
    }
    video:fullscreen,
    video:-webkit-full-screen {
        width: 100vw;
        height: 100vh;
        object-fit: contain;
    }

    /* ── Custom Video Player ── */
    .video-player {
        position: relative;
        width: 100%;
        height: 100%;
        background: #000;
        cursor: default;
    }

    .video-player.hide-cursor {
        cursor: none;
    }

    /* Center Play Button */
    .center-play {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.35);
        border: none;
        cursor: pointer;
        z-index: 5;
        transition: background 0.2s ease;
    }
    .center-play:hover {
        background: rgba(0, 0, 0, 0.5);
    }
    .center-play svg {
        width: 72px;
        height: 72px;
        color: #fff;
        filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.7));
        transition: transform 0.2s ease;
    }
    .center-play:hover svg {
        transform: scale(1.1);
    }

    /* Controls bar */
    .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.85) 100%);
        padding: 40px 16px 12px;
        opacity: 0;
        transform: translateY(4px);
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        pointer-events: none;
    }
    .controls.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
    }

    /* Progress Area */
    .progress-area {
        cursor: pointer;
        padding: 8px 0;
        margin-bottom: 8px;
    }

    .progress-track {
        position: relative;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 99px;
        overflow: visible;
        transition: height 0.15s ease;
    }

    .progress-area:hover .progress-track {
        height: 6px;
    }

    .progress-buffered {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 99px;
        transition: width 0.3s linear;
    }

    .progress-played {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: linear-gradient(90deg, #a855f7, #6366f1);
        border-radius: 99px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        transition: width 0.1s linear;
    }

    .progress-thumb {
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(168, 85, 247, 0.8);
        transform: scale(0);
        transition: transform 0.15s ease;
        flex-shrink: 0;
        margin-right: -7px;
    }

    .progress-area:hover .progress-thumb {
        transform: scale(1);
    }

    /* Controls Row */
    .controls-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    .controls-left,
    .controls-right {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    /* Control Buttons */
    .ctrl-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: none;
        border: none;
        cursor: pointer;
        color: #fff;
        border-radius: 6px;
        transition:
            background 0.2s ease,
            transform 0.15s ease;
        padding: 0;
    }
    .ctrl-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        transform: scale(1.1);
    }
    .ctrl-btn svg {
        width: 20px;
        height: 20px;
    }

    /* Volume Group */
    .volume-group {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .volume-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 0;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 99px;
        outline: none;
        cursor: pointer;
        overflow: hidden;
        max-width: 0;
        opacity: 0;
        transition:
            max-width 0.3s ease,
            opacity 0.3s ease;
    }

    .volume-group:hover .volume-slider {
        max-width: 80px;
        width: 80px;
        opacity: 1;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: -80px 0 0 78px #a855f7;
    }

    .volume-slider::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
    }

    /* Time Display */
    .time-display {
        font-size: 0.82rem;
        color: #fff;
        font-weight: 500;
        white-space: nowrap;
        margin-left: 4px;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }

    /* Content Grid */
    .content-grid {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 60px;
        align-items: start;
    }

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
            padding: 20px;
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
        .time-display {
            font-size: 0.75rem;
        }
        .volume-group:hover .volume-slider {
            max-width: 60px;
            width: 60px;
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
        .ctrl-btn {
            width: 30px;
            height: 30px;
        }
        .ctrl-btn svg {
            width: 17px;
            height: 17px;
        }
        .center-play svg {
            width: 52px;
            height: 52px;
        }
        .time-display {
            display: none;
        }
    }
</style>
