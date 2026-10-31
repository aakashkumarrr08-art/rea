/**
 * Leaderboard & UI Controller for Flappy Bird Clone
 */

const LEADERBOARD_DATA = {
  daily: [
    { name: "SkyDancer", score: 142 },
    { name: "WingMaster", score: 118 },
    { name: "PixelFlap", score: 95 },
    { name: "RetroBirdie", score: 84 },
    { name: "TurboFinch", score: 76 },
    { name: "NeonHawk", score: 68 },
    { name: "AeroPiper", score: 61 },
    { name: "ZephyrAce", score: 54 },
    { name: "GlideMaster", score: 49 },
    { name: "PuffWinger", score: 42 },
    { name: "SwiftRobin", score: 38 },
    { name: "FlapHero", score: 32 },
    { name: "CloudRacer", score: 28 },
    { name: "BirbPulse", score: 24 },
    { name: "NovaDiver", score: 19 }
  ],
  allTime: [
    { name: "LegendaryFlapper", score: 999 },
    { name: "PixelGod", score: 845 },
    { name: "ApexBirb", score: 712 },
    { name: "IronWing", score: 620 },
    { name: "SkyOverlord", score: 540 },
    { name: "GlideTitan", score: 488 },
    { name: "ZenMaster", score: 412 },
    { name: "FlashFeather", score: 389 },
    { name: "StormPilot", score: 345 },
    { name: "QuantumBeak", score: 301 },
    { name: "AstroPuffin", score: 278 },
    { name: "BreezeKing", score: 245 },
    { name: "CosmoHawk", score: 219 },
    { name: "FalconX", score: 198 },
    { name: "HyperSparrow", score: 180 }
  ]
};

class UIController {
  constructor() {
    this.currentTab = 'daily';
    this.playerName = localStorage.getItem('flappy_player_name') || 'Flappy Player';
    this.bestScore = parseInt(localStorage.getItem('flappy_best_score') || '0', 10);
    this.initElements();
    this.setupListeners();
    this.startCountdownTimer();
    this.renderLeaderboard();
  }

  initElements() {
    // Modals
    this.leaderboardModal = document.getElementById('leaderboard-modal');
    this.howToPlayModal = document.getElementById('how-to-play-modal');
    this.nameModal = document.getElementById('name-modal');

    // Controls
    this.nameInput = document.getElementById('player-name-input');
    this.countdownEl = document.getElementById('daily-countdown');
    this.leaderboardRows = document.getElementById('leaderboard-rows');
    this.muteBtn = document.getElementById('navbar-mute');
    this.nameDisplay = document.getElementById('navbar-player-name');

    if (this.nameDisplay) {
      this.nameDisplay.textContent = this.playerName;
    }
  }

  setupListeners() {
    // Navbar links
    document.getElementById('nav-play')?.addEventListener('click', () => {
      this.closeAllModals();
      if (window.flappyGame && window.flappyGame.state === 'gameover') {
        window.flappyGame.restart();
      }
    });

    document.getElementById('nav-leaderboard')?.addEventListener('click', () => {
      this.openModal(this.leaderboardModal);
      this.renderLeaderboard();
    });

    document.getElementById('nav-how-to-play')?.addEventListener('click', () => {
      this.openModal(this.howToPlayModal);
    });

    document.getElementById('nav-name')?.addEventListener('click', () => {
      if (this.nameInput) this.nameInput.value = this.playerName;
      this.openModal(this.nameModal);
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) this.closeModal(modal);
      });
    });

    // Close when clicking outside modal panel
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay);
        }
      });
    });

    // Leaderboard Tabs
    document.getElementById('tab-daily')?.addEventListener('click', () => {
      this.switchTab('daily');
    });

    document.getElementById('tab-alltime')?.addEventListener('click', () => {
      this.switchTab('allTime');
    });

    // Save Name Button
    document.getElementById('save-name-btn')?.addEventListener('click', () => {
      this.savePlayerName();
    });

    this.nameInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.savePlayerName();
      }
    });

    // Mute Button
    this.muteBtn?.addEventListener('click', () => {
      if (window.flappyGame) {
        const muted = window.flappyGame.sound.toggleMute();
        this.updateMuteIcon(muted);
      }
    });

    // Sync mute state on startup
    const isMuted = localStorage.getItem('flappy_muted') === 'true';
    this.updateMuteIcon(isMuted);

    // Score callback from game
    window.onLocalScoreUpdate = (score) => {
      this.bestScore = score;
      this.renderLeaderboard();
    };
  }

  updateMuteIcon(isMuted) {
    if (this.muteBtn) {
      this.muteBtn.textContent = isMuted ? '🔇' : '🔊';
      this.muteBtn.title = isMuted ? 'Unmute (M)' : 'Mute (M)';
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    document.getElementById('tab-daily')?.classList.toggle('active', tab === 'daily');
    document.getElementById('tab-alltime')?.classList.toggle('active', tab === 'allTime');
    this.renderLeaderboard();
  }

  openModal(modal) {
    this.closeAllModals();
    if (modal) modal.classList.add('open');
  }

  closeModal(modal) {
    if (modal) modal.classList.remove('open');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  }

  savePlayerName() {
    const raw = this.nameInput ? this.nameInput.value.trim() : '';
    const newName = raw.slice(0, 16) || 'Flappy Player';
    this.playerName = newName;
    localStorage.setItem('flappy_player_name', newName);

    if (this.nameDisplay) {
      this.nameDisplay.textContent = newName;
    }
    if (window.flappyGame) {
      window.flappyGame.playerName = newName;
    }
    this.closeModal(this.nameModal);
    this.renderLeaderboard();
  }

  startCountdownTimer() {
    const updateCountdown = () => {
      const now = new Date();
      // Next midnight UTC
      const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const diffMs = tomorrow - now;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const formatted = `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`;
      if (this.countdownEl) {
        this.countdownEl.textContent = `RESETS IN: ${formatted}`;
      }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  renderLeaderboard() {
    if (!this.leaderboardRows) return;
    this.leaderboardRows.innerHTML = '';

    // Clone array and insert player's score
    let list = [...LEADERBOARD_DATA[this.currentTab]].map(item => ({ ...item, isYou: false }));

    if (this.bestScore > 0) {
      list.push({
        name: `${this.playerName} (YOU)`,
        score: this.bestScore,
        isYou: true
      });
      // Sort descending by score
      list.sort((a, b) => b.score - a.score);
    }

    list.slice(0, 15).forEach((entry, idx) => {
      const rank = idx + 1;
      const li = document.createElement('li');
      li.className = `leaderboard-row ${entry.isYou ? 'you' : ''}`;

      let rankClass = '';
      if (rank === 1) rankClass = 'gold';
      else if (rank === 2) rankClass = 'silver';
      else if (rank === 3) rankClass = 'bronze';

      li.innerHTML = `
        <div class="leaderboard-row__rank ${rankClass}">${rank}</div>
        <div class="leaderboard-row__name">${this.escapeHTML(entry.name)}</div>
        <div class="leaderboard-row__score">${entry.score}</div>
      `;
      this.leaderboardRows.appendChild(li);
    });
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.flappyUI = new UIController();
});
