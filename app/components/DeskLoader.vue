<script setup lang="ts">
/**
 * DeskLoader: stands in for DeskScene while three and the app screens load.
 * The lamp warms up over the bench and a line of light draws a phone at the
 * exact spot the first real phone appears, so one crossfades into the other.
 *
 * - Server-rendered and CSS-positioned, so it is there from first paint, before
 *   any JS has run. Only `progress` needs the client.
 * - The glass sheen animates transform only, so it stays alive on the compositor
 *   while the scene blocks the main thread.
 * - Fades in after a short delay (fast and cached loads never see it) and gives
 *   itself up after 30 s, which also covers no JS and stalled networks.
 */
const props = defineProps<{ progress: number }>()

const l = useLocalized()
const { locale } = useI18n()
const caption = { de: 'Werkbank wird eingerichtet', en: 'Setting up the bench' }
const percent = computed(() => new Intl.NumberFormat(locale.value, { style: 'percent' }))

// Each half runs from the bottom centre up one side; they meet at the top.
const SIDES = [
  'M50 195H84A15 15 0 0 0 99 180V16A15 15 0 0 0 84 1H50',
  'M50 195H16A15 15 0 0 1 1 180V16A15 15 0 0 1 16 1H50'
]
const TIP = 0.018

// three reports nothing until its chunks are in, so until then the bar counts up
// on its own. Real progress then fills what is left, so it never runs backwards.
const WAIT_STEP = 0.05
const WAIT_MAX = 0.6
const waited = ref(0)
const waiting = computed(() => props.progress === 0)
const target = computed(() => waited.value + (1 - waited.value) * props.progress)
let waitTimer: ReturnType<typeof setInterval> | undefined

// Progress arrives in steps; the line eases toward it. Runs only while moving.
const shown = ref(0)
let raf = 0
let last = 0

function tick(now: number) {
  const dt = Math.min(now - last, 100)
  last = now
  shown.value += (target.value - shown.value) * (1 - Math.exp(-dt / 180))
  if (Math.abs(target.value - shown.value) < 0.001) {
    shown.value = target.value
    raf = 0
    return
  }
  raf = requestAnimationFrame(tick)
}

function follow() {
  if (raf) return
  last = performance.now()
  raf = requestAnimationFrame(tick)
}

watch(target, follow)
watch(waiting, (now) => {
  if (now) return
  clearInterval(waitTimer)
  // The line may still be easing toward the last step; the number must not drop back to it.
  shown.value = Math.max(shown.value, waited.value)
})
onMounted(() => {
  follow()
  if (waiting.value) {
    waitTimer = setInterval(() => {
      waited.value = Math.min(waited.value + WAIT_STEP, WAIT_MAX)
    }, 1000)
  }
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearInterval(waitTimer)
})
</script>

<template>
  <div
    aria-hidden="true"
    class="desk-loader pointer-events-none absolute inset-0"
    :style="{ '--p': shown.toFixed(4) }"
  >
    <div class="desk-loader-spot">
      <div class="desk-loader-lamp" />
      <div class="desk-loader-glass">
        <div class="desk-loader-sheen" />
      </div>
      <svg
        class="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        viewBox="0 0 100 196"
      >
        <rect
          class="stroke-line-strong"
          height="194"
          rx="15"
          stroke-width="0.5"
          width="98"
          x="1"
          y="1"
        />
        <g
          v-for="d in SIDES"
          :key="d"
        >
          <path
            :d="d"
            class="desk-loader-glow"
            pathLength="1"
          />
          <path
            :d="d"
            class="desk-loader-trace"
            pathLength="1"
          />
          <path
            :d="d"
            class="desk-loader-tip"
            pathLength="1"
            :style="{ strokeDasharray: `${TIP} 2`, strokeDashoffset: TIP - shown }"
          />
        </g>
        <circle
          class="desk-loader-hole"
          cx="50"
          cy="8"
          r="2.4"
        />
      </svg>
      <p class="eyebrow desk-loader-caption">
        {{ l(caption) }}
        <span class="ml-2 tabular-nums text-accent">{{ percent.format(waiting ? waited : shown) }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Same spot and size as the focused phone in DeskScene's layout(): keep in sync.
   Only very short phones differ, where the scene also yields to the headline. */
.desk-loader-spot {
  --x: 74%;
  --y: 54%;
  --h: clamp(300px, 54%, 640px);
  position: absolute;
  left: var(--x);
  top: var(--y);
  height: var(--h);
  aspect-ratio: 100 / 196;
  transform: translate(-50%, -50%);
  animation:
    desk-loader-in 0.7s var(--ease-out-soft) 0.25s both,
    desk-loader-out 0.6s ease 30s forwards;
}
@media (max-width: 1279px) {
  .desk-loader-spot { --x: 80%; --h: clamp(280px, 48%, 600px); }
}
@media (max-width: 1023px) {
  .desk-loader-spot { --x: 72%; --y: 21%; --h: clamp(200px, 30%, 360px); }
}
@media (max-width: 767px) {
  .desk-loader-spot { --x: 50%; --y: 36%; --h: clamp(150px, 40%, 360px); }
}
/* Landscape phones: the scene stays hidden there, the headline fills the hero. */
@media (max-width: 767px) and (max-height: 479px) {
  .desk-loader { display: none; }
}

/* The warm pool brightens with progress. Static otherwise: the sheen already
   carries the motion, and looping a layer this large costs frames on weak GPUs. */
.desk-loader-lamp {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 340%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  opacity: calc(0.45 + var(--p) * 0.55);
  background: radial-gradient(closest-side, color-mix(in oklab, var(--color-accent) 34%, transparent), color-mix(in oklab, var(--color-accent) 11%, transparent) 42%, transparent);
}

.desk-loader-glass {
  position: absolute;
  inset: 0.5%;
  overflow: hidden;
  border-radius: 15% / 7.6%;
  background: linear-gradient(160deg, color-mix(in oklab, var(--color-navy-700) 70%, transparent), color-mix(in oklab, var(--color-navy-950) 80%, transparent));
}
/* The same diagonal reflection the real screens carry, passing over the glass. */
.desk-loader-sheen {
  position: absolute;
  inset: -40% 0;
  background: linear-gradient(160deg, transparent 38%, rgb(201 216 237 / 0.1) 50%, transparent 62%);
  animation: desk-loader-sheen 2.8s var(--ease-out-soft) infinite;
}

.desk-loader-glow,
.desk-loader-trace {
  stroke-dasharray: 1 2;
  stroke-dashoffset: calc(1 - var(--p));
}
.desk-loader-glow {
  stroke: var(--color-accent);
  stroke-width: 3;
  opacity: 0.4;
  filter: blur(2.5px);
}
.desk-loader-trace {
  stroke: var(--color-accent);
  stroke-width: 0.9;
  stroke-linecap: round;
}
.desk-loader-tip {
  stroke: #FFE9D2;
  stroke-width: 1.1;
  stroke-linecap: round;
  opacity: calc((1 - var(--p)) * 20);
}
.desk-loader-hole {
  fill: var(--color-navy-950);
  stroke: var(--color-line-strong);
  stroke-width: 0.4;
}

.desk-loader-caption {
  position: absolute;
  left: 50%;
  top: calc(100% + 22px);
  transform: translateX(-50%);
  white-space: nowrap;
}

@keyframes desk-loader-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes desk-loader-out {
  to { opacity: 0; visibility: hidden; }
}
@keyframes desk-loader-sheen {
  from { transform: translateY(-62%); }
  to { transform: translateY(62%); }
}

@media (prefers-reduced-motion: reduce) {
  .desk-loader-sheen { display: none; }
}
</style>
