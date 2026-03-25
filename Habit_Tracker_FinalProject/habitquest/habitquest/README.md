# 🎯 HabitQuest — Level Up Your Life

A **production-level gamified Habit & Task Tracking App** built with React (Vite), Tailwind CSS, Framer Motion, and full Spring Boot backend integration.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

> ✅ **Demo Mode**: Works without a backend! Enter any email + password to explore. All data persists in localStorage.

---

## 🔧 Backend Integration

By default the app uses a Vite proxy to route `/api/*` → `http://localhost:8080`.

To change the backend URL, edit `vite.config.js`:
```js
proxy: {
  '/api': {
    target: 'http://your-backend-url:8080',
    changeOrigin: true,
  }
}
```

### API Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns `{ token, user }` |
| GET | `/api/habits` | Get all habits |
| POST | `/api/habits` | Create habit |
| PUT | `/api/habits/:id/complete` | Mark habit complete |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id/complete` | Mark task complete |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Expected Auth Response Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

JWT is automatically attached to all subsequent requests via Axios interceptors.

---

## 🎨 Features

### Core Pages
| Page | Description |
|------|-------------|
| 🔐 **Login/Register** | Animated auth with demo mode |
| 🏠 **Dashboard** | Stats, XP bar, today's tasks, quick actions, smart suggestions |
| 💪 **Habits** | Create/complete/delete habits with streak tracking |
| ✅ **Tasks** | Full task management with priorities and due dates |
| 📋 **History** | Completed tasks with timeline view + date filters |
| 📅 **Calendar** | Monthly view with color-coded activity indicators |
| 📊 **Progress** | Charts (Recharts) — weekly bars, XP growth, habit trends |
| 👤 **Profile** | Level system, badges, settings, reminders |

### Gamification
- ⚡ **XP System** — Earn XP for every action
- 🏆 **Level Progression** — 10 levels from Beginner to God Mode
- 🎖️ **Badges** — 10 unlockable achievements
- 🔥 **Streaks** — Daily streak tracking with fire animations
- 🎉 **Confetti** — Celebrations on level-up and streak milestones

### Smart Features
- 💡 **Smart Suggestions** — Context-aware tips (streak warnings, overdue tasks, time-based tips)
- 🔔 **Reminders** — Browser notifications with date/time picker
- 🌍 **i18n** — English + Spanish with language toggle
- 🌗 **Dark Mode** — Animated light/dark theme toggle

---

## 📁 Project Structure

```
src/
├── components/
│   ├── calendar/       # CalendarView
│   ├── common/         # Modal, StatCard, SmartSuggestions
│   ├── gamification/   # XPBar, BadgeGrid
│   ├── habits/         # HabitCard, HabitModal
│   ├── layout/         # AppLayout, Sidebar, Navbar
│   ├── reminders/      # RemindersPanel
│   └── tasks/          # TaskCard, TaskModal
├── context/
│   └── AppContext.jsx   # Auth, theme, XP, streaks, badges
├── hooks/
│   └── useData.js       # useHabits, useTasks (API + mock fallback)
├── i18n/
│   └── locales/         # en.json, es.json
├── pages/               # All 8 pages
├── services/
│   └── api.js           # Axios instance + auth/habit/task services
└── utils/               # (extendable)
```

---

## 🛠️ Tech Stack

| Tech | Version | Purpose |
|------|---------|---------|
| React | 18 | UI Framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| Framer Motion | 11 | Animations |
| Axios | 1.7 | HTTP client |
| React Router | 6 | Navigation |
| react-i18next | 15 | Internationalization |
| dayjs | 1.11 | Date handling |
| Recharts | 2 | Charts |
| canvas-confetti | 1.9 | Celebration effects |
| lucide-react | latest | Icons |
| react-hot-toast | 2 | Notifications |

---

## 🎨 Design System

**Colors:**
- Primary: Orange (`#f97316`)
- Secondary: Olive Green (`#7d9440`)
- Highlight: Yellow (`#eab308`)
- Accent: Blue (`#3b82f6`)
- Alert: Red (`#ef4444`)

**Components:** Glassmorphism cards, animated buttons, smooth modals

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 🔮 Extending the App

- **Add more languages**: Create `src/i18n/locales/fr.json` and import in `src/i18n.js`
- **Add SMS/Email reminders**: Integrate Twilio/SendGrid in `RemindersPanel.jsx`
- **Add more badges**: Extend `BADGE_DEFINITIONS` in `BadgeGrid.jsx`
- **Social features**: Add friend challenges via WebSocket

---

Made with ❤️ — HabitQuest © 2025
