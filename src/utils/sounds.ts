let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function playBeep(frequency = 880, duration = 150, volume = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequency
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration / 1000)
  } catch {
    // Audio not available
  }
}

export function playCountdownTick(second: number) {
  if (second <= 0) {
    playBeep(1200, 200, 0.4)
  } else {
    playBeep(660, 120, 0.25)
  }
}

export function playCaptureSound() {
  playBeep(1400, 300, 0.35)
  setTimeout(() => playBeep(1800, 200, 0.25), 100)
}
