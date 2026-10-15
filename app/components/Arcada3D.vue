<script setup lang="ts">
// Sorriso em 3D (Zdog): arcada superior (FDI 11–18 e 21–28) e inferior, com dentes de formatos reais
// (incisivos achatados, caninos pontudos, molares largos), volume frente/fundo e gengiva com contorno.
// Reage ao sintoma: realça dentes, esconde o ausente, entorta os da frente, avermelha a gengiva e amarela a frente.
const props = withDefaults(defineProps<{
  destaque?: number[]
  ausente?: number[]
  gengiva?: boolean
  desalinhado?: boolean
  amarelado?: boolean
}>(), { destaque: () => [], ausente: () => [], gengiva: false, desalinhado: false, amarelado: false })

const canvas = ref<HTMLCanvasElement | null>(null)
const COR = {
  frente: '#FFFFFF', fundo: '#BFB096', brilho: 'rgba(255,255,255,.95)',
  amarelo: '#EBD593', amareloFundo: '#C9B06B', realce: '#8EC2FF', realceFundo: '#3E86E0',
  gengiva: '#F2A0AE', gengivaEscura: '#EA95A3', alerta: '#D44A62', alertaEscura: '#B33148', anel: '#8EC2FF',
}
// [largura, altura, espessura] do incisivo central ao 3º molar
const SUP = [[8.6, 13.5, 1.8], [7, 12, 1.8], [7.4, 13.5, 2.4], [7, 11, 3], [7, 10.5, 3], [9.6, 10, 3.6], [9, 9.5, 3.6], [8, 9, 3.4]]
const INF = [[5.6, 11, 1.6], [6, 11, 1.7], [6.8, 12, 2.2], [7, 10.5, 2.8], [7.2, 10, 2.9], [10.2, 9.5, 3.6], [9.6, 9, 3.5], [8.8, 8.5, 3.3]]
const ANG = [5, 15.5, 26, 36.5, 47, 59, 72.5, 86]
const torto: Record<number, number> = { 11: 0.3, 21: -0.34, 12: -0.28, 22: 0.32 }

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
    zoom: (lado / 100) * dpr,
    dragRotate: true,
    rotate: { x: 0.16 },
    onDragStart: () => { arrastando = true },
    onDragEnd: () => { arrastando = false },
  })

  // contorno de cada tipo de dente (a partir da gengiva, crescendo em +y)
  const contorno = (i: number, w: number, h: number) => {
    if (i <= 1) return [{ x: -0.38 * w, y: 0 }, { x: 0.38 * w, y: 0 }, { x: 0.5 * w, y: 0.82 * h }, { x: 0.4 * w, y: h }, { x: -0.4 * w, y: h }, { x: -0.5 * w, y: 0.82 * h }]
    if (i === 2) return [{ x: -0.36 * w, y: 0 }, { x: 0.36 * w, y: 0 }, { x: 0.5 * w, y: 0.66 * h }, { x: 0.08 * w, y: h }, { x: -0.08 * w, y: h }, { x: -0.5 * w, y: 0.66 * h }]
    return [{ x: -0.42 * w, y: 0 }, { x: 0.42 * w, y: 0 }, { x: 0.5 * w, y: 0.74 * h }, { x: 0.3 * w, y: h }, { x: 0, y: 0.9 * h }, { x: -0.3 * w, y: h }, { x: -0.5 * w, y: 0.74 * h }]
  }

  type Dente = { n: number, grupo: any, frente: any, fundo: any, brilho: any, colar: any, anel: any, i: number, sup: boolean }
  const dentes: Dente[] = []
  const gengivas: { faixa: any, colares: any[] }[] = []

  const arcada = (sup: boolean) => {
    const s = sup ? 1 : -1 // superior cresce para baixo; inferior, para cima
    const ax = sup ? 40 : 36.5, az = sup ? 33 : 29.5
    const base = sup ? -11 : 11
    const zOff = sup ? -4 : -7
    const ponto = (graus: number, lado: number) => { const t = (graus * Math.PI) / 180; return { x: lado * ax * Math.sin(t), z: az * Math.cos(t) + zOff } }
    const curva: { x: number, y: number, z: number }[] = []
    for (let g = 92; g >= -92; g -= 4) { const p = ponto(Math.abs(g), g < 0 ? -1 : 1); curva.push({ x: p.x * 1.02, y: base - s * 4, z: p.z * 1.02 }) }
    const faixa = new Zdog.Shape({ addTo: illo, path: curva, stroke: 9, color: COR.gengiva, closed: false })
    const colares: any[] = []
    const tabela = sup ? SUP : INF
    for (const lado of [-1, 1]) {
      tabela.forEach(([w, h, t], i) => {
        const p = ponto(ANG[i], lado)
        const grupo = new Zdog.Group({ addTo: illo, translate: { x: p.x, y: base, z: p.z }, rotate: { y: -lado * (ANG[i] * Math.PI) / 180 } })
        const forma = contorno(i, w * 0.8, h * 1.3).map(q => ({ x: q.x, y: q.y * s }))
        const fundo = new Zdog.Shape({ addTo: grupo, path: forma, translate: { z: -t / 2 }, stroke: 2.6, fill: true, color: COR.fundo })
        const frente = new Zdog.Shape({ addTo: grupo, path: forma, translate: { z: t / 2 }, stroke: 1.6, fill: true, color: COR.frente })
        const brilho = new Zdog.Shape({ addTo: grupo, path: [{ x: -w * 0.16, y: s * h * 0.3 }, { x: -w * 0.2, y: s * h * 0.85 }], translate: { z: t / 2 + 1.3 }, stroke: Math.max(1, w * 0.16), color: COR.brilho })
        const colar = new Zdog.Shape({ addTo: grupo, path: [{ x: -0.55 * w, y: -s * 1.4 }, { bezier: [{ x: -0.3 * w, y: s * 2.6 }, { x: 0.3 * w, y: s * 2.6 }, { x: 0.55 * w, y: -s * 1.4 }] }], translate: { z: t / 2 + 0.6 }, stroke: 2.2, color: COR.gengivaEscura, closed: false })
        const anel = new Zdog.Ellipse({ addTo: grupo, diameter: w, stroke: 1.2, color: COR.anel, rotate: { x: TAU / 4 }, translate: { y: s * 1.5 }, visible: false })
        colares.push(colar)
        dentes.push({ n: sup ? (lado < 0 ? 10 : 20) + i + 1 : (lado < 0 ? 40 : 30) + i + 1, grupo, frente, fundo, brilho, colar, anel, i, sup })
      })
    }
    gengivas.push({ faixa, colares })
  }
  arcada(false)
  arcada(true)

  atualizar = () => {
    for (const g of gengivas) {
      g.faixa.color = props.gengiva ? COR.alerta : COR.gengiva
      for (const c of g.colares) c.color = props.gengiva ? COR.alertaEscura : COR.gengivaEscura
    }
    for (const d of dentes) {
      const falta = d.sup && props.ausente.includes(d.n)
      const real = d.sup && props.destaque.includes(d.n)
      const amarelo = props.amarelado && d.i < 3
      for (const parte of [d.frente, d.fundo, d.brilho, d.colar]) parte.visible = !falta
      d.anel.visible = falta
      d.frente.color = amarelo ? COR.amarelo : real ? COR.realce : COR.frente
      d.fundo.color = amarelo ? COR.amareloFundo : real ? COR.realceFundo : COR.fundo
      d.grupo.rotate.z = d.sup && props.desalinhado ? torto[d.n] || 0 : 0
    }
    illo.updateRenderGraph()
  }
  atualizar()

  let t = 0
  let visivel = false
  let quadro = 0
  const desenhar = () => {
    if (!arrastando && !reduzido) { t += 0.01; illo.rotate.y = Math.sin(t) * 0.36 }
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
    <canvas ref="canvas" role="img" aria-label="Sorriso em 3D destacando os dentes do sintoma escolhido" />
    <p class="arc3d-dica" aria-hidden="true">Arraste para girar</p>
  </div>
</template>

<style scoped>
.arc3d{ position:relative; }
.arc3d canvas{ display:block; width:100%; aspect-ratio:1 / .82; cursor:grab; touch-action:pan-y; }
.arc3d canvas:active{ cursor:grabbing; }
.arc3d-dica{ position:absolute; left:50%; bottom:6px; transform:translateX(-50%); margin:0; padding:4px 12px; border-radius:999px; background:rgba(255,255,255,.12); font-size:12px; font-weight:600; color:rgba(255,255,255,.8); white-space:nowrap; }
</style>
