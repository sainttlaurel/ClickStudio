import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Toaster } from '@/components/ui/toaster'
import ChangelogModal from '@/components/ui/changelog-modal'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import CameraPage from '@/pages/CameraPage'
import PreviewPage from '@/pages/PreviewPage'
import EditorPage from '@/pages/EditorPage'
import GalleryPage from '@/pages/GalleryPage'
import SessionHistoryPage from '@/pages/SessionHistoryPage'
import SettingsPage from '@/pages/SettingsPage'
import HelpPage from '@/pages/HelpPage'
import AboutPage from '@/pages/AboutPage'
import SharePage from '@/pages/SharePage'
import StudioPage from '@/pages/StudioPage'

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
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/history" element={<SessionHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
      <Toaster />
      <ChangelogModal />
    </>
  )
}

export default App
