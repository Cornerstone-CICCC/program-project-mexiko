import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import api from './api'
import { auth } from '../lib/firebase'

export interface LoginPayload {
  email: string
  password: string
}

export interface SessionUser {
  _id?: string
  id?: string
  email?: string
  isAdmin?: boolean
  firebaseUid?: string
  fullName?: {
    first?: string
    last?: string
  }
}

export async function login(payload: LoginPayload) {
  const credential = await signInWithEmailAndPassword(
    auth,
    payload.email,
    payload.password,
  )

  const idToken = await credential.user.getIdToken()

  const response = await api.post('/users/login', { idToken })
  return response.data
}

export async function logout() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Firebase signOut error:', error)
  }

  const response = await api.post('/users/logout')
  return response.data
}

export async function getSessionMe(): Promise<SessionUser | null> {
  try {
    const response = await api.get('/users/session/me')
    return response.data?.user ?? null
  } catch (error) {
    return null
  }
}