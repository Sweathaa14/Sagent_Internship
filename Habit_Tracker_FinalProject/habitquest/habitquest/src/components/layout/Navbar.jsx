import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import { Sun, Moon, Menu, Globe, Bell } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ onMenuClick }) {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useApp()
  const [langOpen, setLangOpen] = useState(false)

  const switchLang = (lang) => {
    i18n.changeLanguage(lang)
    setLangOpen(false)
  }

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden btn-ghost p-2"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop: empty left side */}
      <div className="hidden lg:block" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(o => !o)}
            className="btn-ghost p-2 gap-1 text-sm"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline font-bold uppercase text-xs">
              {i18n.language.substring(0, 2)}
            </span>
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden min-w-[120px] z-50"
              >
                {[['en', '🇺🇸 English'], ['es', '🇪🇸 Español']].map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => switchLang(code)}
                    className={`w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors
                      ${i18n.language.startsWith(code) ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications bell */}
        <button className="btn-ghost p-2 relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2"
          aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    </header>
  )
}
