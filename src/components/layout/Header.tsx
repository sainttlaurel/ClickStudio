import { Menu, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'
import { usePhotoStore } from '@/store/usePhotoStore'

export default function Header() {
  const toggleSidebar = useUIStore(state => state.toggleSidebar)
  const currentSession = usePhotoStore(state => state.currentSession)
  const capturedPhotos = usePhotoStore(state => state.capturedPhotos)
  const navigate = useNavigate()

  return (
    <header className="h-16 border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-20 shadow-soft">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left — hamburger + logo (links home) */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            icon={<Menu className="h-5 w-5 text-muted-foreground" />}
            aria-label="Toggle sidebar"
          />

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="Go to home"
          >
            <img
              src="/logo.png"
              alt="ClickStudio"
              className="h-8 w-auto object-contain hidden sm:block"
              onError={e => {
                /* fallback: hide broken image */
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            {/* Inline fallback shown while logo.png isn't loaded */}
            <span className="font-display text-xl text-primary leading-none font-bold sm:hidden">
              ClickStudio
            </span>
          </button>
        </div>

        {/* Center — Session info chip */}
        {currentSession && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground bg-secondary border border-border rounded-full px-4 py-1.5">
            <span className="font-medium text-foreground">
              {currentSession.template.name}
            </span>
            <span className="text-border">·</span>
            <span>
              {capturedPhotos.length} photo
              {capturedPhotos.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            icon={<Settings className="h-4 w-4 text-muted-foreground" />}
            aria-label="Settings"
          />
        </div>
      </div>
    </header>
  )
}
