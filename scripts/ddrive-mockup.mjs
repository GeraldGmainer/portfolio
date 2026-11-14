// Builds the D-Drive images: the alcohol tester, the reading on the phone and
// the recorded trip.
//
//   node scripts/ddrive-mockup.mjs
//
// Writes to public/images:
//   ddrive-composition.webp    1800×1274, transparent – hero mockup on the glow
//   ddrive-alcohol-check.webp  1600×1200, opaque – detail shot, card, share image
//   screens/ddrive-alcohol.jpg 1026×2296, opaque – the bare screen for the carousel
//
// The tester comes from the "ddrive" layer of screenshots.psd (gitignored). It
// sits mirrored in that layer, so it is flipped here to make the logo readable.
// The alcohol check screen is a design, not a capture: HTML placed in the frame
// of ddrive.webp, using the labels of the live app (ddrive.ubiteq.co.jp) and the
// demo values of the old screenshot in that layer.
// Needs Google Chrome (or CHROME=/path/to/chrome), ImageMagick, and network for
// the Google Fonts.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PHONE = 'public/images/ddrive.webp'
const PHONE_W = 569
const PHONE_H = 1200
const GLOW = '#22A7E8'
const tmp = mkdtempSync(join(tmpdir(), 'ddrive-'))

const dataUrl = (buffer, type = 'png') => `data:image/${type};base64,${buffer.toString('base64')}`

// The tester, cut out of the PSD layer and flipped.
execFileSync('magick', [
  'screenshots.psd[9]', '-crop', '310x420+470+285', '+repage', '-flop', join(tmp, 'tester.png')
], { stdio: ['ignore', 'ignore', 'ignore'] })
const tester = await sharp(join(tmp, 'tester.png')).trim({ threshold: 0 }).toBuffer({ resolveWithObject: true })
const TESTER_RATIO = tester.info.height / tester.info.width
const testerUrl = dataUrl(await sharp(tester.data).resize({ width: 960, kernel: 'lanczos3' }).sharpen({ sigma: 1.2 }).png().toBuffer())

// Move the active tab in the bottom bar from the trip list to the tester icon.
async function phoneOnTesterTab() {
  const { data, info } = await sharp(PHONE).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const bg = [48, 48, 48]
  const teal = [46, 169, 191]
  const grey = [143, 143, 143]
  const recolor = (x0, x1, peakOfIcon, target) => {
    for (let y = 1085; y < 1140; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * info.width + x) * 4
        const peak = Math.max(data[i], data[i + 1], data[i + 2])
        const t = Math.min(1, Math.max(0, (peak - bg[0]) / (peakOfIcon - bg[0])))
        for (let c = 0; c < 3; c++) data[i + c] = Math.round(bg[c] + t * (target[c] - bg[c]))
      }
    }
  }
  recolor(160, 205, Math.max(...grey), teal)
  recolor(262, 308, Math.max(...teal), grey)
  return dataUrl(await sharp(data, { raw: info }).png().toBuffer())
}

const tripPhone = dataUrl(await sharp(PHONE).png().toBuffer())
const testerTabPhone = await phoneOnTesterTab()

// Painted over the frame's app area. The status bar stays, with the clock moved
// to the time of the test. The content is what the original screen showed and
// nothing more: tests used and days left on the sensor, the reading, the photo
// taken during the test, timing and vehicle, back and upload.
const readingScreen = `
  <div class="status" style="background-image:url(${testerTabPhone})"></div>
  <div class="clock">16:45</div>
  <div class="screen">
    <div class="bar">
      <svg viewBox="0 0 28 24" width="30" height="26" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="2" y="6" width="21" height="12" rx="3"/><path d="M26 10v4" stroke-linecap="round"/><rect x="5.5" y="9.5" width="10" height="5" rx="1" fill="#fff" stroke="none"/></svg>
      <span>1/500回</span>
      <span>残: 315日</span>
    </div>
    <div class="main">
      <div class="reading">
        <svg class="gauge" viewBox="0 0 300 300" width="300" height="300">
          <defs>
            <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5BE3A0"/><stop offset="1" stop-color="#2EA9BF"/></linearGradient>
            <radialGradient id="wash"><stop offset=".55" stop-color="#3DD68C" stop-opacity="0"/><stop offset="1" stop-color="#3DD68C" stop-opacity=".13"/></radialGradient>
          </defs>
          <circle cx="150" cy="150" r="141" fill="url(#wash)"/>
          <circle cx="150" cy="150" r="124" fill="none" stroke="#565656" stroke-width="7" stroke-dasharray="1.6 ${(2 * Math.PI * 124 / 72 - 1.6).toFixed(3)}" transform="rotate(-90.4 150 150)"/>
          <circle class="arc" cx="150" cy="150" r="144" fill="none" stroke="url(#arc)" stroke-width="7"/>
          <circle cx="150" cy="294" r="21" fill="#3DD68C" stroke="#303030" stroke-width="7"/>
          <path d="m141.5 294.5 6 6 11.5-12" fill="none" stroke="#14321F" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="value"><b>0.00</b><span>mg/L</span></div>
      </div>
      <p class="date">2022年9月7日 16:45</p>
      <div class="photo"><svg viewBox="0 0 100 100" width="92" height="92"><circle cx="50" cy="31" r="20"/><path d="M13 92c0-23 16-37 37-37s37 14 37 37z"/></svg></div>
      <dl class="info">
        <div><dt>計測タイミング</dt><dd>運転開始</dd></div>
        <div><dt>車両ナンバー</dt><dd>品川500ゆ0002</dd></div>
      </dl>
    </div>
    <div class="buttons"><span class="btn back">戻る</span><span class="btn upload">アップロード</span></div>
  </div>`

const phoneStyles = `
  .phone { position: absolute; left: 0; top: 0; width: ${PHONE_W}px; height: ${PHONE_H}px; transform-origin: 0 0; filter: drop-shadow(0 34px 44px rgb(0 0 0 / .5)); }
  .phone > img { position: absolute; inset: 0; width: 100%; height: 100%; }
  .status { position: absolute; left: 107px; top: 40px; width: 100px; height: 32px; background-position: -96px -40px; background-size: ${PHONE_W}px ${PHONE_H}px; box-shadow: -60px 0 0 #424242; }
  .clock { position: absolute; left: 58px; top: 44px; font: 400 17.5px/24px Roboto, sans-serif; color: #e4e4e4; letter-spacing: .1px; }
  .screen { position: absolute; left: 26px; top: 90px; width: 517px; height: 988px; display: flex; flex-direction: column; background: #303030; color: #fff; font-family: 'Noto Sans JP', Roboto, sans-serif; }
  .screen p, .screen dl, .screen dd { margin: 0; padding: 0; }
  .bar { flex: none; height: 70px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 24px; background: #424242; font-size: 19px; font-weight: 500; }
  .bar span:last-child { justify-self: end; }
  .main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 8px; }
  .reading { position: relative; flex: none; width: 300px; height: 300px; }
  .gauge { display: block; overflow: visible; }
  .gauge .arc { filter: drop-shadow(0 0 9px rgb(61 214 140 / .45)); }
  .value { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 6px; font-family: Roboto, sans-serif; }
  .value b { font-size: 100px; line-height: 1; font-weight: 300; letter-spacing: -2px; }
  .value span { margin-top: 8px; font-size: 21px; line-height: 1.2; letter-spacing: .5px; color: #a8a8a8; }
  .date { margin-top: 38px !important; font-size: 16px; line-height: 22px; text-align: center; color: #a8a8a8; }
  .photo { flex: none; margin-top: 44px; width: 116px; height: 140px; display: grid; place-items: end center; overflow: hidden; border-radius: 10px; background: #7FB2DC; }
  .photo svg { fill: #1F2B36; }
  .info { margin-top: 26px !important; display: flex; text-align: center; }
  .info > div { padding: 0 28px; }
  .info > div + div { border-left: 1px solid #505050; }
  .info dt { font-size: 14px; line-height: 20px; color: #a8a8a8; }
  .info dd { margin-top: 2px !important; font-size: 19px; line-height: 26px; font-weight: 500; }
  .buttons { flex: none; margin: 0 32px 36px; display: flex; gap: 14px; }
  .btn { height: 58px; display: grid; place-items: center; border-radius: 10px; font-size: 19px; font-weight: 500; }
  .back { width: 112px; border: 1.5px solid #5e5e5e; color: #e4e4e4; }
  .upload { flex: 1; background: #2EA9BF; color: #fff; }`

const bluetooth = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>`

// A dashed link with the Bluetooth mark, drawn between two x positions.
const link = (x0, x1, y) => `
  <div class="link" style="left:${x0}px;top:${y}px;width:${x1 - x0}px"></div>
  <div class="chip" style="left:${(x0 + x1) / 2 - 36}px;top:${y - 36}px">${bluetooth}</div>`

const place = (x, y, scale, content) => `<div class="phone" style="transform:translate(${x}px,${y}px) scale(${scale})">${content}</div>`

const shell = (width, height, background, body) => `<!doctype html><meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&family=Roboto:wght@300;400;500&display=block" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: ${background}; }
    ${phoneStyles}
    .tester { position: absolute; filter: drop-shadow(0 30px 40px rgb(0 0 0 / .55)); }
    .link { position: absolute; height: 0; border-top: 3px dashed color-mix(in oklab, ${GLOW} 75%, white); }
    .chip { position: absolute; width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; background: ${GLOW}; box-shadow: 0 0 0 10px color-mix(in oklab, ${GLOW} 22%, transparent), 0 14px 28px rgb(0 0 0 / .4); }
  </style>
  ${body}`

const testerAt = (x, y, width) => `<img class="tester" src="${testerUrl}" style="left:${x}px;top:${y}px;width:${width}px;height:${Math.round(width * TESTER_RATIO)}px">`
const reading = `<img src="${testerTabPhone}">${readingScreen}`
const trip = `<img src="${tripPhone}">`

function screenshot(name, width, height, html, { transparent = false, scale = 1 } = {}) {
  const file = join(tmp, `${name}.html`)
  const shot = join(tmp, `${name}.png`)
  writeFileSync(file, html)
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', `--force-device-scale-factor=${scale}`,
    `--window-size=${width},${height}`, '--virtual-time-budget=8000',
    ...(transparent ? ['--default-background-color=00000000'] : []),
    `--screenshot=${shot}`, `file://${resolve(file)}`
  ], { stdio: 'ignore' })
  return readFileSync(shot)
}

async function render(name, width, height, html, options) {
  const buffer = await sharp(screenshot(name, width, height, html, options))
    .resize(width, height, { fit: 'cover', position: 'top' })
    .webp({ quality: 88, alphaQuality: 95, effort: 5 })
    .toBuffer()
  writeFileSync(`public/images/${name}.webp`, buffer)
  console.log(`${name}.webp  ${Math.round(buffer.length / 1024)} KB`)
}

// Hero: test → reading → trip, left to right. The trip sits behind the reading.
await render('ddrive-composition', 1800, 1274, shell(1800, 1274, 'transparent', `
  ${place(1190, 146, 0.86, trip)}
  ${link(508, 680, 640)}
  ${testerAt(110, 340, 410)}
  ${place(660, 37, 1, reading)}
`), { transparent: true })

// Detail: the tester and the reading, larger, with the phone running off the bottom.
await render('ddrive-alcohol-check', 1600, 1200, shell(1600, 1200,
  `radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, ${GLOW} 26%, #0B1220), #0B1220)`, `
  ${link(606, 830, 590)}
  ${testerAt(150, 255, 470)}
  ${place(800, 76, 1.05, reading)}
`), { transparent: false })

// The bare screen for the phone carousel on the home page: the same crop of the
// frame as screens/ddrive.jpg, at twice the size so the small labels stay sharp.
const SCREEN = { left: 28, top: 26, width: 513, height: 1148 }
const carousel = await sharp(screenshot('ddrive-screen', PHONE_W, PHONE_H, shell(PHONE_W, PHONE_H, '#000', place(0, 0, 1, reading)), { scale: 2 }))
  .extract({ left: SCREEN.left * 2, top: SCREEN.top * 2, width: SCREEN.width * 2, height: SCREEN.height * 2 })
  .flatten({ background: '#000' })
  .jpeg({ quality: 86, mozjpeg: true })
  .toBuffer()
writeFileSync('public/images/screens/ddrive-alcohol.jpg', carousel)
console.log(`screens/ddrive-alcohol.jpg  ${Math.round(carousel.length / 1024)} KB`)
