/**
 * Flappy Bird Game Engine (Reverse-Engineered Clone of https://flappybird.io)
 * Built with vanilla HTML5 Canvas, Web Audio API, and pixel-precise atlas rendering.
 */

// Physics and Simulation Constants (from original engine)
const PHYSICS = {
  gravity: 5,
  flapVelocity: 1.55,
  fallCap: 2.2,
  lowestHeight: -0.975,
  radius: 0.068,
  displacement: 0.01,
  speed: 0.6,
  startX: 1.2,
  endX: -1.2,
  pipeGap: 0.47,
  openingPipeGaps: [0.62, 0.59, 0.56, 0.53, 0.5],
  pipeSpacing: 1,
  pipeMinY: -0.2,
  pipeMaxY: 0.8
};

// Simulation settings: 120Hz tick rate
const SIM_HZ = 120;
const SIM_STEP = 1 / SIM_HZ;

// SplitMix64 Deterministic PRNG
class PRNG {
  constructor(seed = BigInt(Date.now())) {
    this.state = BigInt(seed) & 0xFFFFFFFFFFFFFFFFn;
  }
  nextU64() {
    this.state = (this.state + 0x9e3779b97f4a7c15n) & 0xFFFFFFFFFFFFFFFFn;
    let z = this.state;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & 0xFFFFFFFFFFFFFFFFn;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & 0xFFFFFFFFFFFFFFFFn;
    return (z ^ (z >> 31n)) & 0xFFFFFFFFFFFFFFFFn;
  }
  nextFraction() {
    return Number(this.nextU64() % 1048576n) / 1048576;
  }
  nextGapY() {
    return PHYSICS.pipeMinY + this.nextFraction() * (PHYSICS.pipeMaxY - PHYSICS.pipeMinY);
  }
}

// Sound Manager with Real Audio & Web Audio Synthesizer Fallback
class SoundController {
  constructor() {
    this.muted = localStorage.getItem('flappy_muted') === 'true';
    this.audioContext = null;
    this.buffers = {};
    this.audioElements = {};
    
    const sounds = ['wing', 'point', 'hit', 'die', 'swooshing'];
    sounds.forEach(name => {
      const audio = new Audio(`audio/sfx_${name}.mp3`);
      audio.preload = 'auto';
      this.audioElements[name] = audio;
    });
  }

  ensureContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('flappy_muted', this.muted);
    return this.muted;
  }

  play(name) {
    if (this.muted) return;
    this.ensureContext();

    // Try HTML5 Audio element first
    const sound = this.audioElements[name];
    if (sound) {
      try {
        const clone = sound.cloneNode();
        clone.volume = 0.85;
        const playPromise = clone.play();
        if (playPromise) {
          playPromise.catch(() => this.playSynthFallback(name));
        }
      } catch (e) {
        this.playSynthFallback(name);
      }
    } else {
      this.playSynthFallback(name);
    }
  }

  // Web Audio Synth Fallback
  playSynthFallback(name) {
    if (this.muted || !this.audioContext) return;
    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (name === 'wing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (name === 'point') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987, now);
        osc.frequency.setValueAtTime(1318, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (name === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (name === 'die') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (name === 'swooshing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (err) {}
  }
}

// Camera / Viewport Projection (Handles Retina Canvas & 3/4 max aspect ratio)
class Camera {
  constructor(worldW = 1.44, worldH = 2.56) {
    this.worldW = worldW;
    this.worldH = worldH;
    this.maxFrameW = worldH * (3 / 4);
    this.pixelsPerUnit = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.frameW = 0;
    this.frameH = 0;
    this.framePxW = 0;
    this.framePxH = 0;
    this.canvasW = 0;
    this.canvasH = 0;
    this.dpr = 1;
  }

  resize(cssWidth, cssHeight, dpr = window.devicePixelRatio || 1) {
    this.dpr = dpr;
    this.canvasW = Math.round(cssWidth * dpr);
    this.canvasH = Math.round(cssHeight * dpr);
    this.pixelsPerUnit = Math.min(this.canvasW / this.worldW, this.canvasH / this.worldH);
    this.frameW = Math.min(this.canvasW / this.pixelsPerUnit, this.maxFrameW);
    this.frameH = this.canvasH / this.pixelsPerUnit;
    this.framePxW = this.frameW * this.pixelsPerUnit;
    this.framePxH = this.frameH * this.pixelsPerUnit;
    this.offsetX = (this.canvasW - this.framePxW) / 2;
    this.offsetY = (this.canvasH - this.framePxH) / 2;
  }

  setupContext(ctx) {
    ctx.resetTransform();
    // Letterbox bars
    if (this.offsetX >= 1) {
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, this.canvasW, this.canvasH);
    }
    ctx.save();
    ctx.translate(Math.round(this.offsetX), Math.round(this.offsetY));
    ctx.beginPath();
    ctx.rect(0, 0, Math.round(this.framePxW), Math.round(this.framePxH));
    ctx.clip();
    ctx.fillStyle = "#4EC0CA";
    ctx.fillRect(0, 0, this.framePxW, this.framePxH);
    ctx.translate(this.framePxW / 2, this.framePxH / 2);
    // +Y is upwards in world coordinates!
    ctx.scale(this.pixelsPerUnit, -this.pixelsPerUnit);
  }

  restoreContext(ctx) {
    ctx.restore();
  }

  screenToWorld(clientX, clientY, rect) {
    const pxX = (clientX - rect.left) * this.dpr;
    const pxY = (clientY - rect.top) * this.dpr;
    const localX = pxX - this.offsetX - this.framePxW / 2;
    const localY = pxY - this.offsetY - this.framePxH / 2;
    return {
      x: localX / this.pixelsPerUnit,
      y: -localY / this.pixelsPerUnit
    };
  }
}

// Screen Shake Effect
class ScreenShake {
  constructor() {
    this.remaining = 0;
    this.duration = 0.45;
  }
  trigger() {
    this.remaining = this.duration;
  }
  advance(dt) {
    if (this.remaining <= 0) return { x: 0, y: 0 };
    this.remaining = Math.max(0, this.remaining - dt);
    const progress = this.remaining / this.duration;
    const angle = (1 - progress) * 4 * 2 * Math.PI;
    return {
      x: Math.sin(angle) * 0.035 * progress,
      y: Math.cos(angle * 0.7) * 0.035 * 0.7 * progress
    };
  }
}

// The Game Engine
class FlappyBirdGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = new Camera();
    this.sound = new SoundController();
    this.shake = new ScreenShake();
    this.prng = new PRNG();

    // Game state
    this.state = 'getready'; // 'getready' | 'play' | 'gameover'
    this.elapsed = 0;
    this.stateElapsed = 0;
    this.accumulator = 0;
    this.lastTime = 0;

    // Bird state
    this.birdY = 0;
    this.birdVy = 0;
    this.birdRot = 0;
    this.prevBirdY = 0;
    this.prevBirdRot = 0;
    this.animTimer = 0;

    // Environment & Pipes
    this.scrollX = 0;
    this.prevScrollX = 0;
    this.pipes = [];
    this.spawnCount = 0;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('flappy_best_score') || '0', 10);
    this.isNewBest = false;
    this.playerName = localStorage.getItem('flappy_player_name') || 'Flappy Player';

    // Atlas data
    this.atlasImg = null;
    this.atlasData = null;
    this.sprites = {};
    this.loaded = false;

    // Toast notification
    this.toastText = null;
    this.toastTimer = 0;

    this.init();
  }

  async init() {
    // Load atlas definitions and image
    try {
      const res = await fetch('assets/atlas.json');
      this.atlasData = await res.json();
    } catch (e) {
      console.error('Failed to load atlas.json', e);
    }

    this.atlasImg = new Image();
    this.atlasImg.src = 'assets/atlas.webp';
    await new Promise(r => { this.atlasImg.onload = r; });

    this.initSpriteDefinitions();
    this.loaded = true;

    // Hide boot splash
    const splash = document.getElementById('boot-splash');
    if (splash) splash.classList.add('hidden');

    this.setupListeners();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    requestAnimationFrame(t => this.loop(t));
  }

  initSpriteDefinitions() {
    const Nf = PHYSICS.displacement; // 0.01
    const Vh = (w, h, ax = 0.5, ay = 0.5) => ({
      worldW: w * Nf,
      worldH: h * Nf,
      anchor: { x: ax, y: ay }
    });

    const ae = (frame, w, h, ax = 0.5, ay = 0.5) => {
      const region = this.atlasData[frame];
      return {
        frame,
        region,
        ...Vh(w, h, ax, ay)
      };
    };

    this.sprites = {
      background: ae("bg", 144, 256, 0.5, 0.5),
      cityline: ae("cityline", 144, 110, 0.5, 0),
      ground: ae("ground", 144, 53, 0.5, 1),
      pipeUp: ae("pipe_new", 26, 160, 0.5, 1),
      pipeDown: ae("pipe_new", 26, 160, 0.5, 1),
      bird0: ae("bird-0", 17, 11.6, 0.5, 0.5),
      bird1: ae("bird-1", 17, 11.6, 0.5, 0.5),
      bird2: ae("bird-2", 17, 17.9, 0.5, 0.5),
      tapHint: ae("tap-hint", 45, 25.2, 0.5, 0.5),
      gameOver: ae("game-over", 100, 18.3, 0.5, 0.5),
      scoreboard: ae("scoreboard", 113, 57.7, 0.5, 0.5),
      panelOutside: ae("panel-outside", 110, 128.9, 0.5, 0.5),
      panelInside: ae("panel-inside", 99.3, 62.6, 0.5, 0.5),
      newBadge: ae("new-badge", 18, 8, 0.5, 0.5),
      buttonGreen: ae("button-green", 62, 20, 0.5, 0.5),
      buttonBlue: ae("button-blue", 62, 20, 0.5, 0.5),
      medalBronze: ae("medal-bronze", 22, 22, 0.5, 0.5),
      medalSilver: ae("medal-silver", 22, 22, 0.5, 0.5),
      medalGold: ae("medal-gold", 22, 22, 0.5, 0.5),
      medalPlatinum: ae("medal-platinum", 22, 22, 0.5, 0.5),
      medalEmpty: ae("medal-empty", 22, 22, 0.5, 0.5),
      soundOn: ae("sound-on", 14, 12, 0.5, 0.5),
      soundOff: ae("sound-off", 14, 12, 0.5, 0.5)
    };

    // External logo image
    this.logoImg = new Image();
    this.logoImg.src = 'sprites/logo.webp';
    this.sprites.logo = {
      image: this.logoImg,
      ...Vh(120, 14.4, 0.5, 0.5)
    };
  }

  handleResize() {
    const container = document.getElementById('app-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.camera.resize(width, height, dpr);
  }

  setupListeners() {
    const handleAction = (e) => {
      // Don't trigger if clicking navbar or modal
      if (e.target.closest('.navbar') || e.target.closest('.modal-overlay.open')) {
        return;
      }
      this.sound.ensureContext();

      if (this.state === 'gameover') {
        // Check game over button clicks
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
        const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
        if (clientX !== undefined && clientY !== undefined) {
          const world = this.camera.screenToWorld(clientX, clientY, rect);
          if (this.handleGameOverClick(world.x, world.y)) {
            return;
          }
        }
      }

      this.flap();
    };

    this.canvas.addEventListener('pointerdown', handleAction);

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.sound.ensureContext();
        this.flap();
      } else if (e.code === 'KeyM') {
        const isMuted = this.sound.toggleMute();
        this.showToast(isMuted ? 'Muted' : 'Sound On');
      } else if (e.code === 'KeyR' && this.state === 'gameover') {
        this.restart();
      }
    });
  }

  handleGameOverClick(wx, wy) {
    if (this.stateElapsed < 0.3) return false;
    // Button row Y is around buttonY = -0.6
    const buttonY = -0.58;
    const btnHalfW = 0.26;
    const btnHalfH = 0.10;

    // PLAY button: centered at x = 0.31
    const playX = 0.31;
    if (Math.abs(wx - playX) < btnHalfW && Math.abs(wy - buttonY) < btnHalfH) {
      this.restart();
      return true;
    }

    // SHARE button: centered at x = -0.31
    const shareX = -0.31;
    if (Math.abs(wx - shareX) < btnHalfW && Math.abs(wy - buttonY) < btnHalfH) {
      this.shareScore();
      return true;
    }

    return false;
  }

  showToast(text) {
    this.toastText = text;
    this.toastTimer = 2.0;
  }

  shareScore() {
    const text = `I scored ${this.score} points on Flappy Bird! Can you beat my score? https://flappybird.io/`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.showToast("Score copied to clipboard!");
    } else {
      this.showToast(`Score: ${this.score}!`);
    }
    this.sound.play('swooshing');
  }

  flap() {
    if (this.state === 'getready') {
      this.state = 'play';
      this.stateElapsed = 0;
      this.sound.play('wing');
      this.birdVy = PHYSICS.flapVelocity;
      return;
    }

    if (this.state === 'play') {
      this.sound.play('wing');
      this.birdVy = PHYSICS.flapVelocity;
      return;
    }

    if (this.state === 'gameover' && this.stateElapsed > 0.6) {
      this.restart();
    }
  }

  restart() {
    this.sound.play('swooshing');
    this.state = 'getready';
    this.stateElapsed = 0;
    this.birdY = 0;
    this.birdVy = 0;
    this.birdRot = 0;
    this.prevBirdY = 0;
    this.prevBirdRot = 0;
    this.pipes = [];
    this.spawnCount = 0;
    this.score = 0;
    this.isNewBest = false;
  }

  triggerGameOver(cause) {
    this.state = 'gameover';
    this.stateElapsed = 0;
    this.sound.play('hit');
    this.sound.play('die');
    this.shake.trigger();

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.isNewBest = true;
      localStorage.setItem('flappy_best_score', this.bestScore.toString());
      if (window.onLocalScoreUpdate) {
        window.onLocalScoreUpdate(this.bestScore);
      }
    }
  }

  // 120Hz Fixed Physics Step
  step(dt) {
    this.prevBirdY = this.birdY;
    this.prevBirdRot = this.birdRot;
    this.prevScrollX = this.scrollX;
    this.elapsed += dt;
    this.stateElapsed += dt;

    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.toastText = null;
    }

    if (this.state === 'play' || this.state === 'gameover') {
      // Apply gravity
      this.birdVy -= PHYSICS.gravity * dt;
      if (this.birdVy < -PHYSICS.fallCap) {
        this.birdVy = -PHYSICS.fallCap;
      }
      this.birdY += this.birdVy * dt;

      // Ground collision
      const groundLimit = PHYSICS.lowestHeight + PHYSICS.radius;
      if (this.birdY <= groundLimit) {
        this.birdY = groundLimit;
        this.birdVy = 0;
        if (this.state === 'play') {
          this.triggerGameOver('ground');
        }
      }

      // Bird rotation calculation
      if (this.birdVy > 0) {
        this.birdRot = Math.PI / 8; // ~22.5 deg upward tilt
      } else {
        const fallT = Math.abs(this.birdVy) / PHYSICS.fallCap;
        this.birdRot = (Math.PI / 8) - (fallT * (Math.PI / 8 + Math.PI / 2));
        if (this.birdRot < -Math.PI / 2) this.birdRot = -Math.PI / 2;
      }
    } else {
      // Get ready bobbing motion
      this.birdY = Math.sin(this.elapsed * 5) * 0.05;
      this.birdVy = 0;
      this.birdRot = 0;
    }

    if (this.state !== 'gameover') {
      this.scrollX += PHYSICS.speed * dt;
      this.animTimer += dt;
    }

    if (this.state === 'play') {
      this.advancePipes(dt);
      this.checkCollisions();
    }
  }

  advancePipes(dt) {
    const lastPipe = this.pipes[this.pipes.length - 1];
    const canSpawn = lastPipe 
      ? (PHYSICS.startX - lastPipe.x >= PHYSICS.pipeSpacing)
      : (this.stateElapsed >= 1.5);

    if (canSpawn) {
      const halfGap = (this.spawnCount < PHYSICS.openingPipeGaps.length)
        ? PHYSICS.openingPipeGaps[this.spawnCount] / 2
        : PHYSICS.pipeGap / 2;

      this.pipes.push({
        x: PHYSICS.startX,
        gapY: this.prng.nextGapY(),
        halfGap: halfGap,
        passed: false
      });
      this.spawnCount++;
    }

    for (const pipe of this.pipes) {
      pipe.x -= PHYSICS.speed * dt;

      // Scoring
      if (!pipe.passed && pipe.x <= 0) {
        pipe.passed = true;
        this.score++;
        this.sound.play('point');
      }
    }

    // Prune off-screen pipes
    if (this.pipes.length > 0 && this.pipes[0].x < PHYSICS.endX) {
      this.pipes.shift();
    }
  }

  checkCollisions() {
    const pipeHalfW = 0.13;
    const birdR = PHYSICS.radius;
    const birdY = this.birdY;

    for (const pipe of this.pipes) {
      // Check horizontal bounds
      const minX = pipe.x - pipeHalfW;
      const maxX = pipe.x + pipeHalfW;
      const clampedX = Math.max(minX, Math.min(0, maxX));
      const dx = -clampedX;

      if (Math.abs(dx) >= birdR) continue;

      // Bottom pipe collision
      const botTop = pipe.gapY - pipe.halfGap;
      const clampedYBot = Math.max(-10, Math.min(birdY, botTop));
      const dyBot = birdY - clampedYBot;
      if (dx * dx + dyBot * dyBot < birdR * birdR) {
        this.triggerGameOver('pipeBottom');
        return;
      }

      // Top pipe collision
      const topBot = pipe.gapY + pipe.halfGap;
      const clampedYTop = Math.max(topBot, Math.min(birdY, 10));
      const dyTop = birdY - clampedYTop;
      if (dx * dx + dyTop * dyTop < birdR * birdR) {
        this.triggerGameOver('pipeTop');
        return;
      }
    }
  }

  // Main Render Loop
  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const delta = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.accumulator += delta;
    while (this.accumulator >= SIM_STEP) {
      this.step(SIM_STEP);
      this.accumulator -= SIM_STEP;
    }

    const alpha = this.accumulator / SIM_STEP;
    this.render(alpha, delta);

    requestAnimationFrame(t => this.loop(t));
  }

  render(alpha, dt) {
    if (!this.loaded) return;

    const ctx = this.ctx;
    this.camera.setupContext(ctx);

    // Apply screen shake
    const shakeOffset = this.shake.advance(dt);
    ctx.translate(shakeOffset.x, shakeOffset.y);

    const frameW = this.camera.frameW;
    const frameH = this.camera.frameH;

    // 1. Draw Background
    this.drawBackground(frameW, frameH);

    // 2. Draw Cityline with Parallax
    const interpolatedScroll = this.prevScrollX + (this.scrollX - this.prevScrollX) * alpha;
    this.drawCityline(interpolatedScroll, frameW);

    // 3. Draw Pipes
    this.drawPipes(frameH);

    // 4. Draw Ground
    this.drawGround(interpolatedScroll, frameW);

    // 5. Draw Bird
    const renderBirdY = this.prevBirdY + (this.birdY - this.prevBirdY) * alpha;
    const renderBirdRot = this.prevBirdRot + (this.birdRot - this.prevBirdRot) * alpha;
    this.drawBird(renderBirdY, renderBirdRot);

    // 6. State Specific UI
    if (this.state === 'getready') {
      this.drawGetReadyUI();
    } else if (this.state === 'play') {
      this.drawScoreUI();
    } else if (this.state === 'gameover') {
      this.drawGameOverUI(frameW, frameH);
    }

    // 7. Toast notification
    if (this.toastText) {
      this.drawText(this.toastText, 0, -0.85, 0.08, 'center', '#ffffff', true);
    }

    this.camera.restoreContext(ctx);
  }

  drawSprite(name, x, y, options = {}) {
    const spr = this.sprites[name];
    if (!spr) return;

    const ctx = this.ctx;
    const rot = options.rot || 0;
    const scale = options.scale || 1;
    const flipX = options.flipX || false;
    const flipY = options.flipY || false;

    ctx.save();
    ctx.translate(x, y);
    if (rot !== 0) ctx.rotate(rot);
    ctx.scale(scale * (flipX ? -1 : 1), -scale * (flipY ? -1 : 1));

    const drawX = -spr.worldW * spr.anchor.x;
    const drawY = -spr.worldH * (1 - spr.anchor.y);

    if (spr.region) {
      // Draw from atlas
      const reg = spr.region;
      ctx.drawImage(
        this.atlasImg,
        reg.x, reg.y, reg.w, reg.h,
        drawX, drawY, spr.worldW, spr.worldH
      );
    } else if (spr.image) {
      // Draw from standalone image
      ctx.drawImage(spr.image, drawX, drawY, spr.worldW, spr.worldH);
    }

    ctx.restore();
  }

  fillPipeShaft(name, x, startY, endY) {
    const spr = this.sprites[name];
    if (!spr || !spr.region || endY <= startY) return;

    const ctx = this.ctx;
    const reg = spr.region;
    const drawX = x - spr.worldW * spr.anchor.x;
    const shaftHeight = endY - startY;

    ctx.save();
    // 1-pixel slice repeated or stretched
    ctx.drawImage(
      this.atlasImg,
      reg.x, reg.y + reg.h - 1, reg.w, 1,
      drawX, startY, spr.worldW, shaftHeight
    );
    ctx.restore();
  }

  drawBackground(frameW, frameH) {
    const bgScale = Math.max(frameW / this.sprites.background.worldW, frameH / this.sprites.background.worldH);
    this.drawSprite('background', 0, 0, { scale: bgScale });
  }

  drawCityline(scrollX, frameW) {
    const cityline = this.sprites.cityline;
    const scale = 1.15;
    const stepW = cityline.worldW * scale - 0.01;
    const offset = (scrollX * 0.5) % stepW;
    const startX = -frameW / 2 - offset + stepW / 2;
    const count = Math.ceil(frameW / stepW) + 2;
    const y = PHYSICS.lowestHeight - 0.15;

    for (let i = 0; i < count; i++) {
      this.drawSprite('cityline', startX + i * stepW, y, { scale });
    }
  }

  drawGround(scrollX, frameW) {
    const ground = this.sprites.ground;
    const stepW = ground.worldW;
    const offset = scrollX % stepW;
    const startX = -frameW / 2 - offset;
    const count = Math.ceil(frameW / stepW) + 2;
    const y = PHYSICS.lowestHeight + 0.21;

    // Bottom solid sand fill
    this.ctx.fillStyle = "#d8a96b";
    this.ctx.fillRect(-10, PHYSICS.lowestHeight, 20, -10);

    for (let i = 0; i < count; i++) {
      this.drawSprite('ground', startX + i * stepW, y);
    }
  }

  drawPipes(frameH) {
    const halfFrame = frameH / 2;
    const pipeH = this.sprites.pipeUp.worldH;

    for (const pipe of this.pipes) {
      const bottomPipeTop = pipe.gapY - pipe.halfGap;
      const topPipeBottom = pipe.gapY + pipe.halfGap;

      // Bottom pipe
      this.fillPipeShaft('pipeUp', pipe.x, -halfFrame, bottomPipeTop - pipeH);
      this.drawSprite('pipeUp', pipe.x, bottomPipeTop);

      // Top pipe (flipped vertically)
      this.fillPipeShaft('pipeDown', pipe.x, topPipeBottom + pipeH, halfFrame);
      this.drawSprite('pipeDown', pipe.x, topPipeBottom, { flipY: true });
    }
  }

  drawBird(y, rot) {
    let frame = 'bird0';
    if (this.state === 'gameover') {
      frame = 'bird2';
    } else {
      frame = (Math.floor(this.animTimer / 0.15) % 2 === 0) ? 'bird0' : 'bird1';
    }
    this.drawSprite(frame, 0, y, { rot });
  }

  drawGetReadyUI() {
    // Logo with gentle floating wave
    const logoY = 0.6 + Math.sin(this.elapsed * 5) * 0.05;
    this.drawSprite('logo', 0, logoY);

    // Tap Hint
    this.drawSprite('tapHint', 0, -0.35);

    // High score top display
    this.drawText(this.playerName, -0.55, 1.15, 0.09, 'left');
    this.drawText(this.bestScore.toString(), 0.55, 1.15, 0.12, 'right');
    this.drawText("HIGH SCORE", 0.55, 1.05, 0.07, 'right', '#ffffff');
  }

  drawScoreUI() {
    // Large Score in Center Top
    this.drawText(this.score.toString(), 0, 1.1, 0.25, 'center');
  }

  drawGameOverUI(frameW, frameH) {
    // Dark overlay fade
    const alpha = Math.min(1, this.stateElapsed * 2.5);
    this.ctx.fillStyle = `rgba(0, 0, 0, ${0.6 * alpha})`;
    this.ctx.fillRect(-frameW / 2, -frameH / 2, frameW, frameH);

    // Title: GAME OVER
    const titleY = 0.68;
    this.drawSprite('gameOver', 0, titleY);

    // Scoreboard Panel
    const panelY = 0.08;
    this.ctx.save();
    this.ctx.translate(0, panelY);

    this.drawSprite('panelOutside', 0, 0);
    this.drawSprite('panelInside', 0, 0.27);

    // Score values and labels
    this.drawText(this.score.toString(), -0.25, 0.40, 0.20, 'center');
    this.drawText("SCORE", -0.25, 0.21, 0.075, 'center');

    this.drawText(this.bestScore.toString(), 0.25, 0.40, 0.20, 'center');
    this.drawText("HIGH", 0.25, 0.245, 0.075, 'center');
    this.drawText("SCORE", 0.25, 0.17, 0.075, 'center');

    if (this.isNewBest) {
      this.drawSprite('newBadge', 0.25, 0.08);
    }

    // Medal
    this.drawText("MEDAL", -0.17, -0.33, 0.09, 'center');
    let medalName = 'medalEmpty';
    if (this.score >= 40) medalName = 'medalPlatinum';
    else if (this.score >= 30) medalName = 'medalGold';
    else if (this.score >= 20) medalName = 'medalSilver';
    else if (this.score >= 10) medalName = 'medalBronze';

    this.drawSprite(medalName, 0.18, -0.33);
    this.ctx.restore();

    // Buttons Row
    const buttonY = -0.58;
    // SHARE (Blue)
    this.drawSprite('buttonBlue', -0.31, buttonY);
    this.drawText("SHARE", -0.31, buttonY, 0.11, 'center');

    // PLAY (Green)
    this.drawSprite('buttonGreen', 0.31, buttonY);
    this.drawText("PLAY", 0.31, buttonY, 0.11, 'center');
  }

  drawText(text, x, y, size, align = 'center', color = 'white', hasShadow = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 100, -size / 100); // match font baseline

    ctx.font = '100px Jersey10, sans-serif';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';

    if (hasShadow) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillText(text, 4, 4);
    }

    // Black stroke around white text
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 15;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, 0, 0);

    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);

    ctx.restore();
  }
}

// Initialize when DOM loads
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  window.flappyGame = new FlappyBirdGame(canvas);
});
