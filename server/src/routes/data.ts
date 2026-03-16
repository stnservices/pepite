import { Router } from 'express'
import { readJson, writeJson } from '../lib/storage.js'

const router = Router()

// Leads & Activities
router.get('/leads', async (_req, res) => {
  try {
    const data = await readJson('leads.json', { leads: [], activities: [] })
    res.json(data)
  } catch (err) {
    console.error('Read leads error:', err)
    res.status(500).json({ error: 'Failed to read leads' })
  }
})

router.put('/leads', async (req, res) => {
  try {
    await writeJson('leads.json', req.body)
    res.json({ ok: true })
  } catch (err) {
    console.error('Write leads error:', err)
    res.status(500).json({ error: 'Failed to write leads' })
  }
})

// Projects
router.get('/projects', async (_req, res) => {
  try {
    const data = await readJson('projects.json', { projects: [] })
    res.json(data)
  } catch (err) {
    console.error('Read projects error:', err)
    res.status(500).json({ error: 'Failed to read projects' })
  }
})

router.put('/projects', async (req, res) => {
  try {
    await writeJson('projects.json', req.body)
    res.json({ ok: true })
  } catch (err) {
    console.error('Write projects error:', err)
    res.status(500).json({ error: 'Failed to write projects' })
  }
})

// Maps API key (for client-side map rendering)
router.get('/config/maps-key', (_req, res) => {
  res.json({ key: process.env.GOOGLE_PLACES_API_KEY || '' })
})

// Settings
router.get('/settings', async (_req, res) => {
  try {
    const data = await readJson('settings.json', {})
    res.json(data)
  } catch (err) {
    console.error('Read settings error:', err)
    res.status(500).json({ error: 'Failed to read settings' })
  }
})

router.put('/settings', async (req, res) => {
  try {
    const existing = await readJson('settings.json', {})
    const merged = { ...existing, ...req.body }
    await writeJson('settings.json', merged)
    res.json({ ok: true })
  } catch (err) {
    console.error('Write settings error:', err)
    res.status(500).json({ error: 'Failed to write settings' })
  }
})

export default router
