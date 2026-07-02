import { useState } from 'react'
import { Camera, Palette, Download, Shield, Monitor, HardDrive, Globe, Bell, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useUIStore } from '@/store/useUIStore'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'

export default function SettingsPage() {
  const { theme, setTheme, reducedMotion, setReducedMotion } = useUIStore()
  const { cameraSettings, setCameraSettings, capturedPhotos, clearPhotos } = usePhotoStore()
  const { success, error: showError } = useToast()

  const [activeSection, setActiveSection] = useState<'camera' | 'appearance' | 'export' | 'privacy'>('camera')
  const [facingMode, setFacingMode] = useState(cameraSettings.facingMode)
  const [countdown, setCountdown] = useState(cameraSettings.countdown)
  const [grid, setGrid] = useState(cameraSettings.grid)
  const [flash, setFlash] = useState(cameraSettings.flash)
  const [exportQuality, setExportQuality] = useState(100)
  const [autoSave, setAutoSave] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const handleCameraSave = () => {
    setCameraSettings({ facingMode, countdown, grid, flash })
    success('Camera settings saved', 'Your preferences have been updated')
  }

  const handleExportQualityChange = (value: number) => {
    setExportQuality(value)
  }

  const handleClearAllPhotos = () => {
    if (capturedPhotos.length === 0) {
      showError('Nothing to clear', 'No photos in current session')
      return
    }
    if (window.confirm(`Delete all ${capturedPhotos.length} photos from the current session? This cannot be undone.`)) {
      clearPhotos()
      success('Photos cleared', 'Current session photos have been removed')
    }
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl text-foreground">Settings</h1>
          <p className="text-muted-foreground font-body">Customize your ClickStudio experience</p>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 bg-white rounded-2xl p-1 border border-border shadow-card">
          {[
            { id: 'camera', label: 'Camera', icon: Camera },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'export', label: 'Export', icon: Download },
            { id: 'privacy', label: 'Privacy', icon: Shield },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as typeof activeSection)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeSection === id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Camera Settings */}
        {activeSection === 'camera' && (
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-foreground">Camera Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Camera</label>
                <select
                  value={facingMode}
                  onChange={e => setFacingMode(e.target.value as 'user' | 'environment')}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="user">Front (Selfie)</option>
                  <option value="environment">Back (Rear)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Countdown Timer: {countdown}s
                </label>
                <Slider
                  value={countdown}
                  onChange={setCountdown}
                  min={0}
                  max={10}
                  step={1}
                  label="Countdown Duration"
                />
                <p className="text-xs text-muted-foreground font-body">Set to 0 for instant capture</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Grid Overlay</p>
                  <p className="text-sm text-muted-foreground">Show rule-of-thirds grid for composition</p>
                </div>
                <Switch checked={grid} onCheckedChange={setGrid} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Screen Flash</p>
                  <p className="text-sm text-muted-foreground">Brief white flash on capture for low light</p>
                </div>
                <Switch checked={flash} onCheckedChange={setFlash} />
              </div>

              <Button onClick={handleCameraSave} className="w-full md:w-auto">
                Save Camera Settings
              </Button>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeSection === 'appearance' && (
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-foreground">Appearance</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Monitor },
                    { value: 'dark', label: 'Dark', icon: Monitor },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        theme === value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      <Monitor className="h-5 w-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Reduced Motion</p>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>
            </div>
          </div>
        )}

        {/* Export Settings */}
        {activeSection === 'export' && (
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-foreground">Export Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Image Quality: {exportQuality}%
                </label>
                <Slider
                  value={exportQuality}
                  onChange={handleExportQualityChange}
                  min={50}
                  max={100}
                  step={5}
                  label="Export Quality"
                />
                <p className="text-xs text-muted-foreground font-body">Higher quality = larger file size</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-save to Cloud</p>
                  <p className="text-sm text-muted-foreground">Automatically sync sessions to your account</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Include QR Code</p>
                  <p className="text-sm text-muted-foreground">Add shareable QR code to exported strips</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Export Format</p>
                  <p className="text-sm text-muted-foreground">Default format for downloads</p>
                </div>
                <select className="px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpg">JPEG (Smaller)</option>
                  <option value="webp">WebP (Modern)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeSection === 'privacy' && (
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-foreground">Privacy & Security</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Analytics</p>
                  <p className="text-sm text-muted-foreground">Help improve ClickStudio with anonymous usage data</p>
                </div>
                <Switch checked={false} onCheckedChange={() => {}} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Crash Reporting</p>
                  <p className="text-sm text-muted-foreground">Automatically send error reports for debugging</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Session History</p>
                  <p className="text-sm text-muted-foreground">Keep local history of your photo sessions</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-medium text-foreground mb-4">Data Management</h3>
                <div className="space-y-3">
                  <Button variant="outline" onClick={handleClearAllPhotos} icon={<Trash2 className="h-4 w-4" />} className="w-full justify-start">
                    Clear Current Session Photos
                  </Button>
                  <Button variant="outline" icon={<HardDrive className="h-4 w-4" />} className="w-full justify-start">
                    Export All Data (JSON)
                  </Button>
                  <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} className="w-full justify-start">
                    Delete Account & All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
