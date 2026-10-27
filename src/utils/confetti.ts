import confetti from 'canvas-confetti';

// Romantic heart confetti burst
export function fireHeartConfetti(originX = 0.5, originY = 0.6) {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: originX - 0.1, y: originY },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#fbbf24'],
      shapes: ['circle', 'square'],
      scalar: 1.2,
      ticks: 200,
    });

    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: originX + 0.1, y: originY },
      colors: ['#e11d48', '#f43f5e', '#f472b6', '#fbcfe8', '#f59e0b'],
      shapes: ['circle', 'square'],
      scalar: 1.2,
      ticks: 200,
    });
  } catch {
    // Graceful fallback
  }
}

// Full celebration fireworks cascade (for cake wish & final surprise)
export function fireCelebrationFireworks() {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.5 + 0.1 },
        colors: ['#fb7185', '#f43f5e', '#ec4899', '#d946ef', '#f59e0b', '#fbbf24', '#ffffff'],
      });
    }, 250);
  } catch {
    // Graceful fallback
  }
}

// Gentle rose petal and sparkling star shower
export function firePetalShower() {
  try {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.1, x: 0.5 },
      colors: ['#fda4af', '#f43f5e', '#fb7185', '#ffe4e6', '#fbbf24'],
      gravity: 0.6,
      drift: 0.2,
      ticks: 300,
      scalar: 1.1,
    });
  } catch {
    // Graceful fallback
  }
}
