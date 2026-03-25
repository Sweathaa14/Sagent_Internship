import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Trash2, Clock } from 'lucide-react'
import Modal from '../common/Modal'
import { useApp } from '../../context/AppContext'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const STORAGE_KEY = 'habitquest_reminders'

export default function RemindersPanel() {
  const { t } = useTranslation()
  const { requestNotificationPermission, sendBrowserNotification } = useApp()
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ message: '', date: dayjs().format('YYYY-MM-DD'), time: '08:00', enabled: true })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  }, [reminders])

  // Check reminders every minute
  useEffect(() => {
    const check = () => {
      const now = dayjs()
      reminders.forEach(r => {
        if (!r.enabled) return
        const reminderTime = dayjs(`${r.date} ${r.time}`)
        if (Math.abs(now.diff(reminderTime, 'minute')) < 1) {
          sendBrowserNotification('HabitQuest Reminder 🎯', r.message)
          toast(r.message, { icon: '🔔', duration: 5000 })
        }
      })
    }
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [reminders, sendBrowserNotification])

  const handleSave = async () => {
    if (!form.message.trim()) return toast.error('Please enter a message')
    const hasPermission = await requestNotificationPermission()
    if (!hasPermission) toast('Notifications blocked. Reminders will still show in-app.', { icon: '⚠️' })
    setReminders(prev => [...prev, { ...form, id: Date.now() }])
    setShowModal(false)
    setForm({ message: '', date: dayjs().format('YYYY-MM-DD'), time: '08:00', enabled: true })
    toast.success('Reminder saved! 🔔')
  }

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id))
    toast.success('Reminder deleted')
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-500" />
          <h3 className="section-title mb-0">{t('reminders.title')}</h3>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary py-1.5 px-3 text-sm">
          <Plus className="w-4 h-4" />
          {t('reminders.new')}
        </button>
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4 font-medium">
          {t('reminders.noReminders')} 🔔
        </p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {reminders.map(r => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${r.enabled
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60'}`}
              >
                <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{r.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {dayjs(r.date).format('MMM D')} at {r.time}
                  </p>
                </div>
                <button
                  onClick={() => toggleReminder(r.id)}
                  className={`flex-shrink-0 w-10 h-5 rounded-full transition-all duration-300 relative
                    ${r.enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300
                    ${r.enabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
                <button onClick={() => deleteReminder(r.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Set Reminder 🔔">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('reminders.message')}
            </label>
            <input
              className="input-field"
              placeholder="e.g. Time for your daily workout!"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t('reminders.date')}
              </label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                min={dayjs().format('YYYY-MM-DD')}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t('reminders.time')}
              </label>
              <input
                type="time"
                className="input-field"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              />
            </div>
          </div>
          <div className="p-3 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-100 dark:border-accent-800">
            <p className="text-xs text-accent-700 dark:text-accent-300 font-semibold">
              📱 You'll receive a browser notification at the scheduled time. Make sure to allow notifications when prompted!
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="flex-1 btn-ghost border border-gray-200 dark:border-gray-700">
              {t('common.cancel')}
            </button>
            <button onClick={handleSave} className="flex-1 btn-primary">
              {t('reminders.save')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
