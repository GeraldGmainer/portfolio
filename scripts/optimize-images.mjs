// Converts the PNGs in public/images to WebP (alpha kept), at most MAX px on
// the long side, and removes the PNG when the WebP is smaller. Run it again
// after adding screenshots, then point the code at the .webp files:
//
//   node scripts/optimize-images.mjs [--dry]
import { readdir, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const DIR = 'public/images'
const MAX = 1800
const dry = process.argv.includes('--dry')

let before = 0
let after = 0

for (const name of (await readdir(DIR)).filter(f => f.endsWith('.png'))) {
  const src = join(DIR, name)
  const out = src.replace(/\.png$/, '.webp')
  const { size } = await stat(src)

  const buffer = await sharp(src)
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 5 })
    .toBuffer()

  if (buffer.length >= size) {
    console.log(`keep   ${name} (WebP not smaller)`)
    continue
  }
  before += size
  after += buffer.length
  console.log(`${dry ? 'would ' : ''}webp   ${name}  ${Math.round(size / 1024)} KB → ${Math.round(buffer.length / 1024)} KB`)
  if (!dry) {
    await sharp(buffer).toFile(out)
    await unlink(src)
  }
}

console.log(`\n${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB`)
