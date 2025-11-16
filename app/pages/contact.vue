<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <section class="relative bg-center bg-cover" style="background-image:url('/hero-bg.svg')">
      <div class="mx-auto max-w-6xl px-6 pt-28 pb-12">
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Kontakt</h1>
        <p class="mt-3 text-slate-400">Schreib mir – ich melde mich fix</p>
      </div>
    </section>

    <!--    <section class="mx-auto max-w-6xl px-6 pb-20">-->
    <!--      <div class="grid gap-8 pt-14 lg:grid-cols-2">-->
    <!--        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">-->
    <!--          <h2 class="text-xl font-semibold">Direkt</h2>-->
    <!--          <div class="mt-6 grid gap-4">-->
    <!--            <a-->
    <!--                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"-->
    <!--                href="mailto:gerald@gmainer.dev"-->
    <!--            >-->
    <!--              <span>E-Mail</span>-->
    <!--              <span class="flex items-center gap-1 text-slate-400">-->
    <!--                gerald.gmainer@gmail.com-->
    <!--                <Icon name="lucide:arrow-up-right" size="16"/>-->
    <!--              </span>-->
    <!--            </a>-->

    <!--            <a-->
    <!--                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"-->
    <!--                href="https://github.com/GeraldGmainer"-->
    <!--                rel="noopener"-->
    <!--                target="_blank"-->
    <!--            >-->
    <!--              <span>GitHub</span>-->
    <!--              <span class="flex items-center gap-1 text-slate-400">-->
    <!--                GeraldGmainer-->
    <!--                <Icon name="simple-icons:github" size="16"/>-->
    <!--              </span>-->
    <!--            </a>-->

    <!--            <a-->
    <!--                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"-->
    <!--                href="/files/Gerald_Gmainer_CV.pdf"-->
    <!--                rel="noopener"-->
    <!--                target="_blank"-->
    <!--            >-->
    <!--              <span>Lebenslauf (PDF)</span>-->
    <!--              <span class="flex items-center gap-1 text-slate-400">-->
    <!--                Öffnen-->
    <!--                <Icon name="lucide:arrow-up-right" size="16"/>-->
    <!--              </span>-->
    <!--            </a>-->

    <!--            <a-->
    <!--                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"-->
    <!--                href="https://www.linkedin.com/in/gerald-gmainer-7924552b1/"-->
    <!--                rel="noopener"-->
    <!--                target="_blank"-->
    <!--            >-->
    <!--              <span>LinkedIn</span>-->
    <!--              <span class="flex items-center gap-1 text-slate-400">-->
    <!--                @gerald-gmainer-->
    <!--                <Icon name="simple-icons:linkedin" size="16"/>-->
    <!--              </span>-->
    <!--            </a>-->

    <!--            <div-->
    <!--                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10"-->
    <!--            >-->
    <!--              <span>Standort</span>-->
    <!--              <span class="text-slate-400">Garsten · Remote/Hybrid</span>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">-->
    <!--          <h2 class="text-xl font-semibold">Nachricht senden</h2>-->
    <!--          <form class="mt-6 space-y-4" @submit.prevent="submit">-->
    <!--            <input-->
    <!--                v-model="name"-->
    <!--                class="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-white/20"-->
    <!--                placeholder="Dein Name"-->
    <!--                required-->
    <!--                type="text"-->
    <!--            />-->
    <!--            <input-->
    <!--                v-model="email"-->
    <!--                class="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-white/20"-->
    <!--                placeholder="E-Mail"-->
    <!--                required-->
    <!--                type="email"-->
    <!--            />-->
    <!--            <textarea-->
    <!--                v-model="message"-->
    <!--                class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-white/20"-->
    <!--                placeholder="Deine Nachricht"-->
    <!--                required-->
    <!--                rows="6"-->
    <!--            ></textarea>-->
    <!--            <input v-model="hp" autocomplete="off" class="hidden" tabindex="-1" type="text"/>-->
    <!--            <div class="flex items-center gap-3">-->
    <!--              <button-->
    <!--                  :disabled="loading"-->
    <!--                  class="inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-white/20 disabled:opacity-60"-->
    <!--              >-->
    <!--                <span v-if="!loading">Senden</span>-->
    <!--                <span v-else>Senden…</span>-->
    <!--              </button>-->
    <!--              <span v-if="ok" class="text-sm text-emerald-300">Danke, Nachricht gesendet.</span>-->
    <!--              <span v-if="err" class="text-sm text-rose-300">Fehler beim Senden.</span>-->
    <!--            </div>-->
    <!--          </form>-->
    <!--          <p class="mt-4 text-xs text-slate-400">-->
    <!--            Alternativ:-->
    <!--            <a-->
    <!--                class="underline decoration-white/30 underline-offset-2"-->
    <!--                href="mailto:gerald@gmainer.dev"-->
    <!--            >E-Mail öffnen</a>-->
    <!--          </p>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </section>-->

    <section class="mx-auto max-w-6xl px-6 pb-20">
      <div class="pt-14 flex justify-center">
        <div class="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 class="text-xl font-semibold">Direkt</h2>
          <div class="mt-6 grid gap-4">
            <a
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"
                href="mailto:gerald@gmainer.dev"
            >
              <span>E-Mail</span>
              <span class="flex items-center gap-1 text-slate-400">
            gerald.gmainer@gmail.com
            <Icon name="lucide:arrow-up-right" size="16"/>
          </span>
            </a>

            <a
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"
                href="https://github.com/GeraldGmainer"
                rel="noopener"
                target="_blank"
            >
              <span>GitHub</span>
              <span class="flex items-center gap-1 text-slate-400">
            GeraldGmainer
            <Icon name="simple-icons:github" size="16"/>
          </span>
            </a>

            <a
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"
                href="/files/Gerald_Gmainer_CV.pdf"
                rel="noopener"
                target="_blank"
            >
              <span>Lebenslauf (PDF)</span>
              <span class="flex items-center gap-1 text-slate-400">
            Öffnen
            <Icon name="lucide:arrow-up-right" size="16"/>
          </span>
            </a>

            <a
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10 hover:bg-white/5"
                href="https://www.linkedin.com/in/gerald-gmainer-7924552b1/"
                rel="noopener"
                target="_blank"
            >
              <span>LinkedIn</span>
              <span class="flex items-center gap-1 text-slate-400">
            @gerald-gmainer
            <Icon name="simple-icons:linkedin" size="16"/>
          </span>
            </a>

            <div
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1220] p-4 ring-1 ring-white/10"
            >
              <span>Standort</span>
              <span class="text-slate-400">Garsten · Remote/Hybrid</span>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>


<script lang="ts" setup>
const name = ref('')
const email = ref('')
const message = ref('')
const hp = ref('')
const loading = ref(false)
const ok = ref(false)
const err = ref(false)

async function submit() {
  ok.value = false;
  err.value = false;
  loading.value = true
  try {
    const r = await $fetch('/api/contact', {
      method: 'POST',
      body: {name: name.value, email: email.value, message: message.value, hp: hp.value}
    })
    if ((r as any)?.ok) {
      ok.value = true;
      name.value = '';
      email.value = '';
      message.value = ''
    } else {
      err.value = true
    }
  } catch {
    err.value = true
  } finally {
    loading.value = false
  }
}
</script>
