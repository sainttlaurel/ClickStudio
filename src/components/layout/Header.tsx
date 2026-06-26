import { Menu, Camera, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'
import { usePhotoStore } from '@/store/usePhotoStore'

export default function Header() {
  const toggleSidebar = useUIStore(state => state.toggleSidebar)
  const currentSession = usePhotoStore(state => state.currentSession)
  const capturedPhotos = usePhotoStore(state => state.capturedPhotos)

  return (
    <header className="h-16 border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-20 shadow-soft">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            icon={<Menu className="h-5 w-5 text-muted" />}
            aria-label="Toggle sidebar"
          />

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-script text-xl text-primary hidden sm:block leading-none">
              ClickStudio
            </h1>
          </div>
        </div>

        {/* Center — Session info */}
        {currentSession && (
          <div className="flex items-center gap-3 text-xs text-muted bg-rose-50 border border-border rounded-full px-4 py-1.5">
            <span className="font-medium text-text">
              {currentSession.template.name}
            </span>
            <span className="text-border">·</span>
            <span>
              {capturedPhotos.length} photo
              {capturedPhotos.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon={<Settings className="h-4 w-4 text-muted" />}
            aria-label="Settings"
          />
        </div>
      </div>
    </header>
  )
}
