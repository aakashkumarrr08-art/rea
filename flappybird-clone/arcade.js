/**
 * VASU ARCADE - Professional Gaming Platform Engine
 * Tagline: PLAY. FLY. REPEAT.
 * 
 * Features:
 * 1. Global & Daily Leaderboards with dynamic player ranking
 * 2. Player Profiles (Avatars, XP, Levels, Lifetime Career Stats)
 * 3. Gaming Achievements & Badges with animated Toast alerts
 * 4. Sound & Audio Settings with Volume Slider and SFX Preview
 * 5. Professional Arcade Boot Loader Sequence
 * 6. Mobile Responsive Navigation & Thumb Dock
 * 
 * Developer: Aakash Kumar
 */

// =============================================================================
// 1. DATA DEFINITIONS & CONSTANTS
// =============================================================================

const PILOT_AVATARS = [
  { id: 'dev', emoji: '👨‍💻', title: 'Master Architect' },
  { id: 'retro', emoji: '🕹️', title: 'Retro Gamer' },
  { id: 'falcon', emoji: '🦅', title: 'Cyber Falcon' },
  { id: 'neon', emoji: '⚡', title: 'Neon Striker' },
  { id: 'king', emoji: '👑', title: 'Arcade Monarch' },
  { id: 'voyager', emoji: '🚀', title: 'Star Voyager' },
  { id: 'fox', emoji: '🦊', title: 'Cyber Fox' },
  { id: 'mecha', emoji: '🤖', title: 'Mecha Birb' },
  { id: 'glitch', emoji: '👾', title: 'Glitch Beast' },
  { id: 'dragon', emoji: '🐉', title: 'Void Dragon' },
  { id: 'ninja', emoji: '🥷', title: 'Shadow Ninja' },
  { id: 'phoenix', emoji: '💎', title: 'Crystal Phoenix' }
];

const ACHIEVEMENTS_LIST = [
  {
    id: 'first_flight',
    title: 'First Flight',
    desc: 'Complete your maiden flight in VASU ARCADE.',
    icon: '🐣',
    tier: 'common',
    xp: 100
  },
  {
    id: 'bronze_aviator',
    title: 'Bronze Aviator',
    desc: 'Score 10 or more points in a single flight run.',
    icon: '🥉',
    tier: 'common',
    xp: 150
  },
  {
    id: 'silver_striker',
    title: 'Silver Striker',
    desc: 'Score 20 or more points in a single flight run.',
    icon: '🥈',
    tier: 'rare',
    xp: 250
  },
  {
    id: 'golden_wings',
    title: 'Golden Wings',
    desc: 'Score 30 or more points in a single flight run.',
    icon: '🥇',
    tier: 'epic',
    xp: 400
  },
  {
    id: 'platinum_ace',
    title: 'Platinum Ace',
    desc: 'Score 40 or more points in a single flight run.',
    icon: '🏆',
    tier: 'legendary',
    xp: 750
  },
  {
    id: 'century_club',
    title: 'Century Club',
    desc: 'Surpass 100 points in a single legendary flight.',
    icon: '💯',
    tier: 'mythic',
    xp: 2000
  },
  {
    id: 'pipe_dodger',
    title: 'Pipe Dodger',
    desc: 'Clear a cumulative total of 50 pipes across flights.',
    icon: '🎯',
    tier: 'rare',
    xp: 300,
    maxProgress: 50
  },
  {
    id: 'pipe_master',
    title: 'Pipe Master',
    desc: 'Clear a cumulative total of 200 pipes across flights.',
    icon: '🛡️',
    tier: 'epic',
    xp: 600,
    maxProgress: 200
  },
  {
    id: 'frequent_flyer',
    title: 'Frequent Flyer',
    desc: 'Complete 10 total flight missions in the arena.',
    icon: '🦅',
    tier: 'rare',
    xp: 250,
    maxProgress: 10
  },
  {
    id: 'marathon_pilot',
    title: 'Marathon Pilot',
    desc: 'Complete 25 total flight missions in the arena.',
    icon: '⚡',
    tier: 'epic',
    xp: 500,
    maxProgress: 25
  },
  {
    id: 'stealth_wing',
    title: 'Stealth Wing',
    desc: 'Score 5+ points with game audio muted.',
    icon: '🤫',
    tier: 'common',
    xp: 150
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    desc: 'Complete a flight run during night hours (8 PM - 6 AM).',
    icon: '🌙',
    tier: 'rare',
    xp: 200
  }
];

const GLOBAL_LEADERBOARD_SEED = [
  { name: 'NeoTokyo', flag: '🇯🇵', score: 174, avatar: '🐉', medal: 'Platinum', badge: 'Apex Pilot' },
  { name: 'SkyDancer', flag: '🇺🇸', score: 152, avatar: '🦅', medal: 'Platinum', badge: 'Grand Master' },
  { name: 'CyberViper', flag: '🇩🇪', score: 138, avatar: '⚡', medal: 'Platinum', badge: 'Speed Demon' },
  { name: 'TurboFinch', flag: '🇨🇦', score: 121, avatar: '🚀', medal: 'Platinum', badge: 'Vanguard' },
  { name: 'PixelGod', flag: '🇰🇷', score: 109, avatar: '👾', medal: 'Platinum', badge: 'Century Ace' },
  { name: 'RetroAce', flag: '🇬🇧', score: 94, avatar: '🕹️', medal: 'Platinum', badge: 'Arcade King' },
  { name: 'IronWing', flag: '🇦🇺', score: 88, avatar: '🤖', medal: 'Platinum', badge: 'Titan' },
  { name: 'ZenMaster', flag: '🇫🇷', score: 76, avatar: '💎', medal: 'Platinum', badge: 'Precision' },
  { name: 'AstroBirb', flag: '🇧🇷', score: 67, avatar: '🦊', medal: 'Platinum', badge: 'Cosmo Ace' },
  { name: 'StormPilot', flag: '🇸🇬', score: 59, avatar: '🥷', medal: 'Platinum', badge: 'Shadow' },
  { name: 'SonicFeather', flag: '🇮🇹', score: 51, avatar: '🦅', medal: 'Platinum', badge: 'Falcon' },
  { name: 'HyperSparrow', flag: '🇮🇳', score: 48, avatar: '⚡', medal: 'Platinum', badge: 'Blitz' },
  { name: 'QuantumBeak', flag: '🇪🇸', score: 43, avatar: '👑', medal: 'Platinum', badge: 'Noble' },
  { name: 'CosmoHawk', flag: '🇳🇱', score: 38, avatar: '🚀', medal: 'Gold', badge: 'Gold Flight' },
  { name: 'GlitchDiver', flag: '🇲🇽', score: 33, avatar: '👾', medal: 'Gold', badge: 'Gold Flight' },
  { name: 'VaporTrail', flag: '🇸🇪', score: 29, avatar: '💎', medal: 'Silver', badge: 'Silver Wing' },
  { name: 'NeonFalcon', flag: '🇵🇱', score: 24, avatar: '⚡', medal: 'Silver', badge: 'Silver Wing' },
  { name: 'CloudChaser', flag: '🇿🇦', score: 19, avatar: '🦊', medal: 'Bronze', badge: 'Bronze Ace' },
  { name: 'NovaPilot', flag: '🇨🇭', score: 14, avatar: '🤖', medal: 'Bronze', badge: 'Bronze Ace' },
  { name: 'AeroCadet', flag: '🇦🇷', score: 8, avatar: '🐣', medal: 'None', badge: 'Cadet' }
];

const DAILY_LEADERBOARD_SEED = [
  { name: 'ApexBirb', flag: '🇺🇸', score: 86, avatar: '👑', medal: 'Platinum', badge: 'Daily #1' },
  { name: 'LightningWing', flag: '🇯🇵', score: 74, avatar: '⚡', medal: 'Platinum', badge: 'Daily #2' },
  { name: 'MirageAce', flag: '🇩🇪', score: 62, avatar: '🥷', medal: 'Platinum', badge: 'Daily #3' },
  { name: 'TurboFinch', flag: '🇨🇦', score: 55, avatar: '🚀', medal: 'Platinum', badge: 'Top 5' },
  { name: 'PulsarKid', flag: '🇰🇷', score: 47, avatar: '👾', medal: 'Platinum', badge: 'Top 5' },
  { name: 'ZephyrPilot', flag: '🇬🇧', score: 39, avatar: '🦅', medal: 'Gold', badge: 'Top 10' },
  { name: 'HorizonHawk', flag: '🇫🇷', score: 31, avatar: '💎', medal: 'Gold', badge: 'Top 10' },
  { name: 'SkyDrifter', flag: '🇦🇺', score: 26, avatar: '🦊', medal: 'Silver', badge: 'Top 10' },
  { name: 'FlareDancer', flag: '🇧🇷', score: 18, avatar: '🕹️', medal: 'Bronze', badge: 'Top 10' },
  { name: 'EchoBeak', flag: '🇸🇬', score: 12, avatar: '🐣', medal: 'Bronze', badge: 'Top 10' }
];

// =============================================================================
// 2. MAIN VASU ARCADE PLATFORM CONTROLLER
// =============================================================================

class VasuArcade {
  constructor() {
    this.playerName = localStorage.getItem('flappy_player_name') || 'Pilot';
    this.playerAvatar = localStorage.getItem('flappy_player_avatar') || '👨‍💻';
    this.bestScore = parseInt(localStorage.getItem('flappy_best_score') || '0', 10);
    this.currentScore = 0;
    this.currentLeaderboardTab = 'global';
    this.leaderboardSearchTerm = '';
    this.currentAchievementFilter = 'all';

    // Audio State
    this.volume = parseFloat(localStorage.getItem('flappy_volume') || '0.85');
    this.muted = localStorage.getItem('flappy_muted') === 'true';

    // Init All Subsystems
    this.initDOM();
    this.initProfile();
    this.initLoadingSequence();
    this.initNavigation();
    this.initMobileUX();
    this.initSoundController();
    this.initAchievements();
    this.initLeaderboards();
    this.bindGameHooks();
  }

  // ---------------------------------------------------------------------------
  // DOM References
  // ---------------------------------------------------------------------------
  initDOM() {
    // Navigation & Chips
    this.navSoundBtn = document.getElementById('nav-sound-btn');
    this.navProfileBtn = document.getElementById('nav-profile-btn');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.arcade-section');

    // HUD Elements
    this.hudCurrentScore = document.getElementById('hud-current-score');
    this.hudBestScore = document.getElementById('hud-best-score');
    this.hudRestartBtn = document.getElementById('hud-restart-btn');
    this.hudSoundBtn = document.getElementById('hud-sound-btn');
    this.hudFullscreenBtn = document.getElementById('hud-fullscreen-btn');
    this.playerNameDisplay = document.getElementById('player-name-display');

    // Modals
    this.profileModal = document.getElementById('profile-modal');
    this.soundModal = document.getElementById('sound-modal');
    this.mobileDrawer = document.getElementById('mobile-drawer');

    // Mobile Hamburger
    this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    this.mobileDrawerClose = document.getElementById('mobile-drawer-close');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');
  }

  // ---------------------------------------------------------------------------
  // Professional Arcade Boot Loading Sequence
  // ---------------------------------------------------------------------------
  initLoadingSequence() {
    const loader = document.getElementById('arcade-loader');
    const progressBar = document.getElementById('loader-progress-bar');
    const progressText = document.getElementById('loader-progress-text');
    const statusText = document.getElementById('loader-status-text');

    if (!loader) return;

    // Check if session was already loaded recently (within current session)
    const hasBooted = sessionStorage.getItem('vasu_arcade_booted');
    if (hasBooted) {
      loader.style.display = 'none';
      return;
    }

    const steps = [
      { pct: 15, msg: 'INITIALIZING HARDWARE BIOS v2.6.0…' },
      { pct: 40, msg: 'CALIBRATING 120HZ SIMULATION ENGINE…' },
      { pct: 68, msg: 'MOUNTING AUDIO SYNTHESIZER & DRIVERS…' },
      { pct: 90, msg: 'CONNECTING GLOBAL LEADERBOARDS & DOSSIER…' },
      { pct: 100, msg: 'VASU ARCADE ONLINE • ALL SYSTEMS READY' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const item = steps[currentStep];
        if (progressBar) progressBar.style.width = `${item.pct}%`;
        if (progressText) progressText.textContent = `${item.pct}%`;
        if (statusText) statusText.textContent = item.msg;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('loader-fade-out');
          sessionStorage.setItem('vasu_arcade_booted', 'true');
          setTimeout(() => {
            loader.style.display = 'none';
          }, 500);
        }, 300);
      }
    }, 220);

    // Allow instant skip on click or keypress
    const dismissEarly = () => {
      clearInterval(interval);
      loader.classList.add('loader-fade-out');
      sessionStorage.setItem('vasu_arcade_booted', 'true');
      setTimeout(() => { loader.style.display = 'none'; }, 200);
      window.removeEventListener('keydown', dismissEarly);
    };
    loader.addEventListener('click', dismissEarly);
    window.addEventListener('keydown', dismissEarly);
  }

  // ---------------------------------------------------------------------------
  // Navigation & Smooth Scroll
  // ---------------------------------------------------------------------------
  initNavigation() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          this.navigateTo(targetId.substring(1));
          this.closeMobileDrawer();
        }
      });
    });

    // Quick Action buttons
    document.getElementById('hero-play-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateTo('play');
    });

    document.getElementById('nav-cta-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateTo('play');
    });

    document.getElementById('hero-scores-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateTo('leaderboard');
    });

    document.getElementById('hero-badges-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateTo('achievements');
    });

    // Scroll spy for active navbar highlighting
    window.addEventListener('scroll', () => {
      let current = '';
      this.sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) {
          current = sec.getAttribute('id');
        }
      });
      if (current) {
        this.navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
        });
      }
    }, { passive: true });
  }

  navigateTo(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;

    window.scrollTo({
      top: el.offsetTop - 75,
      behavior: 'smooth'
    });

    this.navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${sectionId}`);
    });

    if (sectionId === 'play') {
      const canvas = document.getElementById('game-canvas');
      if (canvas) canvas.focus();
    }
  }

  // ---------------------------------------------------------------------------
  // Mobile UX (Drawer, Bottom Dock)
  // ---------------------------------------------------------------------------
  initMobileUX() {
    this.mobileMenuToggle?.addEventListener('click', () => {
      this.openMobileDrawer();
    });

    this.mobileDrawerClose?.addEventListener('click', () => {
      this.closeMobileDrawer();
    });

    // Mobile Bottom Dock Buttons
    document.querySelectorAll('.dock-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-target');
        if (target === 'profile') {
          this.openModal(this.profileModal);
        } else if (target === 'sound') {
          this.openModal(this.soundModal);
        } else if (target) {
          this.navigateTo(target);
        }
      });
    });
  }

  openMobileDrawer() {
    this.mobileDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMobileDrawer() {
    this.mobileDrawer?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ---------------------------------------------------------------------------
  // Player Profile & Career XP
  // ---------------------------------------------------------------------------
  initProfile() {
    this.updateProfileUI();

    // Open profile modal triggers
    this.playerNameDisplay?.addEventListener('click', () => this.openModal(this.profileModal));
    this.navProfileBtn?.addEventListener('click', () => this.openModal(this.profileModal));
    document.getElementById('hero-profile-chip')?.addEventListener('click', () => this.openModal(this.profileModal));

    // Render Avatar Picker in Modal
    const avatarPicker = document.getElementById('profile-avatar-picker');
    if (avatarPicker) {
      avatarPicker.innerHTML = '';
      PILOT_AVATARS.forEach(av => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `avatar-option-btn ${av.emoji === this.playerAvatar ? 'active' : ''}`;
        btn.innerHTML = `<span class="av-emoji">${av.emoji}</span><span class="av-label">${av.title}</span>`;
        btn.addEventListener('click', () => {
          document.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.playerAvatar = av.emoji;
        });
        avatarPicker.appendChild(btn);
      });
    }

    // Profile Form Save
    document.getElementById('save-profile-btn')?.addEventListener('click', () => {
      const input = document.getElementById('profile-name-input');
      const val = (input?.value || '').trim();
      if (val) {
        this.playerName = val.slice(0, 16);
        localStorage.setItem('flappy_player_name', this.playerName);
      }
      localStorage.setItem('flappy_player_avatar', this.playerAvatar);
      this.updateProfileUI();
      this.renderLeaderboards();
      this.closeModal(this.profileModal);
      this.showToast('Profile Saved', `${this.playerAvatar} ${this.playerName} is ready for action!`, '👤');
    });

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn, .modal-backdrop-dismiss').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = btn.closest('.arcade-modal');
        if (modal) this.closeModal(modal);
      });
    });
  }

  getCareerMetrics() {
    const xp = parseInt(localStorage.getItem('vasu_pilot_xp') || '0', 10);
    const totalRuns = parseInt(localStorage.getItem('vasu_total_runs') || '0', 10);
    const totalPipes = parseInt(localStorage.getItem('vasu_total_pipes') || '0', 10);
    const bestScore = parseInt(localStorage.getItem('flappy_best_score') || '0', 10);

    // Dynamic Level formula: Level = Math.floor(Math.sqrt(xp / 100)) + 1
    const level = Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
    const currentLevelBaseXP = (level - 1) * (level - 1) * 100;
    const nextLevelXP = level * level * 100;
    const levelProgressXP = xp - currentLevelBaseXP;
    const levelSpanXP = nextLevelXP - currentLevelBaseXP;
    const progressPercent = Math.min(100, Math.max(0, Math.round((levelProgressXP / levelSpanXP) * 100)));

    let rankTitle = 'Cadet Pilot';
    if (level >= 25) rankTitle = 'Arcade Legend';
    else if (level >= 20) rankTitle = 'Master Aviator';
    else if (level >= 15) rankTitle = 'Veteran Ace';
    else if (level >= 10) rankTitle = 'Elite Ace';
    else if (level >= 7) rankTitle = 'Squadron Leader';
    else if (level >= 4) rankTitle = 'Flight Officer';
    else if (level >= 2) rankTitle = 'Wing Trainee';

    let unlockedCount = 0;
    try {
      const unlockedMap = JSON.parse(localStorage.getItem('vasu_achievements') || '{}');
      unlockedCount = Object.keys(unlockedMap).length;
    } catch (e) { unlockedCount = 0; }

    return {
      xp,
      level,
      rankTitle,
      progressPercent,
      currentLevelBaseXP,
      nextLevelXP,
      totalRuns,
      totalPipes,
      bestScore,
      unlockedCount
    };
  }

  addXP(amount, reason = '') {
    if (amount <= 0) return;
    const prevMetrics = this.getCareerMetrics();
    const newXP = prevMetrics.xp + amount;
    localStorage.setItem('vasu_pilot_xp', newXP.toString());
    const newMetrics = this.getCareerMetrics();

    // Check Level Up
    if (newMetrics.level > prevMetrics.level) {
      this.showToast(
        `LEVEL UP! Level ${newMetrics.level}`,
        `Promoted to ${newMetrics.rankTitle}! +${amount} XP (${reason})`,
        '⭐'
      );
    }
    this.updateProfileUI();
  }

  updateProfileUI() {
    const metrics = this.getCareerMetrics();

    // Update Navbar Chips
    const navChip = document.getElementById('nav-profile-chip-text');
    if (navChip) {
      navChip.textContent = `${this.playerAvatar} ${this.playerName} • Lv.${metrics.level}`;
    }

    // Update Cabinet HUD
    if (this.playerNameDisplay) {
      this.playerNameDisplay.innerHTML = `${this.playerAvatar} <span>${this.playerName}</span> <span class="badge-level">Lv.${metrics.level}</span>`;
    }

    // Update Hero Pilot Chip
    const heroChip = document.getElementById('hero-profile-chip');
    if (heroChip) {
      heroChip.innerHTML = `${this.playerAvatar} <span>${this.playerName}</span> • <span style="color:var(--neon-cyan)">${metrics.rankTitle} (Lv.${metrics.level})</span>`;
    }

    // Update Profile Modal Inputs & Labels
    const nameInput = document.getElementById('profile-name-input');
    if (nameInput) nameInput.value = this.playerName;

    const modalAvatar = document.getElementById('modal-avatar-display');
    if (modalAvatar) modalAvatar.textContent = this.playerAvatar;

    const modalLevel = document.getElementById('modal-level-badge');
    if (modalLevel) modalLevel.textContent = `Level ${metrics.level} • ${metrics.rankTitle}`;

    const modalXPText = document.getElementById('modal-xp-text');
    if (modalXPText) modalXPText.textContent = `${metrics.xp.toLocaleString()} XP`;

    const modalXPBar = document.getElementById('modal-xp-bar');
    if (modalXPBar) modalXPBar.style.width = `${metrics.progressPercent}%`;

    const statRuns = document.getElementById('profile-stat-runs');
    if (statRuns) statRuns.textContent = metrics.totalRuns.toLocaleString();

    const statPipes = document.getElementById('profile-stat-pipes');
    if (statPipes) statPipes.textContent = metrics.totalPipes.toLocaleString();

    const statBest = document.getElementById('profile-stat-best');
    if (statBest) statBest.textContent = metrics.bestScore;

    const statBadges = document.getElementById('profile-stat-badges');
    if (statBadges) statBadges.textContent = `${metrics.unlockedCount} / ${ACHIEVEMENTS_LIST.length}`;
  }

  // ---------------------------------------------------------------------------
  // Sound & Audio Settings
  // ---------------------------------------------------------------------------
  initSoundController() {
    const updateSoundIcons = () => {
      const icon = this.muted ? '🔇' : '🔊';
      const label = this.muted ? 'Muted' : `Sound On (${Math.round(this.volume * 100)}%)`;

      if (this.navSoundBtn) {
        this.navSoundBtn.textContent = icon;
        this.navSoundBtn.title = label;
      }
      if (this.hudSoundBtn) {
        this.hudSoundBtn.textContent = icon;
        this.hudSoundBtn.title = label;
      }

      // Sync settings modal controls
      const muteCheckbox = document.getElementById('sound-mute-checkbox');
      if (muteCheckbox) muteCheckbox.checked = !this.muted;

      const volumeSlider = document.getElementById('sound-volume-slider');
      if (volumeSlider) volumeSlider.value = Math.round(this.volume * 100);

      const volumePercent = document.getElementById('sound-volume-percent');
      if (volumePercent) volumePercent.textContent = `${Math.round(this.volume * 100)}%`;
    };

    updateSoundIcons();

    // Quick toggle from Nav & HUD
    const toggleMute = () => {
      this.muted = !this.muted;
      localStorage.setItem('flappy_muted', this.muted);
      if (window.flappyGame && window.flappyGame.sound) {
        window.flappyGame.sound.muted = this.muted;
      }
      updateSoundIcons();
      this.showToast(this.muted ? 'Audio Muted' : 'Audio Enabled', `Master Volume: ${Math.round(this.volume * 100)}%`, this.muted ? '🔇' : '🔊');
    };

    this.navSoundBtn?.addEventListener('click', toggleMute);
    this.hudSoundBtn?.addEventListener('click', toggleMute);

    // Nav Audio Settings Gear
    document.getElementById('nav-sound-settings-btn')?.addEventListener('click', () => {
      this.openModal(this.soundModal);
    });

    // Modal Checkbox Toggle
    document.getElementById('sound-mute-checkbox')?.addEventListener('change', (e) => {
      this.muted = !e.target.checked;
      localStorage.setItem('flappy_muted', this.muted);
      if (window.flappyGame && window.flappyGame.sound) {
        window.flappyGame.sound.muted = this.muted;
      }
      updateSoundIcons();
    });

    // Volume Slider Control
    document.getElementById('sound-volume-slider')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.volume = val / 100;
      localStorage.setItem('flappy_volume', this.volume.toString());
      if (window.flappyGame && window.flappyGame.sound) {
        window.flappyGame.sound.setVolume(this.volume);
      }
      updateSoundIcons();
    });

    // SFX Preview Test Buttons
    document.querySelectorAll('.btn-sfx-test').forEach(btn => {
      btn.addEventListener('click', () => {
        const soundKey = btn.getAttribute('data-sound');
        if (window.flappyGame && window.flappyGame.sound) {
          window.flappyGame.sound.muted = false; // ensure preview can be heard
          window.flappyGame.sound.play(soundKey);
          setTimeout(() => {
            if (window.flappyGame && window.flappyGame.sound) {
              window.flappyGame.sound.muted = this.muted;
            }
          }, 300);
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Gaming Achievements & Badges Engine
  // ---------------------------------------------------------------------------
  initAchievements() {
    this.renderAchievementsGrid();

    // Filter Pills
    document.querySelectorAll('.achievement-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.achievement-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentAchievementFilter = pill.getAttribute('data-filter') || 'all';
        this.renderAchievementsGrid();
      });
    });
  }

  getUnlockedAchievements() {
    try {
      return JSON.parse(localStorage.getItem('vasu_achievements') || '{}');
    } catch (e) {
      return {};
    }
  }

  unlockAchievement(id) {
    const ach = ACHIEVEMENTS_LIST.find(a => a.id === id);
    if (!ach) return;

    const unlocked = this.getUnlockedAchievements();
    if (unlocked[id]) return; // already unlocked

    unlocked[id] = {
      unlockedAt: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };
    localStorage.setItem('vasu_achievements', JSON.stringify(unlocked));

    // Award XP
    this.addXP(ach.xp, `Achievement: ${ach.title}`);

    // Show Real-time Toast
    this.showToast(
      `ACHIEVEMENT UNLOCKED!`,
      `${ach.icon} ${ach.title} (+${ach.xp} XP)`,
      '🏆'
    );

    this.renderAchievementsGrid();
    this.updateProfileUI();
  }

  renderAchievementsGrid() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    const unlocked = this.getUnlockedAchievements();
    const metrics = this.getCareerMetrics();

    grid.innerHTML = '';

    ACHIEVEMENTS_LIST.forEach(ach => {
      const isUnlocked = !!unlocked[ach.id];

      // Filtering
      if (this.currentAchievementFilter === 'unlocked' && !isUnlocked) return;
      if (this.currentAchievementFilter === 'locked' && isUnlocked) return;

      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked tier-' + ach.tier : 'locked'}`;

      let progressHtml = '';
      if (!isUnlocked && ach.maxProgress) {
        let current = 0;
        if (ach.id.startsWith('pipe_')) current = metrics.totalPipes;
        else if (ach.id === 'frequent_flyer' || ach.id === 'marathon_pilot') current = metrics.totalRuns;

        const clamped = Math.min(ach.maxProgress, current);
        const pct = Math.round((clamped / ach.maxProgress) * 100);
        progressHtml = `
          <div class="ach-progress-wrap">
            <div class="ach-progress-bar" style="width: ${pct}%"></div>
            <span class="ach-progress-label">${clamped} / ${ach.maxProgress}</span>
          </div>
        `;
      }

      const statusBadge = isUnlocked
        ? `<span class="ach-status-badge unlocked">✔ UNLOCKED</span>`
        : `<span class="ach-status-badge locked">🔒 LOCKED</span>`;

      card.innerHTML = `
        <div class="ach-top">
          <div class="ach-icon-wrap">${ach.icon}</div>
          <div class="ach-tier-badge ${ach.tier}">${ach.tier.toUpperCase()}</div>
        </div>
        <h4 class="ach-title">${ach.title}</h4>
        <p class="ach-desc">${ach.desc}</p>
        ${progressHtml}
        <div class="ach-footer">
          <span class="ach-xp">+${ach.xp} XP</span>
          ${statusBadge}
        </div>
      `;

      grid.appendChild(card);
    });

    // Update Count Pills
    const countAll = ACHIEVEMENTS_LIST.length;
    const countUnlocked = Object.keys(unlocked).length;
    const countLocked = countAll - countUnlocked;

    const elAll = document.getElementById('ach-count-all');
    const elUnlocked = document.getElementById('ach-count-unlocked');
    const elLocked = document.getElementById('ach-count-locked');

    if (elAll) elAll.textContent = countAll;
    if (elUnlocked) elUnlocked.textContent = countUnlocked;
    if (elLocked) elLocked.textContent = countLocked;
  }

  // ---------------------------------------------------------------------------
  // Global & Daily Leaderboards with Real Ranking
  // ---------------------------------------------------------------------------
  initLeaderboards() {
    this.renderLeaderboards();

    // Tab buttons
    document.querySelectorAll('.lb-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lb-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLeaderboardTab = btn.getAttribute('data-tab') || 'global';
        this.renderLeaderboards();
      });
    });

    // Search filter input
    const searchInput = document.getElementById('leaderboard-search');
    searchInput?.addEventListener('input', (e) => {
      this.leaderboardSearchTerm = (e.target.value || '').toLowerCase().trim();
      this.renderLeaderboards();
    });

    // Daily countdown timer
    this.startDailyTimer();

    // Reset local records button
    document.getElementById('reset-records-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset your local flight history on this device?')) {
        localStorage.removeItem('flappy_best_score');
        localStorage.removeItem('vasu_total_runs');
        localStorage.removeItem('vasu_total_pipes');
        localStorage.removeItem('vasu_run_history');
        this.bestScore = 0;
        this.currentScore = 0;
        if (this.hudBestScore) this.hudBestScore.textContent = '0';
        if (window.flappyGame) window.flappyGame.bestScore = 0;
        this.updateProfileUI();
        this.renderLeaderboards();
        this.showToast('Records Reset', 'Personal device logs cleared.', '🗑️');
      }
    });
  }

  startDailyTimer() {
    const timerEl = document.getElementById('daily-countdown');
    if (!timerEl) return;

    const update = () => {
      const now = new Date();
      const nextUtcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
      const diffMs = nextUtcMidnight - now;
      if (diffMs <= 0) {
        timerEl.textContent = '00:00:00';
        return;
      }
      const hrs = Math.floor(diffMs / 3600000).toString().padStart(2, '0');
      const mins = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0');
      const secs = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, '0');
      timerEl.textContent = `${hrs}h ${mins}m ${secs}s`;
    };

    update();
    setInterval(update, 1000);
  }

  renderLeaderboards() {
    const tableBody = document.getElementById('leaderboard-table-body');
    const emptyNotice = document.getElementById('leaderboard-empty-notice');
    const standingBar = document.getElementById('player-standing-bar');

    if (!tableBody) return;
    tableBody.innerHTML = '';

    const bestScore = parseInt(localStorage.getItem('flappy_best_score') || '0', 10);
    const totalRuns = parseInt(localStorage.getItem('vasu_total_runs') || '0', 10);

    // 1. Personal History Tab
    if (this.currentLeaderboardTab === 'local') {
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('vasu_run_history') || '[]');
      } catch (e) { history = []; }

      if (this.leaderboardSearchTerm) {
        history = history.filter(h => h.score.toString().includes(this.leaderboardSearchTerm) || h.date.toLowerCase().includes(this.leaderboardSearchTerm));
      }

      if (history.length === 0) {
        if (emptyNotice) {
          emptyNotice.style.display = 'block';
          emptyNotice.textContent = 'No local flight logs found. Launch in the arena to record a score!';
        }
        if (standingBar) standingBar.style.display = 'none';
        return;
      }

      if (emptyNotice) emptyNotice.style.display = 'none';
      if (standingBar) standingBar.style.display = 'none';

      history.slice(0, 20).forEach((run, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'history-row';

        let medalBadge = `<span class="medal-tag medal-none">None</span>`;
        if (run.score >= 40) medalBadge = `<span class="medal-tag medal-plat">Platinum</span>`;
        else if (run.score >= 30) medalBadge = `<span class="medal-tag medal-gold">Gold</span>`;
        else if (run.score >= 20) medalBadge = `<span class="medal-tag medal-silver">Silver</span>`;
        else if (run.score >= 10) medalBadge = `<span class="medal-tag medal-bronze">Bronze</span>`;

        tr.innerHTML = `
          <td class="rank-cell">#${idx + 1}</td>
          <td class="pilot-cell"><span class="table-avatar">${this.playerAvatar}</span> <strong>${this.playerName}</strong> <span class="badge-you">(You)</span></td>
          <td class="score-cell"><span class="flight-score">${run.score}</span></td>
          <td class="medal-cell">${medalBadge}</td>
          <td class="date-cell">${run.date}</td>
        `;
        tableBody.appendChild(tr);
      });
      return;
    }

    // 2. Global or Daily Tab with Player Dynamic Ranking
    const seed = this.currentLeaderboardTab === 'daily'
      ? [...DAILY_LEADERBOARD_SEED]
      : [...GLOBAL_LEADERBOARD_SEED];

    // Inject Player Entry if they have played
    const playerEntry = {
      name: `${this.playerName} (You)`,
      rawName: this.playerName,
      isPlayer: true,
      flag: '🌐',
      score: bestScore,
      avatar: this.playerAvatar,
      medal: bestScore >= 40 ? 'Platinum' : bestScore >= 30 ? 'Gold' : bestScore >= 20 ? 'Silver' : bestScore >= 10 ? 'Bronze' : 'Cadet',
      badge: bestScore >= 40 ? 'Ace Aviator' : 'Contender'
    };

    // Merge and sort
    const combined = [...seed, playerEntry].sort((a, b) => b.score - a.score);

    // Compute player rank
    const playerRank = combined.findIndex(item => item.isPlayer) + 1;

    // Filter by search
    let filtered = combined;
    if (this.leaderboardSearchTerm) {
      filtered = combined.filter(item =>
        item.name.toLowerCase().includes(this.leaderboardSearchTerm) ||
        item.score.toString().includes(this.leaderboardSearchTerm)
      );
    }

    if (filtered.length === 0) {
      if (emptyNotice) {
        emptyNotice.style.display = 'block';
        emptyNotice.textContent = `No pilots found matching "${this.leaderboardSearchTerm}".`;
      }
      return;
    }
    if (emptyNotice) emptyNotice.style.display = 'none';

    filtered.forEach((entry, idx) => {
      const realRank = combined.indexOf(entry) + 1;
      const tr = document.createElement('tr');
      tr.className = `leaderboard-row ${entry.isPlayer ? 'player-row active-glow' : ''}`;

      let rankDisplay = `#${realRank}`;
      if (realRank === 1) rankDisplay = `🥇 1st`;
      else if (realRank === 2) rankDisplay = `🥈 2nd`;
      else if (realRank === 3) rankDisplay = `🥉 3rd`;

      let medalClass = 'medal-none';
      if (entry.score >= 40) medalClass = 'medal-plat';
      else if (entry.score >= 30) medalClass = 'medal-gold';
      else if (entry.score >= 20) medalClass = 'medal-silver';
      else if (entry.score >= 10) medalClass = 'medal-bronze';

      tr.innerHTML = `
        <td class="rank-cell ${realRank <= 3 ? 'rank-top' : ''}">${rankDisplay}</td>
        <td class="pilot-cell">
          <span class="table-flag">${entry.flag}</span>
          <span class="table-avatar">${entry.avatar}</span>
          <span class="table-name ${entry.isPlayer ? 'highlight-player' : ''}">${entry.name}</span>
          ${entry.isPlayer ? '<span class="badge-you">YOU</span>' : ''}
        </td>
        <td class="score-cell"><span class="flight-score">${entry.score}</span></td>
        <td class="medal-cell"><span class="medal-tag ${medalClass}">${entry.medal}</span></td>
        <td class="badge-cell"><span class="pilot-badge-tag">${entry.badge}</span></td>
      `;
      tableBody.appendChild(tr);
    });

    // Update standing bar
    if (standingBar) {
      standingBar.style.display = 'flex';
      const percentile = Math.max(1, Math.round((playerRank / combined.length) * 100));
      standingBar.innerHTML = `
        <div class="standing-item">
          <span class="standing-label">Your Stand:</span>
          <span class="standing-val" style="color:var(--neon-cyan)">Rank #${playerRank} of ${combined.length}</span>
        </div>
        <div class="standing-item">
          <span class="standing-label">Global Percentile:</span>
          <span class="standing-val" style="color:var(--gold)">Top ${percentile}%</span>
        </div>
        <div class="standing-item">
          <span class="standing-label">Best Record:</span>
          <span class="standing-val" style="color:#fff">${bestScore} pts</span>
        </div>
      `;
    }
  }

  // ---------------------------------------------------------------------------
  // Real-time Game Engine Callbacks
  // ---------------------------------------------------------------------------
  bindGameHooks() {
    // 1. On Live Score Update
    window.onScoreUpdate = (current, best) => {
      this.currentScore = current;
      this.bestScore = best;

      if (this.hudCurrentScore) this.hudCurrentScore.textContent = current;
      if (this.hudBestScore) this.hudBestScore.textContent = best;

      // In-flight achievement checks
      if (current >= 10) this.unlockAchievement('bronze_aviator');
      if (current >= 20) this.unlockAchievement('silver_striker');
      if (current >= 30) this.unlockAchievement('golden_wings');
      if (current >= 40) this.unlockAchievement('platinum_ace');
      if (current >= 100) this.unlockAchievement('century_club');

      // Stealth wing: 5+ while muted
      if (current >= 5 && this.muted) {
        this.unlockAchievement('stealth_wing');
      }
    };

    // 2. On Game Over
    window.onGameOver = (runData) => {
      const score = runData?.score || 0;
      const best = runData?.bestScore || 0;

      // XP calculation: 25 base + 10 per pipe + medal bonuses
      let xpEarned = 25 + (score * 10);
      if (score >= 40) xpEarned += 300;
      else if (score >= 30) xpEarned += 150;
      else if (score >= 20) xpEarned += 75;
      else if (score >= 10) xpEarned += 35;

      this.addXP(xpEarned, `Flight Completed (${score} pts)`);

      // First Flight
      this.unlockAchievement('first_flight');

      // Night Owl check (8 PM to 6 AM local time)
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 6) {
        this.unlockAchievement('night_owl');
      }

      // Check cumulative metrics
      const metrics = this.getCareerMetrics();
      if (metrics.totalPipes >= 50) this.unlockAchievement('pipe_dodger');
      if (metrics.totalPipes >= 200) this.unlockAchievement('pipe_master');
      if (metrics.totalRuns >= 10) this.unlockAchievement('frequent_flyer');
      if (metrics.totalRuns >= 25) this.unlockAchievement('marathon_pilot');

      // Refresh leaderboards & profile stats
      this.renderLeaderboards();
      this.updateProfileUI();
    };

    // 3. Cabinet Controls
    this.hudRestartBtn?.addEventListener('click', () => {
      if (window.flappyGame) {
        window.flappyGame.restart();
        this.navigateTo('play');
      }
    });

    this.hudFullscreenBtn?.addEventListener('click', () => {
      const cabinet = document.getElementById('arcade-cabinet');
      if (!document.fullscreenElement) {
        if (cabinet?.requestFullscreen) cabinet.requestFullscreen();
        else if (cabinet?.webkitRequestFullscreen) cabinet.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Modal Utilities
  // ---------------------------------------------------------------------------
  openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ---------------------------------------------------------------------------
  // Animated Toast Notifications
  // ---------------------------------------------------------------------------
  showToast(title, message, icon = '🏆') {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'arcade-toast';
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${message}</div>
      </div>
      <button class="toast-close-btn" aria-label="Close notification">×</button>
    `;

    toast.querySelector('.toast-close-btn')?.addEventListener('click', () => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 300);
    });

    this.toastContainer.appendChild(toast);

    // Auto-remove after 4.2 seconds
    setTimeout(() => {
      if (toast.isConnected) {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4200);
  }
}

// Instantiate VASU ARCADE on load
window.addEventListener('DOMContentLoaded', () => {
  window.vasuArcade = new VasuArcade();
});
