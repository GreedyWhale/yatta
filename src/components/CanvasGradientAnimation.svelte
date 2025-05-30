<script lang="ts">
  import { gsap } from 'gsap';
  import { onDestroy, onMount } from 'svelte';

  let canvasElement: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let width: number;
  let height: number;

  const colorStops = [
    { stop: 0, color: { r: 28, g: 0, b: 58 } },
    { stop: 0.5, color: { r: 0, g: 17, b: 82 } },
    { stop: 1, color: { r: 48, g: 0, b: 42 } }
  ];

  const gradientParams = {
    x1: 0,
    y1: 0,
    x2: 0, // 将在 onMount 中初始化为 width
    y2: 0, // 将在 onMount 中初始化为 height
  };


  onMount(() => {
    initializeCanvas();
    window.addEventListener('resize', resizeCanvas);
  });

  onDestroy(() => {
    window.removeEventListener('resize', resizeCanvas);
  });

  function initializeCanvas() {
    if (!canvasElement) {
      return;
    }
    ctx = canvasElement.getContext('2d');
    resizeCanvas();
    startAnimation();

    gsap.ticker.add(drawBackground);
  }

  function resizeCanvas() {
    if (!canvasElement || !ctx) {
      return;
    }

    width = window.innerWidth;
    height = window.innerHeight;
    canvasElement.width = width;
    canvasElement.height = height;
    if (!gsap.isTweening(gradientParams)) { // 避免在动画过程中干扰
      gradientParams.x1 = 0;
      gradientParams.y1 = 0;
      gradientParams.x2 = width;
      gradientParams.y2 = height;
    }

    // 当画布尺寸改变时，需要重绘
    drawBackground();
  }

  function drawBackground() {
    if (!ctx) {
      return;
    }

    const gradient = ctx.createLinearGradient(
      gradientParams.x1,
      gradientParams.y1,
      gradientParams.x2,
      gradientParams.y2
    );

    for (const stopInfo of colorStops) {
      gradient.addColorStop(
        stopInfo.stop,
        `rgb(${Math.round(stopInfo.color.r)}, ${Math.round(stopInfo.color.g)}, ${Math.round(stopInfo.color.b)})`
      );
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function startAnimation() {
    // 初始化 x2 和 y2，确保它们在首次动画前有基于当前尺寸的合理值
    gradientParams.x2 = width;
    gradientParams.y2 = height;

    // 位置动画
    gsap.to(gradientParams, {
      duration: 15, // 动画时长15秒
      x1: () => Math.random() * width * 0.4, // 随机改变起始点X
      y1: () => Math.random() * height * 0.4, // 随机改变起始点Y
      x2: () => width * (0.6 + Math.random() * 0.4), // 随机改变结束点X
      y2: () => height * (0.6 + Math.random() * 0.4), // 随机改变结束点Y
      ease: 'linear', // 平滑过渡
      repeat: -1, // 无限重复
      yoyo: true, // 动画会来回播放
    });

    // 颜色动画
    colorStops.forEach((stop, index) => {
      gsap.to(stop.color, {
        duration: 10,
        r: () => Math.random() * 255,
        g: () => Math.random() * 255,
        b: () => Math.random() * 255,
        ease: 'linear',
        repeat: -1,
        yoyo: true,
      });
    });
  }
</script>

<div
  id="CanvasGradientAnimation"
  class="fixed z-[-1] top-0 left-0 w-full h-full pointer-events-none bg-black"
>
  <canvas bind:this={canvasElement}></canvas>
</div>