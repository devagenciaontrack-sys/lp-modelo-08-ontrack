# Modelo 08 — Dentista · On Track LP

Landing page modelo da **On Track**, feita em **Nuxt 4** (Vue). Sem marca: pronta para personalizar e vender.

- **Demonstração:** https://devagenciaontrack-sys.github.io/lp-modelo-08-ontrack/

## O que tem
- Arcada dentária desenhada em SVG (16 dentes, numeração odontológica), que acende ao abrir a página.
- **"O que está incomodando você?"**: o paciente escolhe o sintoma, a arcada destaca os dentes envolvidos e aparece o tratamento (por que acontece, como é feito, quantas consultas e se dói). O botão leva ao agendamento já com o motivo preenchido.
- Tratamentos por área, primeira consulta em 4 etapas, biossegurança, sobre nós com equipe e CRO, depoimentos, dúvidas e agendamento pelo WhatsApp.

## Atenção às regras do CFO
O Código de Ética Odontológica não permite anunciar **preços, descontos, formas de pagamento nem consulta gratuita**. Por isso o modelo não mostra valores. Também é obrigatório informar o **nome e o CRO do responsável técnico** (já está no topo e no rodapé). Depoimentos e fotos de pacientes só com autorização.

## Como personalizar
Tudo fica no topo de `app/app.vue`:
- `site`: nome, responsável técnico e CRO, WhatsApp, Instagram, telefone, endereço, link do mapa, horário, CNPJ.
- `casos` (sintomas e tratamentos; os números em `destaque`/`ausente` são os dentes pela numeração FDI, 11–18 e 21–28), `areas`, `etapas`, `equipe`, `depoimentos`, `faq`.
- Cores e fontes: topo de `app/assets/css/main.css` e `nuxt.config.ts`.
- Fotos: `public/fotos/`. As atuais são de ambientação (Wikimedia Commons), com crédito no rodapé; ao trocar por fotos próprias, apague o crédito.

## Rodar e publicar
```
npm install
npm run dev        # http://localhost:3000
npm run generate   # site estático em .output/public
```
- **Vercel:** importe o repositório; a Vercel detecta o Nuxt sozinha. Não defina `LP_BASE`.
- **GitHub Pages (demonstração):** `LP_BASE=/lp-modelo-08-ontrack/ npm run generate` e publique `.output/public` no branch `gh-pages`.

## Briefing para o cliente
PDF com tudo o que precisamos do cliente para montar o site: [baixar o briefing](Briefing-Modelo-08-Dentista.pdf?raw=1)

## Prévia ao compartilhar
A imagem `public/og.jpg` aparece quando o link é enviado no WhatsApp ou no Instagram. Em domínio próprio, gere com `LP_URL=https://www.dominio-do-cliente.com.br/` para a prévia apontar para o endereço certo, e troque o `og.jpg` por um print do site final.
