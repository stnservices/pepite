import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { readJson, writeJson } from '../lib/storage.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me'

interface User {
  email: string
  passwordHash: string
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' })
      return
    }

    const user = await readJson<User | null>('user.json', null)
    if (!user || user.email !== email) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const accessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ email }, JWT_REFRESH_SECRET, { expiresIn: '7d' })

    // Store refresh token
    const tokens = await readJson<string[]>('refresh-tokens.json', [])
    tokens.push(refreshToken)
    await writeJson('refresh-tokens.json', tokens)

    res.json({ accessToken, refreshToken })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' })
      return
    }

    const tokens = await readJson<string[]>('refresh-tokens.json', [])
    if (!tokens.includes(refreshToken)) {
      res.status(401).json({ error: 'Invalid refresh token' })
      return
    }

    let payload: { email: string }
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { email: string }
    } catch {
      // Remove invalid token
      await writeJson('refresh-tokens.json', tokens.filter((t) => t !== refreshToken))
      res.status(401).json({ error: 'Expired refresh token' })
      return
    }

    // Rotate tokens
    const newAccessToken = jwt.sign({ email: payload.email }, JWT_SECRET, { expiresIn: '15m' })
    const newRefreshToken = jwt.sign({ email: payload.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' })

    const updatedTokens = tokens.filter((t) => t !== refreshToken)
    updatedTokens.push(newRefreshToken)
    await writeJson('refresh-tokens.json', updatedTokens)

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch (err) {
    console.error('Refresh error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      const tokens = await readJson<string[]>('refresh-tokens.json', [])
      await writeJson('refresh-tokens.json', tokens.filter((t) => t !== refreshToken))
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('Logout error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
