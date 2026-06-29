export function bakeFrameOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameId?: string,
  caption?: string
): void {
  if (frameId === 'film') {
    const barH = Math.round(h * 0.1)
    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, w, barH)
    ctx.fillRect(0, h - barH, w, barH)
    const holeW = Math.round(w * 0.025)
    const holeH = Math.round(barH * 0.5)
    const gap = Math.round(w * 0.055)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    for (let x = gap; x < w - gap; x += gap + holeW) {
      const ry = Math.round((barH - holeH) / 2)
      ctx.fillRect(x, ry, holeW, holeH)
      ctx.fillRect(x, h - barH + ry, holeW, holeH)
    }
  } else if (frameId === 'blush') {
    const grad = ctx.createRadialGradient(
      w / 2, h / 2, h * 0.25,
      w / 2, h / 2, h * 0.9
    )
    grad.addColorStop(0, 'rgba(233,30,140,0)')
    grad.addColorStop(0.6, 'rgba(233,30,140,0.15)')
    grad.addColorStop(1, 'rgba(233,30,140,0.35)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // corner accent lines
    const c = Math.round(w * 0.04)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1
    // top-left
    ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c * 2, c); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c, c * 2); ctx.stroke()
    // top-right
    ctx.beginPath(); ctx.moveTo(w - c, c); ctx.lineTo(w - c * 2, c); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(w - c, c); ctx.lineTo(w - c, c * 2); ctx.stroke()
    // bottom-left
    ctx.beginPath(); ctx.moveTo(c, h - c); ctx.lineTo(c * 2, h - c); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(c, h - c); ctx.lineTo(c, h - c * 2); ctx.stroke()
    // bottom-right
    ctx.beginPath(); ctx.moveTo(w - c, h - c); ctx.lineTo(w - c * 2, h - c); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(w - c, h - c); ctx.lineTo(w - c, h - c * 2); ctx.stroke()

    // inner subtle border
    const b = Math.round(w * 0.02)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 1
    ctx.strokeRect(b, b, w - b * 2, h - b * 2)
  } else if (frameId === 'minimal') {
    const b = Math.round(w * 0.04)
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.lineWidth = b
    ctx.strokeRect(b / 2, b / 2, w - b, h - b)
    // shadow
    ctx.shadowColor = 'rgba(0,0,0,0.06)'
    ctx.shadowBlur = Math.round(w * 0.03)
    ctx.strokeStyle = 'rgba(0,0,0,0.03)'
    ctx.lineWidth = 1
    ctx.strokeRect(b + 1, b + 1, w - b * 2 - 2, h - b * 2 - 2)
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  } else if (frameId === 'polaroid') {
    const border = Math.round(Math.min(w, h) * 0.04)
    const bottomH = Math.round(h * 0.18)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, border)
    ctx.fillRect(0, 0, border, h)
    ctx.fillRect(w - border, 0, border, h)
    ctx.fillRect(0, h - bottomH, w, bottomH)
    // outer shadow
    const s = Math.round(w * 0.02)
    ctx.shadowColor = 'rgba(0,0,0,0.08)'
    ctx.shadowBlur = s
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.strokeStyle = 'rgba(0,0,0,0)'
    ctx.lineWidth = 0
    ctx.strokeRect(0, 0, w, h)
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    const displayCaption = caption?.trim() || 'ClickStudio'
    ctx.fillStyle = 'rgba(155, 107, 123, 0.5)'
    ctx.font = `italic ${Math.round(h * 0.028)}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayCaption, w / 2, h - bottomH / 2)
  }
}
