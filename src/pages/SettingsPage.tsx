import { Camera, Palette, Download, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl text-text">Settings</h1>
          <p className="text-muted-foreground font-body">Customize your ClickStudio experience</p>
        </div>

        <div className="grid gap-6">
          {/* Camera Settings */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-text">
                Camera Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-body">
                Camera settings will be available here
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-text">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-body">
                Theme and appearance options will be available here
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-text">
                Export Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-body">
                Export and sharing preferences will be available here
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-text">
                Privacy & Security
              </h2>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-body">
                Privacy and security settings will be available here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
