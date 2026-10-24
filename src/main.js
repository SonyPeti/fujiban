import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { records } from './records.js'
import { coverSVG } from './covers.js'
import { initCrate } from './carousel.js'

gsap.registerPlugin(ScrollTrigger)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (s) => document.querySelector(s)

// ---------- Smooth scroll (Lenis drives ScrollTrigger) ----------
const lenis = new Lenis({ lerp: 0.09 })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
lenis.stop()
history.scrollRestoration = 'manual'
scrollTo(0, 0)

// ---------- Tokyo clock ----------
const tokyo = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' })
const tick = () => ($('#clock').textContent = tokyo.format(new Date()).replace(':', ' . '))
tick(); setInterval(tick, 10000)

// ---------- Build scene details ----------
const SVGNS = 'http://www.w3.org/2000/svg'
const mk = (tag, attrs) => { const el = document.createElementNS(SVGNS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el }
let seed = 11; const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
for (let i = 0; i < 140; i++) $('#stars').append(mk('circle', { cx: rand() * 1600, cy: rand() * 620, r: rand() * 1.4 + 0.3, fill: '#fff', opacity: rand() * 0.7 + 0.2 }))
for (let r = 120; r < 296; r += 3.2) $('#grooves').append(mk('circle', { cx: 800, cy: 0, r, fill: 'none', stroke: r % 32 < 3.2 ? '#050506' : '#1b1b1e', 'stroke-width': 1 }))

// ---------- Photo layers: use generated images if they exist ----------
const NIGHT = 'brightness(0.22) saturate(0.4) hue-rotate(20deg)'
const DAWN = 'brightness(1) saturate(1) hue-rotate(0deg)'
const photos = [...document.querySelectorAll('.photo')].map((el) => new Promise((done) => {
  const img = new Image()
  img.onload = () => {
    el.setAttribute('href', el.dataset.src)
    el.style.display = ''
    el.style.filter = NIGHT
    if (el.dataset.replaces) document.querySelectorAll(el.dataset.replaces).forEach((v) => (v.style.display = 'none'))
    document.documentElement.classList.add('has-photos')
    done()
  }
  img.onerror = done
  img.src = el.dataset.src
}))

// ---------- Covers: loader flick ----------
const flick = $('#flick')
records.forEach((_, i) => flick.insertAdjacentHTML('beforeend', `<div>${coverSVG(i)}</div>`))
initCrate(lenis)

// ---------- Loader ----------
function runLoader() {
  const frames = [...flick.children]
  const count = { v: 0 }
  let last = -1
  const tl = gsap.timeline()
  tl.to(count, {
    v: 100, duration: reduced ? 0.2 : 2.6, ease: 'power2.inOut',
    onUpdate() {
      $('#count').textContent = String(Math.round(count.v)).padStart(3, '0')
      const f = Math.floor(count.v / 6) % frames.length // flick ~every 6%
      if (f !== last) { frames[last]?.classList.remove('on'); frames[f].classList.add('on'); last = f }
    },
  })
  // Square drops away → the night sky waiting underneath grows to full screen
  tl.set(flick, { autoAlpha: 0 })
  tl.to('.loader__count, .loader__note', { yPercent: 40, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '<')
  tl.to('.hero__stage', { clipPath: 'inset(0px 0px)', duration: reduced ? 0 : 1.4, ease: 'expo.inOut' }, '<0.1')
  tl.from('.scene', { scale: 1.25, duration: 1.8, ease: 'expo.out' }, '<0.2')
  tl.from('.hero__kanji', { autoAlpha: 0, yPercent: 8, duration: 1.2, ease: 'expo.out' }, '<0.6')
  tl.add(() => { document.body.classList.remove('is-loading'); $('.loader').remove(); lenis.start(); ScrollTrigger.refresh() })
}

// ---------- Hero: scroll-scrubbed dawn ----------
function heroScene() {
  gsap.set(['.vinyl', '.vinyl__label'], { scale: 0.37, svgOrigin: '800 0' })
  gsap.set('.vinyl__label', { autoAlpha: 0 })

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=180%', pin: true, scrub: 1 },
  })
  // 0 → .5 : night becomes dawn, the sun rises, fog parts
  tl.to('.sky-dawn', { opacity: 1, duration: 0.5 }, 0)
    .to('.stars', { opacity: 0, duration: 0.3 }, 0)
    .to('.sun', { attr: { transform: 'translate(0 400)' }, duration: 0.55, ease: 'power2.out' }, 0)
    .to('.fuji', { attr: { fill: '#5E6C86' }, duration: 0.5 }, 0)
    .to('.fuji-snow', { attr: { fill: '#F4F1EA' }, duration: 0.5 }, 0)
    .to('.ridge', { attr: { fill: '#2B3348' }, duration: 0.5 }, 0)
    .fromTo('.photo', { filter: NIGHT }, { filter: DAWN, duration: 0.5 }, 0)
    .to('.photo--mist', { x: 260, opacity: 0.6, duration: 0.6 }, 0)
    .to('.fog--l', { x: -420, opacity: 0.5, duration: 0.6 }, 0)
    .to('.fog--r', { x: 420, opacity: 0.5, duration: 0.6 }, 0)
    // .45 → .8 : the sun is a record — the disc spreads out behind it
    .to('.sun__glow', { opacity: 0, duration: 0.25 }, 0.45)
    .to('.vinyl', { scale: 1, duration: 0.35, ease: 'power2.inOut' }, 0.45)
    .to('.vinyl__label', { autoAlpha: 1, scale: 1, duration: 0.2 }, 0.6)
    .to('.vinyl__spin, .vinyl__label', { rotation: 540, svgOrigin: '800 0', duration: 0.55 }, 0.45)
    // .7 → 1 : copy reveals
    .fromTo('.mask span', { yPercent: 110 }, { yPercent: 0, stagger: 0.05, duration: 0.2, ease: 'power3.out' }, 0.72)
    .to('#bar', { scaleX: 1, duration: 1 }, 0)

  // Dawn clock: 05:12 → 05:48 as you scroll
  const clock = { m: 12 }
  tl.to(clock, { m: 48, duration: 1, onUpdate: () => ($('#dawn').textContent = `05.${String(Math.round(clock.m)).padStart(2, '0')}`) }, 0)

  if (reduced) tl.progress(1)
}

Promise.all([document.fonts.ready, ...photos]).then(() => { heroScene(); runLoader() })
