<template>
  <div>
    <!-- The shell is what goes full screen; the outer div keeps the page's classes. -->
    <div
      ref="shell"
      :class="full
        ? 'fixed inset-0 z-[80] grid grid-rows-[auto_minmax(0,1fr)] bg-navy-950 md:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_26rem]'
        : 'grid grid-cols-1 gap-8 md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-8 md:gap-y-10'"
    >
      <!-- Filters: regions (years live in the legend on the map) -->
      <div
        :class="full
          ? 'min-w-0 border-b border-line px-4 py-3 md:col-start-2 md:row-start-1 md:border-b-0 md:border-l md:px-6 md:pb-2 md:pt-6'
          : 'md:col-span-4 md:row-start-1'"
      >
        <UiEyebrow
          class="block"
          :class="full && 'max-md:hidden'"
        >
          {{ tx.region }}
        </UiEyebrow>
        <div
          class="scrollbar-hide flex gap-1.5 overflow-x-auto md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
          :class="full ? '-mx-4 px-4 md:mt-3' : '-mx-6 mt-4 px-6'"
        >
          <button
            v-for="r in regionOptions"
            :key="r.id ?? 'all'"
            type="button"
            :aria-pressed="region === r.id"
            class="shrink-0 rounded border px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors"
            :class="region === r.id
              ? 'border-accent text-accent'
              : 'border-line text-ink-muted hover:border-line-strong hover:text-ink'"
            @click="r.id ? showRegion(r.id) : reset()"
          >
            {{ r.name }}
            <span
              v-if="r.count"
              class="ml-1 text-ink-faint"
            >{{ r.count }}</span>
          </button>
        </div>
      </div>

      <!-- Map -->
      <figure
        :class="full
          ? 'relative min-h-0 md:col-start-1 md:row-span-2 md:row-start-1'
          : 'md:col-span-8 md:col-start-5 md:row-span-2 md:row-start-1'"
      >
        <div
          ref="frame"
          class="select-none overflow-hidden bg-navy-950"
          :class="full ? 'absolute inset-0' : 'relative rounded-md border border-line'"
          :style="full ? undefined : { aspectRatio: `${MAP.width} / ${MAP.height}` }"
        >
          <svg
            ref="svg"
            :viewBox="viewBox"
            class="absolute inset-0 h-full w-full"
            :style="{
              touchAction: zoomed || full ? 'none' : 'pan-y',
              cursor: dragging ? 'grabbing' : zoomed ? 'grab' : 'default'
            }"
            role="img"
            :aria-label="tx.mapLabel"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @wheel="onWheel"
          >
            <rect
              :x="MAP.inset.box[0]"
              :y="MAP.inset.box[1]"
              :width="MAP.inset.box[2]"
              :height="MAP.inset.box[3]"
              rx="6"
              class="fill-none stroke-line-strong"
              stroke-dasharray="3 4"
              vector-effect="non-scaling-stroke"
            />
            <text
              :x="MAP.inset.box[0] + px(12)"
              :y="MAP.inset.box[1] + px(20)"
              :font-size="px(10)"
              letter-spacing="0.18em"
              class="pointer-events-none fill-ink-faint font-mono"
            >OKINAWA · AMAMI</text>

            <path
              v-for="p in PREFECTURES"
              :key="p.id"
              :d="p.d"
              :style="{ fill: prefFill(p.id) }"
              class="stroke-navy-950 transition-[fill] duration-200"
              :class="zoomed ? '' : 'cursor-pointer'"
              stroke-width="1"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
              @pointerenter="hoverPref = p.id"
              @pointerleave="hoverPref = null"
              @click="onPrefClick(p)"
            />

            <!-- Routes: casing, line, the hovered or open day, then wide hit areas per day -->
            <g
              v-for="r in routes"
              :key="r.id"
              :opacity="yearShown(r.year) ? 1 : 0.12"
              class="transition-opacity duration-200"
            >
              <path
                :d="r.d"
                fill="none"
                class="pointer-events-none stroke-navy-950"
                stroke-width="4.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
              <path
                :d="r.d"
                fill="none"
                :stroke="r.color"
                :stroke-width="zoom < STOP_ZOOM ? 1.5 : 2"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
                class="pointer-events-none"
              />
              <path
                v-if="litDay(r)"
                :d="litDay(r)!.d"
                fill="none"
                class="pointer-events-none stroke-ink"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
              <template v-if="yearShown(r.year)">
                <path
                  v-for="day in r.days"
                  :key="day.n"
                  :d="day.d"
                  fill="none"
                  stroke="transparent"
                  stroke-width="16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  vector-effect="non-scaling-stroke"
                  pointer-events="stroke"
                  class="cursor-pointer"
                  @pointerenter="hoverDay = { route: r.id, i: day.n - 1 }"
                  @pointerleave="hoverDay = null"
                  @click="onDayClick(r, day.n - 1)"
                />
              </template>
            </g>

            <g
              v-for="m in mapMarkers"
              :key="m.id"
              :transform="`translate(${m.x} ${m.y})`"
              :opacity="markerOpacity(m)"
              class="transition-opacity duration-200"
              :class="yearShown(m.year) ? 'cursor-pointer' : 'pointer-events-none'"
              @pointerenter="hoverPlace = m.id"
              @pointerleave="hoverPlace = null"
              @click="onMarkerClick(m.id)"
            >
              <circle
                :r="px(11)"
                fill="transparent"
              />
              <path
                v-if="m.route"
                :d="tentD"
                :fill="m.color"
                class="stroke-navy-950"
                stroke-width="1.5"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
              <circle
                v-else
                :r="px(4.5)"
                :fill="m.color"
                class="stroke-navy-950"
                stroke-width="1.5"
                vector-effect="non-scaling-stroke"
              />
            </g>

            <g
              v-if="!animating"
              class="pointer-events-none"
            >
              <text
                v-for="lbl in labels"
                :key="lbl.id"
                :x="lbl.x"
                :y="lbl.y"
                :text-anchor="lbl.anchor"
                :font-size="px(11)"
                :stroke-width="px(3)"
                paint-order="stroke"
                stroke-linejoin="round"
                class="fill-ink stroke-navy-950 font-sans"
              >{{ lbl.name }}</text>
            </g>

            <!-- Hovered or selected marker drawn last so it sits on top. -->
            <g
              v-for="m in focusMarkers"
              :key="`focus-${m.id}`"
              :transform="`translate(${m.x} ${m.y})`"
              class="pointer-events-none"
            >
              <circle
                v-if="m.id === selected"
                :r="px(11)"
                fill="none"
                :stroke="m.color"
                stroke-width="1.5"
                vector-effect="non-scaling-stroke"
                class="marker-ping"
              />
              <path
                v-if="m.route"
                :d="tentFocusD"
                :fill="m.color"
                class="stroke-ink"
                stroke-width="2"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
              <circle
                v-else
                :r="px(6.5)"
                :fill="m.color"
                class="stroke-ink"
                stroke-width="2"
                vector-effect="non-scaling-stroke"
              />
            </g>
          </svg>

          <!-- Tooltip -->
          <div
            v-if="tip"
            class="pointer-events-none absolute z-10 w-max max-w-56 -translate-x-1/2 rounded border border-line-strong bg-navy-950/95 shadow-lg shadow-navy-950/50"
            :class="[tip.below ? 'translate-y-4' : '-translate-y-[calc(100%+1rem)]', tip.photo ? 'p-1.5' : 'px-3 py-2']"
            :style="{ left: `${tip.left}px`, top: `${tip.top}px` }"
          >
            <img
              v-if="tip.photo"
              :src="tip.photo"
              alt=""
              width="176"
              height="132"
              class="mb-2 aspect-[4/3] w-44 rounded-sm object-cover"
            >
            <div :class="tip.photo && 'px-1.5 pb-1'">
              <p class="text-sm font-semibold leading-snug text-ink">
                {{ tip.title }}
              </p>
              <p class="mt-1 flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                <span
                  class="h-2 w-2 shrink-0 rounded-full"
                  :style="{ backgroundColor: tip.color }"
                />
                {{ tip.meta }}
              </p>
            </div>
          </div>

          <!-- Zoom and full-screen controls -->
          <div class="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded border border-line bg-navy-950/90">
            <button
              v-for="c in zoomControls"
              :key="c.label"
              type="button"
              :aria-label="c.label"
              :title="c.label"
              :disabled="c.disabled"
              class="grid h-9 w-9 place-items-center border-b border-line text-ink-muted transition-colors last:border-b-0 hover:text-accent disabled:pointer-events-none disabled:opacity-30"
              @click="c.action"
            >
              <Icon
                :name="c.icon"
                size="16"
              />
            </button>
          </div>

          <!-- Status line -->
          <p
            class="pointer-events-none absolute bottom-3 left-3 rounded bg-navy-950/80 px-2 py-1 font-mono text-[11px] text-ink-muted"
            :class="peek && 'max-md:hidden'"
          >
            {{ status }}
          </p>

          <!-- Year legend, doubles as a filter -->
          <div
            class="absolute bottom-3 right-3 z-10 rounded border border-line bg-navy-950/90 p-1 font-mono"
            :class="peek && 'max-md:hidden'"
          >
            <div class="flex items-baseline justify-between gap-3 px-1.5 pb-0.5 pt-0.5">
              <UiEyebrow class="text-[10px]">
                {{ tx.year }}
              </UiEyebrow>
              <button
                type="button"
                class="text-[10px] text-ink-faint transition-colors hover:text-accent"
                :class="!activeYears.length && 'invisible'"
                @click="activeYears = []"
              >
                {{ tx.all }}
              </button>
            </div>
            <ul>
              <li
                v-for="y in yearRows"
                :key="y.year"
              >
                <button
                  type="button"
                  :aria-pressed="activeYears.includes(y.year)"
                  :title="tx.places(y.count)"
                  class="flex w-full items-center gap-2 rounded-sm px-1.5 py-px text-left leading-4 transition-colors hover:bg-navy-800"
                  :class="yearShown(y.year) ? 'text-ink' : 'text-ink-faint'"
                  @click="toggleYear(y.year)"
                  @pointerenter="hoverYear = y.year"
                  @pointerleave="hoverYear = null"
                  @focus="hoverYear = y.year"
                  @blur="hoverYear = null"
                >
                  <span
                    class="h-2 w-3 shrink-0 rounded-sm transition-opacity"
                    :style="{ backgroundColor: y.color, opacity: yearShown(y.year) ? 1 : 0.25 }"
                  />
                  <span class="text-[11px] tabular-nums md:text-xs">{{ y.year }}</span>
                  <span class="ml-auto hidden pl-1 text-[11px] tabular-nums text-ink-faint sm:inline">{{ y.count }}</span>
                </button>
              </li>
            </ul>
          </div>

          <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-300"
            leave-to-class="opacity-0"
          >
            <div
              v-if="wheelHint"
              class="pointer-events-none absolute inset-0 grid place-items-center bg-navy-950/50"
            >
              <p class="rounded border border-line-strong bg-navy-950/95 px-3 py-2 font-mono text-xs text-ink">
                {{ tx.wheel(isMac) }}
              </p>
            </div>
          </Transition>

          <!-- Small screens: what was tapped, right on the map -->
          <div
            v-if="peek"
            class="absolute inset-x-2 bottom-2 z-20 flex items-start gap-3 rounded-md border border-line-strong bg-navy-900/95 p-2 shadow-lg shadow-navy-950/60 md:hidden"
          >
            <button
              type="button"
              class="relative h-20 w-20 shrink-0 overflow-hidden rounded"
              :disabled="!peek.photos.length"
              :aria-label="$t('common.viewPhotos', { name: peek.title })"
              @click="openPhotos(0)"
            >
              <img
                v-if="peek.photos[0]"
                :src="peek.photos[0]"
                alt=""
                class="h-full w-full object-cover"
              >
              <PhotoStub
                v-else
                :name="peek.title"
                compact
                class="h-full w-full rounded"
              />
              <span
                v-if="peek.photos.length > 1"
                class="absolute bottom-1 right-1 rounded-sm bg-navy-950/85 px-1 font-mono text-[10px] text-ink"
              >{{ peek.photos.length }}</span>
            </button>
            <div class="min-w-0 flex-1 py-0.5">
              <p class="truncate font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {{ peek.eyebrow }}
              </p>
              <p class="mt-0.5 truncate text-sm font-semibold text-ink">
                {{ peek.title }}
              </p>
              <p class="mt-0.5 line-clamp-2 text-xs leading-snug text-ink-muted">
                {{ peek.meta }}
              </p>
              <div
                v-if="selectedDay"
                class="mt-1.5 flex gap-1.5"
              >
                <button
                  v-for="dir in [-1, 1]"
                  :key="dir"
                  type="button"
                  :disabled="!dayAt(dir)"
                  class="inline-flex items-center gap-1 rounded border border-line px-2 py-0.5 font-mono text-[11px] text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
                  @click="stepDay(dir)"
                >
                  <Icon
                    v-if="dir < 0"
                    name="lucide:chevron-left"
                    size="12"
                  />
                  {{ tx.day(selectedDay.n + dir) }}
                  <Icon
                    v-if="dir > 0"
                    name="lucide:chevron-right"
                    size="12"
                  />
                </button>
              </div>
              <button
                v-else-if="!selectedPlace && selectedRouteView"
                type="button"
                class="mt-1.5 inline-flex items-center gap-1 rounded border border-line px-2 py-0.5 font-mono text-[11px] text-ink-muted transition-colors hover:text-ink"
                @click="selectDay(selectedRouteView, 0)"
              >
                {{ tx.day(1) }}
                <Icon
                  name="lucide:chevron-right"
                  size="12"
                />
              </button>
            </div>
            <button
              type="button"
              :aria-label="$t('common.close')"
              class="grid h-8 w-8 shrink-0 place-items-center rounded text-ink-muted transition-colors hover:text-ink"
              @click="back"
            >
              <Icon
                name="lucide:x"
                size="16"
              />
            </button>
          </div>
        </div>
        <figcaption
          v-if="!full"
          class="mt-4 font-mono text-xs leading-relaxed text-ink-faint"
        >
          {{ tx.caption }}
          <span class="hidden md:inline">{{ tx.captionDrag }}</span>
          {{ tx.captionSource }}
        </figcaption>
      </figure>

      <!-- Details: a place or day, a route, the places of a region, or an overview -->
      <div
        :class="full
          ? 'min-h-0 overflow-y-auto overscroll-contain max-md:hidden md:col-start-2 md:row-start-2 md:border-l md:border-line md:px-6 md:pb-6 md:pt-4'
          : 'md:col-span-4 md:row-start-2 md:self-start'"
        aria-live="polite"
      >
        <article
          v-if="selectedPlace"
          class="rounded-md border border-line p-5"
          :class="full ? 'bg-navy-900' : 'bg-navy-800/60'"
        >
          <PhotoCover
            :photos="selectedPlace.photos ?? []"
            :name="selectedPlace.name"
            @open="openPhotos"
          />
          <UiEyebrow>
            {{ selectedDay ? tx.dayOf(selectedDay.n, selectedRouteView!.days.length) : `${selectedPlace.prefName} · ${regionName(selectedPlace.region)}` }}
          </UiEyebrow>
          <h3 class="mt-2 font-display text-2xl leading-tight tracking-tight text-ink">
            {{ selectedPlace.name }}
          </h3>
          <p class="mt-2 flex items-center gap-2 font-mono text-xs text-ink-muted">
            <span
              class="h-2 w-2 shrink-0 rounded-full"
              :style="{ backgroundColor: selectedPlace.color }"
            />
            {{ selectedPlace.route ? stayText(selectedPlace) : whenText(selectedPlace) }}
          </p>
          <p
            v-if="selectedDay"
            class="mt-2 flex items-start gap-2 font-mono text-xs leading-relaxed text-ink-muted"
          >
            <Icon
              name="lucide:footprints"
              size="13"
              class="mt-0.5 shrink-0 text-ink-faint"
            />
            {{ selectedDay.from }} → {{ selectedPlace.name }} · {{ fmtKm(selectedDay.km) }}
          </p>
          <p
            v-if="selectedPlace.note"
            class="mt-3 text-sm leading-relaxed text-ink-muted"
          >
            {{ selectedPlace.note }}
          </p>
          <div
            v-if="selectedDay"
            class="mt-5 grid grid-cols-2 gap-2"
          >
            <button
              v-for="dir in [-1, 1]"
              :key="dir"
              type="button"
              :disabled="!dayAt(dir)"
              class="flex items-center gap-1.5 rounded border border-line px-3 py-2 text-left text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-30"
              :class="dir > 0 && 'flex-row-reverse text-right'"
              @click="stepDay(dir)"
            >
              <Icon
                :name="dir < 0 ? 'lucide:chevron-left' : 'lucide:chevron-right'"
                size="14"
                class="shrink-0"
              />
              <span class="min-w-0 flex-1">
                <span class="block font-mono text-[10px] uppercase tracking-wider text-ink-faint">{{ tx.day(selectedDay.n + dir) }}</span>
                <span class="block truncate">{{ dayAt(dir)?.to?.name ?? '–' }}</span>
              </span>
            </button>
          </div>
          <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              class="group inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
              @click="back"
            >
              <Icon
                name="lucide:arrow-left"
                size="15"
              />
              <span class="link-underline">{{ backLabel }}</span>
            </button>
            <UiButtonLink :to="`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`">
              Google Maps
            </UiButtonLink>
          </div>
        </article>

        <article
          v-else-if="selectedRouteView"
          class="rounded-md border border-line p-5"
          :class="full ? 'bg-navy-900' : 'bg-navy-800/60'"
        >
          <PhotoCover
            :photos="selectedRouteView.photos ?? []"
            :name="selectedRouteView.name"
            @open="openPhotos"
          />
          <UiEyebrow>{{ regionName(selectedRouteView.region) }} · {{ selectedRouteView.year }}</UiEyebrow>
          <h3 class="mt-2 font-display text-2xl leading-tight tracking-tight text-ink">
            {{ selectedRouteView.name }}
          </h3>
          <p class="mt-2 flex items-center gap-2 font-mono text-xs text-ink-muted">
            <span
              class="h-2 w-2 shrink-0 rounded-full"
              :style="{ backgroundColor: selectedRouteView.color }"
            />
            {{ fmtRange(selectedRouteView.first, selectedRouteView.last) }}
          </p>
          <dl class="mt-4 grid grid-cols-3 border-y border-line py-3">
            <div
              v-for="s in routeStats(selectedRouteView)"
              :key="s.label"
            >
              <dt class="eyebrow">
                {{ s.label }}
              </dt>
              <dd class="mt-1 font-display text-xl tabular-nums text-ink">
                {{ s.value }}
              </dd>
            </div>
          </dl>
          <p
            v-if="selectedRouteView.note"
            class="mt-3 text-sm leading-relaxed text-ink-muted"
          >
            {{ selectedRouteView.note }}
          </p>
          <ol
            class="mt-2 overflow-y-auto"
            :class="full ? '' : 'max-h-80'"
          >
            <li
              v-for="item in selectedRouteView.itinerary"
              :key="item.key"
              class="border-b border-line last:border-b-0"
            >
              <button
                v-if="item.day"
                type="button"
                class="group flex w-full items-baseline gap-3 py-2 text-left"
                @pointerenter="hoverDay = { route: selectedRouteView.id, i: item.day.n - 1 }"
                @pointerleave="hoverDay = null"
                @focus="hoverDay = { route: selectedRouteView.id, i: item.day.n - 1 }"
                @blur="hoverDay = null"
                @click="selectDay(selectedRouteView, item.day.n - 1)"
              >
                <span class="w-5 shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">{{ String(item.day.n).padStart(2, '0') }}</span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-1.5 text-sm text-ink-muted transition-colors group-hover:text-ink group-focus-visible:text-ink">
                    <span class="truncate">{{ item.day.to?.name }}</span>
                    <Icon
                      v-if="item.day.to?.photos?.length"
                      name="lucide:image"
                      size="12"
                      class="shrink-0 text-ink-faint"
                    />
                  </span>
                  <span class="block font-mono text-[11px] text-ink-faint">{{ fmtDay(item.day.date, false) }}</span>
                </span>
                <span class="shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">{{ fmtKm(item.day.km) }}</span>
              </button>
              <p
                v-else
                class="flex items-center gap-2 py-2 pl-8 font-mono text-[11px] text-ink-faint"
              >
                <Icon
                  name="lucide:tent"
                  size="12"
                  class="shrink-0"
                />
                {{ item.text }}
              </p>
            </li>
          </ol>
          <div class="mt-5">
            <button
              type="button"
              class="group inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
              @click="back"
            >
              <Icon
                name="lucide:arrow-left"
                size="15"
              />
              <span class="link-underline">{{ backLabel }}</span>
            </button>
          </div>
        </article>

        <div v-else-if="region">
          <div class="flex items-baseline justify-between">
            <UiEyebrow>{{ regionName(region) }}</UiEyebrow>
            <span class="font-mono text-[11px] tabular-nums text-ink-faint">{{ tx.places(regionCount) }}</span>
          </div>
          <ul
            class="mt-4 overflow-y-auto border-t border-line"
            :class="full ? '' : 'max-h-[22rem]'"
          >
            <li
              v-for="r in regionRoutes"
              :key="r.id"
              class="border-b border-line"
            >
              <button
                type="button"
                class="flex w-full items-center gap-3 py-2 text-left text-sm text-ink transition-colors hover:text-accent"
                @click="showRoute(r.id)"
              >
                <Icon
                  name="lucide:footprints"
                  size="14"
                  class="shrink-0"
                  :style="{ color: r.color }"
                />
                <span class="truncate">{{ r.name }}</span>
                <span class="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">{{ tx.stagesN(r.days.length) }}</span>
              </button>
            </li>
            <li
              v-for="m in regionPlaces"
              :key="m.id"
              class="border-b border-line"
            >
              <button
                type="button"
                class="flex w-full items-center gap-3 py-2 text-left text-sm text-ink-muted transition-colors hover:text-ink focus-visible:text-ink"
                @pointerenter="hoverPlace = m.id"
                @pointerleave="hoverPlace = null"
                @focus="hoverPlace = m.id"
                @blur="hoverPlace = null"
                @click="showPlace(m.id)"
              >
                <span
                  class="h-2 w-2 shrink-0 rounded-full"
                  :style="{ backgroundColor: m.color }"
                />
                <span class="truncate">{{ m.name }}</span>
                <Icon
                  v-if="m.photos?.length"
                  name="lucide:image"
                  size="12"
                  class="shrink-0 text-ink-faint"
                />
                <span class="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">{{ m.year }}</span>
              </button>
            </li>
          </ul>
        </div>

        <div v-else>
          <dl class="grid grid-cols-3 gap-4 border-t border-line pt-4 md:grid-cols-1 md:gap-0 md:pt-0">
            <div
              v-for="s in stats"
              :key="s.label"
              class="md:flex md:items-baseline md:justify-between md:border-b md:border-line md:py-2.5"
            >
              <dt class="eyebrow">
                {{ s.label }}
              </dt>
              <dd class="mt-1 whitespace-nowrap font-display text-2xl tabular-nums text-ink md:mt-0">
                {{ s.value }}
              </dd>
            </div>
          </dl>
          <button
            v-for="r in routes"
            :key="r.id"
            type="button"
            class="mt-5 flex w-full items-center gap-3 rounded border border-line px-3 py-2.5 text-left text-sm text-ink transition-colors hover:border-line-strong hover:text-accent"
            @click="showRoute(r.id)"
          >
            <Icon
              name="lucide:footprints"
              size="15"
              class="shrink-0"
              :style="{ color: r.color }"
            />
            <span class="min-w-0 flex-1">
              <span class="block">{{ r.name }}</span>
              <span class="mt-0.5 block font-mono text-[11px] text-ink-faint">{{ tx.stagesN(r.days.length) }} · {{ Math.round(r.km) }} km</span>
            </span>
            <Icon
              name="lucide:arrow-right"
              size="15"
              class="shrink-0 text-ink-faint"
            />
          </button>
          <p class="mt-5 text-sm leading-relaxed text-ink-muted">
            {{ tx.hint }}
          </p>
        </div>
      </div>

      <PhotoLightbox
        v-model:index="lightboxIndex"
        :items="lightboxItems"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * JapanMap — interactive SVG map of Japan with lat/lng markers and routes.
 *
 * - Prefecture outlines are pre-projected (app/data/japan-map.ts); places and
 *   routes are projected at runtime, so adding a place is just lat/lng/year.
 * - Which prefecture a place lies in is found by point-in-polygon on the same
 *   paths; prefectures take the colour of their earliest year.
 * - Routes are drawn per day; their night stops are places with a `route`,
 *   shown as tents once zoomed in.
 * - Zoom is an animated viewBox that follows the frame's aspect ratio (the
 *   full-screen frame is not 1000:965). Markers, labels and strokes are scaled
 *   by the inverse zoom so they stay the same size on screen.
 * - Touch: page scroll wins at full view; once zoomed in (or full screen),
 *   drag pans and pinch zooms. The mouse wheel zooms with Ctrl/⌘, or always
 *   when full screen.
 */
import { MAP, PREFECTURES, REGIONS, projectLatLng, type Prefecture, type RegionId } from '~/data/japan-map'
import { PLACES, ROUTES, YEARS } from '~/data/japan-places'
import type { LightboxItem } from '~/components/PhotoLightbox.vue'
import type { Localized } from '#shared/types/localized'

const LAND = '#142037'
const MAX_ZOOM = 14
/** Below this zoom route stops are hidden and a click on a route shows all of it. */
const STOP_ZOOM = 2.5
/** Height of the small-screen peek card plus its margin, in px. */
const PEEK_COVER = 128

type Box = [number, number, number, number]

/* ------------------------------------------------------------------ */
/* Geometry: which prefecture contains a point                          */
/* ------------------------------------------------------------------ */

interface Shape {
  id: number
  box: Box
  rings: number[][]
}

const emptyBox = (): Box => [Infinity, Infinity, -Infinity, -Infinity]

function grow(b: Box, x: number, y: number) {
  b[0] = Math.min(b[0], x)
  b[1] = Math.min(b[1], y)
  b[2] = Math.max(b[2], x)
  b[3] = Math.max(b[3], y)
}

const shapes: Shape[] = PREFECTURES.map((p) => {
  const rings = p.d.split('Z').filter(Boolean).map(seg =>
    seg.slice(1).split('L').flatMap(pt => pt.split(',').map(Number)))
  const box = emptyBox()
  for (const r of rings) {
    for (let i = 0; i < r.length; i += 2) grow(box, r[i]!, r[i + 1]!)
  }
  return { id: p.id, box, rings }
})

function contains(s: Shape, x: number, y: number) {
  if (x < s.box[0] || x > s.box[2] || y < s.box[1] || y > s.box[3]) return false
  let inside = false
  for (const r of s.rings) {
    for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
      const xi = r[i]!, yi = r[i + 1]!, xj = r[j]!, yj = r[j + 1]!
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

// Coastal spots can fall just outside the simplified outline: take the
// prefecture with the nearest vertex instead.
function prefectureAt(x: number, y: number): Prefecture {
  let hit = shapes.find(s => contains(s, x, y))
  if (!hit) {
    let best = Infinity
    for (const s of shapes) {
      for (const r of s.rings) {
        for (let i = 0; i < r.length; i += 2) {
          const d = (r[i]! - x) ** 2 + (r[i + 1]! - y) ** 2
          if (d < best) {
            best = d
            hit = s
          }
        }
      }
    }
  }
  return PREFECTURES.find(p => p.id === hit!.id)!
}

/* ------------------------------------------------------------------ */
/* Dates, formatted by hand so server and browser render the same text  */
/* ------------------------------------------------------------------ */

// The page remounts on a language switch (it is another route), so the
// strings are picked once per mount.
const l = useLocalized()
const { locale } = useI18n()
const de = locale.value === 'de'
const pick = (v: string | Localized) => (typeof v === 'string' ? v : l(v))

const tx = l({
  de: {
    region: 'Region',
    year: 'Jahr',
    all: 'Alle',
    allJapan: 'Ganz Japan',
    overview: 'Übersicht',
    allStages: 'Alle Etappen',
    mapLabel: 'Karte von Japan mit allen Orten, an denen ich gelebt, gearbeitet und gereist bin',
    caption: 'Punkte zeigen Orte, Zelte die Nächte der Fernwanderung, Flächen die Präfekturen im Jahr des ersten Besuchs.',
    captionDrag: 'Ziehen zum Verschieben, Präfektur anklicken zum Hineinzoomen.',
    captionSource: 'Kartengrundlage: Global Map Japan (GSI).',
    hint: 'Wähle eine Region oder tippe auf einen Punkt, um Fotos und Details zu sehen.',
    zoomIn: 'Hineinzoomen',
    zoomOut: 'Herauszoomen',
    fullscreen: 'Vollbild',
    exitFullscreen: 'Vollbild beenden',
    km: 'Km',
    stages: 'Etappen',
    days: 'Tage',
    placesLabel: 'Orte',
    prefectures: 'Präfekturen',
    period: 'Zeitraum',
    goal: 'Ziel',
    wheel: (mac: boolean) => `${mac ? '⌘' : 'Strg'} + Scrollen zum Zoomen`,
    places: (n: number) => `${n} ${n === 1 ? 'Ort' : 'Orte'}`,
    stagesN: (n: number) => `${n} ${n === 1 ? 'Etappe' : 'Etappen'}`,
    day: (n: number) => `Tag ${n}`,
    dayOf: (n: number, total: number) => `Tag ${n} von ${total}`,
    nights: (n: number) => (n === 1 ? '1 Nacht' : `${n} Nächte`),
    rest: (n: number, where?: string) => `${n === 1 ? 'Ruhetag' : `${n} Ruhetage`} in ${where}`
  },
  en: {
    region: 'Region',
    year: 'Year',
    all: 'All',
    allJapan: 'All of Japan',
    overview: 'Overview',
    allStages: 'All stages',
    mapLabel: 'Map of Japan with every place I lived, worked and travelled',
    caption: 'Dots are places, tents the nights of the long-distance hike, areas the prefectures in the year of the first visit.',
    captionDrag: 'Drag to pan, click a prefecture to zoom in.',
    captionSource: 'Base map: Global Map Japan (GSI).',
    hint: 'Pick a region or tap a dot to see photos and details.',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    km: 'Km',
    stages: 'Stages',
    days: 'Days',
    placesLabel: 'Places',
    prefectures: 'Prefectures',
    period: 'Period',
    goal: 'finish',
    wheel: (mac: boolean) => `${mac ? '⌘' : 'Ctrl'} + scroll to zoom`,
    places: (n: number) => `${n} ${n === 1 ? 'place' : 'places'}`,
    stagesN: (n: number) => `${n} ${n === 1 ? 'stage' : 'stages'}`,
    day: (n: number) => `Day ${n}`,
    dayOf: (n: number, total: number) => `Day ${n} of ${total}`,
    nights: (n: number) => (n === 1 ? '1 night' : `${n} nights`),
    rest: (n: number, where?: string) => `${n === 1 ? 'Rest day' : `${n} rest days`} in ${where}`
  }
})

const MONTHS = de
  ? ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = de
  ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// German writes "9. Aug", English "9 Aug".
const DOT = de ? '.' : ''
const DAY_MS = 864e5

function dateParts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
  return { y, m, d, day: Date.UTC(y, m - 1, d) / DAY_MS }
}

const addDays = (iso: string, n: number) => new Date((dateParts(iso).day + n) * DAY_MS).toISOString().slice(0, 10)
const daysBetween = (a: string, b: string) => dateParts(b).day - dateParts(a).day

function fmtDay(iso: string, withYear = true) {
  const { y, m, d, day } = dateParts(iso)
  // Day 0 of the Unix epoch was a Thursday.
  return `${WEEKDAYS[(day + 4) % 7]}, ${d}${DOT} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ''}`
}

function fmtRange(from: string, to: string) {
  const a = dateParts(from)
  const b = dateParts(to)
  if (a.m === b.m) return `${a.d}${DOT}–${b.d}${DOT} ${MONTHS[b.m - 1]} ${b.y}`
  return `${a.d}${DOT} ${MONTHS[a.m - 1]} – ${b.d}${DOT} ${MONTHS[b.m - 1]} ${b.y}`
}

const fmtKm = (km: number) => `${de ? km.toFixed(1).replace('.', ',') : km.toFixed(1)} km`

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const yearColor = (year: number) => YEARS.find(y => y.year === year)?.color ?? '#9AA6BC'
const regionName = (id: RegionId) => REGIONS.find(r => r.id === id)!.name

const markers = PLACES.map((p) => {
  const [x, y] = projectLatLng(p.lat, p.lng)
  const pref = prefectureAt(x, y)
  return { ...p, name: pick(p.name), note: p.note && l(p.note), x, y, pref: pref.id, prefName: pref.name, region: pref.region, color: yearColor(p.year) }
})
type Marker = (typeof markers)[number]

const prefYears = new Map<number, number[]>()
for (const m of markers) {
  const list = prefYears.get(m.pref) ?? []
  if (!list.includes(m.year)) list.push(m.year)
  prefYears.set(m.pref, list.sort())
}

/** Nights spent at each route stop; null for the last one. */
const nights = new Map<string, number | null>()

const toD = (pts: [number, number][]) => 'M' + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')

const routes = ROUTES.map((r) => {
  const stops = markers
    .filter(m => m.route === r.id && m.date)
    .sort((a, b) => a.date!.localeCompare(b.date!))
  stops.forEach((s, i) => nights.set(s.id, stops[i + 1] ? daysBetween(s.date!, stops[i + 1]!.date!) : null))

  const box = emptyBox()
  let from = r.start
  const days = r.stages.map((s, i) => {
    const pts = s.path.map(([lat, lng]) => projectLatLng(lat, lng))
    const dayBox = emptyBox()
    for (const [x, y] of pts) {
      grow(dayBox, x, y)
      grow(box, x, y)
    }
    // A day ends at the latest stop reached by its date.
    const to = [...stops].reverse().find(p => p.date! <= s.date)
    const day = { n: i + 1, date: s.date, km: s.km, d: toD(pts), box: dayBox, mid: pts[Math.floor(pts.length / 2)]!, from, to }
    from = to?.name ?? from
    return day
  })

  // Walking days with the rest days in between.
  const itinerary: { key: string, day?: (typeof days)[number], text?: string }[] = []
  days.forEach((day, i) => {
    itinerary.push({ key: day.date, day })
    const next = days[i + 1]
    const rest = next ? daysBetween(day.date, next.date) - 1 : 0
    if (next && rest > 0) {
      const first = addDays(day.date, 1)
      const when = rest === 1 ? fmtDay(first, false) : fmtRange(first, addDays(next.date, -1)).replace(/ \d{4}$/, '')
      itinerary.push({ key: `rest-${first}`, text: `${when} · ${tx.rest(rest, day.to?.name)}` })
    }
  })

  return {
    ...r,
    name: pick(r.name),
    note: r.note && l(r.note),
    color: yearColor(r.year),
    region: stops[0]?.region ?? 'hokkaido',
    d: days.map(day => day.d).join(''),
    box,
    days,
    itinerary,
    first: r.stages[0]!.date,
    last: r.stages[r.stages.length - 1]!.date,
    km: r.stages.reduce((sum, s) => sum + s.km, 0)
  }
})
type RouteView = (typeof routes)[number]
type Day = RouteView['days'][number]

const routeStats = (r: RouteView) => [
  { label: tx.km, value: Math.round(r.km) },
  { label: tx.stages, value: r.days.length },
  { label: tx.days, value: daysBetween(r.first, r.last) + 1 }
]

const whenText = (m: Marker) => (m.date ? fmtDay(m.date) : String(m.year))

function stayText(m: Marker) {
  const n = nights.get(m.id)
  if (!m.date) return String(m.year)
  if (n == null) return `${fmtDay(m.date)} · ${tx.goal}`
  if (n === 1) return `${fmtDay(m.date)} · ${tx.nights(1)}`
  return `${fmtRange(m.date, addDays(m.date, n))} · ${tx.nights(n)}`
}

const yearRows = YEARS.map(y => ({ ...y, count: markers.filter(m => m.year === y.year).length }))

// A span rather than a count of years: the page speaks of five years
// living there, the first trips came before.
const stats = [
  { label: tx.placesLabel, value: markers.length },
  { label: tx.prefectures, value: `${prefYears.size}/47` },
  { label: tx.period, value: `${YEARS[0]!.year}–${String(YEARS[YEARS.length - 1]!.year).slice(2)}` }
]

/* ------------------------------------------------------------------ */
/* State                                                                */
/* ------------------------------------------------------------------ */

const activeYears = ref<number[]>([])
const hoverYear = ref<number | null>(null)
const hoverPref = ref<number | null>(null)
const hoverPlace = ref<string | null>(null)
const hoverDay = ref<{ route: string, i: number } | null>(null)
const selected = ref<string | null>(null)
const selectedRoute = ref<string | null>(null)
/** Index of the day shown with a selected route stop. */
const activeDay = ref<number | null>(null)
const region = ref<RegionId | null>(null)

const yearShown = (year: number) => !activeYears.value.length || activeYears.value.includes(year)

function toggleYear(year: number) {
  const list = activeYears.value
  activeYears.value = list.includes(year) ? list.filter(y => y !== year) : [...list, year]
}

const regionOptions = computed(() => [
  { id: null, name: tx.allJapan, count: 0 },
  ...REGIONS.map(r => ({
    id: r.id,
    name: r.name,
    count: markers.filter(m => m.region === r.id && yearShown(m.year)).length
  }))
])

const regionCount = computed(() => markers.filter(m => m.region === region.value && yearShown(m.year)).length)

// Route stops are listed through their route.
const regionPlaces = computed(() => markers
  .filter(m => m.region === region.value && !m.route && yearShown(m.year))
  .sort((a, b) => a.name.localeCompare(b.name, locale.value)))

const regionRoutes = computed(() => routes.filter(r => r.region === region.value && yearShown(r.year)))

const selectedPlace = computed(() => markers.find(m => m.id === selected.value) ?? null)
const selectedRouteView = computed(() => routes.find(r => r.id === selectedRoute.value) ?? null)
const selectedDay = computed(() =>
  selectedPlace.value?.route && activeDay.value !== null ? selectedRouteView.value?.days[activeDay.value] ?? null : null)

const dayAt = (dir: number) =>
  activeDay.value === null ? undefined : selectedRouteView.value?.days[activeDay.value + dir]

const backLabel = computed(() => {
  if (selectedPlace.value?.route) return tx.allStages
  return region.value ? regionName(region.value) : tx.overview
})

/* ------------------------------------------------------------------ */
/* View: animated viewBox                                               */
/* ------------------------------------------------------------------ */

interface View { x: number, y: number, w: number }

// Size of the map on screen; SSR renders with a typical desktop width.
const frame = ref<HTMLDivElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)
const frameW = ref(740)
const frameH = ref((740 * MAP.height) / MAP.width)
const aspect = computed(() => frameH.value / frameW.value)
const isWide = ref(true)

/** The whole map, letterboxed when the frame is wider or taller than it. */
function homeView(): View {
  const w = Math.max(MAP.width, MAP.height / aspect.value)
  return { w, x: (MAP.width - w) / 2, y: (MAP.height - w * aspect.value) / 2 }
}

const view = reactive<View>({ x: 0, y: 0, w: MAP.width })
const viewBox = computed(() => `${view.x} ${view.y} ${view.w} ${view.w * aspect.value}`)
const zoom = computed(() => homeView().w / view.w)
const zoomed = computed(() => zoom.value > 1.01)

/** Converts screen pixels to map units at the current zoom. */
const px = (n: number) => (n * view.w) / frameW.value

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

// Limits zoom around the view's centre, then keeps the map in frame.
function clampView(v: View): View {
  const cx = v.x + v.w / 2
  const cy = v.y + (v.w * aspect.value) / 2
  const w = clamp(v.w, MAP.width / MAX_ZOOM, homeView().w)
  const h = w * aspect.value
  return {
    w,
    x: w >= MAP.width ? (MAP.width - w) / 2 : clamp(cx - w / 2, 0, MAP.width - w),
    y: h >= MAP.height ? (MAP.height - h) / 2 : clamp(cy - h / 2, 0, MAP.height - h)
  }
}

// On small screens the peek card covers the bottom of the map; frame things
// in the part above it.
const coveredBottom = () => (!isWide.value && (selected.value || selectedRoute.value) ? PEEK_COVER / frameH.value : 0)

function fitBox(box: readonly [number, number, number, number], pad = 0.12): View {
  const [x0, y0, x1, y1] = box
  const cover = coveredBottom()
  const w = Math.max(x1 - x0, (y1 - y0) / (aspect.value * (1 - cover))) * (1 + pad * 2)
  const h = w * aspect.value
  return clampView({ x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 + (h * cover) / 2 - h / 2, w })
}

let raf = 0
let reducedMotion = false
// Labels are hidden mid-flight so they don't reshuffle on every frame.
const animating = ref(false)

function animateTo(target: View) {
  const to = clampView(target)
  cancelAnimationFrame(raf)
  if (reducedMotion || typeof window === 'undefined') {
    Object.assign(view, to)
    return
  }
  animating.value = true
  const from = { ...view }
  const a = aspect.value
  const fromCx = from.x + from.w / 2
  const fromCy = from.y + (from.w * a) / 2
  const toCx = to.x + to.w / 2
  const toCy = to.y + (to.w * a) / 2
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / 650)
    const e = 1 - (1 - t) ** 3
    // Interpolate width geometrically so zooming feels even.
    const w = from.w * (to.w / from.w) ** e
    view.w = w
    view.x = fromCx + (toCx - fromCx) * e - w / 2
    view.y = fromCy + (toCy - fromCy) * e - (w * a) / 2
    if (t < 1) raf = requestAnimationFrame(step)
    else animating.value = false
  }
  raf = requestAnimationFrame(step)
}

function stopAnimation() {
  cancelAnimationFrame(raf)
  animating.value = false
}

function zoomAround(factor: number, cx: number, cy: number, animate = false) {
  const w = clamp(view.w / factor, MAP.width / MAX_ZOOM, homeView().w)
  const s = w / view.w
  const next = { w, x: cx - (cx - view.x) * s, y: cy - (cy - view.y) * s }
  if (animate) animateTo(next)
  else Object.assign(view, clampView(next))
}

const viewCenter = () => [view.x + view.w / 2, view.y + (view.w * aspect.value) / 2] as const

const zoomControls = computed(() => [
  { label: tx.zoomIn, icon: 'lucide:plus', disabled: view.w <= MAP.width / MAX_ZOOM + 0.01, action: () => zoomAround(1.8, ...viewCenter(), true) },
  { label: tx.zoomOut, icon: 'lucide:minus', disabled: !zoomed.value, action: () => zoomAround(1 / 1.8, ...viewCenter(), true) },
  { label: tx.allJapan, icon: 'lucide:map', disabled: !zoomed.value && !region.value && !selectedRoute.value, action: reset },
  { label: full.value ? tx.exitFullscreen : tx.fullscreen, icon: full.value ? 'lucide:minimize' : 'lucide:maximize', disabled: false, action: toggleFull }
])

function clearSelection() {
  selected.value = null
  selectedRoute.value = null
  activeDay.value = null
}

function showRegion(id: RegionId) {
  region.value = id
  clearSelection()
  animateTo(fitBox(REGIONS.find(r => r.id === id)!.box))
}

function reset() {
  region.value = null
  clearSelection()
  animateTo(homeView())
}

function showRoute(id: string) {
  const r = routes.find(r => r.id === id)
  if (!r) return
  if (!yearShown(r.year)) activeYears.value = []
  selected.value = null
  activeDay.value = null
  selectedRoute.value = id
  region.value = r.region
  animateTo(fitBox(r.box, 0.08))
}

/** Shows one day of a route: its path on the map and where it ended. */
function selectDay(r: RouteView, i: number) {
  const day = r.days[i]
  if (!day) return
  if (!yearShown(r.year)) activeYears.value = []
  selectedRoute.value = r.id
  activeDay.value = i
  selected.value = day.to?.id ?? null
  region.value = r.region
  animateTo(fitBox(day.box, 0.3))
}

function stepDay(dir: number) {
  if (selectedRouteView.value && activeDay.value !== null) selectDay(selectedRouteView.value, activeDay.value + dir)
}

/** Selects a place and flies to it. Used by the lists and by the page. */
function showPlace(id: string) {
  const m = markers.find(p => p.id === id)
  if (!m) return
  const r = routes.find(r => r.id === m.route)
  if (r) {
    selectDay(r, r.days.findIndex(day => day.to?.id === id))
    return
  }
  if (!yearShown(m.year)) activeYears.value = []
  clearSelection()
  selected.value = id
  region.value = m.region
  const w = Math.min(view.w, fitBox(REGIONS.find(r => r.id === m.region)!.box).w)
  const h = w * aspect.value
  animateTo({ x: m.x - w / 2, y: m.y - h / 2 + (h * coveredBottom()) / 2, w })
}

/** One step back: day → route → region (or overview). */
function back() {
  if (selectedPlace.value?.route) {
    selected.value = null
    activeDay.value = null
  } else {
    clearSelection()
  }
}

defineExpose({ showPlace, showRegion, showRoute })

/* ------------------------------------------------------------------ */
/* Full screen: the Fullscreen API where there is one (not on iPhone),  */
/* on top of a fixed overlay that works everywhere                      */
/* ------------------------------------------------------------------ */

const shell = ref<HTMLDivElement | null>(null)
const full = ref(false)
let pageOverflow = ''

function toggleFull() {
  if (full.value) {
    exitFull()
    return
  }
  full.value = true
  pageOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  shell.value?.requestFullscreen?.({ navigationUI: 'hide' }).catch(() => {})
}

function exitFull() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  full.value = false
  document.documentElement.style.overflow = pageOverflow
}

function onFullscreenChange() {
  if (!document.fullscreenElement && full.value) exitFull()
}

function onKeydown(e: KeyboardEvent) {
  // Browsers usually take Esc out of real full screen themselves (then this
  // never fires); the lightbox handles its own Esc.
  if (e.key === 'Escape' && full.value && lightboxIndex.value === null) exitFull()
}

/* ------------------------------------------------------------------ */
/* Pointer input: drag, pinch, wheel                                    */
/* ------------------------------------------------------------------ */

const pointers = new Map<number, { x: number, y: number }>()
const dragging = ref(false)
let dragStart: { x: number, y: number, view: View } | null = null
let pinchStart: { dist: number, w: number } | null = null
let suppressClick = false

function toMap(clientX: number, clientY: number) {
  const rect = svg.value!.getBoundingClientRect()
  return [
    view.x + ((clientX - rect.left) / rect.width) * view.w,
    view.y + ((clientY - rect.top) / rect.height) * view.w * aspect.value
  ] as const
}

function pinchState() {
  const [a, b] = [...pointers.values()] as [{ x: number, y: number }, { x: number, y: number }]
  return { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  stopAnimation()
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pointers.size === 1) {
    suppressClick = false
    dragStart = { x: e.clientX, y: e.clientY, view: { ...view } }
  } else if (pointers.size === 2) {
    pinchStart = { dist: pinchState().dist, w: view.w }
    dragStart = null
  }
}

function onPointerMove(e: PointerEvent) {
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

  if (pinchStart && pointers.size === 2) {
    const { dist, cx, cy } = pinchState()
    const [mx, my] = toMap(cx, cy)
    zoomAround(view.w / (pinchStart.w * (pinchStart.dist / dist)), mx, my)
    suppressClick = true
    return
  }
  if (!dragStart || !zoomed.value) return
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  if (!dragging.value) {
    if (Math.hypot(dx, dy) < 4) return
    dragging.value = true
    svg.value?.setPointerCapture(e.pointerId)
  }
  const s = view.w / svg.value!.getBoundingClientRect().width
  Object.assign(view, clampView({ x: dragStart.view.x - dx * s, y: dragStart.view.y - dy * s, w: view.w }))
}

function onPointerUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  if (dragging.value) suppressClick = true
  if (pointers.size < 2) pinchStart = null
  if (pointers.size === 0) {
    dragging.value = false
    dragStart = null
  }
}

const wheelHint = ref(false)
const isMac = ref(false)
let hintTimer: ReturnType<typeof setTimeout> | undefined

function onWheel(e: WheelEvent) {
  if (!e.ctrlKey && !e.metaKey && !full.value) {
    // At full view a plain wheel is just page scrolling; only hint once
    // someone is actually exploring the map.
    if (!zoomed.value) return
    wheelHint.value = true
    clearTimeout(hintTimer)
    hintTimer = setTimeout(() => (wheelHint.value = false), 1100)
    return
  }
  e.preventDefault()
  wheelHint.value = false
  stopAnimation()
  const [mx, my] = toMap(e.clientX, e.clientY)
  zoomAround(Math.exp(-clamp(e.deltaY, -50, 50) * 0.01), mx, my)
}

function onPrefClick(p: Prefecture) {
  if (suppressClick) return
  // First click goes to the region, a second one into the prefecture.
  if (region.value !== p.region || zoom.value < 1.5) showRegion(p.region)
  else animateTo(fitBox(p.box, 0.3))
}

function onMarkerClick(id: string) {
  if (suppressClick) return
  if (selected.value === id) {
    back()
    return
  }
  const m = markers.find(p => p.id === id)!
  const r = routes.find(r => r.id === m.route)
  // A route stop opens the day that ended there, path and all.
  if (r) {
    selectDay(r, r.days.findIndex(day => day.to?.id === id))
    return
  }
  selectedRoute.value = null
  activeDay.value = null
  selected.value = id
  region.value = m.region
  // From the overview, also bring the region into view.
  if (zoom.value < 1.5) animateTo(fitBox(REGIONS.find(r => r.id === m.region)!.box))
}

function onDayClick(r: RouteView, i: number) {
  if (suppressClick) return
  // Days are too small to pick apart from far away.
  if (zoom.value < STOP_ZOOM && selectedRoute.value !== r.id) showRoute(r.id)
  else selectDay(r, i)
}

watch(activeYears, () => {
  if (selectedRouteView.value && !yearShown(selectedRouteView.value.year)) clearSelection()
  else if (selectedPlace.value && !yearShown(selectedPlace.value.year)) selected.value = null
})

/* ------------------------------------------------------------------ */
/* Photos                                                               */
/* ------------------------------------------------------------------ */

const lightboxIndex = ref<number | null>(null)

const lightboxItems = computed<LightboxItem[]>(() => {
  const p = selectedPlace.value
  if (p) {
    const day = selectedDay.value
    const eyebrow = day ? `${tx.day(day.n)} · ${fmtDay(day.date)}` : `${p.prefName} · ${whenText(p)}`
    return (p.photos ?? []).map(src => ({ src, title: p.name, eyebrow, text: p.note }))
  }
  const r = selectedRouteView.value
  if (r) return (r.photos ?? []).map(src => ({ src, title: r.name, eyebrow: fmtRange(r.first, r.last), text: r.note }))
  return []
})

function openPhotos(i: number) {
  if (lightboxItems.value[i]) lightboxIndex.value = i
}

/** What the small-screen card on the map shows. */
const peek = computed(() => {
  const p = selectedPlace.value
  const day = selectedDay.value
  if (p) {
    return {
      title: p.name,
      photos: p.photos ?? [],
      eyebrow: day ? `${tx.day(day.n)} · ${fmtDay(day.date)}` : `${p.prefName} · ${whenText(p)}`,
      meta: day ? `${day.from} → ${p.name} · ${fmtKm(day.km)}` : p.note ?? regionName(p.region)
    }
  }
  const r = selectedRouteView.value
  if (r) {
    return {
      title: r.name,
      photos: r.photos ?? [],
      eyebrow: `${regionName(r.region)} · ${r.year}`,
      meta: `${fmtRange(r.first, r.last)} · ${Math.round(r.km)} km`
    }
  }
  return null
})

/* ------------------------------------------------------------------ */
/* Rendering helpers                                                    */
/* ------------------------------------------------------------------ */

function mix(a: string, b: string, t: number) {
  const ca = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16))
  const cb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16))
  return '#' + ca.map((v, i) => Math.round(v * t + cb[i]! * (1 - t)).toString(16).padStart(2, '0')).join('')
}

function prefFill(id: number) {
  const years = prefYears.get(id)
  if (!years) return hoverPref.value === id ? '#1A2740' : LAND
  const shown = years.filter(yearShown)
  if (!shown.length) return mix(yearColor(years[0]!), LAND, 0.1)
  const highlight = hoverPref.value === id || (hoverYear.value !== null && shown.includes(hoverYear.value))
  return mix(yearColor(shown[0]!), LAND, highlight ? 0.6 : 0.36)
}

function markerOpacity(m: Marker) {
  if (!yearShown(m.year)) return 0.1
  if (hoverYear.value !== null && hoverYear.value !== m.year) return 0.25
  return 1
}

/** The day drawn highlighted on a route: the hovered one, else the open one. */
function litDay(r: RouteView): Day | undefined {
  if (hoverDay.value) return hoverDay.value.route === r.id ? r.days[hoverDay.value.i] : undefined
  return selectedRoute.value === r.id && activeDay.value !== null ? r.days[activeDay.value] : undefined
}

const tent = (s: number) => `M0,${px(-5.5 * s)}L${px(5.5 * s)},${px(4 * s)}L${px(-5.5 * s)},${px(4 * s)}Z`
const tentD = computed(() => tent(1))
const tentFocusD = computed(() => tent(1.4))

// Route stops only show once zoomed in, or while their route is open.
const mapMarkers = computed(() => markers.filter(m =>
  !m.route || zoom.value >= STOP_ZOOM || selectedRoute.value === m.route))

const inView = (x: number, y: number) =>
  x >= view.x && x <= view.x + view.w && y >= view.y && y <= view.y + view.w * aspect.value

const overlaps = (a: Box, b: Box) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]

// Greedy label placement once zoomed in: try right, left, above, below of
// each dot and skip the label if all four collide or leave the frame
// (hover still names it). Places with a photo go first, route stops last,
// then north to south so results are stable.
const labels = computed(() => {
  if (zoom.value < 2.2) return []
  const visible = mapMarkers.value.filter(m => yearShown(m.year) && inView(m.x, m.y))
  const size = px(11)
  const gap = px(8)
  const dot = px(5)
  const right = view.x + view.w
  const bottom = view.y + view.w * aspect.value
  const taken: Box[] = [
    ...visible.map((m): Box => [m.x - dot, m.y - dot, m.x + dot, m.y + dot]),
    // Keep clear of the controls, the status line and the peek card.
    [right - px(56), view.y, right, view.y + px(170)],
    [view.x, bottom - px(40), view.x + px(200), bottom]
  ]
  if (peek.value && !isWide.value) taken.push([view.x, bottom - px(PEEK_COVER), right, bottom])
  const fits = (b: Box) => b[0] >= view.x && b[2] <= right && b[1] >= view.y && b[3] <= bottom
  const rank = (m: Marker) => (m.photos?.length ? 0 : m.route ? 2 : 1)
  const order = [...visible].sort((a, b) => rank(a) - rank(b) || a.y - b.y)
  const out: { id: string, name: string, x: number, y: number, anchor: 'start' | 'end' | 'middle' }[] = []
  for (const m of order) {
    const w = m.name.length * size * 0.56
    const h = size
    const candidates = [
      { x: m.x + gap, y: m.y + h * 0.35, anchor: 'start' as const, box: [m.x + gap, m.y - h / 2, m.x + gap + w, m.y + h / 2] as Box },
      { x: m.x - gap, y: m.y + h * 0.35, anchor: 'end' as const, box: [m.x - gap - w, m.y - h / 2, m.x - gap, m.y + h / 2] as Box },
      { x: m.x, y: m.y - gap, anchor: 'middle' as const, box: [m.x - w / 2, m.y - gap - h, m.x + w / 2, m.y - gap] as Box },
      { x: m.x, y: m.y + gap + h * 0.75, anchor: 'middle' as const, box: [m.x - w / 2, m.y + gap, m.x + w / 2, m.y + gap + h] as Box }
    ]
    const spot = candidates.find(c => fits(c.box) && !taken.some(b => overlaps(b, c.box)))
    if (!spot) continue
    taken.push(spot.box)
    out.push({ id: m.id, name: m.name, x: spot.x, y: spot.y, anchor: spot.anchor })
  }
  return out
})

const focusMarkers = computed(() => markers.filter(m =>
  (m.id === hoverPlace.value || m.id === selected.value) && yearShown(m.year)))

interface Tip { x: number, y: number, title: string, meta: string, color: string, photo?: string }

function tipTarget(): Tip | null {
  const m = markers.find(p => p.id === hoverPlace.value)
  if (m && yearShown(m.year)) {
    return { x: m.x, y: m.y, title: m.name, meta: m.route ? whenText(m) : `${m.year} · ${m.prefName}`, color: m.color, photo: m.photos?.[0] }
  }
  const hd = hoverDay.value
  const r = hd ? routes.find(r => r.id === hd.route) : undefined
  const day = hd ? r?.days[hd.i] : undefined
  if (r && day) {
    return { x: day.mid[0], y: day.mid[1], title: `${tx.day(day.n)} · ${fmtDay(day.date)}`, meta: `${day.from} → ${day.to?.name} · ${fmtKm(day.km)}`, color: r.color }
  }
  return null
}

const tip = computed(() => {
  const t = tipTarget()
  if (!t || dragging.value || !inView(t.x, t.y)) return null
  const left = ((t.x - view.x) / view.w) * frameW.value
  const top = ((t.y - view.y) / (view.w * aspect.value)) * frameH.value
  return { ...t, left: clamp(left, 100, frameW.value - 100), top, below: top < (t.photo ? 210 : 72) }
})

const status = computed(() => {
  if (hoverPref.value !== null) {
    const pref = PREFECTURES.find(p => p.id === hoverPref.value)!
    const years = prefYears.get(pref.id)
    if (!years) return pref.name
    const n = markers.filter(m => m.pref === pref.id).length
    return `${pref.name} · ${years.join(', ')} · ${tx.places(n)}`
  }
  if (selectedRouteView.value) return selectedRouteView.value.name
  return region.value ? regionName(region.value) : tx.allJapan
})

/* ------------------------------------------------------------------ */
/* Lifecycle                                                            */
/* ------------------------------------------------------------------ */

let resizeObserver: ResizeObserver | null = null
let wideQuery: MediaQueryList | null = null
const onWideChange = () => (isWide.value = !!wideQuery?.matches)

// Keep what is in view when the frame changes size (window resize, full
// screen): the whole map stays the whole map, otherwise centre and scale stay.
function onResize(w: number, h: number) {
  if (!w || !h) return
  const wasHome = !zoomed.value
  const [cx, cy] = viewCenter()
  frameW.value = w
  frameH.value = h
  if (wasHome) Object.assign(view, homeView())
  else Object.assign(view, clampView({ w: view.w, x: cx - view.w / 2, y: cy - (view.w * aspect.value) / 2 }))
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  isMac.value = /Mac|iPhone|iPad/.test(navigator.userAgent)
  wideQuery = window.matchMedia('(min-width: 768px)')
  onWideChange()
  wideQuery.addEventListener('change', onWideChange)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  window.addEventListener('keydown', onKeydown)
  if (frame.value) {
    onResize(frame.value.clientWidth, frame.value.clientHeight)
    resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) onResize(entry.contentRect.width, entry.contentRect.height)
    })
    resizeObserver.observe(frame.value)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(hintTimer)
  resizeObserver?.disconnect()
  wideQuery?.removeEventListener('change', onWideChange)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  window.removeEventListener('keydown', onKeydown)
  if (full.value) exitFull()
})
</script>

<style scoped>
.marker-ping {
  transform-box: fill-box;
  transform-origin: center;
  animation: ping 1.8s var(--ease-out-soft) infinite;
}

@keyframes ping {
  from {
    opacity: 0.9;
    transform: scale(0.6);
  }
  to {
    opacity: 0;
    transform: scale(1.8);
  }
}
</style>
