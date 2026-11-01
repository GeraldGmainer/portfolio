<template>
  <NuxtLink
    :to="localePath('/')"
    class="group inline-flex items-center gap-x-[0.55em] whitespace-nowrap font-display tracking-tight text-ink"
  >
    <!-- GG monogram: two Fraunces italic G's, stepped like signed initials. Same artwork as /favicon.svg. -->
    <svg
      aria-hidden="true"
      class="h-[1.45em] w-auto shrink-0 transition-colors duration-200 group-hover:text-accent"
      viewBox="-1 -1 42.98 46"
    >
      <mask
        :id="maskId"
        height="46"
        maskUnits="userSpaceOnUse"
        width="42.98"
        x="-1"
        y="-1"
      >
        <rect
          fill="#fff"
          height="46"
          width="42.98"
          x="-1"
          y="-1"
        />
        <path
          :d="G"
          stroke="#000"
          stroke-width="2"
          transform="translate(15 14)"
        />
      </mask>
      <path
        :d="G"
        :mask="`url(#${maskId})`"
        fill="currentColor"
      />
      <path
        :d="G"
        fill="currentColor"
        transform="translate(15 14)"
      />
    </svg>
    <span>Gerald Gmainer</span>
  </NuxtLink>
</template>

<script lang="ts" setup>
// Header and footer both render the logo, so the mask id must be unique per instance.
const maskId = `gg-${useId()}`
const localePath = useLocalePath()

const G = 'M16.49 0Q18.07 0 19.16 0.32Q20.25 0.64 20.95 1.08Q21.64 1.52 22.05 1.86Q22.45 2.2 22.68 2.2Q22.91 2.2 23.24 1.87Q23.57 1.54 23.91 1.14Q24.24 0.75 24.58 0.43Q24.92 0.1 25.15 0.1Q25.52 0.1 25.73 0.37Q25.94 0.64 25.98 1.18L25.65 8.24Q25.69 8.7 25.49 8.91Q25.3 9.11 25.05 9.13Q24.74 9.18 24.52 8.99Q24.3 8.8 24.15 8.49L23.68 6.6Q23.16 4.78 22.29 3.67Q21.41 2.57 20.24 2.11Q19.07 1.64 17.64 1.64Q15.46 1.64 13.5 2.78Q11.55 3.92 9.96 6.05Q8.38 8.18 7.28 11.01Q6.18 13.85 5.74 17.15Q5.12 21.09 5.58 23.53Q6.05 25.97 7.32 27.13Q8.58 28.3 10.43 28.3Q11.86 28.3 13.08 27.79Q14.29 27.28 15.14 26.34Q16 25.39 16.43 23.98L17.78 19.27Q17.97 18.66 17.83 18.33Q17.7 18 17.18 17.92L15.37 17.65Q15.02 17.56 14.87 17.37Q14.73 17.17 14.75 16.92Q14.75 16.55 14.98 16.35Q15.21 16.15 15.62 16.15L24.76 16.15Q25.19 16.15 25.35 16.33Q25.5 16.51 25.5 16.84Q25.5 17.13 25.3 17.34Q25.09 17.54 24.74 17.65L23.55 17.94Q23.16 18.06 22.93 18.33Q22.7 18.6 22.58 19.08L19.75 28.9Q19.65 29.5 19.39 29.75Q19.13 30 18.76 30Q18.55 30 18.24 29.79Q17.93 29.58 17.58 29.28Q17.24 28.98 16.9 28.67Q16.56 28.36 16.27 28.13Q15.97 27.9 15.81 27.9Q15.6 27.9 15.1 28.24Q14.6 28.57 13.82 28.97Q13.03 29.38 11.9 29.68Q10.76 29.98 9.27 29.98Q6.07 29.98 3.83 28.45Q1.59 26.93 0.61 24.01Q-0.36 21.09 0.22 16.94Q0.65 13.43 2.09 10.33Q3.52 7.22 5.72 4.92Q7.92 2.62 10.68 1.31Q13.44 0 16.49 0Z'
</script>
