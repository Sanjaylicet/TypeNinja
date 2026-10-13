  # ⚡ TypeNinja

  **Fast typing speed test arena and interactive 5-module touch typing academy with real-time biometric telemetry, adaptive weak-key retraining, and cloud synchronization.**

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-touch-typing-curriculum">Curriculum</a> •
    <a href="#-weak-key-retraining-lab">Weak-Key Lab</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-cloud-sync--database">Cloud Sync</a> •
    <a href="#-aws-deployment">AWS Architecture</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Style-Neo--Brutalism-FFDE03?style=for-the-badge" alt="Neo-Brutalism" />
  </p>
</div>

---

## 📖 Overview

**TypeNinja** is a comprehensive, gamified touch-typing platform built with a high-impact **Neo-Brutalist** aesthetic. Unlike standard typing test widgets that merely measure raw speed, TypeNinja is engineered around ergonomic motor skill pedagogy:

- **Spatial Anchors & Home-Row Discipline:** Developing subconscious muscle memory starting from the tactile bumps on `F` and `J`.
- **Opposite-Hand Shift Rules:** Enforcing correct shift usage (Right Shift for left-hand keys, Left Shift for right-hand keys) to prevent hand contortion and wrist strain.
- **Biometric Error & Latency Telemetry:** Tracking per-key attempt frequency, mistake counts, and strike latency in milliseconds.
- **Adaptive Remediation:** Dynamically synthesizing targeted retraining drills to eliminate specific bottleneck keys.
- **Seamless Cloud Synchronization:** Persisting unlocked modules, star ratings, and typing analytics across devices via Supabase.

---

## 🚀 Key Features

### ⚡ 1. Speed Test Arena
- **Configurable Durations:** Test your throughput in 15-second sprints, 30-second drills, or standard 60-second endurance tests.
- **Real-Time Analytics:** Live Net WPM, Raw WPM, Accuracy %, character-by-character live validation, and remaining timer.
- **Instant Result Breakdown:** High score tracking stored in local state and synchronized with your user profile upon completion.
- **Curated Word Bank:** Evaluates performance against standard high-frequency English benchmark corpora.

### 🎓 2. Five-Module Touch Typing Curriculum
A progressive, unlock-based pedagogy designed to take learners from absolute beginner to **65+ WPM Mastery**:

| Module | Title | Target WPM | Target Accuracy | Pedagogical Focus |
|:---:|:---|:---:|:---:|:---|
| **01** | **Home Row Mechanics** | **20 WPM** | **98%** | Spatial anchors (`A S D F` & `J K L ;`), finger independence, bigram transitions, and basic home-row words. |
| **02** | **Vertical Reaches** | **35 WPM** | **96%** | Top row (`Q-P`) extensions, bottom row (`Z-M`) curl control, high-frequency trigrams (`the`, `ing`, `ion`), and pangrams. |
| **03** | **Shift Discipline & Punctuation** | **45 WPM** | **96%** | Strict opposite-hand shift enforcement, capitalization rules, core punctuation (`. , ' ? !`), and dialogue prose. |
| **04** | **Numbers & Special Symbols** | **45 WPM** | **95%** | Blind top number row reaches (`1-0`), shifted symbols (`! @ # $ % ^ & * ( )`), and programming syntax (`{ } [ ] < > = ; : _ /`). |
| **05** | **Mastery & Dynamic Building** | **65+ WPM** | **97%** | Top 100 English words sprint, technical and engineering prose, and the Grand Mastery Benchmark graduation test. |

- **Star Rating System:** Earn 1 to 3 stars per lesson based on reaching both speed and accuracy milestones.
- **Progression Gating:** Lessons and subsequent modules unlock automatically upon passing prerequisite thresholds.

### ⌨️ 3. Tactile Visual Keyboard & Ergonomic Finger Guide
- **Color-Coded Finger Mapping:** Visual layout identifying each key's assigned finger:
  - 🟣 **Left Pinky** (`A`, `Q`, `Z`, `1`)
  - 🔵 **Left Ring** (`S`, `W`, `X`, `2`)
  - 🟢 **Left Middle** (`D`, `E`, `C`, `3`)
  - 🟡 **Left Index** (`F`, `R`, `T`, `G`, `V`, `B`, `4`, `5`)
  - ⚪ **Thumbs** (`Spacebar`)
  - 🟡 **Right Index** (`J`, `Y`, `U`, `H`, `N`, `M`, `6`, `7`)
  - 🟢 **Right Middle** (`K`, `I`, `,`, `8`)
  - 🔵 **Right Ring** (`L`, `O`, `.`, `9`)
  - 🟣 **Right Pinky** (`;`, `:`, `P`, `/`, `?`, `'`, `0`, `Enter`, `Shift`)
- **Active Finger Guidance Bar:** Real-time visual posture bar showing the currently targeted finger and recommended physical approach.
- **Opposite-Hand Shift Visualizer:** Highlights the exact Shift key (Left or Right) required for capital letters and shifted symbols.

### 🧠 4. Weak-Key Retraining Lab
- **Telemetry Engine:** Tracks keystroke performance at the individual character level:
  $$\text{Weakness Score} = (\text{Error Rate} \times 0.7) + \left(\min\left(100, \frac{\text{Avg Latency (ms)}}{450} \times 100\right) \times 0.3\right)$$
- **Bottleneck Diagnostics:** Automatically surfaces your top 3 problematic keys.
- **Adaptive Drill Generator:** Synthesizes custom practice strings from an extensive word bank categorized by target letters to retrain stubborn muscle memory.

### ☁️ 5. Cloud Sync & Profile Management
- **Supabase Authentication:** Secure email and password sign-in and sign-up with instant session persistence.
- **Bidirectional Merge Algorithm (`mergeProgress`):** Automatically combines offline `localStorage` achievements with Supabase cloud records without overwriting higher scores.
- **Debounced Autosave:** Background synchronization with real-time indicators (`synced`, `saving`, `offline`).

### 🎨 6. Neo-Brutalist Design System
- High-contrast visual language featuring bold 3px/4px solid black borders (`brutal-border`, `brutal-border-thick`).
- Hard-angled offset drop shadows (`3px`, `5px`, `8px`, `12px`).
- Tactile button press interactions (`transform: translate(3px, 3px)`).
- Typography paired with Google Fonts: **Plus Jakarta Sans** for UI headers and **Fira Code** for monospaced drill execution.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|:---|:---|:---|
| **Framework** | [React 19](https://react.dev/) | Component architecture, state management, and modern hooks. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type checking, interfaces, and compiler validation. |
| **Bundler / Tooling** | [Vite 6.2](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundling. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS engine with custom neo-brutalist tokens. |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent vector iconography. |
| **Database & Auth** | [Supabase](https://supabase.com/) | Managed PostgreSQL backend and authentication service. |
| **Typography** | [Google Fonts](https://fonts.google.com/) | *Plus Jakarta Sans* & *Fira Code*. |
| **Deployment** | [AWS Amplify](https://aws.amazon.com/amplify/) | Zero-cost serverless static SPA hosting architecture. |

---

## 📂 Project Structure

```plaintext
TypeNinja/
├── .env.example              # Environment variables template
├── AWS_CONFIG.md             # AWS Amplify, IAM RBAC & CloudWatch architecture
├── metadata.json             # Application capabilities and configuration
├── index.html                # Entry HTML with custom Google Fonts preconnect
├── package.json              # Project dependencies and script commands
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration with React and Tailwind plugins
└── src/
    ├── App.tsx               # Main application container, routing & state sync
    ├── main.tsx              # React DOM entry point
    ├── index.css             # Tailwind imports & Neo-Brutalist utility classes
    ├── vite-env.d.ts         # Vite client type definitions
    ├── components/
    │   ├── AuthModal.tsx             # Supabase Sign In / Sign Up modal dialog
    │   ├── CourseCurriculum.tsx      # 5-Module accordion course navigator
    │   ├── FingerGuideBar.tsx        # Dynamic hand & finger position guidance bar
    │   ├── Header.tsx                # Brand header, navigation & sync indicators
    │   ├── LessonDrill.tsx           # Active typing drill execution container
    │   ├── LessonSummaryModal.tsx    # Post-lesson scorecard & star rating modal
    │   ├── SpeedTestMode.tsx         # Standalone 15s/30s/60s speed test arena
    │   ├── VisualKeyboard.tsx        # Interactive SVG-styled QWERTY keyboard
    │   └── WeakKeyLab.tsx            # Adaptive telemetry analytics & retraining lab
    ├── data/
    │   └── courseData.ts             # Complete curriculum definition & lesson texts
    ├── hooks/
    │   └── useTypingEngine.ts        # Core typing hook (WPM, latency, shift rules)
    ├── types/
    │   └── course.ts                 # Type definitions (Modules, Lessons, Telemetry)
    └── utils/
        ├── keyboardMapping.ts        # QWERTY geometry, fingers & shift validation
        ├── supabaseClient.ts         # Supabase client & bidirectional progress sync
        └── weakKeyAlgorithm.ts       # Telemetry ranking & dynamic drill generator
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher) or [Bun](https://bun.sh/)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/) package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Sanjaylicet/TypeNinja.git
cd TypeNinja
```

### 2. Install Dependencies
```bash
npm install
# or if using Bun
bun install
```

### 3. Configure Environment Variables
Create a `.env` (or `.env.local`) file based on [.env.example](.env.example):
```bash
cp .env.example .env
```

Fill in your configuration keys:
```env
# Supabase configuration for Authentication and Cloud Progress Persistence
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Gemini API Key for AI extensions
GEMINI_API_KEY=your-gemini-api-key
```

> **Note:** If Supabase environment variables are omitted, TypeNinja automatically functions in local-first mode using browser `localStorage`.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start typing!

### 5. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be located in the `dist/` directory.

---

## ☁️ Cloud Sync & Database Setup

TypeNinja uses Supabase to persist user training records. To enable cloud persistence in your own Supabase instance, create a `user_progress` table:

```sql
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  unlocked_module_ids text[] default array['module-1'],
  unlocked_lesson_ids text[] default array['lesson-1-1'],
  completed_lessons jsonb default '{}'::jsonb,
  key_stats jsonb default '{}'::jsonb,
  highest_wpm integer default 0,
  current_streak_days integer default 1,
  total_practice_time_seconds integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.user_progress enable row level security;

-- Policy: Users can view their own progress
create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

-- Policy: Users can insert/update their own progress
create policy "Users can upsert own progress"
  on public.user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## 🏗️ AWS Deployment & Architecture

TypeNinja includes a zero-cost production deployment architecture designed for **AWS Amplify Static Hosting**. Detailed configuration steps, IAM policies, and billing monitors are provided in [AWS_CONFIG.md](AWS_CONFIG.md):

- **AWS Organizations & RBAC:** Customer-managed IAM policy (`Frontend-Developers-Policy`) providing scoped access to Amplify, CloudWatch, and Budgets while restricting unneeded services.
- **Cost Optimization:** Leverages AWS Free Tier static SPA hosting to achieve near-zero operational expenses.
- **CloudWatch Traffic Alarm:** Automatic alerts configured for bandwidth thresholds exceeding 1 GB in 24 hours.
- **AWS Budgets:** Strict $2.00/month cost safeguard with automated email notification thresholds at 50% and 100%.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve TypeNinja:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📜 License

This project is open-source and available under the **MIT License**.
