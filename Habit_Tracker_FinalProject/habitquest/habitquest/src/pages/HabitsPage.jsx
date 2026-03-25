import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHabits } from '../hooks/useData'
import HabitCard from '../components/habits/HabitCard'
import HabitModal from '../components/habits/HabitModal'
import { Plus, Zap, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HabitsPage() {
  const { t } = useTranslation()
  const { habits, loading, createHabit, completeHabit, updateHabit, deleteHabit } = useHabits()
  const [modalOpen, setModalOpen] = useState(false)
  const [editHabit, setEditHabit] = useState(null)

  const handleSave = async (data) => {
    if (editHabit) await updateHabit(editHabit.id, data)
    else await createHabit(data)
    setEditHabit(null)
  }

  const openEdit = (habit) => {
    setEditHabit(habit)
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditHabit(null)
    setModalOpen(true)
  }

  const completedToday = habits.filter(h => h.completedToday).length

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t('habits.title')}</h1>
          <p className="page-subtitle">{t('habits.subtitle')}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-5 h-5" />
          {t('habits.new')}
        </button>
      </div>

      {/* Progress summary */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 flex items-center gap-4"
        >
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex flex-col items-center justify-center text-white">
            <span className="text-2xl font-black">{completedToday}</span>
            <span className="text-xs font-bold opacity-80">/{habits.length}</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-700 dark:text-gray-200">
              {completedToday === habits.length ? '🎉 All done today!' : `${habits.length - completedToday} habits remaining`}
            </p>
            <div className="xp-bar mt-2">
              <motion.div
                className="progress-bar-fill bg-gradient-to-r from-primary-400 to-primary-600"
                initial={{ width: 0 }}
                animate={{ width: `${habits.length ? (completedToday / habits.length) * 100 : 0}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Tip banner */}
      <div className="mb-6 p-3 bg-highlight-50 dark:bg-highlight-900/20 rounded-xl border border-highlight-200 dark:border-highlight-800">
        <p className="text-sm font-semibold text-highlight-800 dark:text-highlight-200">{t('habits.suggestion')}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 glass-card"
        >
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">{t('habits.noHabits')}</p>
          <button onClick={openCreate} className="btn-primary mx-auto">
            <Plus className="w-5 h-5" /> {t('habits.new')}
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {habits.map((habit, i) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              index={i}
              onComplete={completeHabit}
              onEdit={openEdit}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}

      <HabitModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditHabit(null) }}
        onSave={handleSave}
        habit={editHabit}
      />
    </div>
  )
}
