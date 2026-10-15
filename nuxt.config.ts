// Modelo 08 · Dentista — On Track LP
// Endereço público do site (usado na prévia do WhatsApp/Instagram). Em domínio próprio: LP_URL=https://www.cliente.com.br/
const SITE = process.env.LP_URL || 'https://devagenciaontrack-sys.github.io/lp-modelo-08-ontrack/'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    // GitHub Pages: LP_BASE=/<repo>/ · Vercel/domínio próprio: deixe vazio
    baseURL: process.env.LP_BASE || '/',
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Sua Clínica — Odontologia sem pressa',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Clínica odontológica para a família toda: limpeza, clareamento, canal, implantes, aparelho e odontopediatria. Agende sua avaliação pelo WhatsApp.' },
        { name: 'theme-color', content: '#FFFFFF' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Sua Clínica — Odontologia sem pressa' },
        { property: 'og:description', content: 'Clínica odontológica para a família toda: limpeza, clareamento, canal, implantes, aparelho e odontopediatria. Agende sua avaliação pelo WhatsApp.' },
        { property: 'og:url', content: SITE },
        { property: 'og:image', content: SITE + 'og.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'pt_BR' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap' },
        { rel: 'icon', href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7.5 3C5 3 3.5 5 3.5 7.5c0 2 .8 3.3 1.3 5 .6 2.2.7 4.3 1.3 6.3.4 1.4 1.1 2.2 1.9 2.2 1.6 0 1.6-3 2.2-5 .3-1 .8-1.5 1.8-1.5s1.5.5 1.8 1.5c.6 2 .6 5 2.2 5 .8 0 1.5-.8 1.9-2.2.6-2 .7-4.1 1.3-6.3.5-1.7 1.3-3 1.3-5C20.5 5 19 3 16.5 3c-1.9 0-2.9 1-4.5 1S9.4 3 7.5 3Z' fill='%23D9536A'/%3E%3C/svg%3E" },
      ],
    },
  },
})
