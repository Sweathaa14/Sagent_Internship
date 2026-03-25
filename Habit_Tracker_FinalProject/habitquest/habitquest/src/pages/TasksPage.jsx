import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTasks } from '../hooks/useData'
import TaskCard from '../components/tasks/TaskCard'
import TaskModal from '../components/tasks/TaskModal'
import { Plus, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'

const FILTERS = ['all', 'pending', 'completed']

export default function TasksPage() {
  const { t } = useTranslation()
  const { tasks, loading, createTask, completeTask, updateTask, deleteTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [filter, setFilter] = useState('pending')

  const handleSave = async (data) => {
    if (editTask) await updateTask(editTask.id, data)
    else await createTask(data)
    setEditTask(null)
  }

  const openEdit = (task) => { setEditTask(task); setModalOpen(true) }
  const openCreate = () => { setEditTask(null); setModalOpen(true) }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  // Sort: overdue first, then by due date, then no date
  const sorted = [...filteredTasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    const aOverdue = a.dueDate && dayjs(a.dueDate).isBefore(dayjs(), 'day') && !a.completed
    const bOverdue = b.dueDate && dayjs(b.dueDate).isBefore(dayjs(), 'day') && !b.completed
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1
    const priorities = { high: 0, medium: 1, low: 2 }
    return (priorities[a.priority] ?? 1) - (priorities[b.priority] ?? 1)
  })

  const overdueCount = tasks.filter(t => !t.completed && t.dueDate && dayjs(t.dueDate).isBefore(dayjs(), 'day')).length
  const todayCount = tasks.filter(t => !t.completed && t.dueDate && dayjs(t.dueDate).isSame(dayjs(), 'day')).length

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t('tasks.title')}</h1>
          <p className="page-subtitle">{t('tasks.subtitle')}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-5 h-5" />
          {t('tasks.new')}
        </button>
      </div>

      {/* Quick stats */}
      {(overdueCount > 0 || todayCount > 0) && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {overdueCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <span className="text-red-500 font-black text-lg">{overdueCount}</span>
              <span className="text-red-600 dark:text-red-400 text-sm font-bold">{t('tasks.overdue')}</span>
            </div>
          )}
          {todayCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
              <span className="text-primary-600 font-black text-lg">{todayCount}</span>
              <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">{t('tasks.dueToday')}</span>
            </div>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-fit">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200
              ${filter === f
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t(`tasks.${f}`)}
            <span className="ml-1.5 text-xs">
              ({f === 'all' ? tasks.length : f === 'pending' ? tasks.filter(t => !t.completed).length : tasks.filter(t => t.completed).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass-card"
        >
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{t('tasks.noTasks')}</p>
          {filter !== 'completed' && (
            <button onClick={openCreate} className="btn-primary mx-auto mt-4">
              <Plus className="w-5 h-5" /> {t('tasks.new')}
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-2">
          {sorted.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              index={i}
              onComplete={completeTask}
              onEdit={openEdit}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        onSave={handleSave}
        task={editTask}
      />
    </div>
  )
}
