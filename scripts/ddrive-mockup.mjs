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

// The steps of the driver's day, as the live app names them.
const steps = [['運転前', 'ALC'], ['運転前', '車両点検'], ['運転', ''], ['運転後', '車両点検'], ['運転後', 'ALC']]
const stepper = steps.map(([a, b], i) => `
  <li class="${i === 0 ? 'on' : ''}"><i>${i === 0 ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>' : ''}</i><span>${a}<br>${b}</span></li>`).join('')

// Painted over the frame's app area. The status bar stays, with the clock moved
// to the time of the test.
const readingScreen = `
  <div class="status" style="background-image:url(${testerTabPhone})"></div>
  <div class="clock">16:45</div>
  <div class="screen">
    <div class="bar">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>
      <span>運転前 アルコールチェック</span>
    </div>
    <ol class="steps">${stepper}</ol>
    <div class="device">
      <img src="${testerUrl}" alt="">
      <div class="device-name">
        <b>ALCOFIND</b>
        <span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>接続済み</span>
      </div>
      <dl><div><dt>測定回数</dt><dd>1/500回</dd></div><div><dt>残り</dt><dd>315日</dd></div></dl>
    </div>
    <div class="reading">
      <svg class="ring" viewBox="0 0 260 260" width="288" height="288"><circle cx="130" cy="130" r="116" fill="none" stroke="#3DD68C" stroke-width="11"/></svg>
      <div class="value"><b>0.00</b><span>mg/L</span></div>
    </div>
    <p class="verdict"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>アルコール検知なし</p>
    <p class="date">2022年9月7日 16:45</p>
    <div class="info">
      <div class="photo"><svg viewBox="0 0 100 100" width="50" height="50"><circle cx="50" cy="31" r="20"/><path d="M13 92c0-23 16-37 37-37s37 14 37 37z"/></svg></div>
      <dl>
        <div><dt>計測タイミング</dt><dd>運転開始</dd></div>
        <div><dt>車両ナンバー</dt><dd>品川500ゆ0002</dd></div>
      </dl>
    </div>
    <div class="unlock">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 7.6-1.7"/></svg>
      アップロード後にエンジンロックを解除できます
    </div>
    <div class="buttons"><span class="btn back">戻る</span><span class="btn upload">アップロード</span></div>
  </div>`

const phoneStyles = `
  .phone { position: absolute; left: 0; top: 0; width: ${PHONE_W}px; height: ${PHONE_H}px; transform-origin: 0 0; filter: drop-shadow(0 34px 44px rgb(0 0 0 / .5)); }
  .phone > img { position: absolute; inset: 0; width: 100%; height: 100%; }
  .status { position: absolute; left: 107px; top: 40px; width: 100px; height: 32px; background-position: -96px -40px; background-size: ${PHONE_W}px ${PHONE_H}px; box-shadow: -60px 0 0 #424242; }
  .clock { position: absolute; left: 58px; top: 44px; font: 400 17.5px/24px Roboto, sans-serif; color: #e4e4e4; letter-spacing: .1px; }
  .screen { position: absolute; left: 26px; top: 90px; width: 517px; height: 988px; background: #303030; color: #fff; font-family: 'Noto Sans JP', Roboto, sans-serif; }
  .screen p, .screen dl, .screen dd, .screen ol { margin: 0; padding: 0; }
  .bar { position: relative; height: 70px; display: flex; align-items: center; gap: 12px; padding: 0 20px 0 18px; background: #424242; box-shadow: 0 2px 6px rgb(0 0 0 / .35); font-size: 21px; font-weight: 500; }
  .steps { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); padding: 20px 12px 0 !important; list-style: none; }
  .steps::before { content: ''; position: absolute; left: 62px; right: 62px; top: 33px; height: 2px; background: #5a5a5a; }
  .steps li { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 13.5px; line-height: 17px; text-align: center; color: #9a9a9a; }
  .steps i { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: #5a5a5a; box-shadow: 0 0 0 5px #303030; }
  .steps .on { color: #fff; font-weight: 500; }
  .steps .on i { background: #2EA9BF; }
  .device { margin: 18px 20px 0; height: 74px; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 12px; border-radius: 12px; background: #3b3b3b; }
  .device img { height: 54px; width: auto; }
  .device-name { display: flex; flex-direction: column; gap: 3px; }
  .device-name b { font: 500 18px/1.1 Roboto, sans-serif; letter-spacing: .4px; }
  .device-name span { display: flex; align-items: center; gap: 3px; font-size: 14px; line-height: 1.1; color: #5FC9DB; }
  .device dl { margin-left: auto !important; display: flex; gap: 18px; text-align: right; }
  .device dt { font-size: 12.5px; line-height: 18px; color: #a8a8a8; }
  .device dd { font-size: 16px; line-height: 22px; font-weight: 500; }
  .reading { position: relative; width: 288px; height: 288px; margin: 32px auto 0; }
  .ring { display: block; filter: drop-shadow(0 0 16px rgb(61 214 140 / .35)); }
  .value { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: Roboto, sans-serif; }
  .value b { font-size: 94px; line-height: 1; font-weight: 500; letter-spacing: -1px; }
  .value span { margin-top: 4px; font-size: 24px; line-height: 1.2; color: #c4c4c4; }
  .verdict { margin-top: 20px !important; display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 21px; line-height: 28px; font-weight: 500; color: #3DD68C; }
  .date { margin-top: 2px !important; font-size: 15px; line-height: 22px; text-align: center; color: #a8a8a8; }
  .info { margin: 26px 20px 0; display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; background: #3b3b3b; }
  .photo { flex: none; width: 66px; height: 78px; display: grid; place-items: end center; overflow: hidden; border-radius: 8px; background: #6E9FC9; }
  .photo svg { fill: #24384C; }
  .info dl { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .info dl > div { display: flex; justify-content: space-between; align-items: baseline; }
  .info dt { font-size: 15px; line-height: 22px; color: #b4b4b4; }
  .info dd { font-size: 17px; line-height: 22px; font-weight: 500; }
  .unlock { margin: 14px 20px 0; height: 50px; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 12px; background: rgb(61 214 140 / .14); color: #6BE3A9; font-size: 17px; font-weight: 500; }
  .buttons { margin: 18px 20px 0; display: flex; gap: 12px; }
  .btn { height: 56px; display: grid; place-items: center; border-radius: 12px; font-size: 19px; font-weight: 500; }
  .back { width: 104px; background: #4c4c4c; color: #fff; }
  .upload { flex: 1; background: #2EA9BF; color: #fff; box-shadow: 0 4px 14px rgb(46 169 191 / .35); }`

const bluetooth = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>`

// A dashed link with the Bluetooth mark, drawn between two x positions.
const link = (x0, x1, y) => `
  <div class="link" style="left:${x0}px;top:${y}px;width:${x1 - x0}px"></div>
  <div class="chip" style="left:${(x0 + x1) / 2 - 36}px;top:${y - 36}px">${bluetooth}</div>`

const place = (x, y, scale, content) => `<div class="phone" style="transform:translate(${x}px,${y}px) scale(${scale})">${content}</div>`

const shell = (width, height, background, body) => `<!doctype html><meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&family=Roboto:wght@400;500&display=block" rel="stylesheet">
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
