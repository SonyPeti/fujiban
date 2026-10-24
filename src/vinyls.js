// Each record's vinyl: pressing color/pattern drawn with CSS gradients.
// `disc` paints the vinyl body; the label reuses the record's cover art.
export const vinyls = [
  { // 01 AKA FUJI — translucent hinomaru red
    name: 'Hinomaru Smoke Marble', light: false,
    disc: 'radial-gradient(circle, #ff4a3d 0 30%, #c8211b 55%, #7d120e 100%)',
    clear: true,
  },
  { // 02 SHŪDEN — smoke, like a train window at night
    name: 'Last Train Smoke',
    disc: 'radial-gradient(circle at 62% 40%, rgba(242,182,109,.55), transparent 45%), radial-gradient(circle, #3a3a40, #121216 80%)',
    clear: true,
  },
  { // 03 AMAOTO — crystal clear with rain droplets
    name: 'Clear / Rain Splatter', light: true,
    disc: 'radial-gradient(circle, rgba(230,236,240,.55), rgba(190,200,210,.35) 70%, rgba(120,130,140,.55))',
    clear: true,
    drops: true,
  },
  { // 04 YAKŌ — black with lantern-red splatter
    name: 'Lantern Swirl',
    disc: `radial-gradient(circle at 30% 35%, #e8432a 0 3%, transparent 3.5%),
      radial-gradient(circle at 70% 28%, #e8432a 0 2%, transparent 2.5%),
      radial-gradient(circle at 76% 70%, #e8432a 0 4%, transparent 4.5%),
      radial-gradient(circle at 24% 74%, #e8432a 0 1.5%, transparent 2%),
      radial-gradient(circle at 55% 85%, #ffd23b 0 1.5%, transparent 2%),
      radial-gradient(circle at 18% 50%, #ffd23b 0 1%, transparent 1.5%),
      #0d0d10`,
  },
  { // 05 NAMI — indigo / white marble swirl
    name: 'Kanagawa Foam Marble',
    disc: `conic-gradient(from 20deg, #1d3a5f, #e9e2d3 8%, #1d3a5f 14%, #2c5687 30%, #e9e2d3 36%, #1d3a5f 44%,
      #13283f 60%, #e9e2d3 66%, #2c5687 74%, #1d3a5f 88%, #e9e2d3 94%, #1d3a5f)`,
    swirl: true,
  },
  { // 06 KŪHAKU — solid bone white
    name: 'Bone White / One Drop',
    disc: 'radial-gradient(circle, #f6f3ec, #dcd7cc 90%)',
    light: true,
  },
  { // 07 SAKURA ZENSEN — half pink, half white split
    name: 'Sakura Milk Swirl',
    disc: 'conic-gradient(from 135deg, #f2a7b5 0 50%, #fbf4f1 50% 100%)',
    light: true,
  },
]

// Markup for one vinyl. ChatGPT pressing texture (public/vinyls/NN.jpg) over the gradient fallback.
// Rotor (material + grooves + paper label) spins; sheen stays still like real light.
export const vinylHTML = (i, r) => {
  const v = vinyls[i]
  const cls = ['vinyl', v.light && 'is-light'].filter(Boolean).join(' ')
  return `
    <div class="${cls}" style="--disc:url(/vinyls/${r.no}.jpg) center/cover, ${v.disc.replace(/\s+/g, ' ')}">
      <div class="vinyl__rotor">
        <div class="vinyl__body"></div>
        <div class="vinyl__grooves"></div>
        <div class="vinyl__label">
          <span class="vl__brand">FUJIBAN 富士盤</span>
          <span class="vl__kanji">${r.kanji}</span>
          <span class="vl__meta">${r.romaji}<br>No.${r.no} · SIDE A · 33⅓</span>
        </div>
        <div class="vinyl__hole"></div>
      </div>
      <div class="vinyl__sheen"></div>
    </div>`
}
