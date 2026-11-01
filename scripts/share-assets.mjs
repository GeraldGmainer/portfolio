// Renders the default share image per language (public/images/og/default.<lang>.jpg,
// 1200 × 630) and the app icons for site.webmanifest:
//
//   node scripts/share-assets.mjs
//
// Needs Google Chrome (or CHROME=/path/to/chrome) and network for the Google Fonts.
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const ICON = readFileSync('public/favicon.svg')

const COPY = {
  de: {
    headline: 'Produkt, Design <em>und</em> Code – aus einer Hand.',
    role: 'Product Owner, UX-Designer und Full-Stack-Entwickler · Österreich'
  },
  en: {
    headline: 'Product, design <em>and</em> code – end to end.',
    role: 'Product owner, UX designer and full-stack developer · Austria'
  }
}

const page = ({ headline, role }) => `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=JetBrains+Mono:wght@400&family=Manrope:wght@400&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; padding: 72px 80px; display: flex; flex-direction: column; justify-content: space-between;
    background: radial-gradient(60% 80% at 88% 8%, #16294a 0%, transparent 70%), #0B1220; color: #E8ECF4; font-family: Manrope, sans-serif;
  }
  .name { display: flex; align-items: center; gap: 22px; font: 400 36px Fraunces, serif; letter-spacing: -0.01em; }
  .name img { width: 72px; height: 72px; }
  h1 { font: 400 92px/1.02 Fraunces, serif; letter-spacing: -0.025em; max-width: 1020px; }
  em { font-style: italic; }
  p { font: 400 25px 'JetBrains Mono', monospace; color: #9AA6BC; letter-spacing: -0.01em; }
</style>
<div class="name"><img src="data:image/svg+xml;base64,${ICON.toString('base64')}" alt="">Gerald Gmainer</div>
<div><h1>${headline}</h1><p style="margin-top:32px">${role}</p></div>`

mkdirSync('public/images/og', { recursive: true })
const dir = mkdtempSync(join(tmpdir(), 'share-'))

for (const [lang, copy] of Object.entries(COPY)) {
  const html = join(dir, `${lang}.html`)
  const png = join(dir, `${lang}.png`)
  writeFileSync(html, page(copy))
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=8000', `--screenshot=${png}`, `file://${resolve(html)}`
  ], { stdio: 'ignore' })
  await sharp(png).resize(1200, 630).jpeg({ quality: 88, mozjpeg: true }).toFile(`public/images/og/default.${lang}.jpg`)
}

for (const size of [192, 512]) {
  await sharp(ICON, { density: 72 * size / 64 }).resize(size, size).png().toFile(`public/icon-${size}.png`)
}
