# 🌱 The Growth Hub — Master Learning Center

A personal learning website with 5 high-quality sub-sites covering the most powerful skills for modern professionals.

## 🗺️ Sub-Sites

| # | Site | Topic | Color |
|---|------|--------|-------|
| 1 | 🤝 Negotiation Lab | Win-win deals, BATNA, ZOPA, anchoring | Sky Blue |
| 2 | 💰 The Sales Vault | SPIN Selling, Challenger Sale, closing | Orange |
| 3 | ☮️ Harmony Center | Conflict resolution, DESC, de-escalation | Rose |
| 4 | 🧠 The Mind Reader | Cialdini's 6, cognitive biases, influence | Purple |
| 5 | 🤖 AI & Future Biz | AI agents, RAG, automation, 2026 trends | Emerald |

## ✨ Features

- **Dark / Light mode** — toggled per-user, saved in localStorage
- **Progress tracking** — browser remembers which sections you've visited
- **Interactive quizzes** — 5 questions per topic with instant feedback
- **Mind maps** — visual outlines of each topic's structure
- **Daily wisdom** — rotating quotes on the home page
- **Scroll animations** — smooth reveal effects
- **Fully responsive** — works on mobile, tablet, and desktop
- **No dependencies** — pure HTML, CSS, and vanilla JavaScript

## 🚀 How to Host on GitHub Pages

1. Push this repo to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/growth-hub.git
   git push -u origin main
   ```

2. Go to your repo → **Settings** → **Pages**

3. Under **Source**, select `main` branch, `/ (root)` folder → click **Save**

4. Your site will be live at: `https://YOUR_USERNAME.github.io/growth-hub/`

## 📁 File Structure

```
growth-hub/
├── index.html              ← Master Home (The Growth Hub)
├── css/
│   └── styles.css          ← Shared styles for all pages
├── js/
│   └── main.js             ← Shared JavaScript (quiz, theme, progress)
├── negotiations/
│   └── index.html          ← Negotiation Lab
├── sales/
│   └── index.html          ← The Sales Vault
├── conflict/
│   └── index.html          ← Harmony Center
├── psychology/
│   └── index.html          ← The Mind Reader
└── ai-trends/
    └── index.html          ← AI & Future Biz
```

## 🔄 Keeping Content Updated

Each sub-site is a standalone HTML file. To update content:

- **Add new quotes**: Edit the `quotes-grid` section in any sub-site HTML
- **Add new AI trends**: Update the trends snapshot grid in `ai-trends/index.html`
- **Add new methods**: Add a new `.method-card` block in the methods section
- **Update quiz questions**: Edit the `.quiz-question` blocks and `data-correct` attributes
- **Add new sub-sites**: Create a new folder with `index.html`, update the nav in all files

## 📅 Content Update Log

| Date | Update |
|------|--------|
| 2026-03-27 | Initial release — all 5 sub-sites live |

---

Built with ❤️ for lifelong learners.
