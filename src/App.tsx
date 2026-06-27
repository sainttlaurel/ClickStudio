import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import ChangelogModal from '@/components/ui/changelog-modal'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import CameraPage from '@/pages/CameraPage'
import PreviewPage from '@/pages/PreviewPage'
import EditorPage from '@/pages/EditorPage'
import TemplatesPage from '@/pages/TemplatesPage'
import GalleryPage from '@/pages/GalleryPage'
import SessionHistoryPage from '@/pages/SessionHistoryPage'
import SettingsPage from '@/pages/SettingsPage'
import HelpPage from '@/pages/HelpPage'
import AboutPage from '@/pages/AboutPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
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
