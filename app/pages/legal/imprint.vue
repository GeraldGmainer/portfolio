<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <PageHeader
        :badges="['Rechtliches']"
        subtitle="Angaben gemäß § 5 ECG."
        title="Impressum"
    />

    <section class="border-t border-white/5 bg-[#050816] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6 text-sm leading-relaxed text-slate-300 sm:text-base">
        <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Diensteanbieter
        </h2>
        <p class="mt-3">
          Gerald Gmainer<br>
          Money Koi<br>
          Am Platzl 3<br>
          4451 Garsten<br>
          Österreich
        </p>

        <p class="mt-3">
          E-Mail:
          <a
              class="text-sky-400 hover:text-sky-300"
              href="mailto:gerald.gmainer@gmail.com"
          >
            gerald.gmainer@gmail.com
          </a>
        </p>

        <p class="mt-3">
          Verantwortlich für den Inhalt dieser Website: Gerald Gmainer.
        </p>

        <p class="mt-6 text-xs text-slate-500">
          Diese Website ist ein persönliches Portfolio zur Darstellung von Projekten und beruflichen Tätigkeiten
          im Bereich Softwareentwicklung, App, Web und 3D.<br>
          Stand: November 2025
        </p>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
</script>
