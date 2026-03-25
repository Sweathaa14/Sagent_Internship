import { motion } from 'framer-motion'

export const BADGE_DEFINITIONS = [
  { id: 'first_habit', name: 'First Step', desc: 'Created your first habit', emoji: '🌱' },
  { id: 'streak_7', name: 'Week Warrior', desc: '7-day streak', emoji: '🔥' },
  { id: 'streak_30', name: 'Month Master', desc: '30-day streak', emoji: '🏆' },
  { id: 'tasks_10', name: 'Task Crusher', desc: 'Completed 10 tasks', emoji: '💪' },
  { id: 'habits_5', name: 'Habit Builder', desc: 'Created 5 habits', emoji: '⚡' },
  { id: 'perfect_day', name: 'Perfect Day', desc: 'Completed all habits in one day', emoji: '⭐' },
  { id: 'early_bird', name: 'Early Bird', desc: 'Completed a habit before 8am', emoji: '🌅' },
  { id: 'night_owl', name: 'Night Owl', desc: 'Completed a task after 10pm', emoji: '🦉' },
  { id: 'xp_500', name: 'XP Hunter', desc: 'Earned 500 XP', emoji: '⚡' },
  { id: 'xp_1000', name: 'Power Player', desc: 'Earned 1000 XP', emoji: '🚀' },
]

export default function BadgeGrid({ earned = [] }) {
  const earnedIds = earned.map(b => b.id || b)

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {BADGE_DEFINITIONS.map((badge, i) => {
        const isEarned = earnedIds.includes(badge.id)
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative group flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200
              ${isEarned
                ? 'bg-gradient-to-br from-primary-50 to-highlight-50 dark:from-primary-900/30 dark:to-highlight-900/20 border-primary-200 dark:border-primary-700 shadow-md'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-40 grayscale'}`}
          >
            <span className="text-2xl">{badge.emoji}</span>
            <span className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 leading-tight">
              {badge.name}
            </span>
            {isEarned && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                <span className="text-white text-[8px]">✓</span>
              </div>
            )}
            {/* Tooltip */}
            <div className="tooltip">{badge.desc}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
