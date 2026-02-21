<script>
  import { onMount, onDestroy } from "svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Home from "$lib/components/Home.svelte";
  import About from "$lib/components/About.svelte";
  import Skills from "$lib/components/Skills.svelte";
  import Projects from "$lib/components/Projects.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import Contact from "$lib/components/Contact.svelte";

  let starsCanvas;
  let cursorCanvas;
  let starsCtx;
  let cursorCtx;
  let animationId;
  let cursorAnimationId;
  let isMobile = false;

  // ── Stars ────────────────────────────────────────────────────────
  const stars = [];
  const NUM_STARS = 350;

  // ── Meteor ───────────────────────────────────────────────────────
  let meteor = null; // one meteor at a time
  let meteorTimer = null;

  // ── Cursor trail ─────────────────────────────────────────────────
  const trail = [];
  const trailLength = 20;
  let mouseX = 0;
  let mouseY = 0;

  // Star color palette
  const STAR_COLORS = [
    [255, 255, 255], // pure white
    [200, 210, 255], // cool blue-white
    [255, 240, 200], // warm yellow-white
    [210, 180, 255], // soft purple
    [180, 220, 255], // sky blue
  ];

  function randomStarColor() {
    return STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
  }

  function createStar(randomPos = true) {
    const angle = Math.random() * Math.PI * 2; // full 360° direction
    const speed = Math.random() * 0.25 + 0.05; // slow drift
    return {
      x: randomPos
        ? Math.random() * (starsCanvas?.width || window.innerWidth)
        : Math.random() * window.innerWidth,
      y: randomPos
        ? Math.random() * (starsCanvas?.height || window.innerHeight)
        : Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.3,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      baseOpacity: Math.random() * 0.5 + 0.3,
      // multi‑layer twinkle for realism
      twinkleA: {
        speed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
      },
      twinkleB: {
        speed: Math.random() * 0.007 + 0.003,
        phase: Math.random() * Math.PI * 2,
      },
      color: randomStarColor(),
      isBright: Math.random() < 0.12, // 12% chance of sparkle cross
    };
  }

  function initStars() {
    for (let i = 0; i < NUM_STARS; i++) stars.push(createStar(true));
  }

  function drawSparkle(ctx, x, y, size, opacity) {
    // 4-point star cross
    const arms = size * 4;
    ctx.save();
    ctx.globalAlpha = opacity * 0.6;
    ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
    ctx.lineWidth = size * 0.4;
    ctx.beginPath();
    ctx.moveTo(x - arms, y);
    ctx.lineTo(x + arms, y);
    ctx.moveTo(x, y - arms);
    ctx.lineTo(x, y + arms);
    // diagonal arms (shorter)
    const d = arms * 0.55;
    ctx.moveTo(x - d, y - d);
    ctx.lineTo(x + d, y + d);
    ctx.moveTo(x + d, y - d);
    ctx.lineTo(x - d, y + d);
    ctx.stroke();
    ctx.restore();
  }

  function animateStars() {
    if (!starsCtx) return;

    const W = starsCanvas.width;
    const H = starsCanvas.height;
    starsCtx.clearRect(0, 0, W, H);

    const now = performance.now() * 0.001;

    stars.forEach((star) => {
      // Update position
      star.x += star.speedX;
      star.y += star.speedY;

      // Wrap around all 4 edges
      if (star.x < -2) star.x = W + 2;
      if (star.x > W + 2) star.x = -2;
      if (star.y < -2) star.y = H + 2;
      if (star.y > H + 2) star.y = -2;

      // Multi-layer twinkle (realistic)
      star.twinkleA.phase += star.twinkleA.speed;
      star.twinkleB.phase += star.twinkleB.speed;
      const twinkle =
        Math.sin(star.twinkleA.phase) * 0.35 +
        Math.sin(star.twinkleB.phase) * 0.15 +
        0.5;
      const opacity = Math.max(0, Math.min(1, star.baseOpacity * twinkle));
      const [r, g, b] = star.color;

      // Outer glow for bright stars
      if (star.size > 1.2) {
        const grad = starsCtx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 3.5,
        );
        grad.addColorStop(0, `rgba(${r},${g},${b},${opacity * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
        starsCtx.fillStyle = grad;
        starsCtx.fill();
      }

      // Core dot
      starsCtx.beginPath();
      starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      starsCtx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
      starsCtx.fill();

      // Sparkle cross for bright stars
      if (star.isBright && opacity > 0.45) {
        drawSparkle(starsCtx, star.x, star.y, star.size, opacity);
      }
    });

    // Draw meteor if active
    if (meteor) drawMeteor();

    animationId = requestAnimationFrame(animateStars);
  }

  // ── Meteor ───────────────────────────────────────────────────────
  function spawnMeteor() {
    const W = starsCanvas?.width || window.innerWidth;
    const H = starsCanvas?.height || window.innerHeight;
    // Start from top edge (random X), angle slightly downward
    const angle = (Math.random() * 30 + 20) * (Math.PI / 180); // 20-50 degrees
    meteor = {
      x: Math.random() * W,
      y: 0,
      vx: Math.cos(angle) * 18,
      vy: Math.sin(angle) * 18,
      len: Math.random() * 120 + 80, // trail length
      life: 1.0, // fades out
      decay: 0.016,
    };
  }

  function drawMeteor() {
    if (!meteor) return;
    meteor.x += meteor.vx;
    meteor.y += meteor.vy;
    meteor.life -= meteor.decay;

    if (
      meteor.life <= 0 ||
      meteor.x > starsCanvas.width + 200 ||
      meteor.y > starsCanvas.height + 200
    ) {
      meteor = null;
      scheduleMeteor();
      return;
    }

    const tailX = meteor.x - meteor.vx * (meteor.len / 18);
    const tailY = meteor.y - meteor.vy * (meteor.len / 18);

    const grad = starsCtx.createLinearGradient(
      meteor.x,
      meteor.y,
      tailX,
      tailY,
    );
    grad.addColorStop(0, `rgba(255,255,255,${meteor.life})`);
    grad.addColorStop(0.3, `rgba(180,180,255,${meteor.life * 0.6})`);
    grad.addColorStop(1, `rgba(120,100,255,0)`);

    starsCtx.save();
    starsCtx.beginPath();
    starsCtx.moveTo(meteor.x, meteor.y);
    starsCtx.lineTo(tailX, tailY);
    starsCtx.strokeStyle = grad;
    starsCtx.lineWidth = 2;
    starsCtx.lineCap = "round";
    starsCtx.stroke();

    // Bright head
    starsCtx.beginPath();
    starsCtx.arc(meteor.x, meteor.y, 2.5, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(255,255,255,${meteor.life})`;
    starsCtx.fill();

    starsCtx.restore();
  }

  function scheduleMeteor() {
    const delay = (Math.random() * 6 + 5) * 1000; // 5-11 detik
    meteorTimer = setTimeout(spawnMeteor, delay);
  }

  // ── Cursor trail ─────────────────────────────────────────────────
  function initTrail() {
    for (let i = 0; i < trailLength; i++) trail.push({ x: 0, y: 0 });
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animateCursor() {
    if (!cursorCtx) return;
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    let prevX = mouseX;
    let prevY = mouseY;
    trail.forEach((point, index) => {
      const ease = 0.35 - index * 0.01;
      point.x += (prevX - point.x) * ease;
      point.y += (prevY - point.y) * ease;
      prevX = point.x;
      prevY = point.y;

      const size = ((trailLength - index) / trailLength) * 10 + 2;
      const opacity = ((trailLength - index) / trailLength) * 0.8;
      const hue = 250 + index * 2;

      cursorCtx.beginPath();
      cursorCtx.arc(point.x, point.y, size, 0, Math.PI * 2);
      cursorCtx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
      cursorCtx.fill();

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
    // Detect touch/mobile device
    isMobile =
      window.matchMedia("(max-width: 900px)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    starsCtx = starsCanvas.getContext("2d");

    resizeCanvas();
    initStars();
    animateStars();
    scheduleMeteor();

    window.addEventListener("resize", resizeCanvas);

    // Only initialize cursor trail on non-touch desktop devices
    if (!isMobile) {
      cursorCtx = cursorCanvas.getContext("2d");
      initTrail();
      animateCursor();
      window.addEventListener("mousemove", handleMouseMove);
    }
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (cursorAnimationId) cancelAnimationFrame(cursorAnimationId);
    if (meteorTimer) clearTimeout(meteorTimer);
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", resizeCanvas);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
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
  </div>

  <Navbar />

  <main>
    <Home />
    <About />
    <Skills />
    <Projects />
    <Experience />
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

  @media (max-width: 900px) {
    .cursor-canvas {
      display: none;
    }
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

  main {
    position: relative;
    z-index: 1;
  }
</style>
