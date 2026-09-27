# ❄️ Winter Arc Tracker

> A complete, modern, responsive web application to track your 90-day **Winter Arc challenge** with weighted scoring, daily trends, streak tracking, interactive contribution heatmaps, and local data persistence.

---

## 🚀 Quick Features

- 🏋️ **11 Core Winter Arc Habits & 100% Priority Weighting System**:
  - 🏋️ Hit Gym — **6x/week** — Weight: **14%**
  - 📚 Study — **6x/week** — Weight: **14%**
  - 🥗 No Junk Food — **6x/week** — Weight: **12%**
  - 🚶 10,000 Steps — **5x/week** — Weight: **10%**
  - 🏃 Running — **3x/week** — Weight: **9%**
  - ⏰ Wake Up at 5:00 AM — **6x/week** — Weight: **8%**
  - 💧 Drink 3L Water — **7x/week** — Weight: **7%**
  - 🧘 Meditation — **7x/week** — Weight: **6%**
  - 😴 Sleep 8 Hours — **7x/week** — Weight: **15%**
  - 📱 Instagram Limit ≤2 Hours — **7x/week** — Weight: **3%**
  - 🍽️ No Phone During Meals — **7x/week** — Weight: **2%**

- 📊 **Interactive Daily Score Trend Line Chart**:
  - Filter by 7d, 30d, 90d, or Custom Date Range.
  - Hover tooltips showing exact Date, Score %, and habits completed.
  - Period average score and trend indicator (+% / -%).

- 🗓️ **90-Day Contribution Heatmap Grid**:
  - GitHub-style contribution grid color-coded by daily performance (🟩 90-100%, 🟢 80-89%, 🟡 60-79%, 🟥 <60%, ⬜ No Data).
  - Interactive date picker to view and edit historical entries or add daily reflection notes.

- 💾 **Data Persistence & Privacy**:
  - Auto-saves progress to `localStorage` (works seamlessly on HTTPS deployed domains).
  - Export progress backup (`winter-arc-backup.json`) and import JSON file restore.
  - Safe data reset options.

- 📅 **Configurable Challenge Dates**:
  - Challenge Start Date: **October 1, 2026** (Day 1).
  - Pre-challenge countdown state before October 1.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Dark Productivity Aesthetic)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Math**: Date-fns
- **Confetti**: Canvas-Confetti

---

## 💻 Local Setup & Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/winter-arc-tracker.git
cd winter-arc-tracker

# 2. Install dependencies
npm install

# 3. Start local dev server
npm run dev

# 4. Build for production
npm run build
```

---

## 🌐 Deploy to Vercel in 3 Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Winter Arc Tracker"
   git remote add origin https://github.com/your-username/winter-arc-tracker.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Select your GitHub repository `winter-arc-tracker`.
   - Vercel automatically detects **Vite** as the framework.

3. **Deploy**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**! Your site is live on your Vercel URL.

---

## 📄 License

MIT License. Free to use and customize for your personal Winter Arc challenge!
