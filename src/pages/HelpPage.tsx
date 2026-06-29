import { HelpCircle, Camera } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl text-foreground">Help & Support</h1>
          <p className="text-muted-foreground font-body">Get help with using ClickStudio</p>
        </div>

        <div className="grid gap-6">
          {/* Getting Started */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-foreground">
                Getting Started
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground font-body">
              <p>
                Learn how to use ClickStudio to create amazing photo memories.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Choose a template for your session</li>
                <li>Allow camera permissions when prompted</li>
                <li>Take photos using the capture button</li>
                <li>Edit and enhance your photos</li>
                <li>Export and share your creations</li>
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-body">
                Common questions and answers will be available here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
