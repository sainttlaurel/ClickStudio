import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import {
  CHANGELOG,
  APP_VERSION,
  isChangelogSeen,
  markChangelogSeen,
} from '@/constants/changelog'

const TYPE_EMOJI: Record<string, string> = {
  new: '🆕',
  improved: '✨',
  fixed: '🐛',
}

export default function ChangelogModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isChangelogSeen()) setOpen(true)
  }, [])

  const handleClose = () => {
    markChangelogSeen()
    setOpen(false)
  }

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      size="md"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-foreground">What's New ✦</h2>
          <span className="inline-block mt-1 text-xs font-semibold bg-primary/10 text-primary px-3 py-0.5 rounded-full">
            v{APP_VERSION}
          </span>
        </div>

        {/* Changelog list — scrollable */}
        <div className="max-h-72 overflow-y-auto space-y-5 pr-1">
          {CHANGELOG.map((version, vi) => (
            <div key={version.version}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary">v{version.version}</span>
                <span className="text-xs text-muted-foreground">{version.date}</span>
                {vi === 0 && (
                  <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full">
                    Latest
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {version.entries.map((entry, ei) => (
                  <motion.li
                    key={ei}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ei * 0.04 }}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="flex-shrink-0 mt-0.5 text-base leading-none">
                      {TYPE_EMOJI[entry.type]}
                    </span>
                    <span className="leading-snug">{entry.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dismiss */}
        <Button onClick={handleClose} className="w-full" pill>
          Got it! ✦
        </Button>
      </div>
    </Modal>
  )
}
