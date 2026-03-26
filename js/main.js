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

// ── Quiz Engine (v2 — Question Bank + Rotation) ──
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuizFromBank(bank, count = 5) {
  const quizContainer = document.getElementById('quiz');
  if (!quizContainer || !bank || !bank.length) return;

  const selected = shuffleArray(bank).slice(0, count);
  const labelEl = document.getElementById('quiz-bank-label');
  if (labelEl) labelEl.textContent = `Showing ${count} of ${bank.length} questions — reshuffles on every visit`;

  quizContainer.innerHTML = selected.map((q, qi) => {
    const shuffledOpts = shuffleArray(q.options);
    const opts = shuffledOpts.map((o, oi) => `
      <label class="q-option" data-correct="${o.correct}">
        <input type="radio" name="q${qi}">
        <span class="q-option-dot"></span>
        ${o.text}
      </label>`).join('');
    return `
      <div class="quiz-question" id="qq${qi}">
        <div class="q-number">${qi + 1}</div>
        <div class="q-text">${q.question}</div>
        <div class="q-options">${opts}</div>
        <div class="q-answer">${q.explanation}</div>
      </div>`;
  }).join('');

  attachQuizHandlers();
}

function attachQuizHandlers() {
  const quizContainer = document.getElementById('quiz');
  const submitBtn = document.getElementById('quiz-submit');
  const resetBtn  = document.getElementById('quiz-reset');
  const scoreEl   = document.getElementById('quiz-score');
  if (!quizContainer) return;

  quizContainer.querySelectorAll('.q-option').forEach(opt => {
    opt.addEventListener('click', function () {
      const qBlock = this.closest('.quiz-question');
      if (qBlock.dataset.answered) return;
      qBlock.querySelectorAll('.q-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  if (submitBtn) {
    // Remove old listener by replacing node
    const newBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newBtn, submitBtn);
    newBtn.addEventListener('click', () => {
      const questions = quizContainer.querySelectorAll('.quiz-question');
      let correct = 0, answered = 0;
      questions.forEach(q => {
        const selected = q.querySelector('.q-option.selected');
        if (!selected) return;
        answered++;
        q.dataset.answered = '1';
        if (selected.dataset.correct === 'true') {
          selected.classList.add('correct'); correct++;
        } else {
          selected.classList.add('wrong');
          q.querySelectorAll('.q-option').forEach(o => { if (o.dataset.correct === 'true') o.classList.add('correct'); });
        }
        const ans = q.querySelector('.q-answer');
        if (ans) ans.classList.add('show');
      });
      if (answered === 0) { alert('Please answer at least one question first!'); return; }
      const pct = Math.round((correct / answered) * 100);
      let emoji = '🎯', msg = 'Great job!';
      if (pct === 100) { emoji = '🏆'; msg = 'Perfect score! Outstanding!'; }
      else if (pct >= 80) { emoji = '🌟'; msg = 'Excellent work!'; }
      else if (pct >= 60) { emoji = '📚'; msg = 'Good effort! Review and retry.'; }
      else { emoji = '💪'; msg = "Keep studying — you'll get it!"; }
      if (scoreEl) {
        scoreEl.innerHTML = `<span class="score-emoji">${emoji}</span>${correct}/${answered} correct (${pct}%) — ${msg}`;
        scoreEl.classList.add('show');
        scoreEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      newBtn.style.display = 'none';
    });
  }

  if (resetBtn) {
    const newReset = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newReset, resetBtn);
    newReset.addEventListener('click', () => {
      // If bank exists, re-draw with new random set
      if (window.QUIZ_BANK) {
        if (scoreEl) scoreEl.classList.remove('show');
        buildQuizFromBank(window.QUIZ_BANK);
        const newSubmit = document.getElementById('quiz-submit');
        if (newSubmit) newSubmit.style.display = '';
      } else {
        quizContainer.querySelectorAll('.quiz-question').forEach(q => {
          delete q.dataset.answered;
          q.querySelectorAll('.q-option').forEach(o => {
            o.classList.remove('selected','correct','wrong');
            const r = o.querySelector('input[type="radio"]');
            if (r) r.checked = false;
          });
          const ans = q.querySelector('.q-answer');
          if (ans) ans.classList.remove('show');
        });
        if (scoreEl) scoreEl.classList.remove('show');
        const sub = document.getElementById('quiz-submit');
        if (sub) sub.style.display = '';
      }
    });
  }
}

function initQuiz() {
  // If a QUIZ_BANK is defined by the page, use the dynamic engine
  if (window.QUIZ_BANK && window.QUIZ_BANK.length) {
    buildQuizFromBank(window.QUIZ_BANK, 5);
  } else {
    // Fallback: wire up static HTML quiz
    attachQuizHandlers();
  }
}

// ── Tip of the Day Rotator ────────────────────
function initTipRotator() {
  const el = document.getElementById('tip-text');
  const tips = window.PAGE_TIPS;
  if (!el || !tips || !tips.length) return;
  const idx = Math.floor(Math.random() * tips.length);
  el.textContent = tips[idx];
}

// ── Reading Progress Bar ─────────────────────
function initReadingProgress() {
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.id = 'reading-progress';
  document.body.prepend(bar);

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Accordion ────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all siblings
      item.closest('.accordion-group')?.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
  // Open first by default
  document.querySelectorAll('.accordion-group').forEach(g => {
    const first = g.querySelector('.accordion-item');
    if (first) first.classList.add('open');
  });
}

// ── Method Tabs ───────────────────────────────
function initMethodTabs() {
  document.querySelectorAll('.methods-tabs').forEach(tabBar => {
    const btns = tabBar.querySelectorAll('.method-tab-btn');
    const panels = tabBar.closest('.methods-tab-container')?.querySelectorAll('.method-tab-panel') || [];
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
    // Activate first tab
    if (btns[0]) btns[0].click();
  });
}

// ── Flip Cards ───────────────────────────────
function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Flip card to see definition');
  });
}

// ── Section Complete Buttons ─────────────────
function initSectionComplete() {
  const page = window.location.pathname.split('/').filter(Boolean).pop()?.replace('.html','') || 'home';
  const storageKey = `done-${page}`;
  const done = JSON.parse(localStorage.getItem(storageKey) || '[]');

  document.querySelectorAll('.section-complete-btn').forEach(btn => {
    const sectionId = btn.dataset.section;
    if (done.includes(sectionId)) markDone(btn, sectionId, false);

    btn.addEventListener('click', () => {
      const isDone = btn.classList.contains('done');
      if (isDone) {
        btn.classList.remove('done');
        btn.innerHTML = '○ Mark as read';
        const updated = done.filter(s => s !== sectionId);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } else {
        markDone(btn, sectionId, true);
        if (!done.includes(sectionId)) done.push(sectionId);
        localStorage.setItem(storageKey, JSON.stringify(done));
      }
    });
  });
}

function markDone(btn, sectionId, animate) {
  btn.classList.add('done');
  btn.innerHTML = '✓ Done';
  if (animate) {
    btn.style.transform = 'scale(1.08)';
    setTimeout(() => { btn.style.transform = ''; }, 300);
  }
}

// ── Sticky Section Nav (mobile) ──────────────
function initStickySectionNav() {
  const nav = document.querySelector('.sticky-section-nav');
  if (!nav) return;
  const links = nav.querySelectorAll('a');
  const sections = [];
  links.forEach(link => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#')) {
      const el = document.querySelector(id);
      if (el) sections.push({ el, link });
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = sections.find(s => s.el === entry.target);
        if (match) {
          match.link.classList.add('active');
          // Scroll the nav link into view
          match.link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(s => observer.observe(s.el));
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
  initReadingProgress();
  initAccordions();
  initMethodTabs();
  initFlipCards();
  initSectionComplete();
  initStickySectionNav();
  initQuiz();
  initTipRotator();
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
