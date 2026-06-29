interface FrameOverlayProps {
  frameId: string
  caption?: string
}

export const FrameOverlay = ({ frameId, caption = 'ClickStudio' }: FrameOverlayProps) => {
  if (!frameId || frameId === 'none') return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {frameId === 'film' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[6.5%] bg-[#111111]" />
          <div className="absolute bottom-0 left-0 right-0 h-[6.5%] bg-[#111111]" />
        </>
      )}
      {frameId === 'blush' && (
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 28%, rgba(233,30,140,0.28) 80%)'
        }} />
      )}
      {frameId === 'minimal' && (
        <div className="absolute inset-0 border-[3px] border-white/85 rounded-sm" />
      )}
      {frameId === 'polaroid' && (
        <div className="absolute inset-0" style={{
          boxShadow: 'inset 0 0 0 4% #FFFFFF, inset 0 -20% 0 0 #FFFFFF'
        }}>
          <div className="absolute bottom-[10%] left-0 right-0 text-center text-[11px] italic"
            style={{ color: 'rgba(155, 107, 123, 0.45)' }}>
            {caption}
          </div>
        </div>
      )}
    </div>
  )
}
