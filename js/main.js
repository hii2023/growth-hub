/* =============================================
   THE GROWTH HUB — Main JavaScript
   Version: 1.0 | 2026
   ============================================= */

// ── Theme Toggle ──────────────────────────────
const THEME_KEY = 'growth-hub-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── Daily Wisdom Rotator ──────────────────────
const WISDOMS = [
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
];

let wisdomIndex = 0;

function initWisdom() {
  const saved = parseInt(localStorage.getItem('wisdom-index') || '0');
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem('wisdom-date');

  if (lastDate !== today) {
    wisdomIndex = (saved + 1) % WISDOMS.length;
    localStorage.setItem('wisdom-index', wisdomIndex);
    localStorage.setItem('wisdom-date', today);
  } else {
    wisdomIndex = saved;
  }

  renderWisdom(wisdomIndex);
  renderWisdomDots();
}

function renderWisdom(index) {
  const textEl = document.getElementById('wisdom-text');
  const authorEl = document.getElementById('wisdom-author');
  if (!textEl || !authorEl) return;

  textEl.style.opacity = '0';
  setTimeout(() => {
    textEl.textContent = `"${WISDOMS[index].text}"`;
    authorEl.textContent = `— ${WISDOMS[index].author}`;
    textEl.style.opacity = '1';
    textEl.style.transition = 'opacity 0.4s';
  }, 200);
}

function renderWisdomDots() {
  const container = document.getElementById('wisdom-dots');
  if (!container) return;
  container.innerHTML = '';
  WISDOMS.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'wisdom-dot' + (i === wisdomIndex ? ' active' : '');
    dot.onclick = () => { wisdomIndex = i; renderWisdom(i); renderWisdomDots(); };
    container.appendChild(dot);
  });
}

// ── Quiz Engine ───────────────────────────────
function initQuiz() {
  const quizContainer = document.getElementById('quiz');
  if (!quizContainer) return;

  const submitBtn = document.getElementById('quiz-submit');
  const resetBtn = document.getElementById('quiz-reset');
  const scoreEl = document.getElementById('quiz-score');

  // Attach option click handlers
  quizContainer.querySelectorAll('.q-option').forEach(opt => {
    opt.addEventListener('click', function () {
      const qBlock = this.closest('.quiz-question');
      if (qBlock.dataset.answered) return; // already answered

      // Select visually
      qBlock.querySelectorAll('.q-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      this.querySelector('input[type="radio"]').checked = true;
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const questions = quizContainer.querySelectorAll('.quiz-question');
      let correct = 0;
      let answered = 0;

      questions.forEach(q => {
        const selected = q.querySelector('.q-option.selected');
        if (!selected) return;
        answered++;
        q.dataset.answered = '1';

        const isCorrect = selected.dataset.correct === 'true';
        if (isCorrect) {
          selected.classList.add('correct');
          correct++;
        } else {
          selected.classList.add('wrong');
          // Highlight the correct one
          q.querySelectorAll('.q-option').forEach(o => {
            if (o.dataset.correct === 'true') o.classList.add('correct');
          });
        }

        // Show answer explanation
        const ans = q.querySelector('.q-answer');
        if (ans) ans.classList.add('show');
      });

      if (answered === 0) {
        alert('Please answer at least one question first!');
        return;
      }

      const pct = Math.round((correct / answered) * 100);
      let emoji = '🎯';
      let msg = 'Great job!';
      if (pct === 100) { emoji = '🏆'; msg = 'Perfect score! Outstanding!'; }
      else if (pct >= 80) { emoji = '🌟'; msg = 'Excellent work!'; }
      else if (pct >= 60) { emoji = '📚'; msg = 'Good effort! Review and retry.'; }
      else { emoji = '💪'; msg = 'Keep studying — you\'ll get it!'; }

      if (scoreEl) {
        scoreEl.innerHTML = `<span class="score-emoji">${emoji}</span>${correct}/${answered} correct (${pct}%) — ${msg}`;
        scoreEl.classList.add('show');
        scoreEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      submitBtn.style.display = 'none';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      quizContainer.querySelectorAll('.quiz-question').forEach(q => {
        delete q.dataset.answered;
        q.querySelectorAll('.q-option').forEach(o => {
          o.classList.remove('selected', 'correct', 'wrong');
          o.querySelector('input[type="radio"]').checked = false;
        });
        const ans = q.querySelector('.q-answer');
        if (ans) ans.classList.remove('show');
      });
      if (scoreEl) scoreEl.classList.remove('show');
      if (submitBtn) submitBtn.style.display = '';
    });
  }
}

// ── Scroll Reveal ─────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Active Nav Link ───────────────────────────
function initActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-links a, .navbar-mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.includes(href) && href !== '/') {
      a.classList.add('active');
    } else if (href === '../index.html' || href === './index.html') {
      // Don't mark home as active on sub-pages
    }
  });
}

// ── Mobile Menu ───────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('navbar-mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}

// ── TOC Active Highlight ──────────────────────
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (!tocLinks.length) return;

  const sections = [];
  tocLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) sections.push({ el, link });
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = sections.find(s => s.el === entry.target);
        if (active) active.link.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s.el));
}

// ── Progress Tracking ─────────────────────────
const PROGRESS_KEY = 'growth-hub-progress';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch { return {}; }
}

function markVisited(page) {
  const prog = getProgress();
  prog[page] = { visited: true, date: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
  updateProgressUI();
}

function updateProgressUI() {
  const prog = getProgress();
  const pages = ['negotiations', 'sales', 'conflict', 'psychology', 'ai-trends'];
  const visited = pages.filter(p => prog[p]?.visited).length;
  const pct = Math.round((visited / pages.length) * 100);

  const bar = document.getElementById('overall-progress-bar');
  const label = document.getElementById('overall-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `${visited}/${pages.length} sections visited`;

  // Update individual cards
  pages.forEach(p => {
    const badge = document.getElementById(`progress-${p}`);
    if (badge && prog[p]?.visited) {
      badge.textContent = '✓ Visited';
      badge.style.background = '#dcfce7';
      badge.style.color = '#16a34a';
    }
  });
}

// ── Init All ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initWisdom();
  initQuiz();
  initScrollReveal();
  initActiveNav();
  initMobileMenu();
  initTocHighlight();
  updateProgressUI();

  // Mark current sub-site as visited
  const path = window.location.pathname;
  const sites = ['negotiations', 'sales', 'conflict', 'psychology', 'ai-trends'];
  sites.forEach(s => { if (path.includes(s)) markVisited(s); });
});
