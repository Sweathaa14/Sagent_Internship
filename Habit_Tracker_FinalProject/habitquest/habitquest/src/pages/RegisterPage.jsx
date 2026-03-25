import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { Eye, EyeOff, Target, Rocket } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { t } = useTranslation()
  const { register } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form)
      toast.success(t('auth.registerSuccess'))
      navigate('/dashboard')
    } catch {
      // Demo mode fallback
      const mockUser = { id: 1, name: form.name, email: form.email }
      localStorage.setItem('habitquest_token', 'demo_token')
      localStorage.setItem('habitquest_user', JSON.stringify(mockUser))
      toast.success(t('auth.registerSuccess'))
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh bg-orange-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-olive-500 to-olive-600 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gradient">HabitQuest</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">{t('auth.createAccount')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-solid p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-6">{t('auth.register')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.name')}</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your Hero Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.email')}</label>
              <input
                type="email"
                className="input-field"
                placeholder="hero@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-secondary py-3.5 text-base mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {t('common.loading')}
                </span>
              ) : (
                <><Rocket className="w-5 h-5" /> {t('auth.signUp')}</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5 font-medium">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              {t('auth.signIn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
