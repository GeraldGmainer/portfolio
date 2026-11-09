<script setup lang="ts">
/**
 * DeskScene — a woodworker's bench at night. Phones on small wooden stands
 * stand along the bench in a counter-clockwise arc, each running one of
 * Gerald's apps, with a hand plane, a mallet, chisels and shavings around the
 * outside and a landscape phone running his Unity game lying flat past the
 * arc's right-most point.
 *
 * - Client-only (by filename). Fills its parent absolutely and never captures
 *   pointer events (pointer is read on window, hit-tested against the phones).
 * - three is imported lazily inside onMounted so it never lands in the SSR
 *   bundle or the initial chunk.
 * - World units: 1 unit = 10 cm, a phone is ~1.5 units tall, the bench top is
 *   the XZ plane.
 * - One phone is "focused" at a time: the camera glides to it (critically
 *   damped, ~1.4 s, with a small height/yaw arc from its own speed) and frames
 *   it at a fixed spot on the right of the hero via a camera view offset, so
 *   the headline column stays dark. The warm lamp and the bench's dissolve
 *   follow the focus a little more slowly. Focus cycles on a wall clock and
 *   only a click, a sideways touch swipe (left: next) or the prev/next arrows
 *   below the focus spot change it
 *   (hovering the arrows holds the cycle); hover never moves the camera
 *   (phones slide under a still pointer mid-glide, which made hover-focus
 *   flicker), it pauses the cycle, lifts that phone's screen and shows a
 *   pointer cursor. Reduced motion cuts instantly.
 * - The camera tips further over the bench for the landscape phone, which lies
 *   nearly flat.
 * - Each phone has a project card (title, one-liner, links) that rides along
 *   beside it. Mouse and touch work alike: a press on the phone in view toggles
 *   it, a press on another phone only moves the view there, a press anywhere
 *   else closes it. The cycle holds while a card is open.
 * - Pauses when offscreen or the tab is hidden; everything is disposed on
 *   unmount.
 */
import type {
  BufferGeometry,
  Group,
  IUniform,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
  Texture,
  Vector3,
  WebGLRenderer
} from 'three'
import { projectById, type Project } from '~/data/projects'

type Three = typeof import('three')
type RoundedBoxCtor = typeof import('three/addons/geometries/RoundedBoxGeometry.js').RoundedBoxGeometry
type MergeFn = typeof import('three/addons/utils/BufferGeometryUtils.js').mergeGeometries
type CreasedFn = typeof import('three/addons/utils/BufferGeometryUtils.js').toCreasedNormals

interface Screen {
  src: string
  /** Id in app/data/projects.ts, for the card. */
  project: string
  landscape?: boolean
}

interface NavAt {
  x: number
  y: number
}

interface Ui {
  setOpacity: (o: number) => void
  setNav: (at: NavAt | null) => void
  /** Opens the card for screen i; null closes it. */
  setCard: (i: number | null) => void
  /** Moves the open card beside its phone's box (host px). */
  placeCard: (box: Box, w: number, h: number) => void
  setProgress: (p: number) => void
  /** Loading is over: the first frame is up, or the scene will never show. */
  settled: () => void
  /** Resolves once the scene may draw its first frame (see the `hold` prop). */
  released: Promise<void>
}

interface Scene {
  dispose: () => void
  step: (dir: number) => void
}

/** Display crops of the repo's phone mockups (see public/images/screens). */
const SCREENS: Screen[] = [
  { src: '/images/screens/moneykoi.jpg', project: 'moneykoi' },
  { src: '/images/screens/ddrive-alcohol.jpg', project: 'd-drive' },
  { src: '/images/screens/raraya.jpg', project: 'raraya' },
  { src: '/images/screens/rodelbahn.jpg', project: 'rodelbahn' },
  { src: '/images/screens/schneepflug.jpg', project: 'snowplow' },
  { src: '/images/screens/transit.jpg', project: 'transit-driver' },
  { src: '/images/screens/tampinggame.jpg', project: 'tamping-game', landscape: true },
  { src: '/images/screens/neuracharge.jpg', project: 'neuracharge' }
]
const SCREEN_ASPECT = 513 / 1148
/**
 * Which phone holder the bench shows: 'fine' is the sculpted walnut cradle,
 * 'classic' the original three-block stand and plain wedge. Switch here to revert.
 */
const HOLDER = 'fine' as 'fine' | 'classic'
const INTERVAL = 6000
/** Prev/next: button height, and their offset below the focused phone's body (clears its stand). */
const NAV_SIZE = 44
const NAV_BELOW = HOLDER === 'fine' ? 52 : 36
/** A touch swipe steps one phone: this far sideways (px), and clearly more sideways than up or down. */
const SWIPE_MIN = 40
const SWIPE_RATIO = 1.5
/** Height of the page header on phones; the bench stays below it. */
const MOBILE_HEADER = 72
/** Load progress reported to DeskLoader: three's chunks, the built scene, screens; 1 once the shaders are compiled. */
const LOAD = { chunk: 0.09, built: 0.3, screens: 0.55 }

/** hold: everything may load, but the first frame waits until it turns false (DeskLoader finishing its trace). */
const props = defineProps<{ hold?: boolean }>()
const emit = defineEmits<{ progress: [value: number], settled: [] }>()

const released = new Promise<void>((resolve) => {
  if (!props.hold) {
    resolve()
    return
  }
  const stop = watch(() => props.hold, (held) => {
    if (held) return
    stop()
    resolve()
  })
})

/**
 * Bench-local placements [x, z, yaw°] per screen: a counter-clockwise arc in
 * cycle order, from the front left out to the right and back round to the
 * back left (evenly spaced on a half ellipse, wider in Z than X so it reads
 * round from the 45° camera).
 */
const PLACE: [number, number, number][] = [
  [0, 0, -10],
  [2.35, -2.5, 12],
  [2.45, -3.95, 4],
  [1.95, -1.25, 9],
  [1.05, -6.82, -6],
  [-0.17, -7.13, -14],
  [1.95, -5.6, 14],
  [1.1, -0.4, 4]
]
/** A flat row for tablet portrait, where the copy spans the full width and the bench lives above it. */
const PLACE_ROW: Record<number, [number, number, number]> = {
  0: [0, 0, -8],
  7: [1.15, -0.3, 8],
  3: [2.3, -0.15, -10],
  1: [3.45, -0.4, 6],
  2: [4.6, -0.15, -8],
  6: [6.05, -0.5, 12]
}
/** Focus/cycle order along the bench. */
const CYCLE = [0, 7, 3, 1, 2, 6, 4, 5]
/** Centre of the arc on the bench (XZ); on the arc the lamp's pool leans toward it. */
const RING_CENTER: [number, number] = [0.2, -3.6]

const host = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
/** Where the prev/next buttons sit (host px, top centre); null hides them. */
const nav = ref<NavAt | null>(null)
/** The screen whose project card is open; null when closed. */
const card = ref<number | null>(null)
const cardEl = ref<HTMLDivElement | null>(null)

const l = useLocalized()
const project = computed(() => (card.value === null ? undefined : projectById(SCREENS[card.value]!.project)))
const companyOf = (p: Project) => (typeof p.company === 'string' ? p.company : l(p.company))

const CARD_GAP = 16
const CARD_EDGE = 16
/** From this host width the headline sits in a left column beside the bench. */
const CARD_DESKTOP = 1024
/** Right of the phone, else left, else below; kept while it fits so the parallax doesn't flip it. */
let cardSide: 'right' | 'left' | 'below' = 'right'
let cardAt: { box: Box, w: number, h: number } | null = null

function placeCard(box: Box, w: number, h: number) {
  cardAt = { box, w, h }
  const el = cardEl.value
  if (!el) return
  const cw = el.offsetWidth
  const ch = el.offsetHeight
  const fits = {
    right: box.right + CARD_GAP + cw <= w - CARD_EDGE,
    left: box.left - CARD_GAP - cw >= CARD_EDGE,
    below: true
  }
  if (!fits[cardSide]) cardSide = fits.right ? 'right' : fits.left ? 'left' : 'below'
  const x = cardSide === 'right'
    ? box.right + CARD_GAP
    : cardSide === 'left' ? box.left - CARD_GAP - cw : (box.left + box.right - cw) / 2
  let y = cardSide === 'below' ? box.bottom + CARD_GAP : (box.top + box.bottom - ch) / 2
  if (cardSide !== 'below' && w >= CARD_DESKTOP) {
    // Desktop: level with the phone's foot; on the left, also below the intro copy it would cover.
    y = box.bottom - ch
    const lede = cardSide === 'left' ? document.querySelector<HTMLElement>('[data-desk-lede]') : null
    if (lede) y = Math.max(y, lede.offsetTop + lede.offsetHeight + CARD_GAP)
  }
  el.style.transform = `translate3d(${clamp(x, CARD_EDGE, w - cw - CARD_EDGE).toFixed(1)}px, ${clamp(y, CARD_EDGE, h - ch - CARD_EDGE).toFixed(1)}px, 0)`
}

// The scene places the card before Vue renders it; place it again at its real size.
watch(card, () => {
  if (cardAt) placeCard(cardAt.box, cardAt.w, cardAt.h)
}, { flush: 'post' })

let desk: Scene | null = null
let unmounted = false

onMounted(async () => {
  let THREE: Three
  let RoundedBox: RoundedBoxCtor
  let merge: MergeFn
  let creased: CreasedFn
  let chunks = 0
  function chunk<T>(p: Promise<T>) {
    return p.then((m) => {
      emit('progress', ++chunks * LOAD.chunk)
      return m
    })
  }
  try {
    const [three, boxAddon, utils] = await Promise.all([
      chunk(import('three')),
      chunk(import('three/addons/geometries/RoundedBoxGeometry.js')),
      chunk(import('three/addons/utils/BufferGeometryUtils.js'))
    ])
    THREE = three
    RoundedBox = boxAddon.RoundedBoxGeometry
    merge = utils.mergeGeometries
    creased = utils.toCreasedNormals
  } catch {
    emit('settled')
    return
  }
  if (unmounted || !host.value || !canvas.value) return
  const ui: Ui = {
    setOpacity: (o) => {
      if (canvas.value) canvas.value.style.opacity = o.toFixed(3)
    },
    setNav: (at) => {
      nav.value = at
    },
    setCard: (i) => {
      if (i !== card.value) cardSide = 'right'
      card.value = i
    },
    placeCard,
    setProgress: p => emit('progress', p),
    settled: () => emit('settled'),
    released
  }
  try {
    desk = createScene(THREE, RoundedBox, merge, creased, host.value, canvas.value, ui)
  } catch {
    desk = null
  }
  if (desk) emit('progress', LOAD.built)
  else emit('settled')
})

function go(dir: number) {
  desk?.step(dir)
}

onBeforeUnmount(() => {
  unmounted = true
  desk?.dispose()
  desk = null
  nav.value = null
  card.value = null
})

/* ------------------------------------------------------------------ */
/* Shaders                                                              */
/* ------------------------------------------------------------------ */

// Procedural wood, injected into MeshStandardMaterial. Object-space position
// drives the pattern so the grain follows each piece; the log axis runs along
// X, well below the surface, which gives the wide flat-sawn arches of a plank.
// The bench top adds laminated strips along Z (alternating arch direction and
// tone, a faint glue seam).
const WOOD_VERT_PARS = /* glsl */ `
varying vec3 vWoodPos;
varying vec2 vWorldXZ;
`

const WOOD_VERT_BEGIN = /* glsl */ `
#include <begin_vertex>
vWoodPos = transformed;
vWorldXZ = (modelMatrix * vec4(transformed, 1.0)).xz;
`

const WOOD_FRAG_PARS = /* glsl */ `
uniform vec3 uWoodDark;
uniform vec3 uWoodLight;
uniform float uWoodScale;
uniform float uStrip;
uniform vec2 uFadeCenter;
uniform vec2 uFadeRadii;
varying vec3 vWoodPos;
varying vec2 vWorldXZ;
float gWoodTone;
float gWoodRing;

float woodHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.11, 0.37, 0.73));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float woodNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = mix(woodHash(i), woodHash(i + vec3(1.0, 0.0, 0.0)), f.x);
  float b = mix(woodHash(i + vec3(0.0, 1.0, 0.0)), woodHash(i + vec3(1.0, 1.0, 0.0)), f.x);
  float c = mix(woodHash(i + vec3(0.0, 0.0, 1.0)), woodHash(i + vec3(1.0, 0.0, 1.0)), f.x);
  float d = mix(woodHash(i + vec3(0.0, 1.0, 1.0)), woodHash(i + vec3(1.0, 1.0, 1.0)), f.x);
  return mix(mix(a, b, f.y), mix(c, d, f.y), f.z);
}

float woodFbm(vec3 p) {
  return woodNoise(p) * 0.6 + woodNoise(p * 2.07 + 3.7) * 0.28 + woodNoise(p * 4.3 + 9.1) * 0.12;
}
`

// Fade variant (bench, vise): alpha falloff around the focused phone so the
// bench dissolves into the navy page toward the headline column and the back.
// Fragments outside the pool are discarded before any shading.
const WOOD_FRAG_FADE = /* glsl */ `
#include <clipping_planes_fragment>
vec2 woodD = vWorldXZ - uFadeCenter;
woodD.x *= woodD.x > 0.0 ? 1.1 : 1.15;
woodD.y *= woodD.y > 0.0 ? 1.0 : 0.65;
float woodFade = 1.0 - smoothstep(uFadeRadii.x, uFadeRadii.y, length(woodD));
if (woodFade < 0.004) discard;
`

const WOOD_FRAG_SOLID = /* glsl */ `
#include <clipping_planes_fragment>
float woodFade = 1.0;
`

const WOOD_FRAG_COLOR = /* glsl */ `
#include <color_fragment>
{
  vec3 p = vWoodPos * uWoodScale;
  float stripShift = 0.0;
  float stripTone = 0.0;
  float seam = 0.0;
  float flip = 1.0;
  if (uStrip > 0.0) {
    float sz = (0.75 - vWoodPos.z) / uStrip;
    float sid = floor(sz);
    float fs = fract(sz);
    float sh = woodHash(vec3(sid * 1.37 + 0.5, 2.1, 5.3));
    stripShift = sh * 7.0;
    stripTone = (sh - 0.5) * 0.16;
    flip = mod(sid, 2.0) < 1.0 ? 1.0 : -1.0;
    seam = 1.0 - smoothstep(0.0, 0.018, min(fs, 1.0 - fs) * uStrip);
  }
  // Slow wander of the ring pattern along the grain direction (X).
  float wx = woodFbm(vec3(p.x * 0.34, p.y * 0.6, p.z * 0.6) + 7.3) - 0.5;
  float wy = woodFbm(vec3(p.x * 0.23, p.y * 0.5, p.z * 0.5) + 21.9) - 0.5;
  // Growth rings: distance from a log axis running along X below the surface.
  vec2 q = vec2(p.z * flip - 0.45 + wx * 2.2 + stripShift, p.y + 2.2 + wy * 1.1);
  float r = length(q) * 30.0 + woodFbm(vec3(p.x * 0.8, p.y * 2.5, p.z * 2.5) + 3.1) * 2.2;
  float band = fract(r);
  // Earlywood -> latewood: darkening across the ring, then a crisp edge.
  float late = pow(band, 1.7) * smoothstep(0.0, 0.05, band);
  // Grain streaks stretched ~10x along X, plus fine pores.
  float grain = woodFbm(vec3(p.x * 1.3, p.y * 14.0, p.z * 14.0) + r * 0.03);
  float streak = woodNoise(vec3(p.x * 2.4, p.y * 36.0, p.z * 34.0));
  float pores = woodNoise(vec3(p.x * 5.0, p.y * 70.0, p.z * 66.0));
  // Broad tonal patches so a board is not uniform across its width.
  float blotch = woodFbm(vec3(p.x * 0.45, p.y * 1.3, p.z * 1.3) + 13.7);
  float tone = clamp(0.9 - late * 0.42 - (grain - 0.5) * 1.1 - (streak - 0.5) * 0.4 - (blotch - 0.5) * 0.5 + stripTone, 0.0, 1.0);
  vec3 col = mix(uWoodDark, uWoodLight, tone);
  col *= 0.9 + 0.16 * pores;
  col *= 1.0 - 0.25 * seam;
  diffuseColor.rgb *= col;
  diffuseColor.a *= woodFade;
  gWoodTone = tone;
  gWoodRing = late;
}
`

// Tools sit on the bench, so they dissolve with it: outside the lamp's pool
// their colour runs out into the page navy (opaque, so nothing sorts wrong),
// with the same falloff as the bench. Instancing-aware for the sawdust.
const POOL_VERT = /* glsl */ `
#include <project_vertex>
{
  vec4 poolPos = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
  poolPos = instanceMatrix * poolPos;
  #endif
  vPoolXZ = (modelMatrix * poolPos).xz;
}
`

const POOL_FRAG_PARS = /* glsl */ `
uniform vec2 uPoolCenter;
uniform vec2 uPoolRadii;
uniform vec3 uPage;
varying vec2 vPoolXZ;
`

const POOL_FRAG = /* glsl */ `
#include <fog_fragment>
{
  vec2 poolD = vPoolXZ - uPoolCenter;
  poolD.x *= poolD.x > 0.0 ? 1.1 : 1.15;
  poolD.y *= poolD.y > 0.0 ? 1.0 : 0.65;
  gl_FragColor.rgb = mix(uPage, gl_FragColor.rgb, 1.0 - smoothstep(uPoolRadii.x, uPoolRadii.y, length(poolD)));
}
`

const WOOD_FRAG_ROUGH = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = clamp(roughnessFactor * (0.84 + 0.3 * gWoodTone - 0.14 * gWoodRing), 0.05, 1.0);
`

// The display: one app screenshot, dimmed when not focused, plus a soft
// fresnel glare and one faint reflection band so it reads as glass.
const SCREEN_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vToCam;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vToCam = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const SCREEN_FRAG = /* glsl */ `
uniform sampler2D uTex;
uniform float uBright;
uniform float uGlare;
uniform float uShift;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vToCam;
void main() {
  vec3 col = texture2D(uTex, vUv).rgb * uBright;
  vec3 n = normalize(vNormalW);
  vec3 v = normalize(vToCam);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.5);
  float d = vUv.y - (1.25 - vUv.x * 0.75) + uShift;
  float band = smoothstep(0.26, 0.0, abs(d)) * (0.55 + 0.45 * smoothstep(0.0, 1.0, vUv.y));
  col += vec3(0.79, 0.85, 0.93) * uGlare * (fres * 0.35 + band * 0.045);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const DEG = Math.PI / 180

/** Small seeded PRNG (mulberry32) so the scatter of shavings is reproducible. */
function prng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hasWebGL(): boolean {
  try {
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2') || probe.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/** Critically damped spring step (Unity-style SmoothDamp). Returns the new value. */
function damp(cur: number, target: number, vel: { v: number }, smoothTime: number, dt: number): number {
  const omega = 2 / smoothTime
  const x = omega * dt
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  const change = cur - target
  const temp = (vel.v + omega * change) * dt
  vel.v = (vel.v - omega * temp) * e
  let out = target + (change + temp) * e
  if ((target - cur > 0) === (out > target)) {
    out = target
    vel.v = (out - target) / dt
  }
  return out
}

const velScratch = { v: 0 }
/** SmoothDamp for a Vector3 in place; vel carries the per-axis velocity. */
function dampV3(cur: Vector3, target: Vector3, vel: Vector3, smoothTime: number, dt: number) {
  velScratch.v = vel.x
  cur.x = damp(cur.x, target.x, velScratch, smoothTime, dt)
  vel.x = velScratch.v
  velScratch.v = vel.y
  cur.y = damp(cur.y, target.y, velScratch, smoothTime, dt)
  vel.y = velScratch.v
  velScratch.v = vel.z
  cur.z = damp(cur.z, target.z, velScratch, smoothTime, dt)
  vel.z = velScratch.v
}

type Uniforms = Record<string, IUniform>

interface Box {
  left: number
  right: number
  top: number
  bottom: number
}

function roundedRect(THREE: Three, w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

interface WoodOpts {
  dark: string
  light: string
  scale?: number
  fade?: boolean
  strip?: number
  roughness?: number
  doubleSide?: boolean
}

/* ------------------------------------------------------------------ */
/* Scene                                                                */
/* ------------------------------------------------------------------ */

interface Unit {
  group: Group
  phone: Group
  body: Mesh
  screenMat: ShaderMaterial
  landscape: boolean
  bright: number
  glare: number
  box: Box
  depth: number
  active: boolean
}

function createScene(
  THREE: Three,
  RoundedBox: RoundedBoxCtor,
  merge: MergeFn,
  creased: CreasedFn,
  hostEl: HTMLDivElement,
  canvasEl: HTMLCanvasElement,
  ui: Ui
): Scene | null {
  if (!hasWebGL()) return null

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // The hero headline, positioned from the top of the host (see index.vue).
  const headline = document.querySelector<HTMLElement>('[data-desk-floor]')

  let renderer: WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())

  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(d: T): T => {
    disposables.push(d)
    return d
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(24, 1, 0.5, 80)
  const rand = prng(20170913)

  /* ---- materials ------------------------------------------------------ */

  const fadeCenter = new THREE.Vector2(0, 0)
  const fadeRadii = new THREE.Vector2(1.0, 2.4)
  const ringCenter = new THREE.Vector2(...RING_CENTER)
  // navy-900 as sRGB: the pool mix runs after the output colour conversion.
  const pageColor = new THREE.Vector3(11 / 255, 18 / 255, 32 / 255)

  function pooled<T extends MeshStandardMaterial>(m: T): T {
    const prev = m.onBeforeCompile.bind(m)
    const prevKey = m.customProgramCacheKey.bind(m)
    m.onBeforeCompile = (shader, r) => {
      prev(shader, r)
      Object.assign(shader.uniforms, {
        uPoolCenter: { value: fadeCenter },
        uPoolRadii: { value: fadeRadii },
        uPage: { value: pageColor }
      })
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vPoolXZ;')
        .replace('#include <project_vertex>', POOL_VERT)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\n' + POOL_FRAG_PARS)
        .replace('#include <fog_fragment>', POOL_FRAG)
    }
    m.customProgramCacheKey = () => prevKey() + '-pool'
    return m
  }

  function wood(o: WoodOpts): MeshStandardMaterial {
    const fade = !!o.fade
    const u: Uniforms = {
      uWoodDark: { value: new THREE.Color(o.dark) },
      uWoodLight: { value: new THREE.Color(o.light) },
      uWoodScale: { value: o.scale ?? 1 },
      uStrip: { value: o.strip ?? 0 },
      uFadeCenter: { value: fadeCenter },
      uFadeRadii: { value: fadeRadii }
    }
    const m = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: o.roughness ?? 0.62,
      metalness: 0,
      transparent: fade,
      depthWrite: !fade,
      side: o.doubleSide ? THREE.DoubleSide : THREE.FrontSide
    })
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\n' + WOOD_VERT_PARS)
        .replace('#include <begin_vertex>', WOOD_VERT_BEGIN)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\n' + WOOD_FRAG_PARS)
        .replace('#include <clipping_planes_fragment>', fade ? WOOD_FRAG_FADE : WOOD_FRAG_SOLID)
        .replace('#include <color_fragment>', WOOD_FRAG_COLOR)
        .replace('#include <roughnessmap_fragment>', WOOD_FRAG_ROUGH)
    }
    m.customProgramCacheKey = () => `desk-wood-${fade ? 'fade' : 'solid'}-${o.doubleSide ? 'ds' : 'fs'}`
    return track(m)
  }

  const BENCH_FRONT = 0.75
  const benchMat = wood({
    dark: '#3F2C1E',
    light: '#7A5B40',
    fade: true,
    strip: 0.46,
    roughness: 0.58
  })
  const viseMat = wood({ dark: '#3A2819', light: '#6E5038', scale: 2.2, fade: true, roughness: 0.6 })
  const standMat = wood({ dark: '#2B1F16', light: '#4A3626', scale: 2.6 })
  const malletMat = pooled(wood({ dark: '#3C2819', light: '#6E4D33', scale: 3 }))
  const handleMat = pooled(wood({ dark: '#6B4A2C', light: '#B48A5C', scale: 3.2, roughness: 0.5 }))
  const rosewoodMat = pooled(wood({ dark: '#2A120A', light: '#6E301B', scale: 3.6, roughness: 0.38 }))
  const chipMat = pooled(wood({ dark: '#7A5A3C', light: '#B08B62', scale: 4 }))
  const shavingMat = pooled(wood({ dark: '#8A6B4C', light: '#D4B78F', scale: 5, doubleSide: true, roughness: 0.8 }))
  const dustMat = pooled(track(new THREE.MeshStandardMaterial({ color: 0xa98c66, roughness: 1, side: THREE.DoubleSide })))
  const paintMat = pooled(track(new THREE.MeshStandardMaterial({ color: 0xa8231b, roughness: 0.4 })))
  const graphiteMat = pooled(track(new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.5, metalness: 0.4 })))

  // Metal needs something to reflect: a small painted room (navy walls, the
  // warm lamp overhead, a dark bench below), prefiltered once. Only the tool
  // metals use it; the phones keep their look.
  const toolEnv = (() => {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 64
    const g = c.getContext('2d')
    if (!g) return null
    const room = g.createLinearGradient(0, 0, 0, 64)
    room.addColorStop(0, '#6b7590')
    room.addColorStop(0.42, '#1d263a')
    room.addColorStop(0.55, '#2a1f16')
    room.addColorStop(1, '#0e0a07')
    g.fillStyle = room
    g.fillRect(0, 0, 128, 64)
    const lamp = g.createRadialGradient(44, 8, 0, 44, 8, 30)
    lamp.addColorStop(0, 'rgba(255, 228, 186, 1)')
    lamp.addColorStop(1, 'rgba(255, 228, 186, 0)')
    g.fillStyle = lamp
    g.fillRect(0, 0, 128, 64)
    const tex = new THREE.CanvasTexture(c)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.colorSpace = THREE.SRGBColorSpace
    const pmrem = new THREE.PMREMGenerator(renderer)
    const rt = track(pmrem.fromEquirectangular(tex))
    pmrem.dispose()
    tex.dispose()
    return rt.texture
  })()
  const metal = (color: number, roughness: number, metalness = 1) => pooled(track(new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    envMap: toolEnv,
    envMapIntensity: 1
  })))
  const steelMat = metal(0xc6cbd2, 0.24)
  const groundMat = metal(0x9aa0a8, 0.42, 0.75) // machined cast iron: plane sole and sides
  const ironMat = metal(0x0d0f12, 0.3, 0.15) // japanned (black lacquered) cast iron
  const brassMat = metal(0xc99c48, 0.3)
  const nickelMat = metal(0xd2d5da, 0.38, 0.5) // satin plating: part diffuse, so it takes the lamp
  const capMat = track(new THREE.MeshStandardMaterial({ color: 0x15181f, roughness: 0.5, metalness: 0.3 }))
  const frameMat = track(new THREE.MeshStandardMaterial({ color: 0x2b3039, roughness: 0.32, metalness: 0.75 }))
  const holeMat = track(new THREE.MeshStandardMaterial({ color: 0x04060a, roughness: 0.18, metalness: 0.4 }))

  /* ---- lights: warm desk lamp upper left, cool navy fill right ------- */

  scene.add(new THREE.HemisphereLight(0x3f5478, 0x0b1220, 1.3))

  // The lamp follows the focused phone (slowly) so every phone sits in its pool.
  const key = new THREE.SpotLight(0xf5b577, 260, 0, 0.38, 1, 2)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 1.5
  key.shadow.camera.far = 14
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.01
  key.shadow.radius = 10
  key.shadow.blurSamples = 16
  key.shadow.focus = 1
  scene.add(key, key.target)

  const fill = new THREE.DirectionalLight(0x7dd3fc, 1.5)
  fill.position.set(3.4, 2.2, 1.6)
  scene.add(fill)

  // Faint spill of the focused screen onto the bench in front of it.
  const glow = new THREE.PointLight(0xd9e4f5, 0.3, 1.8, 2)
  scene.add(glow)

  /* ---- geometry helpers ----------------------------------------------- */

  const m4 = new THREE.Matrix4()
  const euler = new THREE.Euler()
  const quat = new THREE.Quaternion()
  const vec = new THREE.Vector3()
  const one = new THREE.Vector3(1, 1, 1)
  const xf = (g: BufferGeometry, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
    quat.setFromEuler(euler.set(rx, ry, rz))
    m4.compose(vec.set(x, y, z), quat, one)
    g.applyMatrix4(m4)
    return g
  }
  // RoundedBoxGeometry is non-indexed while the primitives are indexed, so
  // everything is flattened before merging. Nothing merged is textured and
  // lofted parts carry no UVs, so UVs are dropped.
  const merged = (parts: BufferGeometry[]): BufferGeometry => {
    const flat = parts.map(p => (p.index ? p.toNonIndexed() : p))
    for (const p of flat) p.deleteAttribute('uv')
    const g = merge(flat, false)
    for (const p of parts) p.dispose()
    for (const p of flat) p.dispose()
    if (!g) throw new Error('merge failed')
    return track(g)
  }
  const solid = (g: BufferGeometry, m: MeshStandardMaterial | MeshStandardMaterial[], parent: Group, shadow = true) => {
    const mesh = new THREE.Mesh(g, m)
    mesh.castShadow = shadow
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  const HALF = Math.PI / 2

  /** A lathe-turned part from [radius, along] pairs, laid along +X from along = 0. */
  const turned = (profile: [number, number][], segs = 16) =>
    xf(new THREE.LatheGeometry(profile.map(([r, a]) => new THREE.Vector2(r, a)), segs), 0, 0, 0, 0, 0, -HALF)

  /**
   * A closed, flat-shaded solid lofted along +X through convex cross-sections
   * [x, [y, z][]], all with the same point count. Winding is checked against
   * the first section's centre so faces point outward either way round.
   */
  const loft = (sections: [number, [number, number][]][]): BufferGeometry => {
    const n = sections[0]![1].length
    const last = sections.length - 1
    const at = (s: number, j: number): [number, number, number] => {
      const [x, pts] = sections[s]!
      const [y, z] = pts[j % n]!
      return [x, y, z]
    }
    type V3 = [number, number, number]
    const tris: [V3, V3, V3][] = []
    for (let s = 0; s < last; s++) {
      for (let j = 0; j < n; j++) {
        tris.push([at(s, j), at(s, j + 1), at(s + 1, j + 1)], [at(s, j), at(s + 1, j + 1), at(s + 1, j)])
      }
    }
    for (let j = 1; j < n - 1; j++) {
      tris.push([at(0, 0), at(0, j + 1), at(0, j)], [at(last, 0), at(last, j), at(last, j + 1)])
    }
    const [a, b, c] = tris[0]!
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const ny = u[2]! * v[0]! - u[0]! * v[2]!
    const nz = u[0]! * v[1]! - u[1]! * v[0]!
    const pts0 = sections[0]![1]
    const cy = pts0.reduce((s, p) => s + p[0], 0) / n
    const cz = pts0.reduce((s, p) => s + p[1], 0) / n
    const flip = ny * ((a[1] + b[1]) / 2 - cy) + nz * ((a[2] + b[2]) / 2 - cz) < 0
    const pos = new Float32Array(tris.length * 9)
    tris.forEach((t, i) => {
      const order = flip ? [t[0], t[2], t[1]] : t
      order.forEach((p, k) => pos.set(p, i * 9 + k * 3))
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.computeVertexNormals()
    return g
  }

  /* ---- bench: laminated top, front apron ------------------------------ */

  const bench = new THREE.Group()
  scene.add(bench)
  const benchTop = merged([
    xf(new THREE.BoxGeometry(18, 0.35, 13), 2, -0.175, BENCH_FRONT - 6.5),
    xf(new THREE.BoxGeometry(18, 0.6, 0.1), 2, -0.65, BENCH_FRONT - 0.06)
  ])
  const benchMesh = solid(benchTop, benchMat, bench)
  // VSM shadow maps want receivers in the map as well.
  benchMesh.castShadow = true

  /* ---- face vise at the front-left corner ----------------------------- */

  // A Hobelbank front vise: wooden chop, a turned wooden screw hub and a
  // tommy bar hanging through its head. Only what shows in front of the
  // bench is modelled: the top dissolves, so anything under it shows through.
  const vise = new THREE.Group()
  vise.position.set(-1.0, 0, BENCH_FRONT)
  bench.add(vise)
  const BAR_A = -68 * DEG
  const barDir = new THREE.Vector2(Math.cos(BAR_A), Math.sin(BAR_A))
  const viseGeo = merged([
    xf(new RoundedBox(1.25, 0.62, 0.2, 2, 0.03), 0, -0.31, 0.16),
    // screw and guide bars, visible in the gap between bench and chop
    xf(new THREE.CylinderGeometry(0.075, 0.075, 0.1, 14), 0, -0.3, 0.03, HALF, 0, 0),
    xf(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 10), -0.44, -0.3, 0.03, HALF, 0, 0),
    xf(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 10), 0.44, -0.3, 0.03, HALF, 0, 0),
    xf(turned([[0, 0], [0.2, 0], [0.22, 0.02], [0.22, 0.07], [0.19, 0.1], [0.11, 0.12], [0.1, 0.24], [0.13, 0.26], [0.135, 0.38], [0.11, 0.41], [0, 0.41]], 20), 0, -0.3, 0.26, 0, -HALF, 0),
    xf(new THREE.CylinderGeometry(0.032, 0.032, 0.95, 10), barDir.x * 0.25, -0.3 + barDir.y * 0.25, 0.59, 0, 0, BAR_A - HALF),
    xf(new THREE.SphereGeometry(0.055, 12, 8), -barDir.x * 0.225, -0.3 - barDir.y * 0.225, 0.59),
    xf(new THREE.SphereGeometry(0.055, 12, 8), barDir.x * 0.725, -0.3 + barDir.y * 0.725, 0.59)
  ])
  solid(viseGeo, viseMat, vise)

  /* ---- tools inside the arc ------------------------------------------ */

  // The ring of phones frames a working area: square and shavings at the
  // front, plane and saw in the middle, chisels and mallet among chips at the
  // back. The mechanical pencil lies along the front edge.

  const tools = new THREE.Group()
  scene.add(tools)

  // Metal bench plane (a No. 4 smoother) standing in the middle of the ring,
  // toe to the left, side to the camera so the tote shows its grip: ground sole and sides, japanned frog and floor,
  // blade under a plated lever cap, brass depth wheel, rosewood tote and knob.
  // Built with the toe on +X and the sole on y = 0.
  const PL = 2.45
  const PW = 0.6
  const FLOOR = 0.07
  const cheek = new THREE.Shape()
  cheek.moveTo(-PL / 2 + 0.06, 0)
  cheek.lineTo(PL / 2 - 0.06, 0)
  cheek.quadraticCurveTo(PL / 2, 0, PL / 2, 0.06)
  cheek.lineTo(PL / 2, 0.22)
  cheek.quadraticCurveTo(PL / 2, 0.3, PL / 2 - 0.1, 0.3)
  cheek.lineTo(0.45, 0.3)
  cheek.quadraticCurveTo(0.25, 0.3, 0.12, 0.42)
  cheek.quadraticCurveTo(-0.05, 0.52, -0.3, 0.48)
  cheek.quadraticCurveTo(-0.52, 0.44, -0.66, 0.3)
  cheek.lineTo(-PL / 2 + 0.1, 0.3)
  cheek.quadraticCurveTo(-PL / 2, 0.3, -PL / 2, 0.22)
  cheek.lineTo(-PL / 2, 0.06)
  cheek.quadraticCurveTo(-PL / 2, 0, -PL / 2 + 0.06, 0)
  const cheekWall = (z: number) => xf(new THREE.ExtrudeGeometry(cheek, {
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelOffset: -0.006,
    bevelSegments: 1,
    curveSegments: 8
  }), 0, 0, z)
  // Rosewood tote: a flared foot, a slim grip leaning toward the toe and a
  // horn curling forward on top.
  const toteShape = new THREE.Shape()
  toteShape.moveTo(-0.26, 0)
  toteShape.lineTo(0.24, 0)
  toteShape.quadraticCurveTo(0.12, 0.06, 0.1, 0.16)
  toteShape.quadraticCurveTo(0.1, 0.45, 0.2, 0.72)
  toteShape.quadraticCurveTo(0.26, 0.86, 0.36, 0.9)
  toteShape.quadraticCurveTo(0.38, 0.98, 0.26, 1.0)
  toteShape.quadraticCurveTo(0.08, 1.02, 0, 0.88)
  toteShape.quadraticCurveTo(-0.12, 0.55, -0.12, 0.35)
  toteShape.quadraticCurveTo(-0.13, 0.12, -0.26, 0)
  const tote = xf(new THREE.ExtrudeGeometry(toteShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: -0.05,
    bevelSegments: 3,
    curveSegments: 12
  }), -0.92, FLOOR, -0.05)
  const knob = xf(turned([[0, 0], [0.12, 0], [0.12, 0.04], [0.1, 0.08], [0.095, 0.14], [0.12, 0.22], [0.15, 0.3], [0.155, 0.36], [0.13, 0.42], [0.08, 0.46], [0, 0.47]], 20), 0.82, FLOOR, 0, 0, 0, HALF)
  // Blade assembly, bedded at 45° and leaning back from the mouth.
  const MOUTH = 0.18
  const BED = 45 * DEG
  const along = (d: number, off: number): [number, number] =>
    [MOUTH - d * Math.cos(BED) + off * Math.sin(BED), 0.01 + d * Math.sin(BED) + off * Math.cos(BED)]
  const onBed = (g: BufferGeometry, d: number, off: number) => {
    const [x, y] = along(d, off)
    return xf(g, x, y, 0, 0, 0, BED)
  }
  const planeIron = [
    xf(new THREE.BoxGeometry(PL - 0.16, 0.03, PW - 0.07), 0, 0.055, 0),
    xf(new THREE.BoxGeometry(0.05, 0.24, PW - 0.07), PL / 2 - 0.06, 0.18, 0),
    xf(new THREE.BoxGeometry(0.05, 0.24, PW - 0.07), -PL / 2 + 0.06, 0.18, 0),
    xf(new THREE.CylinderGeometry(0.13, 0.14, 0.04, 20), 0.82, FLOOR + 0.02, 0),
    onBed(new THREE.BoxGeometry(0.12, 0.4, PW - 0.14), 0.36, -0.075)
  ]
  const planeGround = [
    xf(new RoundedBox(PL, 0.045, PW, 1, 0.01), 0, 0.0225, 0),
    cheekWall(-PW / 2 + 0.006),
    cheekWall(PW / 2 - 0.041)
  ]
  const planeSteel = [
    onBed(new THREE.BoxGeometry(0.024, 0.85, PW - 0.08), 0.425, 0),
    onBed(new RoundedBox(0.045, 0.56, PW - 0.1, 2, 0.02), 0.5, 0.035),
    onBed(new RoundedBox(0.06, 0.12, 0.22, 2, 0.02), 0.72, 0.075)
  ]
  const planeBrass = [onBed(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 20), 0.62, -0.17)]
  const plane = new THREE.Group()
  plane.position.set(0.5, 0, -3.75)
  plane.rotation.y = 154 * DEG
  tools.add(plane)
  solid(merged(planeIron), ironMat, plane)
  solid(merged(planeGround), groundMat, plane)
  solid(merged(planeSteel), steelMat, plane)
  solid(merged(planeBrass), brassMat, plane)
  solid(merged([tote, knob]), rosewoodMat, plane)

  // Carver's mallet (Klüpfel): turned hornbeam head and an ash handle, lying
  // on the head and the handle's end, sloping down between them, at the back
  // of the ring in front of Schneepflug and Transit.
  const HEAD_R = 0.33
  const KNOB_R = 0.092
  const mLean = Math.atan2(HEAD_R - KNOB_R, 1.74 - 0.2)
  const malletLie = (g: BufferGeometry) => xf(xf(xf(g, 0, HEAD_R, 0), -0.2, 0, 0, 0, 0, -mLean), 0.2, 0, 0)
  const mallet = new THREE.Group()
  mallet.position.set(0.58, 0, -6.47)
  mallet.rotation.y = Math.PI
  tools.add(mallet)
  solid(merged([malletLie(turned([[0, 0], [0.27, 0], [0.31, 0.03], [HEAD_R, 0.2], [0.32, 0.42], [0.28, 0.6], [0.2, 0.68], [0.09, 0.71], [0, 0.71]], 24))]), malletMat, mallet)
  solid(merged([malletLie(turned([[0, 0.66], [0.08, 0.66], [0.068, 0.8], [0.072, 1.3], [0.085, 1.62], [KNOB_R, 1.74], [0.08, 1.8], [0.04, 1.83], [0, 1.83]], 14))]), handleMat, mallet)

  // Bevel-edge bench chisels (Stemmeisen) in three widths, laid side by side
  // at the back of the ring: turned beech handle, brass ferrule, steel neck and a
  // flat-backed blade ground to a 25° bevel. Built along +X with the handle
  // axis at its radius above the bench, then tipped about the handle's belly
  // until the cutting edge touches down.
  const CH_R = 0.135
  const CH_T = 0.045
  const CH_TIP = 1.05
  const CH_BELLY = -0.8
  const chLean = Math.atan2(CH_R - CH_T / 2, CH_TIP - CH_BELLY)
  const chisel = { wood: [] as BufferGeometry[], brass: [] as BufferGeometry[], steel: [] as BufferGeometry[] }
  const chiselAt = (width: number, x: number, z: number, yaw: number) => {
    const yb = CH_R - CH_T / 2
    const w = width / 2
    const section = (sx: number, t: number): [number, [number, number][]] => {
      const e = Math.min(t * 0.6, width * 0.2)
      return [sx, [[yb, -w], [yb, w], [yb + t * 0.25, w], [yb + t, w - e], [yb + t, e - w], [yb + t * 0.25, -w]]]
    }
    const place = (g: BufferGeometry) =>
      xf(xf(xf(g, -CH_BELLY, 0, 0), CH_BELLY, 0, 0, 0, 0, -chLean), x, 0, z, 0, yaw, 0)
    chisel.wood.push(place(xf(turned([[0, 0], [0.095, 0], [0.115, 0.02], [0.125, 0.08], [CH_R, 0.3], [0.13, 0.55], [0.115, 0.78], [0.1, 0.9], [0.095, 0.98], [0, 0.98]]), -1.1, CH_R, 0)))
    chisel.brass.push(place(xf(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), -0.07, CH_R, 0, 0, 0, HALF)))
    chisel.steel.push(
      place(xf(turned([[0, 0], [0.06, 0], [0.06, 0.03], [0.045, 0.05], [0.032, 0.14], [0, 0.14]], 12), -0.02, CH_R, 0)),
      place(loft([section(0.1, CH_T), section(CH_TIP - 0.1, CH_T * 0.92), section(CH_TIP, 0.004)]))
    )
  }
  chiselAt(0.25, -0.3, -5.27, 1.5 * DEG)
  chiselAt(0.16, -0.2, -5.61, -1.5 * DEG)
  chiselAt(0.1, -0.32, -5.95, 0.5 * DEG)
  const chisels = new THREE.Group()
  tools.add(chisels)
  solid(merged(chisel.wood), handleMat, chisels)
  solid(merged(chisel.brass), brassMat, chisels)
  solid(merged(chisel.steel), steelMat, chisels)

  // Try square (Anschlagwinkel) at the front of the ring: rosewood stock with
  // a brass wear strip and rivets, a graduated steel blade let into it. Lying
  // flat, the blade floats on the stock's thickness. Stock runs toward the
  // front, the blade across the ring behind MoneyKoi and NeuraCharge.
  const SQ_T = 0.18
  const square = new THREE.Group()
  square.position.set(-0.5, 0, -2.25)
  square.rotation.y = -HALF
  tools.add(square)
  solid(merged([xf(new RoundedBox(1.4, SQ_T, 0.45, 2, 0.02), 0.7, SQ_T / 2, 0.225)]), rosewoodMat, square)
  const squareBrass = [xf(new THREE.BoxGeometry(1.4, SQ_T, 0.02), 0.7, SQ_T / 2, -0.01)]
  for (const rz of [0.1, 0.22, 0.34]) {
    squareBrass.push(xf(new THREE.CylinderGeometry(0.026, 0.026, SQ_T + 0.004, 12), 0.15, SQ_T / 2, rz))
  }
  solid(merged(squareBrass), brassMat, square)
  solid(merged([xf(new THREE.BoxGeometry(0.3, 0.018, 2.1), 0.15, SQ_T / 2, -0.6)]), steelMat, square)
  const ticks: BufferGeometry[] = []
  for (let i = 1; i <= 15; i++) {
    const long = i % 5 === 0
    ticks.push(xf(new THREE.BoxGeometry(long ? 0.09 : 0.05, 0.002, 0.008), 0.3 - (long ? 0.045 : 0.025), SQ_T / 2 + 0.01, -0.02 - i * 0.1))
  }
  solid(merged(ticks), graphiteMat, square, false)

  // Mechanical pencil (Druckbleistift) in front of MoneyKoi and NeuraCharge, at
  // true scale: a lacquered hexagonal barrel lying on one flat, a knurled nickel
  // grip behind a red ring, a turned nose with a thin lead sleeve, and a spring
  // clip and push button at the back. Built along +X with the tip forward.
  const PEN_A = 0.045
  const PEN_R = PEN_A / Math.cos(30 * DEG)
  const penHex = (x: number, r: number): [number, [number, number][]] =>
    [x, [0, 1, 2, 3, 4, 5].map((i): [number, number] => [PEN_A + r * Math.sin(i * 60 * DEG), r * Math.cos(i * 60 * DEG)])]
  const penClip = (x: number, y: number, w: number): [number, [number, number][]] =>
    [x, [[y, -w], [y, w], [y + 0.008, w], [y + 0.008, -w]]]
  const penTurned = (g: BufferGeometry, x: number) => xf(g, x, PEN_A, 0)
  // Diamond knurl: a staggered lattice of flat-shaded four-sided pyramids.
  const KNURL_AROUND = 18
  const KNURL_ROWS = 41
  const KNURL_LEN = 0.29
  const KNURL_SIDES = [[0, 1], [1, 0], [0, -1], [-1, 0]] as const
  const knurlPos: number[] = []
  const knurlPoint = (i: number, j: number, r: number) => {
    const a = i * Math.PI / KNURL_AROUND
    knurlPos.push(clamp(j, 0, KNURL_ROWS) / KNURL_ROWS * KNURL_LEN, r * Math.sin(a), r * Math.cos(a))
  }
  for (let j = 0; j <= KNURL_ROWS; j++) {
    for (let i = j % 2; i < KNURL_AROUND * 2; i += 2) {
      KNURL_SIDES.forEach(([di, dj], k) => {
        const [ei, ej] = KNURL_SIDES[(k + 1) % 4]!
        knurlPoint(i, j, 0.0415)
        knurlPoint(i + di, j + dj, 0.039)
        knurlPoint(i + ei, j + ej, 0.039)
      })
    }
  }
  const knurl = new THREE.BufferGeometry()
  knurl.setAttribute('position', new THREE.BufferAttribute(new Float32Array(knurlPos), 3))
  knurl.computeVertexNormals()
  const pencil = new THREE.Group()
  pencil.position.set(0.5, 0, 0.5)
  pencil.rotation.y = 5 * DEG
  tools.add(pencil)
  solid(merged([loft([
    penHex(-0.69, PEN_R * 0.88),
    penHex(-0.678, PEN_R),
    penHex(0.168, PEN_R),
    penHex(0.18, PEN_R * 0.88)
  ])]), ironMat, pencil)
  solid(merged([penTurned(turned([[0, 0], [0.0425, 0], [0.0425, 0.012], [0, 0.012]], 24), 0.18)]), paintMat, pencil)
  solid(merged([
    penTurned(knurl, 0.2),
    // Nose: shoulder, cone, then the thin sleeve that guides the lead.
    penTurned(turned([[0, 0], [0.042, 0], [0.042, 0.012], [0.034, 0.05], [0.022, 0.12], [0.011, 0.19], [0.0095, 0.2], [0.0065, 0.2], [0.0065, 0.245], [0.0045, 0.25], [0, 0.25]], 24), 0.488),
    penTurned(turned([[0, 0], [0.042, 0], [0.042, 0.008], [0, 0.008]], 24), 0.192),
    // Button at the back, collar and spring clip on the barrel's top flat.
    penTurned(turned([[0, 0], [0.012, 0.002], [0.021, 0.01], [0.025, 0.025], [0.025, 0.08], [0, 0.08]], 20), -0.76),
    loft([penHex(-0.67, PEN_R * 1.04), penHex(-0.61, PEN_R * 1.04)]),
    loft([penClip(-0.66, 0.09, 0.017), penClip(-0.6, 0.092, 0.017), penClip(-0.55, 0.104, 0.016), penClip(-0.27, 0.098, 0.014), penClip(-0.25, 0.094, 0.012)]),
    xf(new THREE.SphereGeometry(0.008, 10, 8), -0.262, 0.096, 0)
  ]), nickelMat, pencil)
  solid(merged([penTurned(turned([[0, 0], [0.0035, 0], [0.0035, 0.02], [0.001, 0.024], [0, 0.024]], 8), 0.735)]), graphiteMat, pencil, false)

  // Dovetail saw (Feinsäge) on the open left side of the ring: toothed steel blade under a
  // folded brass back, closed beech handle with two brass saw nuts. Lies flat,
  // the blade at the handle's mid-thickness; toe to the back.
  const SAW_L = 2.0
  const SAW_W = 0.5
  const SAW_T = 0.21
  const sawBlade = new THREE.Shape()
  sawBlade.moveTo(0, SAW_W)
  sawBlade.lineTo(SAW_L, SAW_W)
  sawBlade.lineTo(SAW_L, 0)
  for (let tx = SAW_L; tx > 0.001; tx -= 0.05) {
    sawBlade.lineTo(tx - 0.025, -0.03)
    sawBlade.lineTo(tx - 0.05, 0)
  }
  sawBlade.closePath()
  const sawGrip = new THREE.Shape()
  sawGrip.moveTo(0.14, 0.04)
  sawGrip.lineTo(0.14, 0.64)
  sawGrip.quadraticCurveTo(0.02, 0.8, -0.16, 0.78)
  sawGrip.quadraticCurveTo(-0.44, 0.74, -0.6, 0.42)
  sawGrip.quadraticCurveTo(-0.74, 0.08, -0.62, -0.18)
  sawGrip.quadraticCurveTo(-0.52, -0.3, -0.36, -0.24)
  sawGrip.quadraticCurveTo(-0.14, -0.12, 0.14, 0.04)
  const sawHole = new THREE.Path()
  sawHole.absellipse(-0.34, 0.24, 0.11, 0.21, 0, Math.PI * 2, true, -0.35)
  sawGrip.holes.push(sawHole)
  // Shapes are drawn in the blade's plane (x along, y across); this lays them
  // flat with y toward +Z and the extrusion centred on y = SAW_T / 2.
  const sawFlat = (g: BufferGeometry, depth: number) => xf(g, 0, SAW_T / 2 + depth / 2, 0, HALF, 0, 0)
  const saw = new THREE.Group()
  saw.position.set(-1.3, 0, -3.05)
  saw.rotation.y = HALF
  tools.add(saw)
  solid(merged([sawFlat(new THREE.ExtrudeGeometry(sawBlade, { depth: 0.012, bevelEnabled: false }), 0.012)]), steelMat, saw)
  solid(merged([
    xf(new THREE.BoxGeometry(SAW_L + 0.02, 0.05, 0.08), SAW_L / 2, SAW_T / 2, SAW_W + 0.01),
    xf(new THREE.CylinderGeometry(0.035, 0.035, SAW_T + 0.006, 12), -0.02, SAW_T / 2, 0.18),
    xf(new THREE.CylinderGeometry(0.035, 0.035, SAW_T + 0.006, 12), -0.02, SAW_T / 2, 0.44)
  ]), brassMat, saw)
  solid(merged([sawFlat(new THREE.ExtrudeGeometry(sawGrip, {
    depth: SAW_T - 0.07,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelOffset: -0.035,
    bevelSegments: 2,
    curveSegments: 10
  }), SAW_T - 0.07)]), handleMat, saw)

  // Shavings and chips: curled plane shavings in the square's corner and on
  // both sides of the plane, chisel chips around the chisels and mallet,
  // sawdust over all of it.
  const PILES = [
    { x: 0.25, z: -1.45, rx: 0.38, rz: 0.28, shavings: 8, chips: 16, dust: 50 },
    { x: 1.0, z: -2.6, rx: 0.35, rz: 0.2, shavings: 6, chips: 8, dust: 40 },
    { x: -0.15, z: -3.05, rx: 0.22, rz: 0.32, shavings: 5, chips: 8, dust: 35 },
    { x: 0.05, z: -5.95, rx: 1.0, rz: 0.75, shavings: 0, chips: 38, dust: 70 }
  ]
  const scatter = (pile: typeof PILES[number], grow = 0): [number, number] => {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand())
    return [pile.x + Math.cos(a) * d * (pile.rx + grow), pile.z + Math.sin(a) * d * (pile.rz + grow)]
  }
  const shavingParts: BufferGeometry[] = []
  const chipParts: BufferGeometry[] = []
  for (const pile of PILES) {
    // A shaving: a ribbon that lies flat for a short tail, then curls up and
    // back over itself into a tightening roll.
    for (let i = 0; i < pile.shavings; i++) {
      const tail = 0.06 + rand() * 0.2
      const r0 = 0.045 + rand() * 0.045
      const turns = 1.1 + rand() * 1.3
      const width = 0.1 + rand() * 0.12
      const segs = 48
      const len = tail + Math.PI * 2 * turns * r0 * 0.8
      const ds = len / segs
      const pos = new Float32Array((segs + 1) * 2 * 3)
      const idx: number[] = []
      let px = 0
      let py = 0.003
      let th = 0
      for (let s = 0; s <= segs; s++) {
        const t = s / segs
        for (let k = 0; k < 2; k++) {
          const j = s * 2 + k
          pos[j * 3] = px
          pos[j * 3 + 1] = py
          pos[j * 3 + 2] = (k - 0.5) * width * (1 - 0.3 * t) + Math.sin(t * 5 + i) * 0.015
        }
        if (s < segs) idx.push(s * 2, s * 2 + 1, s * 2 + 2, s * 2 + 1, s * 2 + 3, s * 2 + 2)
        if (s * ds > tail) th += ds / (r0 * (1 - 0.4 * t))
        px += Math.cos(th) * ds
        py += Math.sin(th) * ds
      }
      const g = new THREE.BufferGeometry()
      g.setIndex(idx)
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      g.computeVertexNormals()
      const [sx, sz] = scatter(pile)
      shavingParts.push(xf(g, sx, 0, sz, 0, rand() * Math.PI * 2, 0))
    }
    // Chisel chips: small split-off wedges lying roughly flat.
    for (let i = 0; i < pile.chips; i++) {
      const len = 0.05 + rand() * 0.1
      const g = new THREE.BoxGeometry(len, 0.012 + rand() * 0.018, 0.025 + rand() * 0.05, 2, 1, 1)
      const p = g.getAttribute('position')
      for (let k = 0; k < p.count; k++) {
        const t = p.getX(k) / len + 0.5
        p.setY(k, p.getY(k) * (1.3 - t))
      }
      g.computeVertexNormals()
      const [cx, cz] = scatter(pile, 0.08)
      chipParts.push(xf(g, cx, 0.012, cz, (rand() - 0.5) * 0.5, rand() * Math.PI * 2, (rand() - 0.5) * 0.4))
    }
  }
  solid(merged(shavingParts), shavingMat, tools)
  solid(merged(chipParts), chipMat, tools)

  // Sawdust: a sprinkle of tiny flat flakes over the piles.
  const dustGeo = track(new THREE.PlaneGeometry(0.02, 0.014))
  dustGeo.rotateX(-HALF)
  const DUST = PILES.reduce((n, p) => n + p.dust, 0)
  const dust = new THREE.InstancedMesh(dustGeo, dustMat, DUST)
  {
    const dummy = new THREE.Object3D()
    let i = 0
    for (const pile of PILES) {
      for (let k = 0; k < pile.dust; k++) {
        const [dx, dz] = scatter(pile, 0.12)
        dummy.position.set(dx, 0.004, dz)
        dummy.rotation.set((rand() - 0.5) * 0.4, rand() * Math.PI * 2, 0)
        dummy.scale.setScalar(0.4 + rand() * 0.8)
        dummy.updateMatrix()
        dust.setMatrixAt(i++, dummy.matrix)
      }
    }
    dust.instanceMatrix.needsUpdate = true
  }
  dust.receiveShadow = true
  tools.add(dust)
  track(dust)

  /* ---- phones on stands ----------------------------------------------- */

  const LEAN = 22 * DEG // from vertical
  const FLAT = 76 * DEG // the landscape phone, nearly flat on the bench
  const BASE_H = 0.035
  const BACK_H = 0.4
  const contactZ = -(BACK_H / Math.cos(LEAN)) * Math.sin(LEAN)
  const standGeo = merged([
    xf(new RoundedBox(0.64, BASE_H, 0.5, 2, 0.012), 0, BASE_H / 2, -0.13),
    xf(new RoundedBox(0.64, 0.05, 0.05, 2, 0.012), 0, BASE_H + 0.025, 0.096),
    xf(new RoundedBox(0.64, BACK_H, 0.18, 2, 0.02), 0, BASE_H + BACK_H / 2, contactZ - 0.004 - 0.09)
  ])

  const SCREEN_W = 0.66
  const SCREEN_H = SCREEN_W / SCREEN_ASPECT
  const BEZEL = 0.02
  const PHONE_W = SCREEN_W + BEZEL * 2
  const PHONE_H = SCREEN_H + BEZEL * 2
  const SCREEN_R = SCREEN_W * 0.14
  const EXTRUDE = 0.05
  const BEVEL = 0.011
  const PHONE_D = EXTRUDE + BEVEL * 2

  // A small wedge that props the far edge of the landscape phone.
  const wedgeGeo = track(new RoundedBox(0.45, 0.16, 0.12, 2, 0.015))
  wedgeGeo.translate(0.2, 0.08, -PHONE_W * Math.sin(FLAT) + 0.02)

  /* ---- fine holder: one thick, sculpted walnut body ---------------------- */

  /** A solid swept along +X through [y, z] sections with the same point count; soft across small angles, crisp at the arrises. */
  const sweep = (xs: number[], section: (x: number) => [number, number][]): BufferGeometry => {
    const secs = xs.map((x) => {
      const pts = section(x)
      let area = 0
      pts.forEach(([y, z], j) => {
        const [ny, nz] = pts[(j + 1) % pts.length]!
        area += y * nz - ny * z
      })
      return area < 0 ? pts.reverse() : pts
    })
    const n = secs[0]!.length
    const pos: number[] = []
    const at = (s: number, j: number) => {
      const [y, z] = secs[s]![j % n]!
      return [xs[s]!, y, z]
    }
    for (let s = 0; s < xs.length - 1; s++) {
      for (let j = 0; j < n; j++) {
        pos.push(...at(s, j), ...at(s, j + 1), ...at(s + 1, j), ...at(s, j + 1), ...at(s + 1, j + 1), ...at(s + 1, j))
      }
    }
    for (const s of [0, xs.length - 1]) {
      const ring = secs[s]!
      for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(ring.map(([y, z]) => new THREE.Vector2(y, z)), [])) {
        const [ay, az] = ring[a!]!
        const [by, bz] = ring[b!]!
        const [cy, cz] = ring[c!]!
        const ccw = (by - ay) * (cz - az) - (bz - az) * (cy - ay) > 0
        const facing = s === 0 ? !ccw : ccw
        for (const k of facing ? [a!, b!, c!] : [a!, c!, b!]) pos.push(...at(s, k))
      }
    }
    const raw = new THREE.BufferGeometry()
    raw.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3))
    const g = creased(raw, 38 * DEG)
    if (g !== raw) raw.dispose()
    return track(g)
  }
  /** Stations across a piece of half width hw: even along the middle, packed into the rounded corners, a small eased arris at each end. */
  const stations = (hw: number, r: number, step: number) => {
    const half: number[] = []
    for (let x = 0; x < hw - r - 1e-6; x += step) half.push(x)
    for (let i = 0; i <= 7; i++) half.push(hw - r + r * Math.sin((i / 7) * HALF))
    half.push(hw + 0.006)
    return [...half.slice(1).reverse().map(x => -x), ...half]
  }
  const cornerOf = (x: number, hw: number, r: number) => {
    const d = Math.min(r, Math.abs(x) - (hw - r))
    return d > 0 ? r - Math.sqrt(r * r - d * d) : 0
  }
  /** Past the end of the piece the section draws in a touch, which eases the arris. */
  const eased = (hw: number, base: (x: number) => [number, number][]) => (x: number) => {
    const pts = base(Math.min(hw, Math.abs(x)))
    if (Math.abs(x) <= hw) return pts
    const zs = pts.map(p => p[1])
    const mid = (Math.min(...zs) + Math.max(...zs)) / 2
    return pts.map(([y, z]): [number, number] => [y * 0.93, mid + (z - mid) * 0.985])
  }

  const CRADLE_W = 0.45 // half width: a little wider than the phone
  const CORNER = 0.085
  const LEDGE = 0.17
  const SEAT = 0.125
  const LIP_Z = 0.082
  const NOSE = 0.045
  const frontZ = (x: number) => 0.26 - 0.035 * (x / CRADLE_W) ** 2 - cornerOf(x, CRADLE_W, CORNER)
  const backZ = (x: number) => -0.5 + 0.05 * (x / CRADLE_W) ** 2 + cornerOf(x, CRADLE_W, CORNER)
  // The back rail: tall behind the phone, its shoulders falling away to the ends.
  const crestY = (x: number) => {
    const t = clamp((Math.abs(x) - 0.2) / 0.25, 0, 1)
    return 0.66 - t * t * (3 - 2 * t) * (0.66 - 0.2)
  }
  const fineStandGeo = sweep(stations(CRADLE_W, CORNER, 0.03), eased(CRADLE_W, (x) => {
    const zf = frontZ(x)
    const zb = backZ(x)
    const pts: [number, number][] = [[0, zf - 0.035], [0.04, zf]]
    // A thick front edge and thumbnail nose over an undercut, so the piece lifts off the bench on a shadow.
    for (let i = 0; i <= 5; i++) {
      const a = (i / 5) * HALF
      pts.push([LEDGE - NOSE + NOSE * Math.sin(a), zf - NOSE + NOSE * Math.cos(a)])
    }
    // Ledge, eased lip, the seat the phone stands in.
    for (let i = 0; i <= 3; i++) {
      const a = HALF + (i / 3) * HALF
      pts.push([LEDGE - 0.008 + 0.008 * Math.sin(a), LIP_Z + 0.008 + 0.008 * Math.cos(a)])
    }
    pts.push([SEAT, LIP_Z], [SEAT, -0.003])
    // Up the back face, parallel to the phone, and round the tip of the rail.
    const sin = Math.sin(LEAN)
    const cos = Math.cos(LEAN)
    const top = crestY(x)
    const pz = -(top - SEAT) * Math.tan(LEAN) - 0.003
    const t = 0.085 + 0.02 * clamp((top - 0.2) / 0.46, 0, 1)
    const cy = top - sin * t / 2
    const cz = pz - cos * t / 2
    for (let i = 0; i <= 6; i++) {
      const a = (i / 6) * Math.PI
      const u = (t / 2) * Math.cos(a)
      const v = (t / 2) * Math.sin(a)
      pts.push([cy + sin * u + cos * v, cz + cos * u - sin * v])
    }
    // The rear sweep, leaving the tip along the phone's lean and landing flat.
    const qy = top - sin * t
    const qz = pz - cos * t
    const ry = 0.1
    const l1 = (0.6 * (qy - ry)) / cos
    const c1y = qy - cos * l1
    const c1z = qz + sin * l1
    const c2z = zb + 0.45 * (qz - zb)
    for (let i = 1; i <= 10; i++) {
      const u = i / 10
      const w = 1 - u
      pts.push([
        w * w * w * qy + 3 * w * w * u * c1y + 3 * w * u * u * ry + u * u * u * ry,
        w * w * w * qz + 3 * w * w * u * c1z + 3 * w * u * u * c2z + u * u * u * zb
      ])
    }
    for (let i = 1; i <= 3; i++) {
      const a = (i / 3) * HALF
      pts.push([ry - 0.022 + 0.022 * Math.cos(a), zb - 0.022 * Math.sin(a)])
    }
    pts.push([0, zb - 0.012])
    return pts
  }))

  // The landscape phone's prop, from the same board: a low bolster under its far edge.
  const BOLSTER_W = 0.33
  const flatY = (z: number) => 0.004 - z / Math.tan(FLAT) - 0.003
  const fineWedgeGeo = sweep(stations(BOLSTER_W, 0.06, 0.04), eased(BOLSTER_W, (x) => {
    const c = cornerOf(x, BOLSTER_W, 0.06)
    const zf = -0.44 - 0.03 * (x / BOLSTER_W) ** 2 - c
    const zb = -0.8 + 0.02 * (x / BOLSTER_W) ** 2 + c * 0.5
    const r = 0.028
    const slope = 90 * DEG - FLAT
    const cz = zf - r
    const cy = flatY(cz + r * Math.sin(slope)) - r * Math.cos(slope)
    const pts: [number, number][] = [[0, zf - 0.04]]
    for (let i = 0; i <= 5; i++) {
      const a = (i / 5) * (HALF - slope)
      pts.push([cy + r * Math.sin(a), cz + r * Math.cos(a)])
    }
    const backTopZ = Math.max(zb + 0.02, -0.72)
    const backR = 0.016
    for (let i = 0; i <= 5; i++) {
      const a = HALF - slope + (i / 5) * (HALF + slope)
      pts.push([
        flatY(backTopZ) - backR * Math.cos(slope) + backR * Math.sin(a),
        backTopZ - backR * Math.sin(slope) + backR * Math.cos(a) - 0.002
      ])
    }
    pts.push([0.05, zb], [0, zb + 0.012])
    return pts
  }))

  // Oiled walnut with a low sheen. It stays out of the lamp's pool like the old
  // stands, since a phone is never lost to the dark.
  const walnutMat = wood({ dark: '#1E100A', light: '#5C3521', scale: 2.8, roughness: 0.44 })
  walnutMat.envMap = toolEnv
  walnutMat.envMapIntensity = 0.45
  const piece = (g: BufferGeometry, m: MeshStandardMaterial) => {
    const mesh = new THREE.Mesh(g, m)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
  }

  const bodyGeo = track(new THREE.ExtrudeGeometry(roundedRect(THREE, PHONE_W, PHONE_H, SCREEN_R + BEZEL), {
    depth: EXTRUDE,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelOffset: -BEVEL,
    bevelSegments: 3,
    curveSegments: 10
  }))
  bodyGeo.translate(0, 0, -EXTRUDE / 2)

  const screenGeo = track(new THREE.ShapeGeometry(roundedRect(THREE, SCREEN_W, SCREEN_H, SCREEN_R), 10))
  {
    const pos = screenGeo.getAttribute('position')
    const uv = screenGeo.getAttribute('uv')
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) + SCREEN_W / 2) / SCREEN_W, (pos.getY(i) + SCREEN_H / 2) / SCREEN_H)
    }
    uv.needsUpdate = true
  }
  const holeGeo = track(new THREE.CircleGeometry(SCREEN_W * 0.037, 16))

  const rig = new THREE.Group()
  scene.add(rig)

  const units: Unit[] = SCREENS.map((s) => {
    const landscape = !!s.landscape
    const group = new THREE.Group()
    const phone = new THREE.Group()
    const body = new THREE.Mesh(bodyGeo, [capMat, frameMat])
    body.position.set(0, PHONE_H / 2, PHONE_D / 2)
    body.castShadow = true
    const screenMat = track(new THREE.ShaderMaterial({
      vertexShader: SCREEN_VERT,
      fragmentShader: SCREEN_FRAG,
      uniforms: {
        uTex: { value: null },
        uBright: { value: 0.72 },
        uGlare: { value: 0.9 },
        uShift: { value: 0 }
      }
    }))
    const screen = new THREE.Mesh(screenGeo, screenMat)
    screen.position.set(0, PHONE_H / 2, PHONE_D + 0.0015)
    const hole = new THREE.Mesh(holeGeo, holeMat)
    hole.position.set(0, PHONE_H / 2 + SCREEN_H / 2 - SCREEN_H * 0.0357, PHONE_D + 0.003)
    if (landscape) {
      // Spun a quarter turn clockwise (top edge to the right) and laid nearly
      // flat, its near long edge on the bench, the far edge on a wedge.
      const spin = new THREE.Group()
      spin.rotation.z = -HALF
      spin.position.set(-PHONE_H / 2, PHONE_W / 2, 0)
      spin.add(body, screen, hole)
      phone.add(spin)
      phone.position.y = 0.004
      phone.rotation.x = -FLAT
      group.add(HOLDER === 'fine' ? piece(fineWedgeGeo, walnutMat) : piece(wedgeGeo, standMat), phone)
    } else {
      group.add(HOLDER === 'fine' ? piece(fineStandGeo, walnutMat) : piece(standGeo, standMat))
      phone.position.y = HOLDER === 'fine' ? SEAT : BASE_H
      phone.rotation.x = -LEAN
      phone.add(body, screen, hole)
      group.add(phone)
    }
    group.visible = false
    rig.add(group)
    return {
      group,
      phone,
      body,
      screenMat,
      landscape,
      bright: 0.72,
      glare: 0.9,
      box: { left: 0, right: 0, top: 0, bottom: 0 },
      depth: 0,
      active: false
    }
  })

  /* ---- textures + focus ------------------------------------------------ */

  const available: boolean[] = SCREENS.map(() => false)
  let order: number[] = []
  const focus = { pos: 0, hover: -1, hold: false, cycle: 0 }

  function setFocus(pos: number, resetCycle: boolean) {
    if (order.length === 0) return
    pos = ((pos % order.length) + order.length) % order.length
    focus.pos = pos
    if (resetCycle) focus.cycle = 0
  }

  // The canvas never takes pointer events, so the cursor goes on the root.
  function setHover(pos: number) {
    if (pos === focus.hover) return
    focus.hover = pos
    document.documentElement.style.cursor = pos >= 0 ? 'pointer' : ''
    if (reduced) renderOnce()
  }

  // The project card (unit index, -1 closed). Only ever open on the phone in view.
  const card = { unit: -1 }

  function showCard(i: number) {
    if (i === card.unit) return
    card.unit = i
    ui.setCard(i < 0 ? null : i)
    trackCard()
  }
  /** A press on unit `hit` (-1: on nothing). */
  function press(hit: number) {
    const inView = hit >= 0 && hit === order[focus.pos]
    if (hit >= 0 && !inView) setFocus(order.indexOf(hit), true)
    showCard(inView && hit !== card.unit ? hit : -1)
    if (reduced) renderOnce()
  }
  function trackCard() {
    if (card.unit >= 0) ui.placeCard(units[card.unit]!.box, view.w, view.h)
  }

  const tmpA = new THREE.Vector3()
  const tmpB = new THREE.Vector3()

  // Non-focused screens dim with their distance from the focused one, and
  // more so when they sit in front of it (closer to the camera); a hovered
  // one, or the one with the card open, lifts most of the way back up.
  function applyBrightness(instant: boolean, dt: number) {
    const k = instant ? 1 : 1 - Math.exp(-dt * 7)
    const focused = order[focus.pos]
    if (focused === undefined) return
    const hovered = focus.hover >= 0 ? order[focus.hover] : undefined
    const f = units[focused]!
    f.body.getWorldPosition(tmpA)
    for (let i = 0; i < units.length; i++) {
      const u = units[i]!
      if (!u.active) continue
      let tb = 1
      let tg = 1.25
      if (i !== focused) {
        u.body.getWorldPosition(tmpB)
        const dist = tmpB.distanceTo(tmpA)
        tb = 0.72 * (1 - 0.5 * clamp((dist - 0.8) / 2.2, 0, 1)) * (u.depth < f.depth - 0.3 ? 0.4 : 1)
        if (i === hovered || i === card.unit) tb = Math.max(tb, 0.9)
        tg = 0.9
      }
      u.bright += (tb - u.bright) * k
      u.glare += (tg - u.glare) * k
      u.screenMat.uniforms.uBright!.value = u.bright
      u.screenMat.uniforms.uGlare!.value = u.glare
    }
  }

  const glowTarget = new THREE.Vector3()
  function updateGlow(instant: boolean, dt: number) {
    const focused = order[focus.pos]
    if (focused === undefined) return
    const u = units[focused]!
    glowTarget.set(0, PHONE_H * 0.5, PHONE_D + 0.15)
    u.body.parent!.localToWorld(glowTarget)
    if (instant) {
      glow.position.copy(glowTarget)
    } else {
      glow.position.lerp(glowTarget, 1 - Math.exp(-dt * 6))
    }
  }

  function stepFocus(ms: number) {
    if (order.length < 2) return
    if (focus.hover >= 0 || focus.hold || card.unit >= 0) return
    focus.cycle += ms
    if (focus.cycle >= INTERVAL) setFocus(focus.pos + 1, true)
  }

  /* ---- camera ---------------------------------------------------------- */

  const view = { w: 1, h: 1, hidden: false, narrow: false, ring: false, tx: 0, ty: 0 }
  const corner = new THREE.Vector3()
  const ELEV = 45 * DEG
  const ELEV_FLAT = 68 * DEG
  const cam = {
    look: new THREE.Vector3(),
    vLook: new THREE.Vector3(),
    yaw: 0,
    vYaw: { v: 0 },
    shift: 0,
    vShift: { v: 0 },
    zoom: 1,
    vZoom: { v: 0 },
    bump: 0,
    dist: 7,
    elev: ELEV,
    vElev: { v: 0 }
  }
  const lamp = { look: new THREE.Vector3(), v: new THREE.Vector3() }
  const orbit = { yaw: 0, pitch: 0 }
  const camDir = new THREE.Vector3()
  const poseLook = new THREE.Vector3()

  /** Where the camera looks for unit i, with a small yaw toward the phone's facing. */
  function poseOf(i: number): number {
    const u = units[i]!
    u.body.getWorldPosition(poseLook)
    // The flat phone sits at bench level: aim a little above it so it lands in
    // the lower half of the target box and the phones around it keep their place.
    if (u.landscape) poseLook.y += 0.35
    return u.group.rotation.y * 0.3
  }
  function shiftOf(i: number): number {
    return units[i]!.landscape && !view.narrow ? view.w * 0.07 : 0
  }
  /** The landscape phone is low and wide; on phones the camera moves in on it. */
  function zoomOf(i: number): number {
    return units[i]!.landscape && view.narrow ? 0.95 : 1
  }

  function elevOf(i: number): number {
    return units[i]!.landscape ? ELEV_FLAT : ELEV
  }

  function placeCamera(look: Vector3, yaw: number, elev: number, dist: number, shift: number) {
    camDir.set(Math.sin(yaw) * Math.cos(elev), Math.sin(elev), Math.cos(yaw) * Math.cos(elev))
    camera.position.copy(look).addScaledVector(camDir, dist)
    camera.lookAt(look)
    camera.updateMatrixWorld(true)
    camera.setViewOffset(view.w, view.h, view.w / 2 - view.tx - shift, view.h / 2 - view.ty, view.w, view.h)
  }

  function followLamp(instant: boolean, dt: number) {
    if (instant) {
      lamp.look.copy(poseLook)
      lamp.v.set(0, 0, 0)
    } else {
      dampV3(lamp.look, poseLook, lamp.v, 0.7, dt)
    }
    key.position.set(lamp.look.x - 1.9, 6.2, lamp.look.z + 2.6)
    key.target.position.set(lamp.look.x + 0.1, 0, lamp.look.z + 0.4)
    fadeCenter.set(lamp.look.x - 0.1, lamp.look.z + 0.3)
    // On the arc the pool leans into the ring, so the tools inside it show.
    if (view.ring) fadeCenter.lerp(ringCenter, 0.3)
  }

  function projectUnit(u: Unit) {
    const out = u.box
    u.body.updateWorldMatrix(true, false)
    out.left = Infinity
    out.right = -Infinity
    out.top = Infinity
    out.bottom = -Infinity
    for (let i = 0; i < 8; i++) {
      corner.set(
        (i & 1 ? 0.5 : -0.5) * PHONE_W,
        (i & 2 ? 0.5 : -0.5) * PHONE_H,
        (i & 4 ? 0.5 : -0.5) * PHONE_D
      )
      corner.applyMatrix4(u.body.matrixWorld).project(camera)
      const x = (corner.x + 1) / 2 * view.w
      const y = (1 - corner.y) / 2 * view.h
      out.left = Math.min(out.left, x)
      out.right = Math.max(out.right, x)
      out.top = Math.min(out.top, y)
      out.bottom = Math.max(out.bottom, y)
    }
    corner.setFromMatrixPosition(u.body.matrixWorld)
    u.depth = corner.distanceTo(camera.position)
  }

  function projectAll() {
    for (const u of units) if (u.active) projectUnit(u)
  }

  /* ---- layout --------------------------------------------------------- */

  function applyLayout(sequence: number[], mode: 'arc' | 'row') {
    order = []
    for (let i = 0; i < units.length; i++) {
      const u = units[i]!
      const table = mode === 'row' ? PLACE_ROW[i] : PLACE[i]
      const p = available[i] && sequence.includes(i) ? table : undefined
      u.active = !!p
      u.group.visible = !!p
      if (!p) continue
      u.group.position.set(p[0], 0, p[1])
      u.group.rotation.y = p[2] * DEG
    }
    for (const i of sequence) if (units[i]!.active) order.push(i)
    rig.updateMatrixWorld(true)
    if (focus.pos >= order.length) focus.pos = 0
    setHover(-1)
    if (card.unit !== order[focus.pos]) showCard(-1)
  }

  // Camera distance so the first phone's body spans `th` pixels at its spot.
  function fit(th: number) {
    const first = order[0]
    if (first === undefined) return
    const u = units[first]!
    const yaw = poseOf(first)
    let dist = 7
    for (let i = 0; i < 4; i++) {
      placeCamera(poseLook, yaw, ELEV, dist, 0)
      projectUnit(u)
      dist *= (u.box.bottom - u.box.top) / th
    }
    placeCamera(poseLook, yaw, ELEV, dist, 0)
    projectUnit(u)
    cam.dist = dist
  }

  function snapCamera() {
    const i = order[focus.pos]
    if (i === undefined) return
    cam.yaw = poseOf(i)
    cam.look.copy(poseLook)
    cam.vLook.set(0, 0, 0)
    cam.vYaw.v = 0
    cam.shift = shiftOf(i)
    cam.vShift.v = 0
    cam.zoom = zoomOf(i)
    cam.vZoom.v = 0
    cam.elev = elevOf(i)
    cam.vElev.v = 0
    cam.bump = 0
    followLamp(true, 0)
    placeCamera(cam.look, cam.yaw, cam.elev, cam.dist * cam.zoom, cam.shift)
  }

  function layout(): boolean {
    const w = hostEl.clientWidth
    const h = hostEl.clientHeight
    if (w < 2 || h < 2) return false
    view.w = w
    view.h = h
    const narrow = w < 768
    const mid = w < 1024
    view.narrow = narrow
    view.ring = narrow || !mid
    // On phones the host is one screen tall; below that (landscape) the headline fills it.
    view.hidden = narrow && h < 480
    canvasEl.style.visibility = view.hidden ? 'hidden' : ''
    if (view.hidden) {
      ui.setNav(null)
      showCard(-1)
      return false
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1 : 1.5))
    renderer.setSize(w, h, false)
    camera.aspect = w / h

    // Which phones, and where the focused one sits in the frame, per breakpoint.
    const floor = headline?.offsetTop ?? h * 0.72
    // On phones: the lowest the arrows go, and their room under a phone of height t (its cradle scales with it).
    const navFloor = floor - NAV_SIZE - 20
    const belowPhone = (t: number) => t * 0.12 + 10
    let sequence = CYCLE
    let th = clamp(h * 0.54, 300, 640)
    view.tx = w * 0.74
    view.ty = h * (HOLDER === 'fine' ? 0.54 : 0.58) // the cradle's ledge needs room above the arrows
    if (narrow) {
      // Top to bottom: page header, phone, arrows, headline. The headline's top
      // moves with its wrapping (width, language), and on short screens the
      // phone gives way so the arrows still fit above it.
      th = clamp(Math.min(h * 0.4, (navFloor - 10 - MOBILE_HEADER) / 1.12), 150, 360)
      view.tx = w * 0.5
      view.ty = Math.min(h * 0.36, navFloor - belowPhone(th) - th / 2)
    } else if (mid) {
      // Tablet portrait: the copy spans the full width, so the bench lives
      // in the free band above it.
      sequence = CYCLE.filter(i => i !== 5 && i !== 4)
      th = clamp(h * 0.3, 200, 360)
      view.tx = w * 0.72
      view.ty = h * 0.21
    } else if (w < 1280) {
      sequence = CYCLE.filter(i => i !== 5)
      th = clamp(h * 0.48, 280, 600)
      view.tx = w * 0.8
    }
    applyLayout(sequence, view.ring ? 'arc' : 'row')
    fit(th)
    // Prev/next sit centred just below the focus spot, clear of the cradle's
    // ledge; on phones, midway down the free band above the headline.
    const navBelow = narrow ? belowPhone(th) : HOLDER === 'fine' && view.ring ? th * 0.2 + 28 : NAV_BELOW
    const navTop = view.ty + th / 2 + navBelow
    const navY = narrow ? Math.min((navTop + floor - NAV_SIZE) / 2, navFloor) : Math.min(navTop, h - 64)
    ui.setNav(order.length < 2 ? null : { x: view.tx, y: navY })
    snapCamera()
    applyBrightness(true, 0)
    updateGlow(true, 0)
    projectAll()
    trackCard()
    return true
  }

  /* ---- pointer (on window, never on the canvas) ---------------------- */

  const pointer = { nx: 0, ny: 0, active: false }

  function toLocal(e: { clientX: number, clientY: number }): [number, number, boolean] {
    const r = hostEl.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const inside = x >= 0 && x <= r.width && y >= 0 && y <= r.height
    return [x, y, inside]
  }
  function hitTest(x: number, y: number): number {
    let best = -1
    let bestDepth = Infinity
    for (let i = 0; i < units.length; i++) {
      const u = units[i]!
      if (!u.active) continue
      const b = u.box
      if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom && u.depth < bestDepth) {
        best = i
        bestDepth = u.depth
      }
    }
    return best
  }
  // Links and buttons (the copy, the nav arrows) sit above the canvas and keep
  // their own clicks; the nav arrows also hold the cycle while hovered.
  const targetOf = (e: PointerEvent) => (e.target instanceof Element ? e.target : null)
  const onMove = (e: PointerEvent) => {
    const [x, y, inside] = toLocal(e)
    const target = targetOf(e)
    pointer.active = inside
    focus.hold = inside && !!target?.closest('[data-desk-nav]')
    if (!inside) {
      setHover(-1)
      return
    }
    pointer.nx = clamp(x / view.w * 2 - 1, -1, 1)
    pointer.ny = clamp(y / view.h * 2 - 1, -1, 1)
    if (!ready || view.hidden) return
    if (target?.closest('a, button, [data-desk-card]')) {
      setHover(-1)
      return
    }
    const hit = hitTest(x, y)
    setHover(hit < 0 ? -1 : order.indexOf(hit))
  }
  /** The phone under a press, or -1. */
  function pick(e: PointerEvent): number {
    if (view.hidden || !ready) return -1
    if (targetOf(e)?.closest('a, button')) return -1
    const [x, y, inside] = toLocal(e)
    return inside ? hitTest(x, y) : -1
  }
  // A mouse acts on press. Touch and pen wait for a tap (released close by, not
  // a scroll, which cancels the pointer).
  const tap = { id: -1, x: 0, y: 0, t: 0 }
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') {
      tap.id = e.pointerId
      tap.x = e.clientX
      tap.y = e.clientY
      tap.t = e.timeStamp
      return
    }
    if (e.button !== 0 || targetOf(e)?.closest('[data-desk-card]')) return
    press(pick(e))
  }
  const onUp = (e: PointerEvent) => {
    if (e.pointerId !== tap.id) return
    tap.id = -1
    if (Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 10 || e.timeStamp - tap.t > 600) return
    if (targetOf(e)?.closest('[data-desk-card]')) return
    press(pick(e))
  }
  const onCancel = (e: PointerEvent) => {
    if (e.pointerId === tap.id) tap.id = -1
  }
  const onOut = (e: PointerEvent) => {
    if (!e.relatedTarget) {
      pointer.active = false
      focus.hold = false
      setHover(-1)
    }
  }
  const onBlur = () => {
    pointer.active = false
    focus.hold = false
    setHover(-1)
  }

  /** The nav arrows: one phone along the cycle, like a click on it. */
  function step(dir: number) {
    if (!ready || view.hidden) return
    setFocus(focus.pos + dir, true)
    showCard(-1)
    if (reduced) renderOnce()
  }

  // A sideways swipe that starts on the scene steps one phone, like the
  // arrows (finger to the left: next). Touch events, not pointer events: the
  // browser cancels the pointer as soon as it takes the gesture for a pan, but
  // still reports where the touch ended. A tap moves under 10 px, a swipe at
  // least SWIPE_MIN, so the two never both fire.
  const swipe = { id: -1, x: 0, y: 0 }
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    // A second finger (pinch-zoom) drops the swipe.
    if (e.touches.length !== 1 || !t || !toLocal(t)[2]) {
      swipe.id = -1
      return
    }
    swipe.id = t.identifier
    swipe.x = t.clientX
    swipe.y = t.clientY
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (swipe.id < 0) return
    const t = Array.from(e.changedTouches).find(c => c.identifier === swipe.id)
    if (!t) return
    swipe.id = -1
    const dx = t.clientX - swipe.x
    const dy = t.clientY - swipe.y
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return
    step(dx < 0 ? 1 : -1)
  }
  const onTouchCancel = () => {
    swipe.id = -1
  }

  /* ---- loop & lifecycle ---------------------------------------------- */

  let raf = 0
  let last = 0
  let visible = true
  let placed = false
  let ready = false
  let alive = true
  let revealAt = -1
  let revealed = false

  // Entrance: fade the canvas in over 1.2s after the first rendered frame.
  function reveal(now: number) {
    if (revealed) return
    if (revealAt < 0) {
      revealAt = now
      ui.setProgress(1)
      ui.settled()
    }
    const k = clamp((now - revealAt) / 1200, 0, 1)
    ui.setOpacity(1 - Math.pow(1 - k, 3))
    if (k >= 1) {
      revealed = true
      hostEl.dataset.stats = `${renderer.info.render.calls}/${renderer.info.render.triangles}` // TEMP-STATS
    }
  }

  function renderOnce() {
    if (!ready || view.hidden) return
    snapCamera()
    applyBrightness(true, 0)
    updateGlow(true, 0)
    renderer.render(scene, camera)
    projectAll()
    trackCard()
    ui.setOpacity(1)
    revealed = true
    ui.setProgress(1)
    ui.settled()
  }

  const frame = (now: number) => {
    raf = 0
    const dtWall = Math.max(0, now - last)
    // Animation step: real time, but capped so slow frames stay stable.
    const dt = clamp(dtWall / 1000, 0.001, 0.25)
    last = now

    stepFocus(dtWall)

    // Glide to the focused phone: critically damped look/yaw/shift, with a
    // small lift and pull-back that follows the camera's own speed (the arc).
    const i = order[focus.pos]
    if (i !== undefined) {
      const tYaw = poseOf(i)
      dampV3(cam.look, poseLook, cam.vLook, 0.42, dt)
      cam.yaw = damp(cam.yaw, tYaw, cam.vYaw, 0.42, dt)
      cam.shift = damp(cam.shift, shiftOf(i), cam.vShift, 0.42, dt)
      cam.zoom = damp(cam.zoom, zoomOf(i), cam.vZoom, 0.42, dt)
      cam.elev = damp(cam.elev, elevOf(i), cam.vElev, 0.42, dt)
      followLamp(false, dt)
    }
    const bt = clamp(cam.vLook.length() / 2.2, 0, 1)
    cam.bump += (bt - cam.bump) * (1 - Math.exp(-dt * 8))

    // Pointer parallax: a small offset on top of the current pose.
    const k = 1 - Math.exp(-dt * 4)
    const ty = pointer.active ? pointer.nx * 2.5 * DEG : 0
    const tp = pointer.active ? -pointer.ny * 1.2 * DEG : 0
    orbit.yaw += (ty - orbit.yaw) * k
    orbit.pitch += (tp - orbit.pitch) * k
    placeCamera(cam.look, cam.yaw + orbit.yaw, cam.elev + 6 * DEG * cam.bump + orbit.pitch, cam.dist * cam.zoom * (1 + 0.08 * cam.bump), cam.shift)
    for (const u of units) {
      if (u.active) u.screenMat.uniforms.uShift!.value = orbit.yaw * 0.8 - orbit.pitch * 1.2
    }

    applyBrightness(false, dt)
    updateGlow(false, dt)
    renderer.render(scene, camera)
    projectAll()
    trackCard()
    hostEl.dataset.cycle = String(Math.round(focus.cycle)) // TEMP-STATS
    hostEl.dataset.boxes = JSON.stringify(order.map(j => units[j]!.box)) // TEMP-STATS
    reveal(now)
    raf = requestAnimationFrame(frame)
  }

  function updateRunning() {
    const want = placed && ready && visible && !view.hidden && !document.hidden && !reduced
    if (want && !raf) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    } else if (!want && raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }

  function ensure() {
    placed = ready && layout()
    if (!placed) {
      updateRunning()
      return
    }
    if (reduced) {
      renderOnce()
    } else {
      updateRunning()
    }
  }

  // Preload every screen before the first frame; a failed one is dropped.
  const loader = new THREE.TextureLoader()
  let screensDone = 0
  const screenDone = () => {
    if (alive) ui.setProgress(LOAD.built + (LOAD.screens * ++screensDone) / SCREENS.length)
  }
  Promise.allSettled(SCREENS.map(s => loader.loadAsync(s.src).finally(screenDone))).then(async (results) => {
    let any = false
    results.forEach((r, i) => {
      if (r.status !== 'fulfilled') return
      if (!alive) {
        r.value.dispose()
        return
      }
      const t: Texture = r.value
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = aniso
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.magFilter = THREE.LinearFilter
      track(t)
      available[i] = true
      units[i]!.screenMat.uniforms.uTex!.value = t
      any = true
    })
    if (!alive) return
    if (!any) {
      ui.settled()
      return
    }
    // Compile the shaders in the background where the browser can, so the first
    // frame doesn't freeze the page. The timeout only guards against a stuck driver.
    if (layout()) {
      await Promise.race([
        renderer.compileAsync(scene, camera).catch(() => {}),
        new Promise(resolve => setTimeout(resolve, 4000))
      ])
      if (!alive) return
    }
    ui.setProgress(1)
    await ui.released
    if (!alive) return
    ready = true
    ensure()
  })

  const ro = new ResizeObserver(() => ensure())
  ro.observe(hostEl)
  // Re-wraps with the web font and the language, without the host resizing.
  if (headline) ro.observe(headline)
  const io = new IntersectionObserver((entries) => {
    visible = entries.some(e => e.isIntersecting)
    updateRunning()
  })
  io.observe(hostEl)
  const onVisibility = () => updateRunning()
  document.addEventListener('visibilitychange', onVisibility)

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerout', onOut, { passive: true })
  window.addEventListener('blur', onBlur)
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointercancel', onCancel, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('touchcancel', onTouchCancel, { passive: true })

  ensure()

  const dispose = () => {
    alive = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerout', onOut)
    window.removeEventListener('blur', onBlur)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onCancel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('touchcancel', onTouchCancel)
    document.documentElement.style.cursor = ''
    for (const d of disposables) d.dispose()
    key.shadow.dispose()
    scene.clear()
    renderer.dispose()
  }
  return { dispose, step }
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0">
    <div
      ref="host"
      class="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref="canvas"
        class="block h-full w-full"
        style="opacity: 0;"
      />
    </div>
    <!-- z-20 lifts the arrows over the hero copy (z-10), which spans this area. Opaque: with a backdrop blur they flickered over the live canvas. -->
    <Transition
      appear
      enter-active-class="transition-opacity duration-700"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="nav"
        data-desk-nav
        class="pointer-events-auto absolute z-20 flex -translate-x-1/2 gap-3"
        :style="{ left: `${nav.x}px`, top: `${nav.y}px` }"
      >
        <button
          v-for="dir in [-1, 1]"
          :key="dir"
          type="button"
          :aria-label="dir < 0 ? $t('common.prevApp') : $t('common.nextApp')"
          class="grid h-11 w-11 cursor-pointer touch-manipulation place-items-center rounded-full border border-line bg-navy-950 text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          @click="go(dir)"
        >
          <Icon
            :name="dir < 0 ? 'lucide:arrow-left' : 'lucide:arrow-right'"
            :size="18"
          />
        </button>
      </div>
    </Transition>
    <!-- The scene sets the transform each frame so the card rides beside its phone. -->
    <div
      ref="cardEl"
      data-desk-card
      class="pointer-events-auto absolute left-0 top-0 z-20 w-[min(20rem,calc(100%_-_2rem))]"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="project"
          class="rounded-lg border border-line-strong bg-navy-950/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-md"
        >
          <p class="font-mono text-xs text-ink-faint">
            <span class="tabular-nums">{{ project.date.slice(0, 4) }}</span>
            <span class="mx-2">—</span>{{ companyOf(project) }}
          </p>
          <p class="mt-2 font-display text-xl leading-tight tracking-tight text-ink">
            {{ l(project.title) }}
          </p>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
            {{ l(project.summary ?? project.description) }}
          </p>
          <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <UiButtonLink
              v-if="project.caseStudy"
              :to="`/projects/${project.caseStudy.slug}`"
              icon="lucide:arrow-right"
            >
              {{ $t('common.caseStudy') }}
            </UiButtonLink>
            <UiButtonLink to="/projects">
              {{ $t('common.allProjects') }}
            </UiButtonLink>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
