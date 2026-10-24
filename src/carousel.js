// Infinite horizontal crate. Cards wrap around, so it never ends.
// Inputs: vertical wheel once the page is at the bottom, horizontal wheel, drag, arrow keys.
import gsap from 'gsap'
import { records } from './records.js'
import { coverSVG } from './covers.js'
import { vinyls, vinylHTML } from './vinyls.js'

export function initCrate(lenis) {
  const track = document.querySelector('#track')
  const idxEl = document.querySelector('#crateIdx')

  track.innerHTML = records.map((r, i) => `
    <article class="card" data-i="${i}" tabindex="0" aria-label="${r.no} ${r.romaji} by ${r.artist}">
      <div class="card__obj">
        <div class="card__vinyl">${vinylHTML(i, r)}</div>
        <div class="card__sleeve">${coverSVG(i)}</div>
      </div>
      <div class="card__meta">
        <span class="tnum">${r.no}</span>
        <span>${r.romaji}<br><em>${r.artist}</em></span>
        <span>${r.genre}<br><em>${vinyls[i].name}</em></span>
      </div>
    </article>`).join('')

  const cards = [...track.children]
  let size, slot, total
  let target = 0, current = 0, lastIdx = -1

  const measure = () => {
    size = cards[0].offsetWidth
    slot = size * 1.5 // room for the vinyl to slide out
    total = slot * cards.length
  }
  measure()
  target = current = -(innerWidth - size) / 2 // first record centered
  addEventListener('resize', () => { const p = current / slot; measure(); target = current = p * slot })

  const mod = (n, m) => ((n % m) + m) % m

  gsap.ticker.add(() => {
    current += (target - current) * 0.085
    const v = target - current
    const skew = gsap.utils.clamp(-6, 6, v * -0.012)
    let best = Infinity, bestI = 0
    cards.forEach((c, i) => {
      const x = mod(i * slot - current + slot, total) - slot
      c.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`
      const d = Math.abs(x + size / 2 - innerWidth / 2)
      if (d < best) { best = d; bestI = i }
    })
    if (bestI !== lastIdx) { idxEl.textContent = records[bestI].no; lastIdx = bestI }
  })

  // Wheel: horizontal always; vertical only once the page has hit bottom
  addEventListener('wheel', (e) => {
    const atBottom = lenis.scroll >= lenis.limit - 2
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) target += e.deltaX * 1.2
    else if (atBottom && e.deltaY > 0) target += e.deltaY * 1.4
  }, { passive: true })

  // Drag (mouse + touch). A tiny movement counts as a tap → toggle the record open.
  let down = null
  track.addEventListener('pointerdown', (e) => { down = { x: e.clientX, t: target, moved: false } })
  addEventListener('pointermove', (e) => {
    if (!down) return
    const dx = e.clientX - down.x
    if (Math.abs(dx) > 6) { down.moved = true; track.classList.add('is-dragging') }
    target = down.t - dx * 1.6
  })
  addEventListener('pointerup', (e) => {
    if (down && !down.moved) {
      const card = e.target.closest('.card')
      if (card) { const open = card.classList.contains('is-open'); cards.forEach((c) => c.classList.remove('is-open')); card.classList.toggle('is-open', !open) }
    }
    down = null; track.classList.remove('is-dragging')
  })

  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') target += slot
    if (e.key === 'ArrowLeft') target -= slot
  })
}
