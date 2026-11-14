// Builds the images of the Objectbay client projects. The site may not name
// those clients or show their real products, so these are designs, not
// captures: HTML with demo data and no client branding, shot in headless Chrome.
//
//   node scripts/client-screens.mjs [claims|finance|coaster|security|crm|time ...]
//
// Writes to public/images:
//   claims.webp, finance.webp, coaster.webp, security.webp, crm.webp,
//   time-tracking.webp     1600×1200, opaque – card, lightbox, share image
//   coaster-mockup.webp    1800×1274, transparent – hero mockup on the glow
//   screens/rodelbahn.jpg  1026×2296, opaque – the bare app screen for the desk carousel
//
// The sled in the coaster app is a three.js model, rendered in headless Chrome
// (SwiftShader WebGL) with three served from node_modules.
//
// Needs Google Chrome (or CHROME=/path/to/chrome) and network for the Google Fonts.
import { execFile, execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'
import * as THREE from 'three'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = process.env.OUT ?? 'public/images'
const tmp = mkdtempSync(join(tmpdir(), 'client-screens-'))
const require = createRequire(import.meta.url)
const lucide = require('@iconify-json/lucide/icons.json')

const THREE_DIR = dirname(dirname(require.resolve('three')))

function icon(name, size = 16, style = '') {
  const id = lucide.icons[name] ? name : lucide.aliases?.[name]?.parent
  if (!id) throw new Error(`Unknown lucide icon: ${name}`)
  return `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" style="${style}">${lucide.icons[id].body}</svg>`
}

const pad2 = n => String(n).padStart(2, '0')

// Smooth line through evenly spaced values, scaled into w×h.
function curve(values, w, h, pad = 6) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => [i / (values.length - 1) * w, pad + (1 - (v - min) / (max - min)) * (h - 2 * pad)])
  const f = n => Math.round(n * 10) / 10
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`
  }
  return { d, area: `${d} L${w},${h} L0,${h} Z`, end: pts.at(-1) }
}

const wave = (n, seed, trend, amp = 1) =>
  Array.from({ length: n }, (_, i) => trend * i + amp * (Math.sin(i * 1.7 + seed) * 2 + Math.sin(i * 0.55 + seed * 2) * 3))

const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=block" rel="stylesheet">'

const BASE = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{overflow:hidden}
body{position:relative;font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;font-feature-settings:'cv11'}
a{color:inherit;text-decoration:none}
b{font-weight:600}
.i{flex:none;display:block}
.mono{font-family:'JetBrains Mono',ui-monospace,monospace}
.tnum{font-variant-numeric:tabular-nums}
.row{display:flex;align-items:center}
.grow{flex:1;min-width:0}
.win{position:absolute;overflow:hidden;border-radius:18px;box-shadow:0 70px 120px -40px rgba(0,0,0,.7),0 30px 60px -30px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08)}
.float{position:absolute;border-radius:18px;box-shadow:0 50px 90px -30px rgba(0,0,0,.7),0 20px 40px -20px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08)}
.phone{position:absolute;padding:11px;border-radius:57px;background:linear-gradient(150deg,#424956,#12151B 28%,#0B0D11 72%,#2C313A);box-shadow:0 70px 110px -35px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.12);transform-origin:0 0}
.phone>.screen{position:relative;width:390px;height:873px;border-radius:46px;overflow:hidden}
.island{position:absolute;z-index:9;top:11px;left:50%;width:120px;height:34px;margin-left:-60px;border-radius:20px;background:#000}
.sbar{height:54px;display:flex;align-items:center;justify-content:space-between;padding:6px 28px 0 42px;font-size:16px;font-weight:600}
.sbar .row{gap:6px}
.homebar{position:absolute;bottom:9px;left:50%;width:134px;height:5px;margin-left:-67px;border-radius:3px}
.logo{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;flex:none}
.av{border-radius:50%;display:grid;place-items:center;font-weight:700;flex:none}
`

function doc(w, h, background, body, css = '') {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">${FONTS}<style>${BASE}
html,body{width:${w}px;height:${h}px}html{background:${background}}${css}</style></head><body>${body}</body></html>`
}

// The scene is laid out at its own size and scaled to fit the canvas.
function stage(scene, w, h, { transparent = false, margin = 0.065 } = {}) {
  const s = Math.min(w * (1 - 2 * margin) / scene.w, h * (1 - 2 * margin) / scene.h)
  const bg = transparent
    ? 'transparent'
    : `radial-gradient(closest-side, color-mix(in oklab, ${scene.glow} 30%, transparent), transparent) 50% 52% / 92% 96% no-repeat, radial-gradient(130% 100% at 50% 30%, #13203A, #0B1220 55%, #070C17)`
  const body = `<div style="position:absolute;left:${(w - scene.w * s) / 2}px;top:${(h - scene.h * s) / 2}px;width:${scene.w}px;height:${scene.h}px;transform:scale(${s});transform-origin:0 0">${scene.html}</div>`
  return doc(w, h, bg, body, scene.css)
}

const statusBar = color => `<div class="sbar" style="color:${color}"><span>9:41</span><span class="row">${icon('signal', 17)}${icon('wifi', 17)}${icon('battery-full', 23)}</span></div>`
const phone = (x, y, scale, bg, content, bar = 'rgba(0,0,0,.85)') =>
  `<div class="phone" style="left:${x}px;top:${y}px;transform:scale(${scale})"><div class="screen" style="background:${bg}"><div class="island"></div>${content}<div class="homebar" style="background:${bar}"></div></div></div>`

// ---------------------------------------------------------------------------
// Alpine coaster: the admin web – a current dashboard layout in the amber
// theme, with the sled list of one track – next to the diagnostics app.

const YELLOW = '#FAAD14'

// The sled in the app is a 3D product shot: a small three.js scene rendered
// in headless Chrome to a transparent PNG. The labels point at parts of the
// model, projected with the same camera (see SLED_PARTS).
const SLED = { w: 1074, h: 750, lift: 0.06, cam: { fov: 22.5, pos: [3.09, 2.51, 4.69], target: [-0.03, 0.55, 0] } }

const SLED_SCENE = `
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const C = window.SLED
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(C.w, C.h)
renderer.setClearColor(0x000000, 0)
renderer.toneMapping = THREE.NeutralToneMapping
renderer.toneMappingExposure = 0.9
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.95

const camera = new THREE.PerspectiveCamera(C.cam.fov, C.w / C.h, 0.1, 50)
camera.position.fromArray(C.cam.pos)
camera.lookAt(new THREE.Vector3().fromArray(C.cam.target))

const key = new THREE.DirectionalLight(0xffffff, 2.2)
key.position.set(1.2, 6, 3.2)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 16 })
key.shadow.radius = 8
key.shadow.blurSamples = 20
key.shadow.bias = -0.0004
scene.add(key)

const M = {
  paint: new THREE.MeshPhysicalMaterial({ color: 0x1765e6, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.75 }),
  inside: new THREE.MeshStandardMaterial({ color: 0x1250bd, roughness: 0.6 }),
  black: new THREE.MeshPhysicalMaterial({ color: 0x1b1d21, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
  pad: new THREE.MeshStandardMaterial({ color: 0x24262b, roughness: 0.92 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xf4f6f9, metalness: 1, roughness: 0.1 }),
  steel: new THREE.MeshStandardMaterial({ color: 0xb4bcc5, metalness: 0.75, roughness: 0.38 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2c3036, metalness: 0.5, roughness: 0.45 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x17191c, roughness: 0.75 }),
  led: new THREE.MeshStandardMaterial({ color: 0xfff6d6, emissive: 0xffeaa6, emissiveIntensity: 2.2 }),
  red: new THREE.MeshStandardMaterial({ color: 0xff3030, emissive: 0xff1f1f, emissiveIntensity: 1.6 }),
  green: new THREE.MeshStandardMaterial({ color: 0x73d13d, emissive: 0x52c41a, emissiveIntensity: 1.6 })
}

function mesh(geo, mat, p = [0, 0, 0], r = [0, 0, 0], parent = scene) {
  const o = new THREE.Mesh(geo, mat)
  o.position.fromArray(p)
  o.rotation.set(r[0], r[1], r[2])
  o.castShadow = true
  o.receiveShadow = true
  parent.add(o)
  return o
}
const box = (w, h, d, r = 0.03) => new RoundedBoxGeometry(w, h, d, 5, r)

// The body sits on the chassis, C.lift above the rail.
const body = new THREE.Group()
body.position.y = C.lift
scene.add(body)

// Narrows a part towards the nose, like the bow of a boat.
function taper(geo) {
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i++) {
    const t = Math.min(1, Math.max(0, (p.getX(i) - 0.3) / 0.9))
    p.setZ(i, p.getZ(i) * (1 - 0.3 * t * t * (3 - 2 * t)))
  }
  return geo
}

// Side view of the shell: high at the rear seat, a dip for the legs,
// a shoulder at the footwell and a bow that sweeps up to the nose.
function side() {
  const s = new THREE.Shape()
  s.moveTo(-1, 0.2)
  s.quadraticCurveTo(-1, 0.13, -0.92, 0.13)
  s.lineTo(0.55, 0.13)
  s.bezierCurveTo(0.85, 0.13, 1.05, 0.2, 1.16, 0.3)
  s.quadraticCurveTo(1.2, 0.34, 1.15, 0.36)
  s.bezierCurveTo(1, 0.42, 0.85, 0.47, 0.68, 0.47)
  s.bezierCurveTo(0.45, 0.47, 0.3, 0.38, 0.05, 0.38)
  s.bezierCurveTo(-0.25, 0.38, -0.4, 0.5, -0.7, 0.5)
  s.lineTo(-0.94, 0.5)
  s.quadraticCurveTo(-1, 0.5, -1, 0.44)
  s.lineTo(-1, 0.2)
  return s
}
const wall = new THREE.ExtrudeGeometry(side(), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 5, curveSegments: 32 })
for (const z of [0.265, -0.295]) mesh(taper(wall.clone().translate(0, 0, z)), M.paint, [0, 0, 0], [0, 0, 0], body)

// The closed bow in front of the footwell, the floor and the rear wall.
const bow = new THREE.Shape()
bow.moveTo(0.52, 0.13)
bow.lineTo(0.55, 0.13)
bow.bezierCurveTo(0.85, 0.13, 1.05, 0.2, 1.16, 0.3)
bow.quadraticCurveTo(1.2, 0.34, 1.15, 0.36)
bow.bezierCurveTo(1, 0.42, 0.85, 0.47, 0.68, 0.47)
bow.quadraticCurveTo(0.6, 0.47, 0.58, 0.4)
bow.lineTo(0.52, 0.13)
mesh(taper(new THREE.ExtrudeGeometry(bow, { depth: 0.54, bevelEnabled: false, curveSegments: 32 }).translate(0, 0, -0.27)), M.paint, [0, 0, 0], [0, 0, 0], body)
mesh(box(1.56, 0.04, 0.54, 0.012), M.inside, [-0.22, 0.15, 0], [0, 0, 0], body)
mesh(box(0.06, 0.37, 0.56, 0.02), M.paint, [-0.97, 0.315, 0], [0, 0, 0], body)

// Start number on the side.
const cv = document.createElement('canvas')
cv.width = 512
cv.height = 256
const g = cv.getContext('2d')
g.fillStyle = '#ffffff'
g.font = 'italic 800 210px -apple-system, Helvetica, Arial, sans-serif'
g.textAlign = 'center'
g.fillText('07', 256, 205)
const tex = new THREE.CanvasTexture(cv)
tex.colorSpace = THREE.SRGBColorSpace
tex.anisotropy = 8
mesh(new THREE.PlaneGeometry(0.3, 0.15), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.5 }), [0.12, 0.255, 0.321], [0, 0, 0], body).castShadow = false

// Rear seat with its tall backrest and headrest, the lower front seat,
// seat belt and buckle.
mesh(box(0.44, 0.08, 0.46, 0.035), M.pad, [-0.62, 0.2, 0], [0, 0, 0], body)
const back = mesh(box(0.1, 0.66, 0.44, 0.045), M.black, [-0.93, 0.62, 0], [0, 0, 0.2], body)
mesh(box(0.03, 0.5, 0.34, 0.012), M.pad, [0.055, -0.03, 0], [0, 0, 0], back)
mesh(box(0.11, 0.2, 0.28, 0.05), M.pad, [0.02, 0.4, 0], [0, 0, 0], back)
mesh(box(0.36, 0.07, 0.42, 0.03), M.pad, [0.14, 0.195, 0], [0, 0, 0], body)
mesh(box(0.07, 0.34, 0.4, 0.03), M.black, [-0.12, 0.4, 0], [0, 0, 0.18], body)
mesh(box(0.4, 0.008, 0.045, 0.003), M.rubber, [-0.67, 0.4, 0.135], [0, 0, -0.71], body)
mesh(box(0.07, 0.022, 0.055, 0.008), M.chrome, [-0.5, 0.262, 0.13], [0, 0, 0], body)

// Bumpers: buffer and lights at the nose, tail light at the rear.
const nose = mesh(box(0.12, 0.17, 0.3, 0.04), M.black, [1.2, 0.31, 0], [0, 0, -0.35], body)
mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 32), M.rubber, [0.08, -0.01, 0], [0, 0, Math.PI / 2], nose)
for (const z of [-0.1, 0.1]) mesh(box(0.012, 0.035, 0.06, 0.005), M.led, [0.062, 0.03, z], [0, 0, 0], nose)
const tail = mesh(box(0.1, 0.26, 0.5, 0.04), M.black, [-1.04, 0.3, 0], [0, 0, 0], body)
mesh(box(0.012, 0.035, 0.3, 0.005), M.red, [-0.052, 0.04, 0], [0, 0, 0], tail)

// Brake levers on both sides, and the grab handle on the bow.
for (const z of [-0.235, 0.235]) {
  const lever = new THREE.Group()
  lever.position.set(-0.35, 0.3, z)
  lever.rotation.z = -0.4
  body.add(lever)
  mesh(new THREE.CylinderGeometry(0.014, 0.017, 0.3, 20), M.dark, [0, 0.15, 0], [0, 0, 0], lever)
  mesh(new THREE.SphereGeometry(0.042, 40, 20), M.black, [0, 0.31, 0], [0, 0, 0], lever)
  mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.035, 24), M.dark, [0, 0, 0], [Math.PI / 2, 0, 0], lever)
}
mesh(new THREE.TorusGeometry(0.085, 0.013, 14, 48, Math.PI), M.rubber, [0.66, 0.465, 0], [0, Math.PI / 2, 0], body)

// Chassis: frame, bogies with running and guide wheels around the rail,
// battery pack and a sensor.
mesh(box(1.6, 0.05, 0.42, 0.015), M.dark, [0, 0.165, 0])
for (const x of [-0.66, -0.44, 0.44, 0.66]) {
  for (const z of [-0.17, 0.17]) {
    mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.05, 32), M.rubber, [x, 0.093, z], [Math.PI / 2, 0, 0])
    mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.056, 24), M.steel, [x, 0.093, z], [Math.PI / 2, 0, 0])
  }
}
for (const x of [-0.55, 0.55]) {
  for (const z of [-0.245, 0.245]) mesh(box(0.2, 0.23, 0.016, 0.006), M.dark, [x, 0.03, z])
  for (const z of [-0.17, 0.17]) mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 24), M.rubber, [x, -0.075, z], [Math.PI / 2, 0, 0])
  mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.49, 12), M.steel, [x, -0.075, 0], [Math.PI / 2, 0, 0])
}
mesh(box(0.46, 0.1, 0.07, 0.02), M.black, [0, 0.11, 0.265])
mesh(box(0.07, 0.045, 0.02, 0.006), M.dark, [0.76, 0.1, 0.258])
mesh(new THREE.SphereGeometry(0.009, 16, 8), M.green, [0.775, 0.105, 0.27])

// Track: the stainless rail on its cross ties and posts, and a ground that
// only takes shadows.
for (const z of [-0.17, 0.17]) mesh(new THREE.CylinderGeometry(0.045, 0.045, 10, 48), M.chrome, [0, 0, z], [0, 0, Math.PI / 2])
for (const x of [-1.7, 1.75, 3.8]) {
  mesh(box(0.06, 0.05, 0.5, 0.012), M.steel, [x, -0.075, 0])
  mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.52, 20), M.steel, [x, -0.36, 0])
}
const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.13 }))
ground.rotation.x = -Math.PI / 2
ground.position.y = -0.62
ground.receiveShadow = true
scene.add(ground)

renderer.render(scene, camera)
document.title = 'done'
`

// Parts the labels point at, in model coordinates (see SLED_SCENE).
const KNOB = [-0.35 + 0.31 * Math.sin(0.4), SLED.lift + 0.3 + 0.31 * Math.cos(0.4), 0.235]
const SLED_PARTS = [
  { label: 'Gurtschloss', value: 'zu', icon: 'lock', chip: 'left:12px;top:12px', anchor: [132, 42], at: [-0.5, SLED.lift + 0.262, 0.13] },
  { label: 'Bremse', value: 'OK', icon: 'disc', chip: 'left:158px;top:12px', anchor: [176, 42], at: KNOB },
  { label: 'LED', value: 'an', icon: 'lightbulb', chip: 'right:12px;top:96px', anchor: [300, 126], at: [1.268, SLED.lift + 0.317, 0.1] },
  { label: 'Akku', value: '14,0 V', icon: 'battery-full', chip: 'left:12px;top:208px', anchor: [92, 208], at: [0, 0.11, 0.3] },
  { label: 'Sensoren', value: '6/6', icon: 'radio', chip: 'right:12px;top:208px', anchor: [270, 208], at: [0.775, 0.105, 0.27] }
]

// Model point → position in the 358×250 illustration card.
function onCard([x, y, z]) {
  const cam = new THREE.PerspectiveCamera(SLED.cam.fov, SLED.w / SLED.h, 0.1, 50)
  cam.position.fromArray(SLED.cam.pos)
  cam.lookAt(new THREE.Vector3().fromArray(SLED.cam.target))
  cam.updateMatrixWorld()
  const v = new THREE.Vector3(x, y, z).project(cam)
  return [Math.round((v.x + 1) / 2 * 358 * 10) / 10, Math.round((1 - v.y) / 2 * 250 * 10) / 10]
}

// Renders SLED_SCENE in headless Chrome, served with three from node_modules.
async function renderSled() {
  const html = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:transparent;overflow:hidden}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
</head><body><script>window.SLED=${JSON.stringify(SLED)}</script><script type="module">${SLED_SCENE}</script></body></html>`
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0])
    if (url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(html)
    }
    const file = resolve(THREE_DIR, `.${url.replace(/^\/three/, '')}`)
    if (!url.startsWith('/three/') || !file.startsWith(THREE_DIR) || !existsSync(file)) {
      res.writeHead(404)
      return res.end()
    }
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' })
    res.end(readFileSync(file))
  })
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  const shot = join(tmp, 'sled.png')
  try {
    await promisify(execFile)(CHROME, [
      '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${SLED.w},${SLED.h}`,
      '--virtual-time-budget=30000', '--default-background-color=00000000', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      `--screenshot=${shot}`, `http://127.0.0.1:${server.address().port}/`
    ])
  } finally {
    server.closeAllConnections()
    server.close()
  }
  return `data:image/png;base64,${readFileSync(shot).toString('base64')}`
}

let sledImage = ''

const coasterScreen = () => `
${statusBar('#1F1F1F')}
<div class="cs">
  <div class="hd row">
    <span class="back">${icon('chevron-left', 20)}</span>
    <div><b>Rodel 07</b><small>Bahn Nord · Fahrzeug 7 von 40</small></div>
    <span class="bt">${icon('bluetooth-connected', 14)}Verbunden</span>
  </div>
  <div class="off row">${icon('cloud-off', 16)}<span><b>Offline</b> · 3 Diagnosen warten auf den Abgleich</span></div>
  <div class="ill">
    <img class="sled" src="${sledImage}" alt="">
    <svg width="358" height="250" viewBox="0 0 358 250">
      ${SLED_PARTS.map((p) => {
        const [x, y] = onCard(p.at)
        return `<path d="M${p.anchor[0]} ${p.anchor[1]} L${x} ${y}" stroke="#AEB4BC" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="${x}" cy="${y}" r="5.5" fill="#52C41A" stroke="#fff" stroke-width="2.5"/>`
      }).join('')}
    </svg>
    ${SLED_PARTS.map(p => `<span class="chip" style="${p.chip}"><span class="ci">${icon(p.icon, 13)}</span>${p.label}<small>${p.value}</small></span>`).join('')}
  </div>
  <div class="stats">
    <div><small>Position</small><b class="tnum">123,0 m</b></div>
    <div><small>Tempo</small><b class="tnum">1,0 m/s</b></div>
    <div><small>Abschnitt</small><b>Einfahrt</b></div>
  </div>
  <h3>Funktionstests</h3>
  <div class="list">
    <div class="it"><span class="ic">${icon('activity', 18)}</span><div><b>Funktionsprüfung</b><small>Zuletzt 08:14 · bestanden</small></div><a class="btn">Testen</a></div>
    <div class="it"><span class="ic">${icon('disc', 18)}</span><div><b>Bremsassistent</b><small>Bereit</small></div><a class="btn">Testen</a></div>
    <div class="it"><span class="ic">${icon('lock', 18)}</span><div><b>Gurtschloss</b><small>Geschlossen</small></div><span class="seg"><a>Auf</a><a class="on">Zu</a></span></div>
    <div class="it"><span class="ic">${icon('lightbulb', 18)}</span><div><b>LED</b><small>Eingeschaltet</small></div><span class="seg"><a class="on">An</a><a>Aus</a></span></div>
  </div>
  <div class="cta">${icon('save', 18)}Diagnose speichern</div>
</div>`

const coasterScreenCss = `
.cs{color:#1F1F1F}
.cs .hd{gap:12px;padding:6px 16px 12px}
.cs .back{width:38px;height:38px;border-radius:12px;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 1px #E6E6E6}
.cs .hd b{display:block;font-size:20px;font-weight:700;letter-spacing:-.015em}
.cs .hd small{display:block;font-size:12.5px;color:#737373;margin-top:1px}
.cs .bt{margin-left:auto;display:flex;align-items:center;gap:5px;height:28px;padding:0 10px 0 8px;border-radius:14px;background:#F6FFED;color:#389E0D;font-size:12px;font-weight:600;box-shadow:inset 0 0 0 1px #D9F7BE}
.cs .off{gap:9px;margin:0 16px 12px;height:40px;padding:0 13px;border-radius:12px;background:#FFFBE6;color:#874D00;font-size:12.5px;box-shadow:inset 0 0 0 1px #FFE58F}
.cs .off .i{color:#D48806}
.cs .ill{position:relative;overflow:hidden;margin:0 16px;height:250px;border-radius:22px;background:radial-gradient(110% 90% at 50% 42%,#FFFFFF,#F1F2F4);box-shadow:0 0 0 1px #E8E8E8}
.cs .ill>svg,.cs .ill .sled{position:absolute;left:0;top:0;width:358px;height:250px}
.cs .chip{position:absolute;display:flex;align-items:center;gap:7px;height:30px;padding:0 10px 0 5px;border-radius:9px;background:#fff;box-shadow:0 6px 16px -4px rgba(0,0,0,.14),0 0 0 1px #E8E8E8;font-size:12px;font-weight:600;white-space:nowrap}
.cs .chip .ci{width:21px;height:21px;border-radius:6px;background:#F6FFED;color:#52C41A;display:grid;place-items:center}
.cs .chip small{color:#737373;font-weight:500;font-size:12px}
.cs .stats{display:grid;grid-template-columns:repeat(3,1fr);margin:14px 16px 0;background:#fff;border-radius:16px;box-shadow:0 0 0 1px #E8E8E8}
.cs .stats div{padding:12px 14px}
.cs .stats div+div{border-left:1px solid #F0F0F0}
.cs .stats small{display:block;font-size:11px;color:#737373;font-weight:500}
.cs .stats b{display:block;font-size:16px;font-weight:700;margin-top:3px}
.cs h3{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#737373;margin:18px 22px 9px}
.cs .list{margin:0 16px;background:#fff;border-radius:18px;box-shadow:0 0 0 1px #E8E8E8}
.cs .it{display:flex;align-items:center;gap:12px;height:56px;padding:0 12px}
.cs .it+.it{border-top:1px solid #F0F0F0}
.cs .it .ic{width:34px;height:34px;border-radius:10px;background:#FFF8E1;color:#D48806;display:grid;place-items:center;flex:none}
.cs .it b{display:block;font-size:14px}
.cs .it small{display:block;font-size:11.5px;color:#737373;margin-top:1px}
.cs .btn{margin-left:auto;height:32px;padding:0 14px;border-radius:10px;display:grid;place-items:center;font-size:13px;font-weight:600;color:#1F1F1F;box-shadow:inset 0 0 0 1px #D9D9D9}
.cs .seg{margin-left:auto;display:flex;padding:3px;border-radius:10px;background:#F0F0F0}
.cs .seg a{height:26px;padding:0 12px;border-radius:8px;display:grid;place-items:center;font-size:12.5px;font-weight:600;color:#737373}
.cs .seg a.on{background:#fff;color:#1F1F1F;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.cs .cta{position:absolute;left:16px;right:16px;bottom:34px;height:54px;border-radius:16px;background:linear-gradient(180deg,#FFC53D,${YELLOW});color:#2B1D00;font-size:15.5px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 12px 24px -10px rgba(250,173,20,.8)}
`

// Page 1 of the sled list, sorted by number.
const RF_ROWS = [
  ['01', 'ok', 93, 'v3.4.1', 'heute, 08:14'],
  ['02', 'ok', 87, 'v3.4.1', 'heute, 08:15'],
  ['03', 'ok', 81, 'v3.4.1', 'heute, 08:15'],
  ['04', 'ok', 75, 'v3.4.1', 'heute, 08:16'],
  ['05', 'warn', 17, 'v3.4.1', 'heute, 08:16'],
  ['06', 'err', 64, 'v3.3.0', 'heute, 08:17'],
  ['07', 'ok', 57, 'v3.4.1', 'heute, 08:14'],
  ['08', 'idle', 100, 'v3.4.1', 'gestern, 17:42']
]
const RF_TAG = { ok: 'Auf Strecke', warn: 'Akku niedrig', err: 'Fehler: Bremse', idle: 'Im Depot' }
const battery = pct => `<div class="pg"><span class="tr"><span style="width:${pct}%;background:${pct < 25 ? '#EF4444' : '#22C55E'}"></span></span><span class="pt tnum">${pct} %</span></div>`
const akkuLine = curve([83, 82, 82, 80, 81, 79, 79, 78, 78], 66, 28, 3)

const coaster = {
  glow: YELLOW,
  w: 1346,
  h: 880,
  css: `
.rf{left:0;top:36px;width:1040px;height:800px;display:flex;background:#FAFAFA;color:#18181B;font-size:13px;line-height:1.4}
.rf small{display:block}
.rf .sd{width:216px;flex:none;background:#F4F4F5;border-right:1px solid #E4E4E7;display:flex;flex-direction:column;padding:16px 12px 12px}
.rf .br{display:flex;align-items:center;gap:10px;padding:2px 8px 16px;font-size:15px;font-weight:700;letter-spacing:-.01em}
.rf .lg{width:28px;height:28px;border-radius:8px;background:linear-gradient(180deg,#FFC53D,${YELLOW});color:#2B1D00;display:grid;place-items:center}
.rf .ws{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:#fff;box-shadow:0 0 0 1px #E4E4E7,0 1px 2px rgba(0,0,0,.04)}
.rf .ws .wi{width:30px;height:30px;border-radius:8px;background:#18181B;color:#fff;display:grid;place-items:center}
.rf .ws b{display:block;font-size:13px}
.rf .ws small{font-size:11.5px;color:#71717A}
.rf .ws>.i{margin-left:auto;color:#A1A1AA}
.rf .cap{margin:18px 10px 6px;font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#A1A1AA}
.rf .mi{display:flex;align-items:center;gap:10px;height:34px;margin-bottom:2px;padding:0 10px;border-radius:8px;font-weight:500;color:#52525B}
.rf .mi .i{color:#71717A}
.rf .mi.on{background:#fff;color:#18181B;font-weight:600;box-shadow:0 0 0 1px #E4E4E7,0 1px 2px rgba(0,0,0,.05)}
.rf .mi.on .i{color:#D48806}
.rf .mi em{margin-left:auto;font-style:normal;font-size:11px;font-weight:600;color:#71717A}
.rf .mi em.bd{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#FEF3C7;color:#92400E;display:grid;place-items:center}
.rf .me{margin-top:auto;display:flex;align-items:center;gap:10px;padding:12px 8px 2px;border-top:1px solid #E4E4E7}
.rf .me b{display:block;font-size:12.5px}
.rf .me small{font-size:11px;color:#71717A}
.rf .me>.i{margin-left:auto;color:#A1A1AA}
.rf .avt{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#52525B,#18181B);color:#fff;display:grid;place-items:center;font-size:11px;font-weight:600}
.rf .mc{flex:1;min-width:0;display:flex;flex-direction:column}
.rf .tb{height:56px;flex:none;display:flex;align-items:center;gap:10px;padding:0 28px;border-bottom:1px solid #E4E4E7;background:#fff}
.rf .bc{gap:8px;color:#71717A}
.rf .bc b{color:#18181B}
.rf .bc .i{color:#D4D4D8}
.rf .srch{margin-left:auto;display:flex;align-items:center;gap:8px;width:230px;height:34px;padding:0 7px 0 10px;border-radius:9px;background:#F4F4F5;color:#A1A1AA}
.rf .srch kbd{margin-left:auto;font:500 11px Inter,sans-serif;padding:2px 6px;border-radius:5px;background:#fff;color:#71717A;box-shadow:0 0 0 1px #E4E4E7}
.rf .ib{position:relative;width:34px;height:34px;border-radius:9px;display:grid;place-items:center;color:#52525B;box-shadow:inset 0 0 0 1px #E4E4E7}
.rf .ib i{position:absolute;top:8px;right:9px;width:7px;height:7px;border-radius:50%;background:${YELLOW};box-shadow:0 0 0 2px #fff}
.rf .cnt{padding:22px 60px 0 28px}
.rf .ttl{display:flex;align-items:flex-end;justify-content:space-between}
.rf .ttl h2{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.2}
.rf .ttl p{font-size:12.5px;color:#71717A;margin-top:3px}
.rf .btn{display:flex;align-items:center;gap:7px;height:34px;padding:0 12px;border-radius:9px;font-weight:600;background:#fff;box-shadow:0 0 0 1px #E4E4E7,0 1px 2px rgba(0,0,0,.04)}
.rf .btn.pri{background:linear-gradient(180deg,#FFC53D,${YELLOW});color:#2B1D00;box-shadow:0 0 0 1px #E8A00C,0 6px 14px -6px rgba(250,173,20,.7)}
.rf .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}
.rf .kpi{position:relative;height:92px;background:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 0 0 1px #E4E4E7,0 1px 2px rgba(0,0,0,.03)}
.rf .kpi small{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:500;color:#71717A}
.rf .kpi small .i{color:#A1A1AA}
.rf .kpi b{display:block;font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.15;margin-top:6px}
.rf .kpi b span{font-size:13px;color:#A1A1AA;font-weight:600;letter-spacing:0}
.rf .kpi p{font-size:11.5px;color:#71717A;margin-top:4px}
.rf .kpi .mix{display:flex;gap:2px;height:5px;margin-top:10px}
.rf .kpi .mix i{border-radius:3px}
.rf .kpi .sp{position:absolute;right:14px;bottom:14px}
.rf .tbl{margin-top:16px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px #E4E4E7,0 1px 2px rgba(0,0,0,.03)}
.rf .bar{display:flex;align-items:center;gap:8px;height:50px;padding:0 12px}
.rf .tabs{display:flex;padding:3px;border-radius:9px;background:#F4F4F5}
.rf .tabs a{display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:7px;font-size:12.5px;font-weight:500;color:#71717A}
.rf .tabs a span{font-size:11px;color:#A1A1AA}
.rf .tabs a.on{background:#fff;color:#18181B;font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.1)}
.rf .bar .btn{height:30px;padding:0 10px;font-size:12.5px;font-weight:500;color:#3F3F46}
.rf .bar .btn:first-of-type{margin-left:auto}
.rf table{width:100%;border-collapse:collapse;table-layout:fixed}
.rf th{height:36px;padding:0 12px;text-align:left;font-size:11.5px;font-weight:500;color:#71717A;background:#FAFAFA;border-top:1px solid #EEEEF0;border-bottom:1px solid #EEEEF0;white-space:nowrap}
.rf th .i{display:inline-block;vertical-align:-2px;margin-left:4px;color:#A1A1AA}
.rf td{height:48px;padding:0 12px;border-bottom:1px solid #F4F4F5;white-space:nowrap}
.rf th:first-child,.rf td:first-child{padding-left:16px}
.rf tr.sel td{background:#FFFBEB}
.rf tr.sel td:first-child{box-shadow:inset 2px 0 0 ${YELLOW}}
.rf .veh{display:flex;align-items:center;gap:10px;font-weight:600}
.rf .veh .no{width:28px;height:28px;border-radius:8px;background:#F4F4F5;color:#52525B;display:grid;place-items:center;font:500 11.5px 'JetBrains Mono',monospace}
.rf tr.sel .no{background:#FDE68A;color:#78350F}
.rf .tag{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 9px 0 8px;border-radius:11px;font-size:12px;font-weight:500}
.rf .tag i{width:6px;height:6px;border-radius:50%}
.rf .tag.ok{background:#F0FDF4;color:#15803D}
.rf .tag.ok i{background:#22C55E}
.rf .tag.warn{background:#FFFBEB;color:#B45309}
.rf .tag.warn i{background:#F59E0B}
.rf .tag.err{background:#FEF2F2;color:#B91C1C}
.rf .tag.err i{background:#EF4444}
.rf .tag.idle{background:#F4F4F5;color:#52525B}
.rf .tag.idle i{background:#A1A1AA}
.rf .pg{display:flex;align-items:center;gap:8px}
.rf .pg .tr{width:60px;height:6px;border-radius:3px;background:#F0F0F2;overflow:hidden}
.rf .pg .tr span{display:block;height:100%;border-radius:3px}
.rf .pg .pt{font-size:12.5px;color:#3F3F46}
.rf .ver{font-family:'JetBrains Mono',monospace;font-size:12px;color:#3F3F46}
.rf .ver u{margin-left:7px;padding:2px 6px;border-radius:5px;background:#FEF3C7;color:#92400E;font:600 10.5px Inter,sans-serif;text-decoration:none}
.rf .dt{color:#52525B}
.rf .more{color:#A1A1AA}
.rf .ft{display:flex;align-items:center;justify-content:space-between;height:46px;padding:0 12px 0 16px;font-size:12.5px;color:#71717A}
.rf .pag{display:flex;gap:4px}
.rf .pa{min-width:28px;height:28px;border-radius:7px;display:grid;place-items:center;font-weight:500;color:#52525B}
.rf .pa.on{background:#18181B;color:#fff}
.rf .pa.dis{color:#D4D4D8}
.screen{background:#F5F5F5}
${coasterScreenCss}`,
  get html() {
    return `
<div class="win rf">
  <aside class="sd">
    <div class="br"><span class="lg">${icon('mountain', 16)}</span>Rodel-Service</div>
    <div class="ws"><span class="wi">${icon('route', 15)}</span><div><b>Bahn Nord</b><small>40 Fahrzeuge</small></div>${icon('chevrons-up-down', 15)}</div>
    <div class="cap">Betrieb</div>
    <div class="mi">${icon('layout-dashboard', 16)}Übersicht</div>
    <div class="mi on">${icon('gauge', 16)}Fahrzeuge<em>40</em></div>
    <div class="mi">${icon('activity', 16)}Diagnosen<em class="bd">3</em></div>
    <div class="mi">${icon('wrench', 16)}Wartung</div>
    <div class="cap">Verwaltung</div>
    <div class="mi">${icon('route', 16)}Bahnen</div>
    <div class="mi">${icon('users', 16)}Benutzer</div>
    <div class="mi">${icon('settings', 16)}Einstellungen</div>
    <div class="me"><span class="avt">JS</span><div><b>J. Steiner</b><small>Installateur</small></div>${icon('ellipsis', 16)}</div>
  </aside>
  <div class="mc">
    <header class="tb">
      <div class="bc row"><span>Bahnen</span>${icon('chevron-right', 14)}<span>Bahn Nord</span>${icon('chevron-right', 14)}<b>Fahrzeuge</b></div>
      <span class="srch">${icon('search', 15)}Suchen …<kbd>⌘K</kbd></span>
      <span class="ib">${icon('bell', 16)}<i></i></span>
    </header>
    <div class="cnt">
      <div class="ttl">
        <div><h2>Fahrzeuge</h2><p>Bahn Nord · zuletzt abgeglichen heute, 08:17</p></div>
        <div class="row" style="gap:8px"><a class="btn">${icon('download', 15)}Export</a><a class="btn pri">${icon('activity', 15)}Diagnose starten</a></div>
      </div>
      <div class="kpis">
        <div class="kpi"><small>Auf Strecke${icon('route', 14)}</small><b class="tnum">34 <span>/ 40</span></b><div class="mix"><i style="flex:34;background:#22C55E"></i><i style="flex:1;background:#F59E0B"></i><i style="flex:1;background:#EF4444"></i><i style="flex:4;background:#D4D4D8"></i></div></div>
        <div class="kpi"><small>Ø Akkustand${icon('battery-medium', 14)}</small><b class="tnum">78 %</b><p>1 unter 25 %</p><svg class="sp" width="66" height="28" viewBox="0 0 66 28"><path d="${akkuLine.d}" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round"/></svg></div>
        <div class="kpi"><small>Offene Fehler${icon('triangle-alert', 14)}</small><b class="tnum" style="color:#B91C1C">1</b><p>Rodel 06 · Bremse</p></div>
        <div class="kpi"><small>Diagnosen heute${icon('activity', 14)}</small><b class="tnum">37</b><p>3 warten auf Abgleich</p></div>
      </div>
      <div class="tbl">
        <div class="bar">
          <div class="tabs"><a class="on">Alle<span>40</span></a><a>Auf Strecke<span>34</span></a><a>Warnungen<span>2</span></a><a>Im Depot<span>4</span></a></div>
          <a class="btn">${icon('list-filter', 14)}Filter</a><a class="btn">${icon('columns-3', 14)}Spalten</a>
        </div>
        <table>
          <colgroup><col style="width:150px"><col style="width:140px"><col style="width:130px"><col style="width:126px"><col><col style="width:44px"></colgroup>
          <thead><tr><th>Fahrzeug${icon('arrow-up', 12)}</th><th>Status</th><th>Akku</th><th>Firmware</th><th>Letzte Diagnose</th><th></th></tr></thead>
          <tbody>
            ${RF_ROWS.map(([n, s, pct, fw, last]) => `<tr class="${n === '07' ? 'sel' : ''}">
              <td><div class="veh"><span class="no">${n}</span>Rodel ${n}</div></td>
              <td><span class="tag ${s}"><i></i>${RF_TAG[s]}</span></td>
              <td>${battery(pct)}</td>
              <td><span class="ver">${fw}${fw === 'v3.4.1' ? '' : '<u>Update</u>'}</span></td>
              <td class="dt">${last}</td>
              <td class="more">${icon(n === '07' ? 'chevron-right' : 'ellipsis', 16)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="ft"><span>1–8 von 40 Fahrzeugen</span><div class="pag"><span class="pa dis">${icon('chevron-left', 14)}</span><span class="pa on">1</span><span class="pa">2</span><span class="pa">3</span><span class="pa">4</span><span class="pa">5</span><span class="pa">${icon('chevron-right', 14)}</span></div></div>
      </div>
    </div>
  </div>
</div>
${phone(992, 104, 0.86, '#F5F5F5', coasterScreen())}`
  }
}

// ---------------------------------------------------------------------------
// Financial management: web dashboard + app, with an adviser at hand.

const heroLine = curve(wave(26, 1.2, 1.6, 0.9), 440, 120)
const phoneLine = curve(wave(22, 2.4, 1.5, 0.9), 326, 84)

const financeScreen = `
${statusBar('#fff')}
<div class="fs">
  <div class="hd row">
    <span class="av" style="width:42px;height:42px;background:linear-gradient(135deg,#A99BFF,#6E5CF2);color:#fff;font-size:16px">A</span>
    <div class="grow"><small>Guten Morgen</small><b>Anna Berger</b></div>
    <span class="ib">${icon('bell', 19)}<i></i></span>
  </div>
  <div class="net">
    <small>Gesamtvermögen</small>
    <div class="big tnum">1.240.000 <span>€</span></div>
    <span class="chip">${icon('trending-up', 13)}+3,8 % seit Jänner</span>
    <svg width="326" height="84" viewBox="0 0 326 84">
      <defs><linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8B7CF6" stop-opacity=".35"/><stop offset="1" stop-color="#8B7CF6" stop-opacity="0"/></linearGradient></defs>
      <path d="${phoneLine.area}" fill="url(#pf)"/><path d="${phoneLine.d}" fill="none" stroke="#A99BFF" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${phoneLine.end[0] - 2}" cy="${phoneLine.end[1]}" r="5" fill="#fff" stroke="#8B7CF6" stroke-width="3"/>
    </svg>
    <div class="seg"><a>1M</a><a>6M</a><a class="on">1J</a><a>Max</a></div>
  </div>
  <div class="adv">
    <div class="row" style="gap:11px"><span class="av" style="width:36px;height:36px;background:linear-gradient(135deg,#FCD34D,#F59E0B);color:#422006;font-size:13px">MK</span><div class="grow"><b>Markus Klein</b><small>Ihr Berater · vor 5 Min.</small></div>${icon('message-circle', 18, 'color:#A99BFF')}</div>
    <p>Ihr Depot-Check ist fertig. Sollen wir ihn am Donnerstag gemeinsam durchgehen?</p>
    <div class="row" style="gap:8px"><a class="pb">Termin bestätigen</a><a class="gb">Antworten</a></div>
  </div>
  <div class="lh row"><b>Konten</b><span>Alle anzeigen</span></div>
  <div class="acc">
    <div class="ar"><span class="ai" style="background:rgba(56,189,248,.14);color:#7DD3FC">${icon('credit-card', 18)}</span><div class="grow"><b>Girokonto</b><small>Hausbank</small></div><b class="tnum">12.480,00 €</b></div>
    <div class="ar"><span class="ai" style="background:rgba(52,211,153,.14);color:#6EE7B7">${icon('piggy-bank', 18)}</span><div class="grow"><b>Tagesgeld</b><small>2,1 % p. a.</small></div><b class="tnum">73.940,00 €</b></div>
    <div class="ar"><span class="ai" style="background:rgba(139,124,246,.16);color:#B9AEFF">${icon('chart-line', 18)}</span><div class="grow"><b>Depot</b><small>ETF & Fonds</small></div><b class="tnum">312.880,00 €</b></div>
  </div>
  <div class="tabbar">
    <a class="on">${icon('house', 21)}Übersicht</a><a>${icon('wallet', 21)}Vermögen</a><a>${icon('target', 21)}Ziele</a><a>${icon('message-circle', 21)}Berater</a>
  </div>
</div>`

const finance = {
  glow: '#8B7CF6',
  w: 1214,
  h: 780,
  css: `
.fw{left:0;top:44px;width:980px;height:700px;background:#0E1424;color:#E7EAF3;display:flex}
.fw .side{width:220px;flex:none;background:#0A0F1C;border-right:1px solid rgba(255,255,255,.06);padding:26px 14px 16px;display:flex;flex-direction:column}
.fw .brand{display:flex;align-items:center;gap:12px;padding:0 8px 28px}
.fw .brand b{display:block;font-size:15px;font-weight:700}
.fw .brand small{display:block;font-size:11.5px;color:#8B93A9;margin-top:2px}
.fw nav{display:flex;flex-direction:column;gap:3px}
.fw nav a{display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;border-radius:10px;font-size:14px;font-weight:500;color:#9199AE}
.fw nav a.on{background:rgba(139,124,246,.14);color:#fff;box-shadow:inset 0 0 0 1px rgba(139,124,246,.28)}
.fw nav a.on .i{color:#A99BFF}
.fw .cap{margin:22px 12px 8px;font-size:10.5px;font-weight:700;letter-spacing:.1em;color:#5C6580}
.fw .advc{margin-top:auto;padding:14px;border-radius:14px;background:linear-gradient(160deg,#1A2140,#141A30);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
.fw .advc b{display:block;font-size:13.5px}
.fw .advc small{display:block;font-size:11.5px;color:#8B93A9}
.fw .advc .row a{flex:1;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600}
.fw .main{flex:1;min-width:0;padding:26px 28px}
.fw .top{justify-content:space-between}
.fw h1{font-size:24px;font-weight:700;letter-spacing:-.02em}
.fw .sub{font-size:13px;color:#8B93A9;margin-top:4px}
.fw .ib{position:relative;width:40px;height:40px;border-radius:12px;background:#161E33;display:grid;place-items:center;color:#AEB5C8;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
.fw .ib i{position:absolute;top:9px;right:10px;width:8px;height:8px;border-radius:50%;background:#F87171;box-shadow:0 0 0 2px #161E33}
.fw .pb{height:40px;padding:0 16px;border-radius:12px;background:#8B7CF6;color:#fff;font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:8px;box-shadow:0 10px 24px -10px rgba(139,124,246,.8)}
.fw .hero{position:relative;margin-top:22px;height:168px;border-radius:20px;overflow:hidden;background:linear-gradient(120deg,#7462F4,#4F42D6 55%,#3A31AE);padding:22px 24px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.fw .hero svg{position:absolute;right:0;bottom:0}
.fw .hero small{font-size:12.5px;color:rgba(255,255,255,.75);font-weight:500}
.fw .hero .big{font-size:42px;font-weight:700;letter-spacing:-.03em;margin:6px 0 12px}
.fw .hero .big span{font-size:26px;opacity:.8}
.fw .chip{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:13px;font-size:12px;font-weight:600}
.fw .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:16px}
.fw .card{background:#161E33;border-radius:16px;padding:16px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.05)}
.fw .card .h{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:#8B93A9;font-weight:500}
.fw .card .h .i{opacity:.8}
.fw .card .v{font-size:19px;font-weight:700;letter-spacing:-.02em;margin-top:10px}
.fw .card .d{font-size:11.5px;margin-top:4px;color:#8B93A9}
.fw .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.fw .card h4{font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.fw .card h4 span{font-size:12px;color:#8B93A9;font-weight:500}
.fw .alloc{display:flex;align-items:center;gap:20px;margin-top:14px}
.fw .leg{flex:1;display:flex;flex-direction:column;gap:10px}
.fw .leg div{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#AEB5C8}
.fw .leg i{width:9px;height:9px;border-radius:3px}
.fw .leg b{margin-left:auto;color:#E7EAF3;font-size:12.5px}
.fw .goal{margin-top:15px}
.fw .goal .row{justify-content:space-between;font-size:13px}
.fw .goal .row span{color:#8B93A9;font-size:12px}
.fw .goal .bar{height:7px;border-radius:4px;background:rgba(255,255,255,.07);margin-top:8px;overflow:hidden}
.fw .goal .bar span{display:block;height:100%;border-radius:4px}
.screen{background:#0B1020}
.fs{color:#E7EAF3}
.fs .hd{gap:12px;padding:8px 18px 14px}
.fs .hd small{display:block;font-size:12.5px;color:#8B93A9}
.fs .hd b{display:block;font-size:17px;font-weight:700}
.fs .ib{position:relative;width:42px;height:42px;border-radius:14px;background:#161E33;display:grid;place-items:center;color:#AEB5C8}
.fs .ib i{position:absolute;top:10px;right:11px;width:8px;height:8px;border-radius:50%;background:#F87171;box-shadow:0 0 0 2px #161E33}
.fs .net{position:relative;margin:0 16px;padding:18px 16px 14px;border-radius:24px;background:linear-gradient(170deg,#1B1F45,#121834);box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)}
.fs .net small{font-size:12.5px;color:#9AA2BA;font-weight:500}
.fs .net .big{font-size:34px;font-weight:700;letter-spacing:-.03em;margin:4px 0 8px}
.fs .net .big span{font-size:22px;color:#AEB5C8}
.fs .chip{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 9px;border-radius:12px;font-size:11.5px;font-weight:600;background:rgba(52,211,153,.14);color:#6EE7B7}
.fs .net>svg{display:block;margin:10px -16px 0 -16px;width:358px}
.fs .seg{display:flex;gap:4px;margin-top:10px;padding:3px;border-radius:11px;background:rgba(255,255,255,.05)}
.fs .seg a{flex:1;height:28px;border-radius:8px;display:grid;place-items:center;font-size:12px;font-weight:600;color:#8B93A9}
.fs .seg a.on{background:#8B7CF6;color:#fff}
.fs .adv{margin:14px 16px 0;padding:14px;border-radius:20px;background:#141B30;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
.fs .adv b{display:block;font-size:14px}
.fs .adv small{display:block;font-size:11.5px;color:#8B93A9}
.fs .adv p{margin:11px 0 12px;font-size:13.5px;line-height:1.45;color:#CBD0DE}
.fs .pb,.fs .gb{height:34px;padding:0 14px;border-radius:10px;display:grid;place-items:center;font-size:12.5px;font-weight:600}
.fs .pb{background:#8B7CF6;color:#fff}
.fs .gb{background:rgba(255,255,255,.06);color:#CBD0DE}
.fs .lh{justify-content:space-between;margin:18px 22px 6px;font-size:15px}
.fs .lh span{font-size:12.5px;color:#A99BFF;font-weight:600}
.fs .acc{margin:0 16px}
.fs .ar{display:flex;align-items:center;gap:12px;height:56px}
.fs .ar+.ar{border-top:1px solid rgba(255,255,255,.06)}
.fs .ai{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex:none}
.fs .ar b{display:block;font-size:14px}
.fs .ar small{display:block;font-size:11.5px;color:#8B93A9;margin-top:1px}
.fs .tabbar{position:absolute;left:0;right:0;bottom:0;height:86px;padding:10px 12px 0;display:flex;background:rgba(11,16,32,.92);border-top:1px solid rgba(255,255,255,.06)}
.fs .tabbar a{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;font-size:11px;font-weight:600;color:#6B7390}
.fs .tabbar a.on{color:#A99BFF}`,
  html: `
<div class="win fw">
  <aside class="side">
    <div class="brand"><span class="logo" style="background:linear-gradient(135deg,#A99BFF,#6E5CF2);color:#fff">${icon('wallet', 19)}</span><div><b>Finanzportal</b><small>Vermögen & Beratung</small></div></div>
    <nav>
      <a class="on">${icon('layout-dashboard', 18)}Übersicht</a>
      <a>${icon('landmark', 18)}Vermögen</a>
      <a>${icon('target', 18)}Ziele</a>
    </nav>
    <div class="cap">PRODUKTE</div>
    <nav>
      <a>${icon('chart-line', 18)}Depot</a>
      <a>${icon('umbrella', 18)}Versicherungen</a>
      <a>${icon('house', 18)}Immobilien</a>
      <a>${icon('folder', 18)}Dokumente</a>
    </nav>
    <div class="advc">
      <div class="row" style="gap:10px"><span class="av" style="width:36px;height:36px;background:linear-gradient(135deg,#FCD34D,#F59E0B);color:#422006;font-size:13px">MK</span><div><b>Markus Klein</b><small>Ihr Berater</small></div></div>
      <div class="row" style="gap:8px;margin-top:12px"><a style="background:#8B7CF6;color:#fff">${icon('calendar', 14)}Termin</a><a style="background:rgba(255,255,255,.07);color:#CBD0DE">${icon('message-circle', 14)}Chat</a></div>
    </div>
  </aside>
  <main class="main">
    <div class="top row">
      <div><h1>Guten Morgen, Anna</h1><p class="sub">Dienstag, 10. Juni · zuletzt abgeglichen 08:30</p></div>
      <div class="row" style="gap:10px"><span class="ib">${icon('bell', 18)}<i></i></span><a class="pb">${icon('plus', 16)}Vermögen hinzufügen</a></div>
    </div>
    <div class="hero">
      <small>Gesamtvermögen · netto</small>
      <div class="big tnum">1,24 Mio <span>€</span></div>
      <span class="chip" style="background:rgba(255,255,255,.16);color:#fff">${icon('trending-up', 13)}+3,8 % seit Jänner</span>
      <svg width="440" height="120" viewBox="0 0 440 120">
        <defs><linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
        <path d="${heroLine.area}" fill="url(#hf)"/><path d="${heroLine.d}" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="cards">
      <div class="card"><div class="h">Liquide Mittel${icon('piggy-bank', 15)}</div><div class="v tnum">86.420 €</div><div class="d">2 Konten</div></div>
      <div class="card"><div class="h">Depot${icon('chart-line', 15)}</div><div class="v tnum">312.880 €</div><div class="d" style="color:#6EE7B7">+8,2 % seit Kauf</div></div>
      <div class="card"><div class="h">Immobilien${icon('house', 15)}</div><div class="v tnum">980.000 €</div><div class="d">1 Wohnung</div></div>
      <div class="card"><div class="h">Kredite${icon('landmark', 15)}</div><div class="v tnum" style="color:#FCA5A5">−139.300 €</div><div class="d">Wohnkredit</div></div>
    </div>
    <div class="two">
      <div class="card">
        <h4>Vermögensaufteilung <span>brutto</span></h4>
        <div class="alloc">
          <svg width="132" height="132" viewBox="0 0 132 132" style="transform:rotate(-90deg)">
            <circle cx="66" cy="66" r="52" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="18"/>
            <circle cx="66" cy="66" r="52" fill="none" stroke="#8B7CF6" stroke-width="18" pathLength="100" stroke-dasharray="70.5 29.5"/>
            <circle cx="66" cy="66" r="52" fill="none" stroke="#38BDF8" stroke-width="18" pathLength="100" stroke-dasharray="22.1 77.9" stroke-dashoffset="-71.1"/>
            <circle cx="66" cy="66" r="52" fill="none" stroke="#34D399" stroke-width="18" pathLength="100" stroke-dasharray="5.6 94.4" stroke-dashoffset="-93.8"/>
          </svg>
          <div class="leg">
            <div><i style="background:#8B7CF6"></i>Immobilien<b>71 %</b></div>
            <div><i style="background:#38BDF8"></i>Depot<b>23 %</b></div>
            <div><i style="background:#34D399"></i>Liquide Mittel<b>6 %</b></div>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>Ziele <span>3 aktiv</span></h4>
        <div class="goal"><div class="row"><b>Eigentumswohnung</b><span>68 %</span></div><div class="bar"><span style="width:68%;background:linear-gradient(90deg,#8B7CF6,#A99BFF)"></span></div></div>
        <div class="goal"><div class="row"><b>Pensionsvorsorge</b><span>41 %</span></div><div class="bar"><span style="width:41%;background:linear-gradient(90deg,#38BDF8,#7DD3FC)"></span></div></div>
        <div class="goal"><div class="row"><b>Notgroschen</b><span>100 %</span></div><div class="bar"><span style="width:100%;background:linear-gradient(90deg,#34D399,#6EE7B7)"></span></div></div>
      </div>
    </div>
  </main>
</div>
${phone(858, 6, 0.86, '#0B1020', financeScreen, 'rgba(255,255,255,.7)')}`
}

// ---------------------------------------------------------------------------
// Rules engine & claims: a claim checked against the rule set, plus one rule.

const CLAIM_RULES = [
  ['ok', 'Vertrag aktiv zum Schadendatum', 'seit 03/2021'],
  ['ok', 'Glasdeckung im Vertrag', 'Kasko inkl. Glas'],
  ['ok', 'Meldung innerhalb der Frist', 'nach 2 Tagen'],
  ['ok', 'Kosten im Richtwert', '−3 % zum Richtwert'],
  ['info', 'Selbstbehalt laut Vertrag', '150,00 € Abzug'],
  ['ok', 'Keine Vorschäden', 'letzte 36 Monate']
]

const claims = {
  glow: '#6E7BFF',
  w: 1200,
  h: 772,
  css: `
.cl{left:110px;top:0;width:1090px;height:700px;background:#F5F6FA;display:flex;color:#121826}
.cl .side{width:210px;flex:none;background:#12172A;color:#C9CEE0;padding:26px 14px;display:flex;flex-direction:column}
.cl .brand{display:flex;align-items:center;gap:12px;padding:0 8px 28px}
.cl .brand b{display:block;font-size:15px;font-weight:700;color:#fff}
.cl .brand small{display:block;font-size:11.5px;opacity:.6;margin-top:2px}
.cl nav{display:flex;flex-direction:column;gap:3px}
.cl nav a{display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;border-radius:10px;font-size:14px;font-weight:500;color:#9AA1BC}
.cl nav a em{margin-left:auto;font-style:normal;font-size:11px;font-weight:700;padding:2px 7px;border-radius:8px;background:rgba(110,123,255,.2);color:#B7BEFF}
.cl nav a.on{background:rgba(110,123,255,.16);color:#fff;box-shadow:inset 0 0 0 1px rgba(110,123,255,.32)}
.cl nav a.on .i{color:#8F99FF}
.cl .main{flex:1;min-width:0;padding:22px 28px}
.cl .crumb{justify-content:space-between;font-size:13px;color:#6B7280}
.cl .crumb b{color:#121826}
.cl .ib{width:36px;height:36px;border-radius:10px;background:#fff;display:grid;place-items:center;color:#6B7280;box-shadow:0 0 0 1px #E6E8EF}
.cl .head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:20px}
.cl h1{font-size:25px;font-weight:700;letter-spacing:-.02em}
.cl .meta{display:flex;align-items:center;gap:10px;margin-top:7px;font-size:13px;color:#6B7280}
.cl .tag{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 9px;border-radius:12px;font-size:11.5px;font-weight:600}
.cl .gb,.cl .pb{height:40px;padding:0 16px;border-radius:11px;display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600}
.cl .gb{background:#fff;color:#374151;box-shadow:0 0 0 1px #E1E4EC}
.cl .pb{background:#5B67F1;color:#fff;box-shadow:0 10px 22px -10px rgba(91,103,241,.8)}
.cl .cols{display:grid;grid-template-columns:1fr 1.08fr;gap:18px;margin-top:22px}
.cl .card{background:#fff;border-radius:16px;box-shadow:0 0 0 1px #E6E8EF,0 1px 2px rgba(18,24,38,.04);padding:18px 20px}
.cl .card h3{display:flex;align-items:center;gap:9px;font-size:14.5px;font-weight:700}
.cl .card h3 .i{color:#5B67F1}
.cl .card h3 span{margin-left:auto}
.cl .kv{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px;margin-top:16px}
.cl .kv small{display:block;font-size:11.5px;color:#8A90A2;font-weight:500}
.cl .kv b{display:block;font-size:13.5px;margin-top:3px}
.cl .docs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
.cl .doc{height:96px;border-radius:12px;display:flex;flex-direction:column;justify-content:flex-end;padding:9px 10px;font-size:11.5px;font-weight:600;position:relative;overflow:hidden}
.cl .doc .i{position:absolute;top:12px;left:10px}
.cl .rules{margin-top:12px}
.cl .rule{display:flex;align-items:center;gap:11px;height:44px}
.cl .rule+.rule{border-top:1px solid #F0F1F5}
.cl .rule .s{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex:none}
.cl .rule b{font-size:13.5px;font-weight:500}
.cl .rule em{margin-left:auto;font-style:normal;font-size:12px;color:#6B7280}
.cl .rec{margin-top:14px;padding:14px 16px;border-radius:14px;background:linear-gradient(135deg,#EEF9F1,#E6F6EC);box-shadow:inset 0 0 0 1px #C7EBD3;display:flex;align-items:center;gap:14px}
.cl .rec small{display:block;font-size:11.5px;color:#4B7A5C}
.cl .rec b{display:block;font-size:14.5px;font-weight:700;color:#14532D}
.cl .rec .amt{margin-left:auto;text-align:right}
.cl .rec .amt b{font-size:21px;letter-spacing:-.02em}
.rl{left:0;top:432px;width:420px;background:#fff;color:#121826;padding:20px 22px}
.rl .h{display:flex;align-items:center;gap:12px}
.rl .h small{display:block;font-size:11px;color:#8A90A2;font-weight:600;letter-spacing:.02em}
.rl .h b{display:block;font-size:15px;font-weight:700;margin-top:1px}
.rl .tg{margin-left:auto;width:42px;height:24px;border-radius:12px;background:#5B67F1;position:relative}
.rl .tg::after{content:'';position:absolute;top:3px;right:3px;width:18px;height:18px;border-radius:50%;background:#fff}
.rl .conds{margin-top:16px;display:flex;flex-direction:column;gap:9px}
.rl .c{display:flex;align-items:center;gap:7px;font-size:12.5px}
.rl .k{width:46px;flex:none;font-size:10.5px;font-weight:800;letter-spacing:.06em;color:#8A90A2}
.rl .f,.rl .v,.rl .a{height:28px;padding:0 10px;border-radius:8px;display:inline-flex;align-items:center;font-weight:600}
.rl .f{background:#F1F2F7;color:#374151}
.rl .o{color:#6B7280;font-weight:500;padding:0 2px}
.rl .v{background:#EEF0FF;color:#4049C9}
.rl .a{background:#E6F6EC;color:#166534;gap:6px}
.rl .ft{display:flex;align-items:center;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid #F0F1F5;font-size:12px;color:#6B7280}`,
  html: `
<div class="win cl">
  <aside class="side">
    <div class="brand"><span class="logo" style="background:linear-gradient(135deg,#8F99FF,#5B67F1);color:#fff">${icon('shield-check', 20)}</span><div><b>Schadenservice</b><small>Sachbearbeitung</small></div></div>
    <nav>
      <a>${icon('inbox', 18)}Eingang<em>12</em></a>
      <a class="on">${icon('folder-open', 18)}Schadenfälle</a>
      <a>${icon('workflow', 18)}Regelwerk</a>
      <a>${icon('chart-column', 18)}Auswertungen</a>
      <a>${icon('settings', 18)}Einstellungen</a>
    </nav>
  </aside>
  <main class="main">
    <div class="crumb row"><span>Schadenfälle &nbsp;›&nbsp; <b>SF-25-08412</b></span><span class="row" style="gap:8px"><span class="ib">${icon('search', 17)}</span><span class="ib">${icon('bell', 17)}</span><span class="av" style="width:36px;height:36px;background:#E0E3FF;color:#4049C9;font-size:12px">SB</span></span></div>
    <div class="head">
      <div>
        <h1>Glasbruch Windschutzscheibe</h1>
        <div class="meta"><span class="mono" style="font-size:12px">SF-25-08412</span>·<span>Kfz-Kasko</span>·<span>gemeldet am 14.10.</span><span class="tag" style="background:#EEF0FF;color:#4049C9">${icon('sparkles', 12)}automatisch geprüft</span></div>
      </div>
      <div class="row" style="gap:10px"><a class="gb">${icon('user-search', 16)}Manuell prüfen</a><a class="pb">${icon('check', 16)}Freigeben</a></div>
    </div>
    <div class="cols">
      <div style="display:flex;flex-direction:column;gap:18px">
        <div class="card">
          <h3>${icon('file-text', 17)}Schadendaten</h3>
          <div class="kv">
            <div><small>Versicherungsnehmer</small><b>Max Mustermann</b></div>
            <div><small>Polizze</small><b class="mono" style="font-size:12.5px">KFZ-4471-220</b></div>
            <div><small>Schadenart</small><b>Glasbruch</b></div>
            <div><small>Schadendatum</small><b>12.10.</b></div>
            <div><small>Werkstatt</small><b>Partnerwerkstatt</b></div>
            <div><small>Gemeldete Kosten</small><b class="tnum">1.240,00 €</b></div>
          </div>
        </div>
        <div class="card">
          <h3>${icon('paperclip', 17)}Dokumente<span class="tag" style="background:#F1F2F7;color:#6B7280">3</span></h3>
          <div class="docs">
            <div class="doc" style="background:linear-gradient(160deg,#C7D7F5,#8EA6D9);color:#fff">${icon('image', 18)}Foto_1.jpg</div>
            <div class="doc" style="background:linear-gradient(160deg,#B9C9E6,#7F93BF);color:#fff">${icon('image', 18)}Foto_2.jpg</div>
            <div class="doc" style="background:#F5F6FA;color:#374151;box-shadow:inset 0 0 0 1px #E6E8EF">${icon('file-text', 18, 'color:#EF4444')}Rechnung.pdf</div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>${icon('workflow', 17)}Regelwerk-Prüfung<span class="tag" style="background:#F1F2F7;color:#6B7280">Kfz-Kasko · v4.2</span></h3>
        <div class="rules">
          ${CLAIM_RULES.map(([s, t, d]) => `<div class="rule"><span class="s" style="${s === 'ok' ? 'background:#DCFCE7;color:#16A34A' : 'background:#FEF3C7;color:#D97706'}">${icon(s === 'ok' ? 'check' : 'info', 14)}</span><b>${t}</b><em>${d}</em></div>`).join('')}
        </div>
        <div class="rec">
          <span class="logo" style="width:40px;height:40px;background:#fff;color:#16A34A;box-shadow:0 0 0 1px #C7EBD3">${icon('badge-check', 20)}</span>
          <div><small>Empfehlung · Regel R-112</small><b>Automatisch freigeben</b></div>
          <div class="amt"><small>Auszahlung</small><b class="tnum">1.090,00 €</b></div>
        </div>
      </div>
    </div>
  </main>
</div>
<div class="float rl">
  <div class="h"><span class="logo" style="background:#EEF0FF;color:#5B67F1">${icon('workflow', 19)}</span><div><small class="mono">REGEL R-112</small><b>Glasschaden bis 1.500 €</b></div><span class="tg"></span></div>
  <div class="conds">
    <div class="c"><span class="k">WENN</span><span class="f">Schadenart</span><span class="o">ist</span><span class="v">Glasbruch</span></div>
    <div class="c"><span class="k">UND</span><span class="f">Schadenhöhe</span><span class="o">≤</span><span class="v">1.500,00 €</span></div>
    <div class="c"><span class="k">UND</span><span class="f">Deckung</span><span class="o">enthält</span><span class="v">Glas</span></div>
    <div class="c"><span class="k">DANN</span><span class="a">${icon('circle-check', 14)}Automatisch freigeben</span></div>
    <div class="c"><span class="k"></span><span class="a">${icon('circle-minus', 14)}Selbstbehalt abziehen</span></div>
  </div>
  <div class="ft">${icon('layers', 14)}Gilt für Kfz-Kasko und Kfz-Teilkasko</div>
</div>`
}

// ---------------------------------------------------------------------------
// Security backend: microservices on Kubernetes, plus the terminal.

const SERVICES = [
  ['auth-service', 'Kotlin', 3, 1.1],
  ['device-service', 'Kotlin', 4, 2.3],
  ['policy-service', 'Java', 2, 0.6],
  ['risk-engine', 'Kotlin', 3, 3.4],
  ['report-service', 'Java', 2, 4.8]
]
const LANG = { Kotlin: 'background:rgba(167,139,250,.16);color:#C4B5FD', Java: 'background:rgba(251,146,60,.15);color:#FDBA74' }
const svcX = i => 40 + i * 188

const security = {
  glow: '#F0506E',
  w: 1240,
  h: 780,
  css: `
.sw{left:0;top:0;width:1000px;height:620px;background:#0C1018;color:#E6E9F0}
.sw .bar{height:58px;display:flex;align-items:center;gap:14px;padding:0 20px;background:#0F141E;border-bottom:1px solid rgba(255,255,255,.06)}
.sw .bar b{display:block;font-size:14.5px;font-weight:700}
.sw .bar small{display:block;font-size:11.5px;color:#8891A5}
.sw .tabs{display:flex;gap:4px;margin-left:26px}
.sw .tabs a{height:32px;padding:0 12px;border-radius:9px;display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:#8891A5}
.sw .tabs a.on{background:rgba(255,255,255,.07);color:#fff}
.sw .ok{margin-left:auto;display:flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:15px;background:rgba(52,211,153,.12);color:#6EE7B7;font-size:12px;font-weight:600}
.sw .ok i{width:7px;height:7px;border-radius:50%;background:#34D399;box-shadow:0 0 0 3px rgba(52,211,153,.2)}
.sw .canvas{position:absolute;top:58px;left:0;right:0;bottom:0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:22px 22px}
.sw svg.links{position:absolute;inset:0}
.sw .node{position:absolute;border-radius:14px;background:#131926;box-shadow:inset 0 0 0 1px rgba(255,255,255,.09),0 14px 30px -14px rgba(0,0,0,.7);padding:13px 14px}
.sw .node .n{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}
.sw .node .n i{width:8px;height:8px;border-radius:50%;background:#34D399;flex:none}
.sw .node .s{font-size:11.5px;color:#8891A5;margin-top:5px}
.sw .tags{display:flex;gap:5px;margin-top:9px}
.sw .tg{height:20px;padding:0 7px;border-radius:6px;display:inline-flex;align-items:center;font-size:10.5px;font-weight:600;background:rgba(255,255,255,.06);color:#AEB5C6}
.sw .ft{display:flex;align-items:flex-end;justify-content:space-between;margin-top:11px}
.sw .pods{display:flex;align-items:center;gap:3px;font-size:11px;color:#8891A5}
.sw .pods u{width:7px;height:7px;border-radius:2px;background:#34D399}
.sw .pods span{margin-left:5px}
.sw .gw{box-shadow:inset 0 0 0 1px rgba(240,80,110,.45),0 0 0 4px rgba(240,80,110,.08),0 14px 30px -14px rgba(0,0,0,.7)}
.sw .legacy{background:transparent;box-shadow:none;border:1.5px dashed rgba(255,255,255,.18);color:#8891A5}
.sw .legacy .n{color:#AEB5C6}
.sw .legacy .n i{background:#6B7280}
.sw .deps{position:absolute;left:40px;top:340px;width:520px;border-radius:14px;background:#111722;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);padding:14px 16px}
.sw .deps h4{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700}
.sw .deps h4 span{margin-left:auto;font-size:11.5px;color:#8891A5;font-weight:500}
.sw .dep{display:flex;align-items:center;gap:10px;height:36px;font-size:12.5px}
.sw .dep+.dep{border-top:1px solid rgba(255,255,255,.05)}
.sw .dep .c{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:rgba(52,211,153,.14);color:#6EE7B7;flex:none}
.sw .dep .v{height:20px;padding:0 7px;border-radius:6px;display:inline-flex;align-items:center;font-size:11px;background:rgba(240,80,110,.12);color:#FDA4B4}
.sw .dep em{margin-left:auto;font-style:normal;font-size:11.5px;color:#8891A5}
.term{left:590px;top:400px;width:650px;height:380px;background:#0A0D13;color:#C9D1E0;overflow:hidden}
.term .tb{height:40px;display:flex;align-items:center;gap:8px;padding:0 16px;background:#11151D;border-bottom:1px solid rgba(255,255,255,.06);font-size:12px;color:#7D869A}
.term .tb i{width:12px;height:12px;border-radius:50%}
.term .tb span{margin-left:auto;margin-right:auto;transform:translateX(-26px)}
.term pre{padding:16px 20px;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.72;white-space:pre}
.term .p{color:#F0506E}
.term .g{color:#6EE7B7}
.term .m{color:#6B7488}
.term .w{color:#fff}
.term .cur{display:inline-block;width:8px;height:15px;background:#F0506E;vertical-align:-2px}`,
  html: `
<div class="win sw">
  <div class="bar">
    <span class="logo" style="width:36px;height:36px;background:linear-gradient(135deg,#FF7A93,#E03358);color:#fff">${icon('shield-check', 19)}</span>
    <div><b>Plattform-Backend</b><small>Cluster prod · Namespace platform</small></div>
    <div class="tabs"><a class="on">${icon('git-branch', 15)}Topologie</a><a>${icon('rocket', 15)}Deployments</a><a>${icon('scroll-text', 15)}Logs</a><a>${icon('activity', 15)}Metriken</a></div>
    <span class="ok"><i></i>Alle Services gesund</span>
  </div>
  <div class="canvas">
    <svg class="links" width="1000" height="562" viewBox="0 0 1000 562">
      <path d="M262 74 L398 74" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/>
      <circle cx="330" cy="74" r="3.5" fill="#F0506E"/>
      <path d="M602 74 L758 74" stroke="rgba(255,255,255,.16)" stroke-width="1.5" stroke-dasharray="5 5"/>
      ${SERVICES.map((_, i) => {
        const x = svcX(i) + 84
        return `<path d="M500 116 C500 154 ${x} 148 ${x} 188" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/>`
      }).join('')}
      <circle cx="500" cy="140" r="3.5" fill="#F0506E"/>
      <circle cx="300" cy="158" r="3" fill="#F0506E" opacity=".7"/>
      <circle cx="760" cy="164" r="3" fill="#F0506E" opacity=".7"/>
    </svg>
    <div class="node" style="left:40px;top:38px;width:222px">
      <div class="n">${icon('smartphone', 15, 'color:#8891A5')}Clients</div><div class="s">iOS · Android · Web-Konsole</div>
    </div>
    <div class="node gw" style="left:398px;top:32px;width:204px">
      <div class="n"><i></i><span class="mono">api-gateway</span></div>
      <div class="tags"><span class="tg">Spring Boot</span><span class="tg">Docker</span></div>
      <div class="ft"><span class="pods"><u></u><u></u><u></u><span>3/3 Pods</span></span></div>
    </div>
    <div class="node legacy" style="left:758px;top:38px;width:202px">
      <div class="n"><i></i><span class="mono">legacy-core</span></div><div class="s">wird schrittweise abgelöst</div>
    </div>
    ${SERVICES.map(([name, lang, pods, seed], i) => {
      const s = curve(wave(14, seed, 0.15, 0.6), 64, 22, 2)
      return `<div class="node" style="left:${svcX(i)}px;top:188px;width:168px">
        <div class="n"><i></i><span class="mono">${name}</span></div>
        <div class="tags"><span class="tg" style="${LANG[lang]}">${lang}</span><span class="tg">Spring Boot</span></div>
        <div class="ft"><span class="pods">${'<u></u>'.repeat(pods)}<span>${pods}/${pods}</span></span><svg width="64" height="22" viewBox="0 0 64 22"><path d="${s.d}" fill="none" stroke="#F0506E" stroke-width="1.6" stroke-linecap="round" opacity=".85"/></svg></div>
      </div>`
    }).join('')}
    <div class="deps">
      <h4>${icon('rocket', 15, 'color:#F0506E')}Letzte Rollouts<span>Kubernetes · Rolling Update</span></h4>
      <div class="dep"><span class="c">${icon('check', 12)}</span><span class="mono">risk-engine</span><span class="v mono">v2.4.0</span><em>vor 42 Sek.</em></div>
      <div class="dep"><span class="c">${icon('check', 12)}</span><span class="mono">device-service</span><span class="v mono">v2.3.2</span><em>vor 3 Tagen</em></div>
      <div class="dep"><span class="c">${icon('check', 12)}</span><span class="mono">report-service</span><span class="v mono">v2.3.4</span><em>vor 6 Tagen</em></div>
      <div class="dep"><span class="c">${icon('check', 12)}</span><span class="mono">auth-service</span><span class="v mono">v2.3.0</span><em>vor 14 Tagen</em></div>
    </div>
  </div>
</div>
<div class="float term">
  <div class="tb"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i><span>platform — zsh</span></div>
<pre><span class="p">❯</span> <span class="w">./gradlew :risk-engine:bootBuildImage</span>
<span class="g">BUILD SUCCESSFUL</span> <span class="m">in 41s</span>
<span class="p">❯</span> <span class="w">kubectl rollout status deploy/risk-engine</span>
deployment "risk-engine" <span class="g">successfully rolled out</span>
<span class="p">❯</span> <span class="w">kubectl get pods</span>
<span class="m">NAME                            READY   STATUS    AGE</span>
api-gateway-7d9f6c8b5-x2kqp     1/1     <span class="g">Running</span>   14d
auth-service-5c7b9d4f6-m8wzr    1/1     <span class="g">Running</span>   14d
device-service-6f8d7c9b4-q4lts  1/1     <span class="g">Running</span>   3d
risk-engine-84b6f7d9c-7hn2v     1/1     <span class="g">Running</span>   42s
report-service-79c5d8f6b-kp9xd  1/1     <span class="g">Running</span>   6d
<span class="p">❯</span> <span class="cur"></span></pre>
</div>`
}

// ---------------------------------------------------------------------------
// CRM for a bank: one customer, their products and contact history.

const crm = {
  glow: '#38BDF8',
  w: 1200,
  h: 688,
  css: `
.cr{left:0;top:0;width:1060px;height:600px;background:#F6F8FB;display:flex;color:#0F172A}
.cr .side{width:210px;flex:none;background:#fff;border-right:1px solid #E8EDF3;padding:26px 14px 16px;display:flex;flex-direction:column}
.cr .brand{display:flex;align-items:center;gap:12px;padding:0 8px 28px}
.cr .brand b{display:block;font-size:15px;font-weight:700}
.cr .brand small{display:block;font-size:11.5px;color:#64748B;margin-top:2px}
.cr nav{display:flex;flex-direction:column;gap:3px}
.cr nav a{display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;border-radius:10px;font-size:14px;font-weight:500;color:#64748B}
.cr nav a em{margin-left:auto;font-style:normal;font-size:11px;font-weight:700;padding:2px 7px;border-radius:8px;background:#E0F2FE;color:#0369A1}
.cr nav a.on{background:#E8F6FE;color:#0C4A6E;box-shadow:inset 0 0 0 1px #BAE6FD}
.cr nav a.on .i{color:#0284C7}
.cr .me{margin-top:auto;display:flex;gap:10px;align-items:center;padding:12px;border-radius:12px;background:#F6F8FB}
.cr .me b{display:block;font-size:13px}
.cr .me small{display:block;font-size:11.5px;color:#64748B}
.cr .main{flex:1;min-width:0;padding:22px 28px}
.cr .top{justify-content:space-between}
.cr .search{width:420px;height:40px;border-radius:11px;background:#fff;box-shadow:0 0 0 1px #E2E8F0;display:flex;align-items:center;gap:10px;padding:0 12px;font-size:13.5px;color:#94A3B8}
.cr .search kbd{margin-left:auto;font-family:Inter;font-size:11px;padding:2px 6px;border-radius:6px;background:#F1F5F9;color:#64748B}
.cr .ib{width:38px;height:38px;border-radius:11px;background:#fff;display:grid;place-items:center;color:#64748B;box-shadow:0 0 0 1px #E2E8F0}
.cr .card{background:#fff;border-radius:16px;box-shadow:0 0 0 1px #E6EBF2,0 1px 2px rgba(15,23,42,.04)}
.cr .cust{margin-top:20px;padding:20px 22px;display:flex;align-items:center;gap:18px}
.cr .cust h1{font-size:23px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px}
.cr .tag{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 9px;border-radius:12px;font-size:11.5px;font-weight:600}
.cr .cust p{font-size:13px;color:#64748B;margin-top:6px}
.cr .gb,.cr .pb{height:40px;padding:0 15px;border-radius:11px;display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600}
.cr .gb{background:#fff;color:#334155;box-shadow:0 0 0 1px #E2E8F0;padding:0 11px}
.cr .pb{background:#0284C7;color:#fff;box-shadow:0 10px 22px -10px rgba(2,132,199,.8)}
.cr .tabs{display:flex;gap:22px;margin-top:18px;border-bottom:1px solid #E2E8F0;font-size:13.5px;font-weight:600;color:#64748B}
.cr .tabs a{padding-bottom:11px}
.cr .tabs a.on{color:#0C4A6E;box-shadow:inset 0 -2px #0284C7}
.cr .cols{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
.cr .card h3{display:flex;align-items:center;justify-content:space-between;font-size:14.5px;font-weight:700;padding:16px 18px 6px}
.cr .card h3 span{font-size:12.5px;color:#0284C7;font-weight:600}
.cr .pr{display:flex;align-items:center;gap:12px;height:58px;padding:0 18px}
.cr .pr+.pr{border-top:1px solid #F1F5F9}
.cr .pi{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;flex:none}
.cr .pr b{display:block;font-size:13.5px}
.cr .pr small{display:block;font-size:11.5px;color:#64748B;margin-top:1px}
.cr .pr .amt{margin-left:auto;font-size:14px;font-weight:700}
.cr .tl{padding:6px 18px 12px}
.cr .ev{position:relative;display:flex;gap:12px;padding:9px 0}
.cr .ev .d{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;flex:none;position:relative;z-index:1}
.cr .ev:not(:last-child)::before{content:'';position:absolute;left:14.5px;top:40px;bottom:-8px;width:1px;background:#E2E8F0}
.cr .ev b{display:block;font-size:13.5px}
.cr .ev small{display:block;font-size:11.5px;color:#64748B;margin-top:2px}
.cr .ev em{margin-left:auto;font-style:normal;font-size:11.5px;color:#94A3B8;white-space:nowrap}
.fu{left:760px;top:410px;width:440px;background:#fff;color:#0F172A;padding:20px 22px}
.fu .h{display:flex;align-items:center;gap:12px}
.fu .h b{display:block;font-size:15px;font-weight:700}
.fu .h small{display:block;font-size:12px;color:#B45309;font-weight:600;margin-top:1px}
.fu p{font-size:13.5px;line-height:1.5;color:#334155;margin:14px 0 16px}
.fu .who{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:#F6F8FB;font-size:13px}
.fu .who small{display:block;font-size:11.5px;color:#64748B}
.fu .acts{display:flex;gap:8px;margin-top:14px}
.fu .acts a{flex:1;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:600}`,
  html: `
<div class="win cr">
  <aside class="side">
    <div class="brand"><span class="logo" style="background:linear-gradient(135deg,#38BDF8,#0284C7);color:#fff">${icon('contact', 20)}</span><div><b>Kundenmanagement</b><small>Privatkunden</small></div></div>
    <nav>
      <a>${icon('layout-dashboard', 18)}Übersicht</a>
      <a class="on">${icon('users', 18)}Kunden</a>
      <a>${icon('calendar', 18)}Termine</a>
      <a>${icon('list-checks', 18)}Aufgaben<em>4</em></a>
      <a>${icon('landmark', 18)}Produkte</a>
      <a>${icon('chart-column', 18)}Berichte</a>
    </nav>
    <div class="me"><span class="av" style="width:34px;height:34px;background:#E0F2FE;color:#0369A1;font-size:12px">TG</span><div><b>T. Gruber</b><small>Kundenberater</small></div></div>
  </aside>
  <main class="main">
    <div class="top row">
      <div class="search">${icon('search', 17)}Kunden, Konten oder Dokumente suchen …<kbd>⌘ K</kbd></div>
      <div class="row" style="gap:8px"><span class="ib">${icon('bell', 17)}</span><span class="ib">${icon('settings', 17)}</span></div>
    </div>
    <div class="card cust">
      <span class="av" style="width:60px;height:60px;background:linear-gradient(135deg,#7DD3FC,#0284C7);color:#fff;font-size:20px">MH</span>
      <div class="grow">
        <h1>Maria Huber <span class="tag" style="background:#E0F2FE;color:#0369A1">Privatkundin</span><span class="tag" style="background:#F1F5F9;color:#475569">Wohnbaukredit</span></h1>
        <p><span class="mono" style="font-size:12px">KD-100482731</span> · Kundin seit 2009 · Betreuer T. Gruber</p>
      </div>
      <div class="row" style="gap:8px"><a class="gb">${icon('phone', 17)}</a><a class="gb">${icon('mail', 17)}</a><a class="pb">${icon('calendar-plus', 16)}Termin anlegen</a></div>
    </div>
    <div class="tabs"><a class="on">Übersicht</a><a>Produkte</a><a>Kontakthistorie</a><a>Dokumente</a><a>Notizen</a></div>
    <div class="cols">
      <div class="card">
        <h3>Produkte <span>4 aktiv</span></h3>
        <div class="pr"><span class="pi" style="background:#E0F2FE;color:#0284C7">${icon('credit-card', 18)}</span><div><b>Girokonto</b><small class="mono">AT•• •••• 4821</small></div><span class="amt tnum">3.214,50 €</span></div>
        <div class="pr"><span class="pi" style="background:#DCFCE7;color:#16A34A">${icon('piggy-bank', 18)}</span><div><b>Sparkonto</b><small>Online-Sparen</small></div><span class="amt tnum">18.900,00 €</span></div>
        <div class="pr"><span class="pi" style="background:#FEF3C7;color:#D97706">${icon('house', 18)}</span><div><b>Wohnkredit</b><small>Fixzins · 25 Jahre</small></div><span class="amt tnum" style="color:#B91C1C">−142.300,00 €</span></div>
        <div class="pr"><span class="pi" style="background:#EDE9FE;color:#7C3AED">${icon('shield', 18)}</span><div><b>Bausparvertrag</b><small>Laufzeit 6 Jahre</small></div><span class="amt tnum">9.640,00 €</span></div>
      </div>
      <div class="card">
        <h3>Kontakthistorie <span>Alle</span></h3>
        <div class="tl">
          <div class="ev"><span class="d" style="background:#E0F2FE;color:#0284C7">${icon('users', 15)}</span><div><b>Beratungsgespräch</b><small>Anschlussfinanzierung · Filiale</small></div><em>12. Sep</em></div>
          <div class="ev"><span class="d" style="background:#DCFCE7;color:#16A34A">${icon('phone', 15)}</span><div><b>Anruf</b><small>Rückfrage zum Fixzins</small></div><em>3. Sep</em></div>
          <div class="ev"><span class="d" style="background:#FEF3C7;color:#D97706">${icon('mail', 15)}</span><div><b>E-Mail</b><small>Unterlagen erhalten</small></div><em>28. Aug</em></div>
          <div class="ev"><span class="d" style="background:#F1F5F9;color:#475569">${icon('pencil', 15)}</span><div><b>Notiz</b><small>Interesse an Bausparen</small></div><em>15. Aug</em></div>
        </div>
      </div>
    </div>
  </main>
</div>
<div class="float fu">
  <div class="h"><span class="logo" style="background:#FEF3C7;color:#D97706">${icon('bell-ring', 19)}</span><div><b>Wiedervorlage</b><small>fällig in 14 Tagen</small></div>${icon('ellipsis', 18, 'margin-left:auto;color:#94A3B8')}</div>
  <p>Die Fixzinsbindung des Wohnkredits endet bald – Anschlussangebot vorbereiten und Termin vereinbaren.</p>
  <div class="who"><span class="av" style="width:32px;height:32px;background:linear-gradient(135deg,#7DD3FC,#0284C7);color:#fff;font-size:11px">MH</span><div><b>Maria Huber</b><small>Wohnkredit · −142.300,00 €</small></div></div>
  <div class="acts"><a style="background:#F1F5F9;color:#334155">Später</a><a style="background:#0284C7;color:#fff">${icon('calendar-plus', 15)}Termin vorschlagen</a></div>
</div>`
}

// ---------------------------------------------------------------------------
// Internal time tracking: the week, and the running timer.

const KIND = {
  meet: ['#FEF3C7', '#F59E0B', '#92400E'],
  dev: ['#DBEAFE', '#3B82F6', '#1E3A8A'],
  review: ['#EDE9FE', '#8B5CF6', '#4C1D95'],
  release: ['#CCFBF1', '#14B8A6', '#134E4A'],
  work: ['#FCE7F3', '#EC4899', '#831843']
}
const WEEK = [
  ['Mo', 6, [[8, 9, 'Daily & Planung', 'meet'], [9, 12, 'Kundenportal', 'dev'], [12.5, 15.5, 'Kundenportal', 'dev'], [15.5, 17, 'Code Review', 'review']]],
  ['Di', 7, [[8.25, 9, 'Daily', 'meet'], [9, 11.5, 'Release 3.2', 'release'], [12, 16.5, 'Kundenportal', 'dev']]],
  ['Mi', 8, [[8, 8.5, 'Daily', 'meet'], [8.5, 12, 'Workshop Anforderungen', 'work'], [13, 16, 'Kundenportal', 'dev']]],
  ['Do', 9, [[8, 8.75, 'Daily', 'meet'], [8.75, 12.25, 'Kundenportal', 'dev'], [13, 14, 'Sprint Review', 'review'], [14, 17, 'Kundenportal', 'dev']]],
  ['Fr', 10, [[8.2, 9, 'Daily', 'meet'], [9, 12, 'Kundenportal', 'dev'], [12.5, 14, 'Kundenportal', 'dev']]]
]
const HOUR = 42
const fmtH = h => `${Math.floor(h)}:${pad2(Math.round((h % 1) * 60))}`
const dayTotal = entries => entries.reduce((s, [a, b]) => s + b - a, 0)

const time = {
  glow: '#F5A524',
  w: 1200,
  h: 730,
  css: `
.tw{left:160px;top:30px;width:1040px;height:700px;background:#F8F7F4;display:flex;color:#1C1917}
.tw .side{width:200px;flex:none;background:#fff;border-right:1px solid #EEEBE6;padding:26px 14px;display:flex;flex-direction:column}
.tw .brand{display:flex;align-items:center;gap:12px;padding:0 8px 28px}
.tw .brand b{display:block;font-size:15px;font-weight:700}
.tw .brand small{display:block;font-size:11.5px;color:#78716C;margin-top:2px}
.tw nav{display:flex;flex-direction:column;gap:3px}
.tw nav a{display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;border-radius:10px;font-size:14px;font-weight:500;color:#78716C}
.tw nav a.on{background:#FEF3C7;color:#78350F;box-shadow:inset 0 0 0 1px #FDE68A}
.tw nav a.on .i{color:#D97706}
.tw .main{flex:1;min-width:0;padding:24px 26px}
.tw .top{justify-content:space-between}
.tw h1{font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:12px}
.tw h1 span{font-size:14px;font-weight:500;color:#78716C}
.tw .nb{width:32px;height:32px;border-radius:9px;background:#fff;display:grid;place-items:center;color:#57534E;box-shadow:0 0 0 1px #E7E5E4}
.tw .seg{display:flex;padding:3px;border-radius:10px;background:#EFEDE9}
.tw .seg a{height:30px;padding:0 13px;border-radius:8px;display:grid;place-items:center;font-size:12.5px;font-weight:600;color:#78716C}
.tw .seg a.on{background:#fff;color:#1C1917;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.tw .pb{height:36px;padding:0 14px;border-radius:10px;background:#1C1917;color:#fff;display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600}
.tw .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:20px}
.tw .kpi{background:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 0 0 1px #ECE9E4}
.tw .kpi small{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#78716C;font-weight:500}
.tw .kpi b{display:block;font-size:22px;font-weight:700;letter-spacing:-.02em;margin-top:8px}
.tw .kpi b span{font-size:13px;color:#A8A29E;font-weight:600}
.tw .kpi .bar{height:5px;border-radius:3px;background:#F1EFEC;margin-top:9px;overflow:hidden}
.tw .kpi .bar span{display:block;height:100%;border-radius:3px;background:#F59E0B}
.tw .cal{margin-top:16px;background:#fff;border-radius:16px;box-shadow:0 0 0 1px #ECE9E4;padding:12px 16px 16px}
.tw .days{display:grid;grid-template-columns:46px repeat(5,1fr);height:44px;align-items:center}
.tw .days div{padding-left:10px;font-size:12px;color:#78716C}
.tw .days b{font-size:14px;color:#1C1917;margin-right:4px}
.tw .days div.today b{color:#B45309}
.tw .days em{font-style:normal;float:right;margin-right:10px;font-size:11.5px;color:#A8A29E}
.tw .grid{position:relative;display:grid;grid-template-columns:46px repeat(5,1fr);height:${9 * HOUR}px}
.tw .hrs{position:relative}
.tw .hrs span{position:absolute;left:0;font-size:10.5px;color:#A8A29E;transform:translateY(-6px)}
.tw .lines{position:absolute;left:46px;right:0;top:0;bottom:0;background:repeating-linear-gradient(#F1EFEC 0 1px,transparent 1px ${HOUR}px)}
.tw .day{position:relative;border-left:1px solid #F1EFEC}
.tw .day.today{background:linear-gradient(#FFFBEB,#FFFBEB) padding-box}
.tw .ev{position:absolute;left:5px;right:5px;border-radius:8px;padding:5px 8px;font-size:11.5px;font-weight:600;overflow:hidden;border-left:3px solid}
.tw .ev small{display:block;font-size:10.5px;font-weight:500;opacity:.75;margin-top:1px}
.tw .ev.run{background-image:repeating-linear-gradient(-45deg,rgba(255,255,255,.55) 0 6px,transparent 6px 12px)}
.tw .now{position:absolute;left:-4px;right:0;height:2px;background:#F59E0B}
.tw .now::before{content:'';position:absolute;left:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:#F59E0B}
.tm{left:0;top:0;width:340px;background:linear-gradient(160deg,#292524,#1C1917);color:#FAFAF9;padding:20px 22px}
.tm .h{display:flex;align-items:center;gap:9px;font-size:12.5px;color:#D6D3D1}
.tm .h i{width:8px;height:8px;border-radius:50%;background:#F59E0B;box-shadow:0 0 0 4px rgba(245,158,11,.22)}
.tm .clock{font-family:'JetBrains Mono',monospace;font-size:46px;font-weight:500;letter-spacing:-.02em;margin:10px 0 14px}
.tm .proj{display:flex;align-items:center;gap:9px;height:40px;padding:0 12px;border-radius:11px;background:rgba(255,255,255,.07);font-size:13px;font-weight:600}
.tm .proj u{width:9px;height:9px;border-radius:3px;background:#3B82F6}
.tm .proj span{color:#A8A29E;font-weight:500}
.tm .prog{margin-top:16px;font-size:12px;color:#A8A29E;display:flex;justify-content:space-between}
.tm .bar{height:6px;border-radius:3px;background:rgba(255,255,255,.1);margin-top:7px;overflow:hidden}
.tm .bar span{display:block;height:100%;width:69%;border-radius:3px;background:linear-gradient(90deg,#F59E0B,#FBBF24)}
.tm .acts{display:flex;gap:8px;margin-top:18px}
.tm .acts a{flex:1;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:13.5px;font-weight:600}`,
  html: `
<div class="win tw">
  <aside class="side">
    <div class="brand"><span class="logo" style="background:linear-gradient(135deg,#FBBF24,#F59E0B);color:#422006">${icon('clock', 20)}</span><div><b>Zeiterfassung</b><small>Intern</small></div></div>
    <nav>
      <a>${icon('sun', 18)}Heute</a>
      <a class="on">${icon('calendar-days', 18)}Woche</a>
      <a>${icon('plane', 18)}Urlaub</a>
      <a>${icon('chart-column', 18)}Berichte</a>
      <a>${icon('users', 18)}Team</a>
      <a>${icon('settings', 18)}Einstellungen</a>
    </nav>
  </aside>
  <main class="main">
    <div class="top row">
      <h1>Woche 41 <span>6.–10. Oktober</span><span class="row" style="gap:6px"><span class="nb">${icon('chevron-left', 16)}</span><span class="nb">${icon('chevron-right', 16)}</span></span></h1>
      <div class="row" style="gap:10px"><div class="seg"><a>Tag</a><a class="on">Woche</a><a>Monat</a></div><a class="pb">${icon('plus', 15)}Eintrag</a></div>
    </div>
    <div class="kpis">
      <div class="kpi"><small>Diese Woche${icon('timer', 15)}</small><b class="tnum">36,8 h <span>/ 38,5 h</span></b><div class="bar"><span style="width:96%"></span></div></div>
      <div class="kpi"><small>Zeitsaldo${icon('scale', 15)}</small><b class="tnum" style="color:#15803D">+18,5 h</b></div>
      <div class="kpi"><small>Urlaub übrig${icon('plane', 15)}</small><b class="tnum">23 <span>Tage</span></b></div>
      <div class="kpi"><small>Diesen Monat${icon('calendar-days', 15)}</small><b class="tnum">72,4 h</b></div>
    </div>
    <div class="cal">
      <div class="days"><span></span>${WEEK.map(([d, n, e]) => `<div class="${d === 'Fr' ? 'today' : ''}"><b>${d} ${n}.</b><em class="tnum">${String(Math.round(dayTotal(e) * 10) / 10).replace('.', ',')} h</em></div>`).join('')}</div>
      <div class="grid">
        <div class="hrs">${Array.from({ length: 9 }, (_, i) => `<span style="top:${i * HOUR}px">${pad2(8 + i)}:00</span>`).join('')}</div>
        <div class="lines"></div>
        ${WEEK.map(([d, , entries]) => `<div class="day${d === 'Fr' ? ' today' : ''}">${entries.map(([a, b, t, k], i) => {
          const [bg, line, fg] = KIND[k]
          const run = d === 'Fr' && i === entries.length - 1
          return `<div class="ev${run ? ' run' : ''}" style="top:${(a - 8) * HOUR + 2}px;height:${(b - a) * HOUR - 4}px;background-color:${bg};border-color:${line};color:${fg}">${t}${b - a >= 1 ? `<small>${run ? `seit ${fmtH(a)}` : `${fmtH(a)}–${fmtH(b)}`}</small>` : ''}</div>`
        }).join('')}${d === 'Fr' ? `<div class="now" style="top:${6 * HOUR}px"></div>` : ''}</div>`).join('')}
      </div>
    </div>
  </main>
</div>
<div class="float tm">
  <div class="h"><i></i>Eingestempelt seit 08:12</div>
  <div class="clock tnum">05:17:32</div>
  <div class="proj"><u></u>Kundenportal <span>· Entwicklung</span>${icon('chevron-down', 15, 'margin-left:auto;color:#A8A29E')}</div>
  <div class="prog"><span>Heute 5,3 h von 7,7 h</span><span>69 %</span></div>
  <div class="bar"><span></span></div>
  <div class="acts"><a style="background:rgba(255,255,255,.08);color:#E7E5E4">${icon('pause', 15)}Pause</a><a style="background:#F59E0B;color:#1C1917">${icon('square', 14)}Ausstempeln</a></div>
</div>`
}

// ---------------------------------------------------------------------------

function screenshot(name, width, height, html, { transparent = false, scale = 2 } = {}) {
  const file = join(tmp, `${name}.html`)
  const shot = join(tmp, `${name}.png`)
  writeFileSync(file, html)
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', `--force-device-scale-factor=${scale}`,
    `--window-size=${width},${height}`, '--virtual-time-budget=10000',
    ...(transparent ? ['--default-background-color=00000000'] : []),
    `--screenshot=${shot}`, `file://${resolve(file)}`
  ], { stdio: 'ignore' })
  return readFileSync(shot)
}

async function save(path, png, width, height) {
  const img = sharp(png).resize(width, height, { fit: 'cover', kernel: 'lanczos3' })
  const buffer = path.endsWith('.jpg')
    ? await img.flatten({ background: '#ffffff' }).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
    : await img.webp({ quality: 88, alphaQuality: 95, effort: 5 }).toBuffer()
  writeFileSync(join(OUT, path), buffer)
  console.log(`${path}  ${width}×${height}  ${Math.round(buffer.length / 1024)} KB`)
}

// The card image: 4:3 on the navy stage, rendered at 2× and scaled down.
const card = async (name, scene) => save(`${name}.webp`, screenshot(name, 1200, 900, stage(scene, 1200, 900)), 1600, 1200)

const jobs = {
  claims: () => card('claims', claims),
  finance: () => card('finance', finance),
  security: () => card('security', security),
  crm: () => card('crm', crm),
  time: () => card('time-tracking', time),
  coaster: async () => {
    sledImage = await renderSled()
    await card('coaster', coaster)
    await save('coaster-mockup.webp', screenshot('coaster-mockup', 1200, 850, stage(coaster, 1200, 850, { transparent: true, margin: 0.012 }), { transparent: true }), 1800, 1274)
    await save('screens/rodelbahn.jpg', screenshot('coaster-screen', 390, 873, doc(390, 873, '#F5F5F5', coasterScreen(), coasterScreenCss), { scale: 3 }), 1026, 2296)
  }
}

const only = process.argv.slice(2)
for (const [name, job] of Object.entries(jobs)) {
  if (!only.length || only.includes(name)) await job()
}
