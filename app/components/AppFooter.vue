<template>
  <footer class="border-t border-orange-100 bg-[#FFF7F0]">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
      <div class="flex flex-col items-center gap-3 text-xs text-slate-500 sm:flex-row sm:justify-between">
        <nav class="order-1 lg:order-2 w-full sm:w-auto">
          <ul class="flex flex-wrap justify-center gap-x-6 gap-y-4">
            <li class="py-4 lg:py-0">
              <NuxtLink class="hover:text-slate-800" to="/legal/terms">Nutzungsbedingungen</NuxtLink>
            </li>
            <li class="py-4 lg:py-0">
              <NuxtLink class="hover:text-slate-800" to="/legal/imprint">Impressum</NuxtLink>
            </li>
            <li class="py-4 lg:py-0">
              <NuxtLink class="hover:text-slate-800" to="/legal/privacy">Datenschutz</NuxtLink>
            </li>
          </ul>
        </nav>

        <span class="order-2 lg:order-1 text-center sm:text-left">
          © 2025 Money Koi · Gerald Gmainer
        </span>
      </div>
    </div>
  </footer>
</template>
<script lang="ts" setup>
</script>