import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  
  if (!token) {
    redirect('/login')
  }
  
  return token
}

export async function redirectIfAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  
  if (token) {
    redirect('/dashboard')
  }
}