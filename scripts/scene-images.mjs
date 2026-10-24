// Builds the hero photo layers from the ChatGPT PNGs in public/scene/:
//   X.webp        — dawn version (as generated, smaller)
//   X-night.webp  — the same image graded for night
// The hero crossfades night → dawn with opacity, which is far cheaper on phones
// than tweening a CSS filter every frame. Run: node scripts/scene-images.mjs
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../public/scene/', import.meta.url))
const p = (f) => dir + f

// Night grade per pixel: dark, cool moonlight (snow stays faintly readable).
// Alpha is pushed up so the night twin fully hides the bright dawn layer
// underneath at soft edges (otherwise a light rim shows around Fuji).
const NIGHT = { r: 0.2, g: 0.25, b: 0.4, lift: [4, 6, 14], alpha: 1.8 }

for (const name of ['fuji', 'foreground', 'mist']) {
  const base = sharp(p(`${name}.png`)).resize({ width: 1800, withoutEnlargement: true }).ensureAlpha()
  await base.clone().webp({ quality: 86, alphaQuality: 95, smartSubsample: true }).toFile(p(`${name}.webp`))

  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * NIGHT.r + NIGHT.lift[0])
    data[i + 1] = Math.min(255, data[i + 1] * NIGHT.g + NIGHT.lift[1])
    data[i + 2] = Math.min(255, data[i + 2] * NIGHT.b + NIGHT.lift[2])
    data[i + 3] = Math.min(255, data[i + 3] * NIGHT.alpha)
  }
  await sharp(data, { raw: info })
    .webp({ quality: 94, alphaQuality: 95, smartSubsample: true }) // dark tones band badly at lower quality
    .toFile(p(`${name}-night.webp`))
  console.log('built', name)
}
