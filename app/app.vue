<script setup lang="ts">
// ============ PERSONALIZAÇÃO ============
const site = {
  marca: 'Sua Clínica',
  subtitulo: 'Odontologia',
  responsavel: 'Dra. Nome Sobrenome',
  cro: 'CRO-UF 00000',
  whatsapp: '5500000000000',
  instagram: '#',
  telefone: '(00) 0000-0000',
  endereco: 'Rua Exemplo, 000, sala 00 — Bairro, Sua cidade/UF',
  mapa: 'https://maps.google.com/?q=Rua+Exemplo+000',
  horario: 'Segunda a sexta, 8h às 19h · Sábado, 8h às 12h',
  cnpj: '00.000.000/0000-00',
}
// Atenção: o Código de Ética Odontológica não permite anunciar preços, descontos, formas de pagamento
// nem consulta "gratuita". Por isso este modelo não mostra valores.

// ============ O QUE ESTÁ INCOMODANDO? ============
type Caso = { id: string, sintoma: string, tratamento: string, oque: string, como: string, consultas: string, dor: string, destaque?: number[], ausente?: number[], gengiva?: boolean, desalinhado?: boolean, amarelado?: boolean }
const casos: Caso[] = [
  { id: 'sensivel', sintoma: 'Dói com gelado ou doce', tratamento: 'Tratamento de sensibilidade', oque: 'Desgaste do esmalte, retração da gengiva ou uma cárie pequena deixam a parte interna do dente exposta.', como: 'Avaliamos a causa e aplicamos dessensibilizante, verniz ou uma restauração na cor do dente.', consultas: '1 a 2 consultas', dor: 'Não dói. Quando precisa, usamos anestesia local.', destaque: [13, 14, 23, 24] },
  { id: 'dor', sintoma: 'Dor forte e latejante', tratamento: 'Tratamento de canal', oque: 'Quando a cárie chega ao nervo, o dente inflama e a dor aparece sozinha, muitas vezes à noite.', como: 'Limpamos o canal por dentro, selamos e reconstruímos o dente. Com anestesia, é parecido com uma restauração.', consultas: '1 a 3 consultas', dor: 'Feito com anestesia. A dor que você sente hoje costuma passar logo depois.', destaque: [26] },
  { id: 'gengiva', sintoma: 'Gengiva sangra ao escovar', tratamento: 'Limpeza e tratamento da gengiva', oque: 'Sangramento é sinal de gengivite: placa e tártaro acumulados na linha da gengiva.', como: 'Raspagem e polimento, orientação de escovação e fio, e retorno para acompanhar.', consultas: '1 a 2 consultas', dor: 'Pode incomodar um pouco onde a gengiva está inflamada. Usamos anestésico em gel.', gengiva: true },
  { id: 'amarelo', sintoma: 'Dentes amarelados', tratamento: 'Clareamento dental', oque: 'Café, vinho, cigarro e o próprio tempo escurecem o esmalte aos poucos.', como: 'Clareamento no consultório, em casa com moldeira ou combinado. Antes, fazemos a limpeza e checamos se há cáries.', consultas: '2 a 3 consultas', dor: 'Alguns pacientes sentem sensibilidade passageira, que controlamos com gel.', amarelado: true, destaque: [11, 12, 13, 21, 22, 23] },
  { id: 'falta', sintoma: 'Falta um dente', tratamento: 'Implante dentário', oque: 'O espaço vazio faz os dentes vizinhos se moverem e sobrecarrega a mastigação.', como: 'Um pino de titânio é colocado no osso e, depois da cicatrização, recebe a coroa definitiva.', consultas: 'Algumas etapas, ao longo de 3 a 6 meses', dor: 'A cirurgia é feita com anestesia. O pós-operatório costuma ser tranquilo.', ausente: [16] },
  { id: 'torto', sintoma: 'Dentes tortos', tratamento: 'Aparelho ou alinhadores', oque: 'Dentes desalinhados dificultam a limpeza e podem causar desgaste e dor na mandíbula.', como: 'Aparelho fixo ou alinhadores transparentes, com plano feito a partir de fotos, raio-x e escaneamento.', consultas: 'Manutenção mensal, de 12 a 24 meses em média', dor: 'Pressão nos primeiros dias de cada etapa, que passa sozinha.', desalinhado: true, destaque: [11, 12, 21, 22] },
  { id: 'siso', sintoma: 'Siso incomodando', tratamento: 'Extração de siso', oque: 'Sem espaço para nascer, o siso pode inflamar a gengiva e empurrar os outros dentes.', como: 'Avaliamos no raio-x panorâmico e fazemos a extração com anestesia, com orientações de repouso.', consultas: '1 consulta e 1 retorno', dor: 'Durante, não. Depois, inchaço por 2 a 3 dias, controlado com medicação.', destaque: [18, 28] },
  { id: 'sorriso', sintoma: 'Quero mudar o sorriso', tratamento: 'Lentes de contato dental', oque: 'Lâminas finas de porcelana corrigem cor, formato e pequenos espaços entre os dentes.', como: 'Planejamento digital do sorriso, ensaio na boca antes de aprovar e cimentação das lentes.', consultas: '3 a 4 consultas', dor: 'Na maioria dos casos, pouco ou nenhum desgaste do dente.', destaque: [11, 12, 13, 21, 22, 23] },
]
const casoId = ref('sensivel')
const caso = computed(() => casos.find(c => c.id === casoId.value)!)

const areas = [
  { g: 'Prevenção', d: 'Limpeza, flúor e acompanhamento para nada virar problema.', itens: ['Limpeza e polimento', 'Aplicação de flúor', 'Selante'], img: 'prevencao.webp', w: 1000, h: 818 },
  { g: 'Estética', d: 'Clareamento, lentes e facetas planejados para o seu rosto.', itens: ['Clareamento', 'Lentes de contato dental', 'Facetas em resina'], img: 'sorriso.webp', w: 1200, h: 729 },
  { g: 'Implantes e próteses', d: 'Repor um dente ou vários, com aparência natural.', itens: ['Implantes', 'Coroas e próteses', 'Restaurações na cor do dente'], img: 'atendimento.webp', w: 1400, h: 968 },
  { g: 'Ortodontia', d: 'Aparelho fixo ou alinhadores transparentes.', itens: ['Aparelho fixo', 'Alinhadores transparentes', 'Contenção'], img: 'procedimento.webp', w: 1200, h: 1798 },
  { g: 'Canal e cirurgia', d: 'Canal, siso e enxerto, com anestesia e cuidado.', itens: ['Tratamento de canal', 'Extração de siso', 'Enxerto ósseo'], img: 'exame.webp', w: 1200, h: 803 },
  { g: 'Odontopediatria', d: 'Da primeira consulta do bebê à adolescência, sem medo.', itens: ['Primeira consulta do bebê', 'Prevenção de cáries', 'Orientação para os pais'], img: 'infantil.webp', w: 1200, h: 800 },
]
const numeros = [{ v: '12', l: 'anos de clínica' }, { v: '8 mil+', l: 'pacientes atendidos' }, { v: '6', l: 'especialidades' }]
const iniciais = (n: string) => n.replace(/^Dra?\.\s*/, '').split(' ').map(x => x[0]).join('').slice(0, 2)
const etapas = [
  { t: 'Conversa', d: 'Você conta o que incomoda e o que espera do tratamento. Sem pressa.' },
  { t: 'Exame e raio-x', d: 'Exame clínico completo e raio-x digital feito na própria clínica.' },
  { t: 'Plano por escrito', d: 'Você leva para casa o plano com as etapas e o tempo de cada uma.' },
  { t: 'Tratamento', d: 'Começamos pelo que é mais urgente, no ritmo que você escolher.' },
]
const equipe = [
  { n: 'Dra. Nome Sobrenome', cro: 'CRO-UF 00000', esp: 'Implantodontia e prótese', resp: true },
  { n: 'Dr. Nome Sobrenome', cro: 'CRO-UF 00000', esp: 'Ortodontia e alinhadores' },
  { n: 'Dra. Nome Sobrenome', cro: 'CRO-UF 00000', esp: 'Odontopediatria' },
]
const depoimentos = [
  { t: 'Morria de medo de dentista. A doutora explicou cada passo antes de fazer e eu não senti nada. Hoje vou nas revisões sem ansiedade.', n: 'Patrícia L.', s: 'Paciente há 3 anos', trat: 'Tratamento de canal' },
  { t: 'Fiz o canal de manhã e voltei a trabalhar à tarde. Atendimento pontual e muito cuidadoso.', n: 'Ricardo M.', s: 'Paciente há 1 ano', trat: 'Endodontia' },
  { t: 'Levo meus dois filhos. Eles saem da consulta pedindo para voltar.', n: 'Aline F.', s: 'Mãe de pacientes', trat: 'Odontopediatria' },
  { t: 'O clareamento ficou natural, do jeito que eu queria. Ninguém diz que eu fiz.', n: 'Bruno T.', s: 'Paciente há 2 anos', trat: 'Clareamento' },
]
const faq = [
  { q: 'Tenho medo de dentista. Como vocês lidam com isso?', a: 'A primeira consulta é só conversa e exame. Explicamos tudo antes de fazer e você pode pedir para parar a qualquer momento.' },
  { q: 'Vocês atendem urgência?', a: 'Sim. Em caso de dor, chame no WhatsApp: reservamos horários todos os dias para urgências.' },
  { q: 'Atendem crianças?', a: 'Sim, a partir do primeiro dente. Temos odontopediatra na equipe.' },
  { q: 'Atendem convênio?', a: 'Atendemos alguns convênios odontológicos. Mande o nome do seu plano pelo WhatsApp que a gente confirma.' },
  { q: 'Quanto tempo dura a primeira consulta?', a: 'Cerca de 50 minutos, já com o raio-x.' },
]

const duvida = ref(0)

// ============ AGENDAMENTO ============
const nome = ref('')
const motivo = ref('Avaliação geral')
const periodo = ref('Manhã')
const agendar = computed(() => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Olá! Meu nome é ${nome.value.trim() || '(seu nome)'}. Quero agendar: ${motivo.value}. Prefiro de ${periodo.value.toLowerCase()}.`)}`)
const wa = (t = 'Olá! Quero agendar uma avaliação.') => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t)}`
const base = useRuntimeConfig().app.baseURL
function agendarCaso() {
  motivo.value = caso.value.tratamento
  document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.5-.4Z" /></symbol>
        <symbol id="i-ig" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /></g><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" /></symbol>
        <symbol id="i-dente" viewBox="0 0 24 24"><path d="M7.5 3C5 3 3.5 5 3.5 7.5c0 2 .8 3.3 1.3 5 .6 2.2.7 4.3 1.3 6.3.4 1.4 1.1 2.2 1.9 2.2 1.6 0 1.6-3 2.2-5 .3-1 .8-1.5 1.8-1.5s1.5.5 1.8 1.5c.6 2 .6 5 2.2 5 .8 0 1.5-.8 1.9-2.2.6-2 .7-4.1 1.3-6.3.5-1.7 1.3-3 1.3-5C20.5 5 19 3 16.5 3c-1.9 0-2.9 1-4.5 1S9.4 3 7.5 3Z" fill="currentColor" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></g></symbol>
        <symbol id="i-relogio" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></g></symbol>
      </defs>
    </svg>

    <header class="topo">
      <div class="wrap topo-in">
        <a href="#" class="marca"><svg><use href="#i-dente" /></svg><span><b>{{ site.marca }}</b><small>{{ site.subtitulo }}</small></span></a>
        <nav class="nav" aria-label="Seções"><a href="#sintomas">O que você sente</a><a href="#tratamentos">Tratamentos</a><a href="#clinica">A clínica</a><a href="#sobre">Sobre nós</a></nav>
        <a class="btn btn-tinta btn-p" href="#agendar">Agendar avaliação</a>
      </div>
    </header>

    <main id="conteudo">
      <!-- topo -->
      <section class="hero">
        <div class="wrap hero-grid">
          <div class="hero-txt">
            <h1>Sorriso cuidado, sem pressa.</h1>
            <p class="hero-desc">Clínica odontológica para a família toda. Explicamos cada etapa antes de começar e você sai da primeira consulta com o plano completo por escrito.</p>
            <div class="hero-acoes">
              <a class="btn btn-gengiva" href="#agendar">Agendar avaliação</a>
              <a class="btn btn-linha" :href="wa('Olá! Estou com dor e preciso de atendimento.')" target="_blank" rel="noopener"><svg><use href="#i-wa" /></svg>Estou com dor</a>
            </div>
            <ul class="hero-fatos">
              <li>Raio-x digital na clínica</li>
              <li>Urgência no mesmo dia</li>
              <li>Atendimento infantil</li>
            </ul>
          </div>
          <div class="hero-midia">
            <img class="hero-foto" :src="`${base}fotos/hero.webp`" width="1600" height="1140" alt="Consultório odontológico claro com dentista organizando o atendimento" fetchpriority="high">
            <div class="hero-card hero-card-a"><span class="hc-ic"><svg><use href="#i-dente" /></svg></span><span><b>{{ site.responsavel }}</b><small>{{ site.cro }} · Responsável técnica</small></span></div>
            <div class="hero-card hero-card-b"><b>4,9</b><span><i aria-hidden="true">★★★★★</i>no Google</span></div>
          </div>
        </div>
      </section>

      <!-- o que está incomodando -->
      <section id="sintomas" class="sintomas">
        <div class="wrap">
          <h2>O que está incomodando você?</h2>
          <p class="sec-desc">Escolha o que mais parece com o seu caso para entender o tratamento mais comum. O diagnóstico de verdade é feito na consulta.</p>
          <div class="sint-grid">
            <div class="sint-lista" role="radiogroup" aria-label="Sintoma">
              <button v-for="c in casos" :key="c.id" type="button" role="radio" :aria-checked="casoId === c.id" :class="{ on: casoId === c.id }" @click="casoId = c.id">{{ c.sintoma }}</button>
            </div>
            <div class="sint-mapa">
              <Arcada3D :destaque="caso.destaque" :ausente="caso.ausente" :gengiva="caso.gengiva" :desalinhado="caso.desalinhado" :amarelado="caso.amarelado" />
            </div>
            <article class="sint-ficha" aria-live="polite">
              <h3>{{ caso.tratamento }}</h3>
              <dl>
                <div><dt>Por que acontece</dt><dd>{{ caso.oque }}</dd></div>
                <div><dt>Como tratamos</dt><dd>{{ caso.como }}</dd></div>
                <div><dt>Quantas consultas</dt><dd>{{ caso.consultas }}</dd></div>
                <div><dt>Dói?</dt><dd>{{ caso.dor }}</dd></div>
              </dl>
              <button type="button" class="btn btn-tinta" @click="agendarCaso">Agendar para este caso</button>
            </article>
          </div>
        </div>
      </section>

      <!-- tratamentos -->
      <section id="tratamentos" class="tratamentos">
        <div class="wrap">
          <div class="sec-head">
            <div><h2>Tratamentos</h2><p class="sec-desc">Da limpeza de rotina ao implante, tudo no mesmo lugar e com a mesma equipe acompanhando o seu histórico.</p></div>
            <a class="btn btn-linha" href="#agendar">Agendar avaliação</a>
          </div>
          <div class="trat-cards">
            <article v-for="(a, i) in areas" :key="a.g" class="trat" :class="`t${i + 1}`">
              <img :src="`${base}fotos/${a.img}`" :width="a.w" :height="a.h" :alt="a.g" loading="lazy">
              <div class="trat-txt">
                <h3>{{ a.g }}</h3>
                <p>{{ a.d }}</p>
                <ul><li v-for="it in a.itens" :key="it">{{ it }}</li></ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- primeira consulta -->
      <section class="consulta">
        <div class="wrap">
          <h2>Como é a primeira consulta</h2>
          <ol class="etapas">
            <li v-for="(e, i) in etapas" :key="e.t"><span class="etapa-n" aria-hidden="true">{{ i + 1 }}</span><h3>{{ e.t }}</h3><p>{{ e.d }}</p></li>
          </ol>
        </div>
      </section>

      <!-- clínica -->
      <section id="clinica" class="clinica">
        <div class="wrap clin-grid">
          <img :src="`${base}fotos/biosseguranca.webp`" width="1200" height="800" alt="Profissional de odontologia atendendo com touca, máscara, protetor facial e luvas" loading="lazy" class="clin-foto">
          <div>
            <h2>Biossegurança que você pode ver</h2>
            <ul class="bio">
              <li><b>Instrumentos esterilizados em autoclave</b>, com registro de cada ciclo.</li>
              <li><b>Embalagens lacradas</b>, abertas na sua frente.</li>
              <li><b>Raio-x digital</b>, com até 80% menos radiação que o convencional.</li>
              <li><b>Materiais descartáveis</b> trocados a cada paciente.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- sobre nós -->
      <!-- TODO: trocar pela história real, fotos e CROs da equipe -->
      <section id="sobre" class="sobre">
        <div class="wrap sobre-grid">
          <div class="sobre-fotos">
            <img class="sf-1" :src="`${base}fotos/consultorio.webp`" width="1400" height="1050" alt="Consultório com cadeira odontológica e armários" loading="lazy">
            <img class="sf-2" :src="`${base}fotos/atendimento.webp`" width="1400" height="968" alt="Dentista atendendo um paciente" loading="lazy">
            <div class="sf-selo"><b>{{ numeros[0].v }}</b><span>{{ numeros[0].l }}</span></div>
          </div>
          <div class="sobre-txt">
            <h2>Sobre nós</h2>
            <p class="sec-desc">A {{ site.marca }} nasceu da vontade de fazer uma odontologia sem pressa: consulta com tempo para conversar, explicação antes de qualquer procedimento e o mesmo dentista acompanhando você do começo ao fim.</p>
            <dl class="sobre-nums"><div v-for="n in numeros" :key="n.l"><dt>{{ n.v }}</dt><dd>{{ n.l }}</dd></div></dl>
            <ul class="equipe">
              <li v-for="p in equipe" :key="p.n + p.esp">
                <span class="foto-esp" aria-hidden="true">{{ iniciais(p.n) }}</span>
                <div><h3>{{ p.n }}</h3><p>{{ p.esp }}</p><small>{{ p.cro }}<template v-if="p.resp"> · Responsável técnica</template></small></div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- depoimentos -->
      <section class="depoimentos">
        <div class="wrap">
          <div class="sec-head">
            <h2>O que dizem os pacientes</h2>
            <div class="google"><b>4,9</b><span><i aria-hidden="true">★★★★★</i>000 avaliações no Google</span></div>
          </div>
          <div class="dep-grid">
            <figure class="dep-destaque">
              <img :src="`${base}fotos/sorriso.webp`" width="1200" height="729" alt="" loading="lazy">
              <div class="dep-destaque-txt">
                <span class="estrelas" aria-label="5 de 5 estrelas">★★★★★</span>
                <blockquote>“{{ depoimentos[0].t }}”</blockquote>
                <figcaption><span class="av" aria-hidden="true">{{ depoimentos[0].n[0] }}</span><span><b>{{ depoimentos[0].n }}</b><small>{{ depoimentos[0].s }} · {{ depoimentos[0].trat }}</small></span></figcaption>
              </div>
            </figure>
            <figure v-for="d in depoimentos.slice(1)" :key="d.n" class="dep">
              <span class="estrelas" aria-label="5 de 5 estrelas">★★★★★</span>
              <blockquote>“{{ d.t }}”</blockquote>
              <figcaption><span class="av" aria-hidden="true">{{ d.n[0] }}</span><span><b>{{ d.n }}</b><small>{{ d.s }} · {{ d.trat }}</small></span></figcaption>
            </figure>
          </div>
          <p class="aviso">Depoimentos de exemplo: substitua por relatos reais, com autorização dos pacientes.</p>
        </div>
      </section>

      <!-- dúvidas: a doutora responde -->
      <section class="duvidas">
        <div class="wrap">
          <h2>Pergunte à doutora</h2>
          <p class="sec-desc">As perguntas que mais ouvimos na cadeira, respondidas por quem atende você.</p>
          <div class="resp-grid">
            <ul class="resp-lista" role="tablist" aria-label="Perguntas">
              <li v-for="(f, i) in faq" :key="f.q"><button type="button" role="tab" :aria-selected="duvida === i" :class="{ on: duvida === i }" @click="duvida = i"><svg aria-hidden="true"><use href="#i-dente" /></svg>{{ f.q }}</button></li>
            </ul>
            <article class="resp-carta" role="tabpanel" aria-live="polite">
              <p class="resp-q">“{{ faq[duvida].q }}”</p>
              <Transition name="resp" mode="out-in"><p :key="duvida" class="resp-a">{{ faq[duvida].a }}</p></Transition>
              <footer class="resp-assina">
                <span class="resp-av" aria-hidden="true"><svg><use href="#i-dente" /></svg></span>
                <span><b>{{ site.responsavel }}</b><small>{{ site.cro }} · Responsável técnica</small></span>
              </footer>
              <a class="btn btn-linha resp-btn" :href="wa('Olá! Tenho uma dúvida para a doutora.')" target="_blank" rel="noopener"><svg><use href="#i-wa" /></svg>Mandar outra pergunta</a>
            </article>
          </div>
        </div>
      </section>

      <!-- agendar -->
      <section id="agendar" class="agendar">
        <div class="wrap ag-grid">
          <form class="ag-form" @submit.prevent>
            <h2>Agendar avaliação</h2>
            <label>Seu nome<input v-model="nome" autocomplete="name" name="nome" placeholder="Ex.: Maria Silva…"></label>
            <label>Motivo da consulta
              <select v-model="motivo">
                <option>Avaliação geral</option>
                <option v-for="c in casos" :key="c.id" :value="c.tratamento">{{ c.tratamento }}</option>
                <option>Consulta para criança</option>
              </select>
            </label>
            <fieldset><legend>Melhor período</legend>
              <div class="chips"><button v-for="p in ['Manhã', 'Tarde', 'Sábado']" :key="p" type="button" :class="{ on: periodo === p }" :aria-pressed="periodo === p" @click="periodo = p">{{ p }}</button></div>
            </fieldset>
            <a class="btn btn-gengiva btn-cheio" :href="agendar" target="_blank" rel="noopener"><svg><use href="#i-wa" /></svg>Enviar pelo WhatsApp</a>
            <p class="nota">A gente responde com os horários livres para você escolher.</p>
          </form>
          <div class="ag-info">
            <p><svg><use href="#i-pin" /></svg>{{ site.endereco }}</p>
            <p><svg><use href="#i-relogio" /></svg>{{ site.horario }}</p>
            <a class="btn btn-linha-escura" :href="site.mapa" target="_blank" rel="noopener">Ver no mapa</a>
            <img :src="`${base}fotos/exame.webp`" width="1200" height="803" alt="Dentista examinando a boca de uma paciente" loading="lazy" class="ag-foto">
          </div>
        </div>
      </section>
    </main>

    <footer class="rodape">
      <div class="wrap rod-top">
        <div>
          <a href="#" class="marca"><svg><use href="#i-dente" /></svg><span><b>{{ site.marca }}</b><small>{{ site.subtitulo }}</small></span></a>
          <p>Responsável técnica: {{ site.responsavel }} · {{ site.cro }}<br>{{ site.endereco }}<br>CNPJ {{ site.cnpj }}</p>
        </div>
        <div class="rod-redes">
          <a :href="wa()" target="_blank" rel="noopener" aria-label="WhatsApp"><svg><use href="#i-wa" /></svg></a>
          <a :href="site.instagram" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#i-ig" /></svg></a>
        </div>
      </div>
      <div class="wrap"><div class="rod-final">
        <span>© {{ new Date().getFullYear() }} {{ site.marca }}. Fotos de ambientação: Germanna CC, Harrison Keely, Conor Lawless, Shixart1985 e Oleg Ponomarev (CC BY), U.S. DoD (domínio público) e Steve Buissinne (CC0), via Wikimedia Commons.</span>
        <a class="rod-credito" href="https://www.ontrackagenciadigital.com.br/" target="_blank" rel="noopener">Desenvolvido por <b>OnTrack Agência Digital</b></a>
      </div></div>
    </footer>
  </div>
</template>
