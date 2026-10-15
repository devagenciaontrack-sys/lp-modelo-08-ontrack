<script setup lang="ts">
// Arcada superior em 3D (Zdog): 16 dentes (numeração FDI 11–18 e 21–28) sobre a gengiva.
// Reage ao sintoma escolhido: realça dentes, esconde o ausente, entorta os da frente,
// avermelha a gengiva e amarela os dentes da frente. Balança devagar e gira ao arrastar.
const props = withDefaults(defineProps<{
  destaque?: number[]
  ausente?: number[]
  gengiva?: boolean
  desalinhado?: boolean
  amarelado?: boolean
}>(), { destaque: () => [], ausente: () => [], gengiva: false, desalinhado: false, amarelado: false })

const canvas = ref<HTMLCanvasElement | null>(null)
const COR = { dente: '#FBF8F1', sombra: '#E4DCCB', amarelo: '#E9D69C', realce: '#7FB4F5', gengiva: '#F4B9C2', gengivaAlerta: '#E2707F', anel: '#1E6FD9' }
// largura, altura e "profundidade" de cada dente, do incisivo central ao 3º molar
const forma = [[8.4, 15], [7, 13.5], [7.6, 15.5], [7.6, 12.5], [7.6, 12], [10, 11], [9.6, 10.5], [8.6, 10]]
const ang = [5, 15.5, 26, 36.5, 47, 59, 72.5, 86]
const torto: Record<number, number> = { 11: 0.32, 21: -0.36, 12: -0.3, 22: 0.34 }

let atualizar = () => {}
let parar = () => {}

onMounted(async () => {
  const el = canvas.value
  if (!el) return
  const { default: Zdog } = await import('zdog')
  const TAU = Zdog.TAU
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const lado = el.clientWidth
  el.width = lado * dpr
  el.height = Math.round(lado * 0.82) * dpr
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches
  let arrastando = false
  const illo = new Zdog.Illustration({
    element: el,
    zoom: (lado / 104) * dpr,
    dragRotate: true,
    rotate: { x: 0.42 },
    translate: { y: 13 },
    onDragStart: () => { arrastando = true },
    onDragEnd: () => { arrastando = false },
  })

  const ax = 40, az = 34
  const ponto = (graus: number, lado: number) => { const t = (graus * Math.PI) / 180; return { x: lado * ax * Math.sin(t), z: az * Math.cos(t) - 6 } }

  // gengiva: faixa grossa seguindo a curva da arcada, por cima dos dentes
  const curva: { x: number, y: number, z: number }[] = []
  for (let g = 90; g >= -90; g -= 6) { const p = ponto(Math.abs(g), g < 0 ? -1 : 1); curva.push({ x: p.x, y: -8.5, z: p.z }) }
  const gengiva = new Zdog.Shape({ addTo: illo, path: curva, stroke: 9, color: COR.gengiva, closed: false })

  const dentes: { n: number, grupo: any, corpo: any, brilho: any, anel: any, i: number }[] = []
  for (const lado of [-1, 1]) {
    forma.forEach(([w, h], i) => {
      const p = ponto(ang[i], lado)
      const giro = -lado * (ang[i] * Math.PI) / 180
      const grupo = new Zdog.Group({ addTo: illo, translate: { x: p.x, y: 0, z: p.z }, rotate: { y: giro } })
      const corpo = new Zdog.Shape({ addTo: grupo, path: [{ y: -h / 2 + w / 2 }, { y: h / 2 - w / 2 }], stroke: w, color: COR.dente })
      const brilho = new Zdog.Shape({ addTo: grupo, path: [{ x: -w * 0.18, y: -h * 0.18 }, { x: -w * 0.18, y: h * 0.12 }], translate: { z: w * 0.42 }, stroke: w * 0.22, color: 'rgba(255,255,255,.85)' })
      const anel = new Zdog.Ellipse({ addTo: grupo, diameter: w + 1, stroke: 1.2, color: COR.anel, rotate: { x: TAU / 4 }, translate: { y: 2 }, visible: false })
      dentes.push({ n: (lado < 0 ? 10 : 20) + i + 1, grupo, corpo, brilho, anel, i })
    })
  }

  atualizar = () => {
    gengiva.color = props.gengiva ? COR.gengivaAlerta : COR.gengiva
    for (const d of dentes) {
      const falta = props.ausente.includes(d.n)
      const real = props.destaque.includes(d.n)
      d.corpo.visible = !falta
      d.brilho.visible = !falta
      d.anel.visible = falta
      d.corpo.color = props.amarelado && d.i < 3 ? COR.amarelo : real ? COR.realce : COR.dente
      d.grupo.translate.y = real ? 2.2 : 0
      d.grupo.rotate.z = props.desalinhado ? torto[d.n] || 0 : 0
    }
    illo.updateRenderGraph()
  }
  atualizar()

  let t = 0
  let visivel = false
  let quadro = 0
  const desenhar = () => {
    if (!arrastando && !reduzido) { t += 0.01; illo.rotate.y = Math.sin(t) * 0.34 }
    illo.updateRenderGraph()
    quadro = visivel ? requestAnimationFrame(desenhar) : 0
  }
  if (reduzido) return
  const io = new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting
    if (visivel && !quadro) quadro = requestAnimationFrame(desenhar)
  })
  io.observe(el)
  parar = () => { io.disconnect(); cancelAnimationFrame(quadro) }
})

watch(() => [props.destaque, props.ausente, props.gengiva, props.desalinhado, props.amarelado], () => atualizar(), { deep: true })
onBeforeUnmount(() => parar())
</script>

<template>
  <div class="arc3d">
    <canvas ref="canvas" role="img" aria-label="Arcada dentária em 3D destacando os dentes do sintoma escolhido" />
    <p class="arc3d-dica" aria-hidden="true">Arraste para girar</p>
  </div>
</template>

<style scoped>
.arc3d{ position:relative; }
.arc3d canvas{ display:block; width:100%; aspect-ratio:1 / .82; cursor:grab; touch-action:pan-y; }
.arc3d canvas:active{ cursor:grabbing; }
.arc3d-dica{ position:absolute; left:50%; bottom:4px; transform:translateX(-50%); margin:0; padding:4px 10px; border-radius:999px; background:rgba(16,35,61,.06); font-size:12px; font-weight:600; color:#4B5A6E; white-space:nowrap; }
</style>
