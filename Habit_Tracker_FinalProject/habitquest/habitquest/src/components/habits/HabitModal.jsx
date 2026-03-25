import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'

const COLORS = ['orange', 'green', 'yellow', 'blue', 'purple', 'red']
const ICONS = ['🎯', '💪', '📚', '🧘', '🏃', '💧', '🛌', '✍️', '🥗', '🎨', '🎵', '🌿', '⚡', '🧠', '🌟']
const COLOR_PREVIEWS = {
  orange: 'bg-orange-400', green: 'bg-olive-500', yellow: 'bg-yellow-400',
  blue: 'bg-blue-400', purple: 'bg-purple-400', red: 'bg-red-400',
}

const DEFAULT_FORM = { name: '', description: '', frequency: 'daily', color: 'orange', icon: '🎯' }

export default function HabitModal({ isOpen, onClose, onSave, habit = null }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (habit) setForm({ name: habit.name, description: habit.description || '', frequency: habit.frequency || 'daily', color: habit.color || 'orange', icon: habit.icon || '🎯' })
    else setForm(DEFAULT_FORM)
  }, [habit, isOpen])

  const handleSave = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    await onSave(form)
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={habit ? t('habits.modal.edit') : t('habits.modal.title')}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('habits.name')} *</label>
          <input
            className="input-field"
            placeholder="e.g. Morning Workout"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('habits.description')}</label>
          <input
            className="input-field"
            placeholder="Optional description..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('habits.frequency')}</label>
          <div className="flex gap-2">
            {['daily', 'weekly'].map(freq => (
              <button
                key={freq}
                onClick={() => setForm(f => ({ ...f, frequency: freq }))}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border-2
                  ${form.frequency === freq
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-300'}`}
              >
                {t(`habits.${freq}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('habits.icon')}</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => setForm(f => ({ ...f, icon }))}
                className={`w-9 h-9 text-lg rounded-xl transition-all border-2
                  ${form.icon === icon ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-110' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('habits.color')}</label>
          <div className="flex gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setForm(f => ({ ...f, color }))}
                className={`w-8 h-8 rounded-full ${COLOR_PREVIEWS[color]} transition-all border-2
                  ${form.color === color ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 btn-ghost border border-gray-200 dark:border-gray-700">
            {t('common.cancel')}
          </button>
          <button onClick={handleSave} disabled={!form.name.trim() || loading} className="flex-1 btn-primary disabled:opacity-50">
            {loading ? t('common.loading') : (habit ? t('common.save') : t('habits.create'))}
          </button>
        </div>
      </div>
    </Modal>
  )
}
