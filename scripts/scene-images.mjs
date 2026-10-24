// Builds the hero photo layers from the ChatGPT PNGs in public/scene/:
//   X.webp        — dawn version (as generated, smaller)
//   X-night.webp  — the same image pre-darkened for night
// The hero crossfades night → dawn with opacity, which is far cheaper on phones
// than tweening a CSS filter every frame. Run: node scripts/scene-images.mjs
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../public/scene/', import.meta.url))
const p = (f) => dir + f
for (const name of ['fuji', 'foreground', 'mist']) {
  const src = sharp(p(`${name}.png`)).resize({ width: 1800, withoutEnlargement: true })
  await src.clone().webp({ quality: 80, alphaQuality: 90 }).toFile(p(`${name}.webp`))
  await src.clone()
    .modulate({ brightness: 0.24, saturation: 0.45, hue: 20 }) // matches the old night filter
    .webp({ quality: 74, alphaQuality: 90 })
    .toFile(p(`${name}-night.webp`))
  console.log('built', name)
}
