import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Toaster } from '@/components/ui/toaster'
import ChangelogModal from '@/components/ui/changelog-modal'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import StudioPage from '@/pages/StudioPage'
import SharePage from '@/pages/SharePage'

const GalleryPage = lazy(() => import('@/pages/GalleryPage'))
const SessionHistoryPage = lazy(() => import('@/pages/SessionHistoryPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const HelpPage = lazy(() => import('@/pages/HelpPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const CameraPage = lazy(() => import('@/pages/CameraPage'))
const EditorPage = lazy(() => import('@/pages/EditorPage'))
const PreviewPage = lazy(() => import('@/pages/PreviewPage'))

function App() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Check for updates every hour
      if (registration) {
        setInterval(() => { registration.update() }, 60 * 60 * 1000)
      }
    },
  })

  useEffect(() => {
    if (needRefresh) {
      // Small delay so the toast is visible, then auto-update
      const t = setTimeout(() => { updateServiceWorker(true) }, 2500)
      return () => clearTimeout(t)
    }
  }, [needRefresh, updateServiceWorker])

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/share/:sessionId" element={<SharePage />} />
        <Route element={<Layout />}>
          <Route path="/camera" element={<Suspense fallback={null}><CameraPage /></Suspense>} />
          <Route path="/preview" element={<Suspense fallback={null}><PreviewPage /></Suspense>} />
          <Route path="/editor" element={<Suspense fallback={null}><EditorPage /></Suspense>} />
          <Route path="/gallery" element={<Suspense fallback={null}><GalleryPage /></Suspense>} />
          <Route path="/history" element={<Suspense fallback={null}><SessionHistoryPage /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={null}><SettingsPage /></Suspense>} />
          <Route path="/help" element={<Suspense fallback={null}><HelpPage /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={null}><AboutPage /></Suspense>} />
        </Route>
      </Routes>
      <Toaster />
      <ChangelogModal />
    </>
  )
}

export default App
