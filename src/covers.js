// Generative album covers as inline SVG strings (inline so page fonts apply).
import { records } from './records.js'

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const SANS = `font-family="IBM Plex Mono, monospace"` // cover labels share the site mono
const SERIF = `font-family="Shippori Mincho B1, serif"`

// Shared typographic frame: label top-left, edition top-right, title bottom.
const frame = (r, ink, { kanjiSize = 110, vertical = false } = {}) => `
  <text x="56" y="80" ${SANS} font-size="22" font-weight="500" letter-spacing="1.5" fill="${ink}">FUJIBAN EXCLUSIVE</text>
  <text x="944" y="80" ${SANS} font-size="22" font-weight="500" letter-spacing="1.5" fill="${ink}" text-anchor="end">No.${r.no} — /300</text>
  ${vertical
    ? `<text x="900" y="150" ${SERIF} font-size="${kanjiSize}" font-weight="800" fill="${ink}" writing-mode="tb" letter-spacing="10">${r.kanji}</text>`
    : `<text x="56" y="880" ${SERIF} font-size="${kanjiSize}" font-weight="800" fill="${ink}">${r.kanji}</text>`}
  <text x="56" y="944" ${SANS} font-size="24" font-weight="500" letter-spacing="1.5" fill="${ink}">${r.romaji} · ${r.artist.toUpperCase()}</text>`

const wrap = (body) =>
  `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" class="cover-svg" aria-hidden="true">${body}</svg>`

const designs = [
  // 01 AKA FUJI — red Fuji under a sun disc
  (r) => wrap(`
    <rect width="1000" height="1000" fill="#E9E2D3"/>
    <circle cx="500" cy="380" r="170" fill="#D2231C"/>
    <path d="M60 760 C260 690 380 560 450 470 L480 462 L500 474 L522 458 L552 470 C620 560 740 690 940 760 Z" fill="#B0201A"/>
    <path d="M450 470 L480 462 L500 474 L522 458 L552 470 C566 488 578 503 590 520 L572 512 L560 536 L544 516 L530 548 L516 520 L500 552 L486 522 L470 546 L458 516 L442 534 L430 520 C438 503 444 486 450 470 Z" fill="#E9E2D3"/>
    <rect x="56" y="770" width="888" height="2" fill="#121212"/>
    ${frame(r, '#121212')}`),

  // 02 SHŪDEN — last train light streaks
  (r) => {
    const R = rng(2); let s = ''
    for (let i = 0; i < 46; i++) {
      const y = 330 + R() * 260, x = R() * 700, w = 80 + R() * 520
      const c = R() > 0.8 ? '#D2231C' : R() > 0.5 ? '#F2B66D' : '#F4F1EA'
      s += `<rect x="${x}" y="${y}" width="${w}" height="${1 + R() * 4}" fill="${c}" opacity="${0.35 + R() * 0.65}"/>`
    }
    return wrap(`<rect width="1000" height="1000" fill="#0B0F1C"/>${s}${frame(r, '#F4F1EA', { vertical: true, kanjiSize: 120 })}`)
  },

  // 03 AMAOTO — rain hairlines, one red drop
  (r) => {
    const R = rng(3); let s = ''
    for (let i = 0; i < 220; i++) {
      const x = 40 + R() * 920, y = 110 + R() * 640, h = 30 + R() * 160
      s += `<line x1="${x}" y1="${y}" x2="${x - h * 0.08}" y2="${y + h}" stroke="#121212" stroke-width="1.2" opacity="${0.15 + R() * 0.5}"/>`
    }
    return wrap(`<rect width="1000" height="1000" fill="#DCDDD8"/>${s}<circle cx="640" cy="560" r="9" fill="#D2231C"/>${frame(r, '#121212')}`)
  },

  // 04 YAKŌ — glowing perspective grid + fox mark
  (r) => {
    let s = ''
    for (let i = 0; i <= 16; i++) s += `<line x1="500" y1="420" x2="${-600 + i * 137.5}" y2="1000" stroke="#FF3B6B" stroke-width="2" opacity=".55"/>`
    for (let i = 1; i < 12; i++) { const y = 420 + Math.pow(i / 11, 2.2) * 580; s += `<line x1="0" y1="${y}" x2="1000" y2="${y}" stroke="#FF3B6B" stroke-width="2" opacity=".55"/>` }
    return wrap(`<defs><radialGradient id="yk" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#5A1030"/><stop offset="1" stop-color="#0E0A14"/></radialGradient></defs>
      <rect width="1000" height="1000" fill="url(#yk)"/>${s}
      <path d="M430 260 L460 170 L500 230 L540 170 L570 260 L500 330 Z" fill="none" stroke="#F4F1EA" stroke-width="5"/>
      <rect x="0" y="0" width="1000" height="420" fill="none"/>
      ${frame(r, '#F4F1EA', { kanjiSize: 120 })}`)
  },

  // 05 NAMI — seigaiha waves
  (r) => {
    let s = ''
    const w = 100
    for (let row = 0; row < 22; row++) for (let col = -1; col < 12; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0), cy = 120 + row * 30
      for (let k = 4; k >= 1; k--) s += `<circle cx="${cx}" cy="${cy}" r="${(w / 2) * (k / 4)}" fill="${k === 4 ? '#1D3A5F' : 'none'}" stroke="#E9E2D3" stroke-width="2"/>`
    }
    return wrap(`<rect width="1000" height="1000" fill="#1D3A5F"/><g clip-path="url(#nm)">${s}</g>
      <clipPath id="nm"><rect x="0" y="110" width="1000" height="640"/></clipPath>
      ${frame(r, '#E9E2D3', { kanjiSize: 130 })}`)
  },

  // 06 KŪHAKU — nothing, one dot
  (r) => wrap(`<rect width="1000" height="1000" fill="#F1EEE7"/><circle cx="702" cy="388" r="14" fill="#D2231C"/>${frame(r, '#121212', { kanjiSize: 70 })}`),

  // 07 SAKURA ZENSEN — drifting petals along a diagonal front
  (r) => {
    const R = rng(7); let s = ''
    for (let i = 0; i < 90; i++) {
      const t = R(), x = t * 1000 + (R() - 0.5) * 260, y = 760 - t * 620 + (R() - 0.5) * 220
      s += `<ellipse cx="${x}" cy="${y}" rx="${8 + R() * 10}" ry="${4 + R() * 5}" fill="${R() > 0.3 ? '#E58B9A' : '#FFFFFF'}" transform="rotate(${R() * 180} ${x} ${y})" opacity="${0.6 + R() * 0.4}"/>`
    }
    return wrap(`<rect width="1000" height="1000" fill="#F3E4DF"/>${s}${frame(r, '#121212')}`)
  },
]

// Generated art (ChatGPT, public/covers/NN.jpg) sits over the vector design and under the type.
// If the file is missing, the SVG <image> renders nothing and the vector design shows through.
const withArt = (svg, r) => {
  const ink = svg.match(/<text[^>]*fill="([^"]+)"/)[1]
  const shade = ink === '#121212' ? '236,232,223' : '0,0,0'
  const art = `
    <image href="/covers/${r.no}.jpg" width="1000" height="1000" preserveAspectRatio="xMidYMid slice"/>
    <linearGradient id="sc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgb(${shade})" stop-opacity=".55"/><stop offset=".14" stop-color="rgb(${shade})" stop-opacity="0"/>
      <stop offset=".72" stop-color="rgb(${shade})" stop-opacity="0"/><stop offset="1" stop-color="rgb(${shade})" stop-opacity=".7"/>
    </linearGradient>
    <rect width="1000" height="1000" fill="url(#sc)"/>`
  const at = svg.indexOf('<text')
  return svg.slice(0, at) + art + svg.slice(at)
}

// Unique ids per render so gradients/clips don't collide when a cover appears twice.
let uid = 0
export const coverSVG = (i) => withArt(designs[i](records[i]), records[i]).replace(/\b(yk|nm|sc)\b/g, `$1-${uid++}`)
