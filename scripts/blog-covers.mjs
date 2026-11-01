// Renders the 1200×630 cover of each blog post – the thumbnail on /blog, the
// image at the top of the post and the share image – and writes it as
// public/images/blog/<key>/cover.<lang>.webp:
//
//   node scripts/blog-covers.mjs [key ...]
//
// A cover is a screenshot from the project on the right and a small diagram of
// the technique on the left, labelled per language. Add an entry to COVERS for
// a new post. Needs Google Chrome (or CHROME=/path/to/chrome) and network for
// the Google Fonts the template loads.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const LOGO = readFileSync('public/logos/logo.svg', 'utf8')

// Diagram coordinates are in a 740 × 400 box. Text is { de, en } or a plain
// string when it reads the same in both languages. A diagram has to match the
// post and moneykoi-docs (src/diagrams/): draw what the system does, leave out
// what doesn't fit, and never draw a path that doesn't exist.
//
// groups are dashed frames (what runs where). Boxes draw in order, so a box can
// sit inside another; `top` puts its text at the top instead of the middle, and
// `sub` is optional. notes are free labels, e.g. a second line under an arrow.
const COVERS = {
  'offline-first-flutter-supabase': {
    screen: 'new-expense-airplane-mode.webp',
    eyebrow: { de: 'MoneyKoi · Offline-First', en: 'MoneyKoi · Offline-first' },
    groups: [
      { x: 0, y: 0, w: 480, h: 372, label: { de: 'Handy', en: 'phone' } }
    ],
    boxes: [
      { x: 14, y: 64, w: 88, h: 84, title: 'UI', sub: 'Flutter' },
      { x: 180, y: 44, w: 170, h: 314, top: true, title: 'SQLite', sub: { de: 'Quelle der Wahrheit', en: 'source of truth' }, accent: true },
      { x: 196, y: 250, w: 138, h: 92, title: 'outbox', sub: 'queue_items' },
      { x: 382, y: 64, w: 84, h: 84, title: 'sync' },
      { x: 600, y: 44, w: 140, h: 314, title: 'Supabase', sub: 'Postgres' }
    ],
    arrows: [
      { d: 'M102 88 H172', accent: true, label: { de: 'schreibt', en: 'writes' }, lx: 141, ly: 78, anchor: 'middle' },
      { d: 'M180 124 H110', label: { de: 'liest', en: 'reads' }, lx: 141, ly: 144, anchor: 'middle' },
      { d: 'M265 126 V242', label: 'enqueue', lx: 277, ly: 192 },
      { d: 'M382 106 H358' },
      { d: 'M600 88 H474', label: 'sync_all', lx: 540, ly: 78, anchor: 'middle' },
      { d: 'M600 124 H474', dashed: true, label: 'realtime', lx: 540, ly: 146, anchor: 'middle' },
      { d: 'M334 296 H592', label: 'push', lx: 540, ly: 286, anchor: 'middle' }
    ],
    notes: [
      { x: 540, y: 166, text: { de: 'nur Türglocke', en: 'doorbell only' }, anchor: 'middle' }
    ]
  },
  'supabase-rls-multi-tenant': {
    screen: 'books.webp',
    eyebrow: 'MoneyKoi · Supabase RLS',
    groups: [
      { x: 120, y: 190, w: 620, h: 164, label: 'RLS' }
    ],
    boxes: [
      { x: 0, y: 10, w: 185, h: 100, title: 'request', sub: 'JWT + X-Tenant-Id: B' },
      { x: 235, y: 10, w: 240, h: 100, title: 'db_pre_request', sub: { de: 'läuft vor jedem Request', en: 'runs before every request' }, accent: true },
      { x: 540, y: 10, w: 200, h: 100, title: 'tenant_member', sub: { de: 'Mitgliedschaften', en: 'memberships' } },
      { x: 134, y: 240, w: 340, h: 100, title: 'SELECT', sub: { de: 'nur das aktive Buch (B)', en: 'active book only (B)' } },
      { x: 490, y: 240, w: 236, h: 100, title: 'INSERT · UPDATE', sub: { de: 'Mitglied im Buch der Zeile', en: 'member of the row\'s book' } }
    ],
    arrows: [
      { d: 'M185 60 H227', accent: true },
      { d: 'M475 60 H532', label: { de: 'prüft', en: 'checks' }, lx: 507, ly: 48, anchor: 'middle' },
      { d: 'M355 110 V232', accent: true, label: 'request.tenant_id = B', lx: 367, ly: 160 },
      { d: 'M640 110 V232' }
    ]
  },
  'rksv-qr-code-auslesen': {
    screen: 'scanner-item-lines.webp',
    eyebrow: { de: 'MoneyKoi · Beleg-Scanner', en: 'MoneyKoi · Receipt scanner' },
    boxes: [
      { x: 0, y: 10, w: 240, h: 90, title: 'RKSV QR', sub: { de: 'ohne OCR · sonst Live-OCR', en: 'no OCR · else live OCR' }, accent: true },
      { x: 0, y: 150, w: 190, h: 100, title: 'ML Kit', sub: { de: 'OCR am Gerät', en: 'on-device OCR' } },
      { x: 260, y: 150, w: 170, h: 100, title: { de: 'Parser', en: 'parser' }, sub: { de: 'pro Kette', en: 'one per chain' } },
      { x: 500, y: 150, w: 240, h: 100, title: { de: 'Abgleich', en: 'reconciler' }, sub: { de: 'Σ Positionen = Summe', en: 'Σ items = total' } },
      { x: 500, y: 290, w: 240, h: 90, title: { de: 'Prüfen', en: 'review' }, sub: { de: 'eine Buchung pro Zeile', en: 'one booking per line' } }
    ],
    arrows: [
      { d: 'M240 55 H620 V142', accent: true, label: { de: 'Summe · Datum', en: 'total · date' }, lx: 270, ly: 43 },
      { d: 'M160 100 V128 H345 V142', label: { de: 'ATU → Shop', en: 'ATU → shop' }, lx: 232, ly: 120 },
      { d: 'M190 200 H252', label: { de: 'Foto', en: 'photo' }, lx: 225, ly: 188, anchor: 'middle' },
      { d: 'M430 200 H492' },
      { d: 'M620 250 V282' }
    ]
  }
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function page(cover, key, lang) {
  const t = v => esc(typeof v === 'string' ? v : v[lang])
  const groups = (cover.groups ?? []).map(g => `
    <rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="16" class="group"/>
    <text x="${g.x + 18}" y="${g.y + 28}" class="g">${t(g.label)}</text>`).join('')
  const boxes = cover.boxes.map((b) => {
    const titleY = b.top ? b.y + 36 : b.sub ? b.y + b.h / 2 - 4 : b.y + b.h / 2 + 8
    const subY = b.top ? b.y + 62 : b.y + b.h / 2 + 22
    return `
    <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" class="${b.accent ? 'box acc' : 'box'}"/>
    <text x="${b.x + 20}" y="${titleY}" class="t">${t(b.title)}</text>${b.sub
      ? `
    <text x="${b.x + 20}" y="${subY}" class="s">${t(b.sub)}</text>`
      : ''}`
  }).join('')
  const arrows = cover.arrows.map(a => `
    <path d="${a.d}" class="${a.accent ? 'a acc' : 'a'}"${a.dashed ? ' stroke-dasharray="5 6"' : ''} marker-end="url(#${a.accent ? 'hA' : 'h'})"/>${a.label
      ? `<text x="${a.lx}" y="${a.ly}" class="l" text-anchor="${a.anchor ?? 'start'}">${t(a.label)}</text>`
      : ''}`).join('')
  const notes = (cover.notes ?? []).map(n => `
    <text x="${n.x}" y="${n.y}" class="l" text-anchor="${n.anchor ?? 'start'}">${t(n.text)}</text>`).join('')
  const screen = resolve(`public/images/blog/${key}/${cover.screen}`)

  return `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400&display=block">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; font-family: Manrope, sans-serif;
    background:
      radial-gradient(circle at 80% 55%, rgba(242, 128, 58, 0.30), transparent 38%),
      radial-gradient(circle at 10% 0%, rgba(125, 211, 252, 0.06), transparent 40%),
      #0B1220;
  }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(232, 236, 244, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232, 236, 244, 0.035) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(90deg, #000 0%, #000 55%, transparent 80%);
  }
  .eyebrow {
    position: absolute; left: 72px; top: 68px; color: #F59E5B;
    font: 500 15px 'JetBrains Mono', monospace; letter-spacing: 0.16em; text-transform: uppercase;
  }
  svg.d { position: absolute; left: 72px; top: 116px; overflow: visible; }
  .group { fill: none; stroke: rgba(232, 236, 244, 0.20); stroke-width: 1.2; stroke-dasharray: 4 6; }
  .g { font: 500 13px 'JetBrains Mono', monospace; letter-spacing: 0.14em; text-transform: uppercase; fill: #7F8BA3; }
  .box { fill: #101A2E; stroke: rgba(232, 236, 244, 0.22); stroke-width: 1.5; }
  .box.acc { fill: rgba(245, 158, 91, 0.08); stroke: #F59E5B; }
  .t { font: 500 22px 'JetBrains Mono', monospace; fill: #E8ECF4; }
  .s { font: 400 15px Manrope, sans-serif; fill: #9AA6BC; }
  .l { font: 400 14px 'JetBrains Mono', monospace; fill: #9AA6BC; }
  .a { fill: none; stroke: rgba(232, 236, 244, 0.40); stroke-width: 1.6; }
  .a.acc { stroke: #F59E5B; }
  .brand {
    position: absolute; left: 72px; bottom: 56px; display: flex; align-items: center; gap: 14px;
    font: 400 24px Fraunces, serif; font-variation-settings: 'opsz' 144; letter-spacing: -0.01em; color: #E8ECF4;
  }
  .brand svg { width: 40px; height: 40px; }
  .phone {
    position: absolute; right: 96px; top: 30px; width: 256px;
    border-radius: 30px; border: 1px solid rgba(232, 236, 244, 0.22);
    box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55), 0 0 0 8px rgba(7, 12, 23, 0.55);
  }
</style></head>
<body>
  <div class="grid"></div>
  <div class="eyebrow">${t(cover.eyebrow)}</div>
  <svg class="d" width="740" height="400" viewBox="0 0 740 400">
    <defs>
      <marker id="h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="rgba(232, 236, 244, 0.55)"/>
      </marker>
      <marker id="hA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="#F59E5B"/>
      </marker>
    </defs>${groups}${boxes}${arrows}${notes}
  </svg>
  <img class="phone" src="file://${screen}" alt="">
  <div class="brand">${LOGO}<span>Gerald Gmainer</span></div>
</body></html>`
}

const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(COVERS)
const tmp = mkdtempSync(join(tmpdir(), 'blog-covers-'))

for (const key of keys) {
  const cover = COVERS[key]
  if (!cover) throw new Error(`No cover defined for "${key}"`)

  for (const lang of ['de', 'en']) {
    const html = join(tmp, `${key}.${lang}.html`)
    const png = join(tmp, `${key}.${lang}.png`)
    writeFileSync(html, page(cover, key, lang))
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      '--allow-file-access-from-files', '--virtual-time-budget=8000', '--window-size=1200,630',
      `--screenshot=${png}`, `file://${html}`
    ], { stdio: 'ignore' })

    const out = `public/images/blog/${key}/cover.${lang}.webp`
    await sharp(png).webp({ quality: 86, effort: 5 }).toFile(out)
    console.log(`wrote  ${out}`)
  }
}
