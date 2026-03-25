import { useTranslation } from 'react-i18next'
import CalendarView from '../components/calendar/CalendarView'
import { useHabits, useTasks } from '../hooks/useData'

export default function CalendarPage() {
  const { t } = useTranslation()
  const { habits } = useHabits()
  const { tasks } = useTasks()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('calendar.title')}</h1>
        <p className="page-subtitle">{t('calendar.subtitle')}</p>
      </div>
      <CalendarView habits={habits} tasks={tasks} />
    </div>
  )
}
