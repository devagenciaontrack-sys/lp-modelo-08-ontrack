<script setup lang="ts">
// Arcada superior vista de baixo (16 dentes, numeração FDI 18–11 e 21–28).
// destaque: dentes realçados · ausente: dente que falta · gengiva: realça a gengiva · desalinhado: dentes da frente tortos
const props = withDefaults(defineProps<{
  destaque?: number[]
  ausente?: number[]
  gengiva?: boolean
  desalinhado?: boolean
  amarelado?: boolean
  acender?: boolean
}>(), { destaque: () => [], ausente: () => [], gengiva: false, desalinhado: false, amarelado: false, acender: false })

// largura (ao longo da arcada) e profundidade de cada dente, do incisivo central ao terceiro molar
const tam = [[34, 26], [27, 23], [27, 27], [27, 30], [27, 30], [37, 37], [35, 35], [31, 32]]
// curva da arcada (meia arcada, do centro para trás)
const curva = (t: number) => ({ x: 150 * Math.sin(t), y: 60 + 216 * Math.cos(t) })
const dentes = computed(() => {
  // comprimento acumulado da meia arcada
  const N = 400, pts: { t: number, s: number }[] = []
  let s = 0, ant = curva(0)
  for (let i = 0; i <= N; i++) { const t = (i / N) * (Math.PI / 2) * 0.98; const p = curva(t); s += Math.hypot(p.x - ant.x, p.y - ant.y); ant = p; pts.push({ t, s }) }
  const L = s, gap = 3
  const soma = tam.reduce((a, d) => a + d[0], 0) + gap * 7
  const k = (L - 4) / soma
  const out: { n: number, x: number, y: number, r: number, w: number, h: number, i: number }[] = []
  for (const lado of [-1, 1]) {
    let pos = 2
    for (let j = 0; j < 8; j++) {
      const w = tam[j][0] * k, h = tam[j][1] * k * 1.3
      const alvo = pos + w / 2
      const p = pts.find(q => q.s >= alvo) || pts[pts.length - 1]
      const c2 = curva(p.t)
      const dx = 150 * Math.cos(p.t), dy = -216 * Math.sin(p.t)
      const rot = (Math.atan2(dy, dx) * 180) / Math.PI
      out.push({ n: (lado < 0 ? 10 : 20) + j + 1, x: 200 + lado * c2.x, y: c2.y, r: lado < 0 ? -rot : rot, w, h, i: j })
      pos += w + gap
    }
  }
  return out
})
const torto: Record<number, number> = { 11: 9, 21: -11, 12: -8, 22: 10 }
</script>

<template>
  <svg class="arcada" :class="{ acender }" viewBox="0 0 400 330" role="img" aria-label="Arcada dentária superior">
    <!-- gengiva -->
    <path class="gengiva" :class="{ alerta: gengiva }" d="M50 44C50 170 100 282 200 282C300 282 350 170 350 44" fill="none" stroke-width="54" stroke-linecap="round" />
    <path d="M200 64C140 64 112 120 112 170C116 214 150 236 200 236C250 236 284 214 288 170C288 120 260 64 200 64Z" class="palato" />
    <g v-for="d in dentes" :key="d.n" :transform="`translate(${d.x} ${d.y}) rotate(${d.r + (desalinhado ? torto[d.n] || 0 : 0)})`" class="dente-g" :style="{ '--i': d.i + (d.n > 20 ? 0.5 : 0) }">
      <rect
        :x="-d.w / 2" :y="-d.h / 2" :width="d.w" :height="d.h"
        :rx="d.i < 2 ? d.h * .38 : d.i < 5 ? d.h * .45 : d.h * .32"
        class="dente"
        :class="{ on: destaque.includes(d.n), falta: ausente.includes(d.n), amarelo: amarelado && d.i < 3 }"
      />
    </g>
  </svg>
</template>

<style scoped>
.arcada{ display:block; width:100%; height:auto; overflow:visible; }
.gengiva{ stroke:#F6C9CF; transition:stroke .3s; } .gengiva.alerta{ stroke:#E77F8F; }
.palato{ fill:#FCEEF0; opacity:.7; }
.dente{ fill:#FBF8F1; stroke:#D9CFBF; stroke-width:1.5; transition:fill .3s, stroke .3s, opacity .3s; }
.dente.amarelo{ fill:#EBDDB5; }
.dente.on{ fill:#FFE1E5; stroke:#D9536A; stroke-width:3; }
.dente.falta{ fill:transparent; stroke:#D9536A; stroke-dasharray:4 4; stroke-width:2; }
.sulco{ fill:none; stroke:#E4DACA; stroke-width:1.5; stroke-linecap:round; }
.dente-g{ transition:transform .4s cubic-bezier(.2,.7,.2,1); }
@media (prefers-reduced-motion:no-preference){
  .acender .dente{ animation:brilho 2.6s ease both; animation-delay:calc(var(--i) * 120ms + 300ms); }
  @keyframes brilho{ 0%{ fill:#E9E1D2; } 40%{ fill:#FFFFFF; stroke:#9BC9E8; } 100%{ fill:#FBF8F1; } }
}
</style>
