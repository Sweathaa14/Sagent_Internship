import { useState, useEffect, useCallback } from 'react'
import { habitService, taskService } from '../services/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

// ── useHabits ──────────────────────────────────────────────────────────────
export function useHabits() {
  const { awardXP, setStreak, celebrateStreak, unlockBadge } = useApp()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHabits = useCallback(async () => {
    try {
      const res = await habitService.getAll()
      setHabits(res.data || [])
    } catch (err) {
      // Use mock data if backend not available
      setHabits(getMockHabits())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchHabits() }, [fetchHabits])

  const createHabit = async (data) => {
    try {
      const res = await habitService.create(data)
      setHabits(prev => [res.data, ...prev])
      awardXP(20, 'New habit created!')
      if (habits.length === 0) unlockBadge({ id: 'first_habit', name: 'First Step', emoji: '🌱' })
      toast.success('Habit created! +20 XP 🌱')
    } catch {
      // Mock fallback
      const mock = { ...data, id: Date.now(), streak: 0, completedToday: false }
      setHabits(prev => [mock, ...prev])
      awardXP(20, 'New habit created!')
      toast.success('Habit created! +20 XP 🌱')
    }
  }

  const completeHabit = async (id) => {
    try {
      await habitService.complete(id)
    } catch { /* offline */ }
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const newStreak = (h.streak || 0) + 1
      setStreak(s => Math.max(s, newStreak))
      celebrateStreak(newStreak)
      if (newStreak >= 7) unlockBadge({ id: 'streak_7', name: 'Week Warrior', emoji: '🔥' })
      if (newStreak >= 30) unlockBadge({ id: 'streak_30', name: 'Month Master', emoji: '🏆' })
      return { ...h, completedToday: true, streak: newStreak }
    }))
    awardXP(10, 'Habit completed!')
    toast.success('Habit done! +10 XP ⚡', { duration: 1500 })
  }

  const updateHabit = async (id, data) => {
    try {
      const res = await habitService.update(id, data)
      setHabits(prev => prev.map(h => h.id === id ? { ...h, ...res.data } : h))
    } catch {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, ...data } : h))
    }
    toast.success('Habit updated!')
  }

  const deleteHabit = async (id) => {
    try { await habitService.delete(id) } catch { /* offline */ }
    setHabits(prev => prev.filter(h => h.id !== id))
    toast.success('Habit removed')
  }

  const completedToday = habits.filter(h => h.completedToday).length
  const completionRate = habits.length ? Math.round((completedToday / habits.length) * 100) : 0

  return { habits, loading, createHabit, completeHabit, updateHabit, deleteHabit, completedToday, completionRate, refetch: fetchHabits }
}

// ── useTasks ───────────────────────────────────────────────────────────────
export function useTasks() {
  const { awardXP, unlockBadge } = useApp()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await taskService.getAll()
      setTasks(res.data || [])
    } catch {
      setTasks(getMockTasks())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const createTask = async (data) => {
    try {
      const res = await taskService.create(data)
      setTasks(prev => [res.data, ...prev])
    } catch {
      const mock = { ...data, id: Date.now(), completed: false, createdAt: new Date().toISOString() }
      setTasks(prev => [mock, ...prev])
    }
    awardXP(5, 'Task added!')
    toast.success('Task added! +5 XP')
  }

  const completeTask = async (id) => {
    try { await taskService.complete(id) } catch { /* offline */ }
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      return { ...t, completed: true, completedAt: new Date().toISOString() }
    }))
    awardXP(15, 'Task completed!')
    toast.success('Task done! +15 XP 🎯', { duration: 1500 })
    const completed = tasks.filter(t => t.completed).length + 1
    if (completed >= 10) unlockBadge({ id: 'tasks_10', name: 'Task Crusher', emoji: '💪' })
  }

  const updateTask = async (id, data) => {
    try {
      const res = await taskService.update(id, data)
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...res.data } : t))
    } catch {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
    }
    toast.success('Task updated!')
  }

  const deleteTask = async (id) => {
    try { await taskService.delete(id) } catch { /* offline */ }
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success('Task removed')
  }

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  return { tasks, loading, createTask, completeTask, updateTask, deleteTask, pending, completed, refetch: fetchTasks }
}

// ── Mock data ──────────────────────────────────────────────────────────────
function getMockHabits() {
  return [
    { id: 1, name: 'Morning Workout', description: '30 min exercise', icon: '💪', color: 'orange', streak: 5, completedToday: false, frequency: 'daily', weeklyCompletions: 4 },
    { id: 2, name: 'Read 30 Minutes', description: 'Daily reading habit', icon: '📚', color: 'blue', streak: 12, completedToday: true, frequency: 'daily', weeklyCompletions: 6 },
    { id: 3, name: 'Meditation', description: '10 min mindfulness', icon: '🧘', color: 'purple', streak: 3, completedToday: false, frequency: 'daily', weeklyCompletions: 3 },
    { id: 4, name: 'Drink 8 Glasses', description: 'Stay hydrated!', icon: '💧', color: 'green', streak: 8, completedToday: false, frequency: 'daily', weeklyCompletions: 5 },
  ]
}

function getMockTasks() {
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7)
  return [
    { id: 1, title: 'Complete project proposal', description: 'Write the Q4 project overview', priority: 'high', dueDate: yesterday.toISOString(), completed: false },
    { id: 2, title: 'Buy groceries', description: 'Fruits, vegetables, protein', priority: 'medium', dueDate: new Date().toISOString(), completed: false },
    { id: 3, title: 'Schedule dentist appointment', description: null, priority: 'low', dueDate: tomorrow.toISOString(), completed: false },
    { id: 4, title: 'Review pull requests', description: 'Check team submissions', priority: 'high', dueDate: tomorrow.toISOString(), completed: true, completedAt: new Date().toISOString() },
    { id: 5, title: 'Plan weekend trip', description: 'Look up hotels and activities', priority: 'low', dueDate: nextWeek.toISOString(), completed: false },
  ]
}
