<script>
  import { onMount, onDestroy } from "svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Home from "$lib/components/Home.svelte";
  import About from "$lib/components/About.svelte";
  import Skills from "$lib/components/Skills.svelte";
  import Projects from "$lib/components/Projects.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import Blog from "$lib/components/Blog.svelte";
  import Contact from "$lib/components/Contact.svelte";

  let starsCanvas;
  let cursorCanvas;
  let starsCtx;
  let cursorCtx;
  let animationId;
  let cursorAnimationId;

  // Star particles
  const stars = [];
  const numStars = 150;

  // Snake cursor trail
  const trail = [];
  const trailLength = 20;
  let mouseX = 0;
  let mouseY = 0;

  function initStars() {
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function animateStars() {
    if (!starsCtx) return;

    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

    stars.forEach((star) => {
      // Update position
      star.x += star.speedX;
      star.y += star.speedY;

      // Twinkle effect
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;

      // Loop stars
      if (star.y > starsCanvas.height) {
        star.y = 0;
        star.x = Math.random() * starsCanvas.width;
      }
      if (star.x < 0) star.x = starsCanvas.width;
      if (star.x > starsCanvas.width) star.x = 0;

      // Draw star
      starsCtx.beginPath();
      starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      starsCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
      starsCtx.fill();

      // Add glow effect for larger stars
      if (star.size > 1.5) {
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        starsCtx.fillStyle = `rgba(99, 102, 241, ${star.opacity * twinkle * 0.3})`;
        starsCtx.fill();
      }
    });

    animationId = requestAnimationFrame(animateStars);
  }

  function initTrail() {
    for (let i = 0; i < trailLength; i++) {
      trail.push({ x: 0, y: 0 });
    }
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animateCursor() {
    if (!cursorCtx) return;

    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    // Update trail positions with smooth following (snake effect)
    let prevX = mouseX;
    let prevY = mouseY;

    trail.forEach((point, index) => {
      // Smooth interpolation for snake-like movement
      const ease = 0.35 - index * 0.01;
      point.x += (prevX - point.x) * ease;
      point.y += (prevY - point.y) * ease;

      prevX = point.x;
      prevY = point.y;

      // Draw circle with gradient based on position in trail
      const size = ((trailLength - index) / trailLength) * 10 + 2;
      const opacity = ((trailLength - index) / trailLength) * 0.8;

      // Gradient color from purple to indigo
      const hue = 250 + index * 2;

      cursorCtx.beginPath();
      cursorCtx.arc(point.x, point.y, size, 0, Math.PI * 2);
      cursorCtx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
      cursorCtx.fill();

      // Add inner glow
      if (index < 5) {
        cursorCtx.beginPath();
        cursorCtx.arc(point.x, point.y, size * 0.5, 0, Math.PI * 2);
        cursorCtx.fillStyle = `hsla(${hue}, 80%, 80%, ${opacity * 0.5})`;
        cursorCtx.fill();
      }
    });

    cursorAnimationId = requestAnimationFrame(animateCursor);
  }

  function resizeCanvas() {
    if (starsCanvas) {
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
    }
    if (cursorCanvas) {
      cursorCanvas.width = window.innerWidth;
      cursorCanvas.height = window.innerHeight;
    }
  }

  onMount(() => {
    // Initialize stars canvas
    starsCtx = starsCanvas.getContext("2d");
    cursorCtx = cursorCanvas.getContext("2d");

    resizeCanvas();
    initStars();
    initTrail();
    animateStars();
    animateCursor();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (cursorAnimationId) cancelAnimationFrame(cursorAnimationId);
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });
</script>

<div class="page-wrapper">
  <!-- Stars Canvas -->
  <canvas bind:this={starsCanvas} class="stars-canvas"></canvas>

  <!-- Cursor Trail Canvas -->
  <canvas bind:this={cursorCanvas} class="cursor-canvas"></canvas>

  <!-- Global Background Effects -->
  <div class="global-bg">
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    <div class="gradient-orb orb-4"></div>
    <div class="grid-pattern"></div>
  </div>

  <Navbar />

  <main>
    <Home />
    <About />
    <Skills />
    <Projects />
    <Experience />
    <Blog />
    <Contact />
  </main>
</div>

<style>
  .page-wrapper {
    position: relative;
    min-height: 100vh;
  }

  .stars-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .cursor-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
  }

  .global-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  .gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
  }

  .orb-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.15) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    top: -100px;
    right: -100px;
    animation: float1 20s ease-in-out infinite;
  }

  .orb-2 {
    width: 500px;
    height: 500px;
    background: linear-gradient(
      225deg,
      rgba(139, 92, 246, 0.12) 0%,
      rgba(168, 85, 247, 0.08) 100%
    );
    top: 30%;
    left: -150px;
    animation: float2 25s ease-in-out infinite;
  }

  .orb-3 {
    width: 450px;
    height: 450px;
    background: linear-gradient(
      45deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(79, 70, 229, 0.08) 100%
    );
    top: 60%;
    right: -100px;
    animation: float3 22s ease-in-out infinite;
  }

  .orb-4 {
    width: 400px;
    height: 400px;
    background: linear-gradient(
      315deg,
      rgba(168, 85, 247, 0.1) 0%,
      rgba(139, 92, 246, 0.08) 100%
    );
    bottom: 10%;
    left: 10%;
    animation: float4 18s ease-in-out infinite;
  }

  @keyframes float1 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(-50px, 30px) scale(1.05);
    }
    50% {
      transform: translate(-20px, 60px) scale(1);
    }
    75% {
      transform: translate(30px, 20px) scale(0.95);
    }
  }

  @keyframes float2 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(40px, -20px) scale(1.08);
    }
    50% {
      transform: translate(80px, 30px) scale(1);
    }
    75% {
      transform: translate(20px, 50px) scale(0.92);
    }
  }

  @keyframes float3 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(-30px, -40px) scale(0.95);
    }
    50% {
      transform: translate(-60px, 20px) scale(1.05);
    }
    75% {
      transform: translate(-20px, -20px) scale(1);
    }
  }

  @keyframes float4 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(50px, 30px) scale(1.06);
    }
    50% {
      transform: translate(30px, -40px) scale(0.94);
    }
    75% {
      transform: translate(-30px, -20px) scale(1.02);
    }
  }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(99, 102, 241, 0.03) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  main {
    position: relative;
    z-index: 1;
  }
</style>
