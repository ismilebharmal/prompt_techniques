import '../styles/globals.css'
import { useState, useEffect } from 'react'

// Toast notification component
function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
      {message}
    </div>
  )
}

export default function App({ Component, pageProps }) {
  const [toast, setToast] = useState({ show: false, message: '' })

  const showToast = (message) => {
    setToast({ show: true, message })
  }

  const hideToast = () => {
    setToast({ show: false, message: '' })
  }

  return (
    <>
      <Component {...pageProps} showToast={showToast} />
      <Toast message={toast.message} show={toast.show} onClose={hideToast} />
    </>
  )
}
