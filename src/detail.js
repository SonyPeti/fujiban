// Record page: one overlay that floods with the record's color, flies the sleeve in
// from the crate (FLIP), slides the vinyl out and reveals the details.
import gsap from 'gsap'
import { records } from './records.js'
import { coverSVG } from './covers.js'
import { vinyls, vinylHTML } from './vinyls.js'

export function initDetail(lenis) {
  const el = document.querySelector('#detail')
  const bg = el.querySelector('.detail__bg')
  const obj = el.querySelector('.detail__obj') // sleeve + vinyl fly as one
  const sleeve = el.querySelector('.detail__sleeve')
  const vinyl = el.querySelector('.detail__vinyl')
  const info = el.querySelector('.detail__info')
  const kanji = el.querySelector('.detail__kanji')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  let current = -1, openedFrom = null, tl = null, busy = false, lastFocus = null

  const render = (i) => {
    const r = records[i], v = vinyls[i]
    el.dataset.ink = r.ink
    el.style.setProperty('--rec', r.color)
    el.classList.toggle('is-soldout', r.left === 0)
    sleeve.innerHTML = coverSVG(i)
    vinyl.innerHTML = vinylHTML(i, r)
    kanji.innerHTML = [...r.kanji].map((c) => `<span>${c}</span>`).join('')
    info.innerHTML = `
      <div class="reveal"><div class="di__eyebrow"><span>FUJIBAN EXCLUSIVE · <b>No.${r.no}</b> / 07</span><span>${r.genre} · ${r.year}</span></div></div>
      <h2 class="di__title reveal" id="detailTitle"><span>${r.romaji}</span></h2>
      <div class="reveal"><p class="di__sub">${r.en} — ${r.artist}</p></div>
      <ol class="di__tracks">${r.tracks.map(([t, d], n) => `<li class="reveal"><span class="tnum">A${n + 1}</span><span>${t}</span><span class="tnum">${d}</span></li>`).join('')}</ol>
      <div class="reveal"><dl class="di__specs">
        <div><dt>PRESSING</dt><dd>${v.name}</dd></div>
        <div><dt>FORMAT</dt><dd>12" · 33⅓ RPM</dd></div>
        <div><dt>EDITION</dt><dd class="tnum">300 COPIES</dd></div>
        <div><dt>PRICE</dt><dd class="tnum">${r.price}</dd></div>
      </dl></div>
      <div class="reveal"><div class="di__stock"><b class="tnum">${r.left === 0 ? 'SOLD OUT' : `${String(r.left).padStart(3, '0')} LEFT`}</b><span class="di__bar"><i style="transform:scaleX(${r.left / 300})"></i></span><span class="tnum">/300</span></div></div>
      <div class="reveal"><p class="di__buy">${r.left === 0
        ? 'All 300 are gone. <b>Never repressed.</b> Ask at the counter about the next drop.'
        : '<b>Not sold online.</b> Come down to B1F, Kitazawa 2-chōme, Shimokitazawa.<br>Open 14:00–23:00 · closed Tuesdays.'}</p></div>`
    current = i
  }

  // Reveal everything except the sleeve flight; shared by open and prev/next
  const intro = (t, at) => {
    t.set(vinyl, { autoAlpha: 1 }, at)
      .fromTo(vinyl, { xPercent: 0, rotation: -40 }, { xPercent: 56, rotation: 0, duration: 1.3, ease: 'expo.out' }, at)
      .add(() => el.classList.add('is-spinning'), at + 0.3)
      .fromTo(kanji.children, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.08, duration: 1, ease: 'expo.out' }, at + 0.1)
      .fromTo(info.querySelectorAll('.reveal > *'), { yPercent: 110 }, { yPercent: 0, stagger: 0.035, duration: 0.9, ease: 'expo.out' }, at + 0.15)
      .fromTo('.detail__nav', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, at + 0.5)
    return t
  }

  function open(i, card) {
    if (busy || current === i && !el.hidden) return
    busy = true
    lastFocus = document.activeElement
    render(i)
    el.hidden = false
    document.body.classList.add('detail-open')
    lenis.stop()
    history.replaceState(null, '', `#/record/${records[i].no}`)

    const cardSleeve = card?.querySelector('.card__sleeve')
    const from = cardSleeve?.getBoundingClientRect()
    const to = obj.getBoundingClientRect()
    const cx = from ? from.left + from.width / 2 : innerWidth / 2
    const cy = from ? from.top + from.height / 2 : innerHeight / 2
    openedFrom = from ? { card, cardSleeve } : null

    tl = gsap.timeline({ onComplete: () => { busy = false; el.querySelector('.dn--close').focus({ preventScroll: true }) } })
    tl.fromTo(bg, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${cx}px ${cy}px)`, duration: 1.1, ease: 'expo.inOut' }, 0)
    if (from) {
      tl.set(cardSleeve, { autoAlpha: 0 }, 0)
        .set(vinyl, { autoAlpha: 0 }, 0) // tucked inside until the sleeve lands
        .fromTo(obj, { x: from.left - to.left, y: from.top - to.top, scale: from.width / to.width, transformOrigin: '0 0' },
          { x: 0, y: 0, scale: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
    } else {
      tl.fromTo(sleeve, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.3)
    }
    intro(tl, from ? 1.05 : 0.75) // vinyl comes out as the sleeve settles
    tl.add(() => gsap.set(bg, { clipPath: 'none' })) // survive window resizes while open; reverse re-renders the circle
    if (reduced) tl.progress(1)
  }

  function close() {
    if (busy || el.hidden) return
    busy = true
    el.classList.remove('is-spinning')
    const done = () => {
      el.hidden = true
      document.body.classList.remove('detail-open')
      if (openedFrom) gsap.set(openedFrom.cardSleeve, { autoAlpha: 1 })
      gsap.set([obj, sleeve, vinyl, bg], { clearProps: 'all' })
      lenis.start()
      history.replaceState(null, '', location.pathname)
      lastFocus?.focus?.({ preventScroll: true })
      current = -1; busy = false
    }
    // Same record we flew in from: rewind the flight. Otherwise just fade out.
    if (openedFrom && tl) tl.eventCallback('onReverseComplete', done).timeScale(2.4).reverse()
    else gsap.to(el, { autoAlpha: 0, duration: 0.5, ease: 'power2.in', onComplete: () => { gsap.set(el, { clearProps: 'all' }); done() } })
  }

  function step(dir) {
    if (busy || el.hidden) return
    busy = true
    const next = (current + dir + records.length) % records.length
    el.classList.remove('is-spinning')
    if (openedFrom) { gsap.set(openedFrom.cardSleeve, { autoAlpha: 1 }); openedFrom = null }
    gsap.timeline({ onComplete: () => {
      render(next)
      history.replaceState(null, '', `#/record/${records[next].no}`)
      const t = gsap.timeline({ onComplete: () => (busy = false) })
      t.fromTo(sleeve, { xPercent: 30 * dir, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1, ease: 'expo.out' }, 0.1)
      intro(t, 0.35)
    } })
      .to(vinyl, { xPercent: 0, rotation: -40, duration: 0.5, ease: 'power3.in' }, 0)
      .to([info, kanji], { autoAlpha: 0, duration: 0.35 }, 0)
      .to(bg, { backgroundColor: records[next].color, duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(sleeve, { xPercent: -30 * dir, autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 0.15)
      .set([info, kanji], { autoAlpha: 1 })
  }

  el.querySelector('.dn--close').addEventListener('click', close)
  el.querySelector('.dn--prev').addEventListener('click', () => step(-1))
  el.querySelector('.dn--next').addEventListener('click', () => step(1))
  addEventListener('keydown', (e) => {
    if (el.hidden) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  })

  // Deep link: #/record/04 opens that record once the site has loaded
  const openFromHash = () => {
    const m = location.hash.match(/#\/record\/(\d{2})/)
    const i = m ? records.findIndex((r) => r.no === m[1]) : -1
    if (i >= 0) open(i, null)
  }

  return { open, close, openFromHash, isOpen: () => !el.hidden }
}
