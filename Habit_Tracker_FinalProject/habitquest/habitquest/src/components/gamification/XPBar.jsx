import { motion } from 'framer-motion'
import { getLevelInfo } from '../../context/AppContext'
import { useTranslation } from 'react-i18next'

export default function XPBar({ xp, compact = false }) {
  const { t } = useTranslation()
  const levelInfo = getLevelInfo(xp)
  const { level, title, emoji, xpInLevel, xpNeeded, progress, nextLevel } = levelInfo

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
            {emoji} Lv.{level} {title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            {xp} XP
          </span>
        </div>
        <div className="xp-bar">
          <motion.div
            className="progress-bar-fill bg-gradient-to-r from-primary-400 to-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
          {xpNeeded - xpInLevel} XP to Level {level + 1}
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{t('progress.level')}</p>
          <p className="text-2xl font-black text-gradient">
            {emoji} Level {level}
          </p>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{title}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-primary-500">{xp.toLocaleString()}</p>
          <p className="text-sm text-gray-400 font-medium">Total XP</p>
        </div>
      </div>
      <div className="xp-bar h-4">
        <motion.div
          className="progress-bar-fill bg-gradient-to-r from-primary-400 via-primary-500 to-highlight-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500 font-medium">{xpInLevel} / {xpNeeded} XP</span>
        <span className="text-xs text-primary-500 font-bold">{Math.round(progress)}%</span>
      </div>
      <p className="text-xs text-gray-400 mt-1 font-medium">
        {t('gamification.nextLevel', { xp: xpNeeded - xpInLevel })} → {nextLevel.emoji} {nextLevel.title}
      </p>
    </div>
  )
}
