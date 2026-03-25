import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const DEFAULT_FORM = {
  name: '', description: '', dueDate: '', priority: 'medium',
}

export default function TaskModal({ isOpen, onClose, onSave, task = null }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        name: task.title || task.name || '',
        description: task.description || '',
        dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
        priority: task.priority || 'medium',
      })
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [task, isOpen])

  const handleSave = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    await onSave({ title: form.name, ...form })
    setLoading(false)
    onClose()
  }

  const priorities = [
    { value: 'low', label: t('tasks.low'), emoji: '🟢' },
    { value: 'medium', label: t('tasks.medium'), emoji: '🟡' },
    { value: 'high', label: t('tasks.high'), emoji: '🔴' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? t('tasks.modal.edit') : t('tasks.modal.title')}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('tasks.name')} *</label>
          <input
            className="input-field"
            placeholder="e.g. Finish project report"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('tasks.description')}</label>
          <textarea
            className="input-field resize-none"
            rows={2}
            placeholder="Add details..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('tasks.dueDate')}</label>
          <input
            type="date"
            className="input-field"
            value={form.dueDate}
            min={dayjs().format('YYYY-MM-DD')}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('tasks.priority')}</label>
          <div className="flex gap-2">
            {priorities.map(p => (
              <button
                key={p.value}
                onClick={() => setForm(f => ({ ...f, priority: p.value }))}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-1
                  ${form.priority === p.value
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 btn-ghost border border-gray-200 dark:border-gray-700">
            {t('common.cancel')}
          </button>
          <button onClick={handleSave} disabled={!form.name.trim() || loading} className="flex-1 btn-primary disabled:opacity-50">
            {loading ? t('common.loading') : (task ? t('common.save') : t('tasks.create'))}
          </button>
        </div>
      </div>
    </Modal>
  )
}
