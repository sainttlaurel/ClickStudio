import { Github, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="ClickStudio Logo"
            className="h-20 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="font-display text-3xl text-text mb-2">ClickStudio</h1>
          <p className="text-muted text-lg">Version 1.0.0</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-border shadow-card text-center">
          <h2 className="font-display text-xl text-text mb-4">
            Modern ClickStudio Experience
          </h2>
          <p className="text-muted leading-relaxed mb-6">
            ClickStudio brings the joy of photo creation to the web with
            professional-grade features and elegant design. Capture, edit, and
            share memorable moments with friends and family using our intuitive
            interface and powerful tools.
          </p>

          <div className="flex items-center justify-center gap-2 text-muted">
            <span>Made with ♡ for creating memories</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
          <h3 className="font-display text-lg text-text mb-4">Built With</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'React 19',
              'TypeScript',
              'Tailwind CSS',
              'Framer Motion',
              'Zustand',
              'Supabase',
              'Vite',
              'Vercel',
            ].map(tech => (
              <div key={tech} className="text-center p-3 bg-rose-50 rounded-lg">
                <span className="text-sm font-medium text-text">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
          <h3 className="font-display text-lg text-text mb-4">Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Live webcam capture with HD quality',
              'Multiple layout templates',
              'Professional photo editing tools',
              'Filters and effects library',
              'Export in multiple formats',
              'QR code sharing',
              'Session history tracking',
              'Responsive design for all devices',
            ].map(feature => (
              <div key={feature} className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
          <h3 className="font-display text-lg text-text mb-4 text-center">Contact</h3>
          <div className="flex flex-col items-center gap-3 text-muted text-sm">
            <a
              href="mailto:miguelpilapil30@gmail.com"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              miguelpilapil30@gmail.com
            </a>
            <a
              href="https://discord.com/users/saintalauuuurel_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              saintalauuuurel_
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" icon={<Github className="h-4 w-4" />}>
            GitHub
          </Button>

          <Button variant="outline" icon={<Mail className="h-4 w-4" />}>
            <a href="mailto:miguelpilapil30@gmail.com">Email</a>
          </Button>

          <Button variant="outline" icon={<MessageSquare className="h-4 w-4" />}>
            <a href="https://discord.com/users/saintalauuuurel_" target="_blank" rel="noopener noreferrer">Discord</a>
          </Button>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-muted border-t border-border pt-6">
          <p>© 2026 ClickStudio. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
