<script setup lang="ts">
// Modelo de dentadura em 3D (Three.js): arcadas superior (FDI 11–18 e 21–28) e inferior, com gengiva em
// ferradura, dentes de cantos arredondados e luz de estúdio, no estilo "modelo de consultório".
// Reage ao sintoma: realça dentes, esconde o ausente, entorta os da frente, avermelha a gengiva e amarela a frente.
// O Three.js só é carregado quando a seção aparece na tela.
const props = withDefaults(defineProps<{
  destaque?: number[]
  ausente?: number[]
  gengiva?: boolean
  desalinhado?: boolean
  amarelado?: boolean
}>(), { destaque: () => [], ausente: () => [], gengiva: false, desalinhado: false, amarelado: false })

const caixa = ref<HTMLDivElement | null>(null)
const carregado = ref(false)
let atualizar = () => {}
let destruir = () => {}

// [largura, altura, espessura] do incisivo central ao 3º molar
const SUP = [[1.0, 1.18, 0.36], [0.76, 1.02, 0.32], [0.82, 1.12, 0.5], [0.7, 0.92, 0.62], [0.68, 0.88, 0.62], [1.0, 0.82, 0.82], [0.94, 0.78, 0.78], [0.84, 0.72, 0.72]]
const INF = [[0.6, 0.92, 0.32], [0.64, 0.94, 0.34], [0.72, 1.0, 0.46], [0.7, 0.86, 0.58], [0.72, 0.82, 0.6], [1.04, 0.78, 0.8], [0.98, 0.74, 0.78], [0.88, 0.7, 0.74]]
const torto: Record<number, [number, number]> = { 11: [0.16, 0.25], 21: [-0.2, -0.3], 12: [-0.18, -0.35], 22: [0.2, 0.3] }

async function iniciar() {
  const el = caixa.value
  if (!el || carregado.value) return
  carregado.value = true
  const THREE = await import('three')
  const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js')
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
  const { mergeVertices } = await import('three/examples/jsm/utils/BufferGeometryUtils.js')
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  el.appendChild(renderer.domElement)

  const cena = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
  camera.position.set(0, 1.2, 14.2)
  camera.lookAt(0, -0.9, 0)

  const luz = new THREE.DirectionalLight(0xffffff, 1.6)
  luz.position.set(3, 6, 8)
  luz.castShadow = true
  luz.shadow.mapSize.set(1024, 1024)
  luz.shadow.radius = 6
  cena.add(luz, new THREE.HemisphereLight(0xffffff, 0x334466, 0.55))

  const modelo = new THREE.Group()
  cena.add(modelo)

  const COR = { dente: 0xF7F4EE, amarelo: 0xE6CF8E, realce: 0x6FB0FF, gengiva: 0xF0D3D7, alerta: 0xE0828F }
  const matGengiva = new THREE.MeshStandardMaterial({ color: COR.gengiva, roughness: 0.62, metalness: 0 })

  // gengiva em forma de ferradura (meia elipse com espessura), com bordas arredondadas
  const ferradura = (a: number, b: number, fora: number, dentro: number, altura: number) => {
    const s = new THREE.Shape()
    const N = 48, ini = -1.72, fim = 1.72
    for (let k = 0; k <= N; k++) { const t = ini + (fim - ini) * k / N; const x = (a + fora) * Math.sin(t), y = (b + fora) * Math.cos(t); k ? s.lineTo(x, y) : s.moveTo(x, y) }
    for (let k = N; k >= 0; k--) { const t = ini + (fim - ini) * k / N; s.lineTo((a - dentro) * Math.sin(t), (b - dentro) * Math.cos(t)) }
    const g = new THREE.ExtrudeGeometry(s, { depth: altura, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.26, bevelSegments: 8, curveSegments: 32 })
    g.rotateX(Math.PI / 2)
    return g
  }

  // dente: silhueta de cada tipo (estreito na gengiva, largo na mordida), extrudada com bordas bem arredondadas
  const silhueta = (i: number, w: number, h: number) => {
    const s = new THREE.Shape()
    const W = w / 2
    s.moveTo(-W * 0.62, 0)
    if (i <= 1) { // incisivo: pá larga, borda de mordida reta com cantos arredondados
      s.bezierCurveTo(-W * 1.0, -h * 0.25, -W * 1.02, -h * 0.72, -W * 0.9, -h * 0.94)
      s.quadraticCurveTo(-W * 0.85, -h, -W * 0.6, -h)
      s.lineTo(W * 0.6, -h)
      s.quadraticCurveTo(W * 0.85, -h, W * 0.9, -h * 0.94)
      s.bezierCurveTo(W * 1.02, -h * 0.72, W * 1.0, -h * 0.25, W * 0.62, 0)
    } else if (i === 2) { // canino: ponta central
      s.bezierCurveTo(-W * 1.0, -h * 0.25, -W * 1.02, -h * 0.6, -W * 0.82, -h * 0.78)
      s.quadraticCurveTo(-W * 0.3, -h * 0.98, 0, -h)
      s.quadraticCurveTo(W * 0.3, -h * 0.98, W * 0.82, -h * 0.78)
      s.bezierCurveTo(W * 1.02, -h * 0.6, W * 1.0, -h * 0.25, W * 0.62, 0)
    } else { // pré-molar e molar: coroa arredondada com duas cúspides
      s.bezierCurveTo(-W * 1.0, -h * 0.2, -W * 1.04, -h * 0.66, -W * 0.86, -h * 0.9)
      s.quadraticCurveTo(-W * 0.62, -h * 1.02, -W * 0.3, -h * 0.97)
      s.quadraticCurveTo(0, -h * 0.9, W * 0.3, -h * 0.97)
      s.quadraticCurveTo(W * 0.62, -h * 1.02, W * 0.86, -h * 0.9)
      s.bezierCurveTo(W * 1.04, -h * 0.66, W * 1.0, -h * 0.2, W * 0.62, 0)
    }
    s.closePath()
    return s
  }
  const geometriaDente = (i: number, w: number, h: number, d: number) => {
    const bev = Math.min(w, d) * 0.3
    const g = new THREE.ExtrudeGeometry(silhueta(i, w - bev * 1.4, h - bev), { depth: Math.max(0.02, d - bev * 2), bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.7, bevelSegments: 6, curveSegments: 14 })
    g.translate(0, h / 2 - bev * 0.3, -(d - bev * 2) / 2)
    const p = g.attributes.position
    for (let k = 0; k < p.count; k++) { const x = p.getX(k) / (w / 2); p.setZ(k, p.getZ(k) - 0.16 * w * x * x) } // frente levemente curva
    g.deleteAttribute('normal'); g.deleteAttribute('uv')
    const liso = mergeVertices(g, 1e-3) // une vértices para a luz deslizar sem quinas
    liso.computeVertexNormals()
    return liso
  }

  type Dente = { n: number, mesh: any, mat: any, i: number, sup: boolean, rot0: number }
  const dentes: Dente[] = []
  const gengivas: any[] = []

  const arcada = (sup: boolean) => {
    const a = sup ? 3.05 : 2.78, b = sup ? 2.7 : 2.4
    const tabela = sup ? SUP : INF
    // posições ao longo da curva pelo comprimento do arco
    const N = 600, pts: { t: number, s: number }[] = []
    let s = 0, ax = 0, az = b
    for (let k = 0; k <= N; k++) { const t = (k / N) * 1.6; const x = a * Math.sin(t), z = b * Math.cos(t); s += Math.hypot(x - ax, z - az); ax = x; az = z; pts.push({ t, s }) }
    const gap = 0.02
    const yGengiva = sup ? 0.1 : -1.62
    // gengiva
    const g = new THREE.Mesh(ferradura(a, b, 0.02, 0.9, 0.4), matGengiva)
    g.position.y = sup ? yGengiva + 0.4 + 0.12 : yGengiva - 0.12
    g.castShadow = g.receiveShadow = true
    modelo.add(g)
    gengivas.push(g)
    for (const lado of [-1, 1]) {
      let pos = 0.02
      tabela.forEach(([w, h, d], i) => {
        const alvo = pos + w / 2
        const q = pts.find(z => z.s >= alvo) || pts[pts.length - 1]
        const x = lado * a * Math.sin(q.t), z = b * Math.cos(q.t)
        const mat = new THREE.MeshStandardMaterial({ color: COR.dente, roughness: 0.38, metalness: 0 })
        const mesh = new THREE.Mesh(geometriaDente(i, w, h, d), mat)
        mesh.position.set(x, sup ? yGengiva - h / 2 + 0.22 : yGengiva + h / 2 - 0.22, z)
        const rot0 = lado * q.t
        mesh.rotation.y = rot0
        if (!sup) mesh.scale.y = -1
        mesh.castShadow = mesh.receiveShadow = true
        modelo.add(mesh)
        dentes.push({ n: sup ? (lado < 0 ? 10 : 20) + i + 1 : (lado < 0 ? 40 : 30) + i + 1, mesh, mat, i, sup, rot0 })
        pos += w + gap
      })
    }
  }
  arcada(true)
  arcada(false)
  modelo.position.y = 0.55

  atualizar = () => {
    matGengiva.color.setHex(props.gengiva ? COR.alerta : COR.gengiva)
    for (const d of dentes) {
      const falta = d.sup && props.ausente.includes(d.n)
      const real = d.sup && props.destaque.includes(d.n)
      d.mesh.visible = !falta
      d.mat.color.setHex(props.amarelado && d.i < 3 ? COR.amarelo : real ? COR.realce : COR.dente)
      d.mat.emissive.setHex(real ? 0x0B2A55 : 0x000000)
      const tt = d.sup && props.desalinhado ? torto[d.n] : undefined
      d.mesh.rotation.z = tt ? tt[0] : 0
      d.mesh.rotation.y = d.rot0 + (tt ? tt[1] : 0)
    }
  }
  atualizar()

  // tamanho
  const ajustar = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix() }
  ajustar()
  const ro = new ResizeObserver(ajustar)
  ro.observe(el)

  // arrastar para girar + balanço suave
  let arrastando = false, x0 = 0, y0 = 0, giroY = 0, giroX = 0.08, t = 0
  const cv = renderer.domElement
  cv.addEventListener('pointerdown', e => { arrastando = true; x0 = e.clientX; y0 = e.clientY; cv.setPointerCapture(e.pointerId) })
  cv.addEventListener('pointermove', e => { if (!arrastando) return; giroY += (e.clientX - x0) * 0.01; giroX = Math.max(-0.4, Math.min(0.7, giroX + (e.clientY - y0) * 0.006)); x0 = e.clientX; y0 = e.clientY })
  const soltar = () => { arrastando = false; t = Math.asin(Math.max(-1, Math.min(1, giroY / 0.55))) }
  cv.addEventListener('pointerup', soltar)
  cv.addEventListener('pointercancel', soltar)

  let visivel = true, quadro = 0
  const desenhar = () => {
    if (!arrastando && !reduzido) { t += 0.008; giroY += (Math.sin(t) * 0.55 - giroY) * 0.05 }
    modelo.rotation.set(giroX, giroY, 0)
    renderer.render(cena, camera)
    quadro = visivel ? requestAnimationFrame(desenhar) : 0
  }
  const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel && !quadro) quadro = requestAnimationFrame(desenhar) })
  io.observe(el)
  quadro = requestAnimationFrame(desenhar)

  destruir = () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(quadro); renderer.dispose(); pmrem.dispose() }
}

onMounted(() => {
  const el = caixa.value
  if (!el) return
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); iniciar() } }, { rootMargin: '300px' })
  io.observe(el)
})
watch(() => [props.destaque, props.ausente, props.gengiva, props.desalinhado, props.amarelado], () => atualizar(), { deep: true })
onBeforeUnmount(() => destruir())
</script>

<template>
  <div class="arc3d">
    <div ref="caixa" class="arc3d-cena" role="img" aria-label="Modelo de dentadura em 3D destacando os dentes do sintoma escolhido" />
    <p class="arc3d-dica" aria-hidden="true">Arraste para girar</p>
  </div>
</template>

<style scoped>
.arc3d{ position:relative; }
.arc3d-cena{ width:100%; aspect-ratio:1 / .82; cursor:grab; touch-action:pan-y; }
.arc3d-cena:active{ cursor:grabbing; }
.arc3d-cena :deep(canvas){ display:block; width:100% !important; height:100% !important; }
.arc3d-dica{ position:absolute; left:50%; bottom:6px; transform:translateX(-50%); margin:0; padding:4px 12px; border-radius:999px; background:rgba(255,255,255,.12); font-size:12px; font-weight:600; color:rgba(255,255,255,.8); white-space:nowrap; }
</style>
