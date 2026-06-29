interface FrameOverlayProps {
  frameId: string
  frameImage?: string
  caption?: string
}

export const FrameOverlay = ({ frameId, frameImage, caption = 'ClickStudio' }: FrameOverlayProps) => {
  if (!frameId && !frameImage) return null
  if (frameId === 'none' && !frameImage) return null

  if (frameImage) {
    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        <img src={frameImage} alt="" className="w-full h-full object-cover" />
      </div>
    )
  }

  if (frameId === 'film') {
    return (
      <>
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '30px',
            background: '#111111',
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 6px, transparent 6px, transparent 24px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '30px',
            background: '#111111',
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 6px, transparent 6px, transparent 24px)',
          }}
        />
      </>
    )
  }

  if (frameId === 'blush') {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(233,30,140,0.35) 70%, rgba(233,30,140,0.15) 100%)'
        }} />
        <span className="absolute top-2 left-3 text-xs pointer-events-none z-10 opacity-40" style={{ filter: 'blur(0.5px)' }}>✦</span>
        <span className="absolute top-2 right-3 text-xs pointer-events-none z-10 opacity-40" style={{ filter: 'blur(0.5px)' }}>✦</span>
        <span className="absolute bottom-2 left-3 text-xs pointer-events-none z-10 opacity-40" style={{ filter: 'blur(0.5px)' }}>✦</span>
        <span className="absolute bottom-2 right-3 text-xs pointer-events-none z-10 opacity-40" style={{ filter: 'blur(0.5px)' }}>✦</span>
        <div className="absolute inset-2 border border-white/20 rounded-sm pointer-events-none z-10" />
      </>
    )
  }

  if (frameId === 'minimal') {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          border: '4px solid rgba(255,255,255,0.9)',
          borderRadius: '2px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.08)'
        }} />
        <div className="absolute top-2 left-2 w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-white/60 rounded-tl-sm pointer-events-none z-10" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-[1.5px] border-r-[1.5px] border-white/60 rounded-tr-sm pointer-events-none z-10" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-[1.5px] border-l-[1.5px] border-white/60 rounded-bl-sm pointer-events-none z-10" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-white/60 rounded-br-sm pointer-events-none z-10" />
      </>
    )
  }

  if (frameId === 'polaroid') {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          border: '12px solid #FFFFFF',
          borderBottomWidth: '54px',
          boxShadow: '0 0 0 2px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '1px',
        }} />
        <div className="absolute bottom-[6px] left-0 right-0 text-center pointer-events-none z-10">
          <span className="text-[11px] italic" style={{ color: 'rgba(155, 107, 123, 0.5)', fontFamily: 'serif', letterSpacing: '0.3px' }}>
            {caption}
          </span>
        </div>
      </>
    )
  }

  return null
}
