export function bakeFrameOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameId?: string
): void {
  if (frameId === 'film') {
    const barH = Math.round(h * 0.065)
    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, w, barH)
    ctx.fillRect(0, h - barH, w, barH)
    const holeW = Math.round(w * 0.022)
    const holeH = Math.round(barH * 0.55)
    const gap = Math.round(w * 0.038)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    for (let x = gap; x < w - gap; x += gap * 1.5) {
      const ry = Math.round((barH - holeH) / 2)
      ctx.fillRect(x, ry, holeW, holeH)
      ctx.fillRect(x, h - barH + ry, holeW, holeH)
    }
  } else if (frameId === 'blush') {
    const grad = ctx.createRadialGradient(
      w / 2,
      h / 2,
      h * 0.28,
      w / 2,
      h / 2,
      h * 0.8
    )
    grad.addColorStop(0, 'rgba(233,30,140,0)')
    grad.addColorStop(1, 'rgba(233,30,140,0.28)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
  } else if (frameId === 'minimal') {
    const b = Math.round(w * 0.022)
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'
    ctx.lineWidth = b
    ctx.strokeRect(b / 2, b / 2, w - b, h - b)
  } else if (frameId === 'polaroid') {
    const border = Math.round(Math.min(w, h) * 0.04)
    const bottomH = Math.round(h * 0.2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, border)
    ctx.fillRect(0, 0, border, h)
    ctx.fillRect(w - border, 0, border, h)
    ctx.fillRect(0, h - bottomH, w, bottomH)
    ctx.fillStyle = 'rgba(155, 107, 123, 0.45)'
    ctx.font = `italic ${Math.round(h * 0.028)}px cursive`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('ClickStudio', w / 2, h - bottomH / 2)
  }
}
