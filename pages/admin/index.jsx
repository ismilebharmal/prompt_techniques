import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdminIndex() {
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const loginTime = localStorage.getItem('admin_login_time')
    
    if (isAuthenticated && loginTime && Date.now() - parseInt(loginTime) < 24 * 60 * 60 * 1000) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
    </div>
  )
}
