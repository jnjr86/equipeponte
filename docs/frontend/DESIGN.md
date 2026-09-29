# Equipe Ponte — design system v01

## Direção e referência

Referência inspecionada: https://www.gogeviti.com/ em 28/09/2026.
Preservar o ritmo editorial: hero com céu, navegação translúcida em cápsula,
texto introdutório sans-serif seguido de título serifado em itálico, CTAs em
cápsula, ícones 3D, seções amplas, FAQ e chamada final de contato.
Adaptar o conteúdo à psicanálise, às oficinas e ao trabalho em grupo da Ponte.
Não reproduzir métricas, depoimentos, preços ou alegações médicas da referência.

## Contexto e jornada

Projeto novo; página institucional voltada a familiares, responsáveis e pessoas
interessadas na proposta clínica. A tarefa central é entender se o trabalho faz
sentido para sua situação e iniciar contato com a equipe.

Entrada → apresentação → proposta → grupo → oficinas → equipe → dúvidas → e-mail.
Primeira decisão: conhecer o trabalho ou conversar. Em mobile, manter o CTA antes
do conteúdo aprofundado. Contato alternativo: endereço e link para o mapa.
Vocabulário: escuta, grupo, oficinas, encontros, singularidade. Evitar linguagem
médica promocional e termos de implementação na interface pública.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--verde-01` | `#6ec597` | Acentos, CTA em fundo escuro |
| `--verde-02` | `#2c5d78` | Azul-petróleo, rótulos, foco |
| `--cinza-01` | `#081e29` | Texto principal, CTA, seção de contato |
| `--cinza-02` | `#a7b7c7` | Texto secundário sobre fundo escuro |
| `--paper` | `#f8faf9` | Fundo principal |
| `--surface` | `#f0f5f3` | Superfícies e ícones |
| `--surface-mint` | `#e4f0e9` | Seção da equipe |

Aspekta 400/500/600: corpo, navegação, ações e títulos de apoio.
Victor Serif 500 regular/itálico: expressão editorial e títulos.
Escala fluida via `clamp`; corpo 16px com entrelinha 1.6.
Grid até 1280px; 3/2/1 colunas conforme espaço. Breakpoints 600, 900, 1100 e 1600px.
Espaçamento de 4 a 96px; raios 12/24/32px e cápsula. Transições 180/320ms.

## Componentes

- **Botão:** primary/light/mint/outline, 56px mínimo, ícone de direção. Hover,
  active, focus-visible e disabled. Links navegam; buttons executam ações.
- **Menu:** navegação inline no desktop, painel expansível em telas compactas;
  `aria-expanded`, fechamento por Escape, seleção ou clique externo.
- **Oficina:** cartão com foto e link para página de leitura com o texto integral.
- **Formulário:** nome, e-mail e mensagem; validação nativa e estados honestos.
  Mailto explícito enquanto envio direto não estiver configurado.
- **FAQ:** `details`/`summary` nativos; leitura e operação sem JavaScript.
- **Ícone 3D:** atlas original, seis células; manter proporção e texto adjacente.
  Elementos decorativos usam `aria-hidden`; não representar pacientes.

## Mídia e procedência

Logo: `Links/logo_equipe-ponte.png`. Foto da equipe e obra de Pedro M.: extraídas
do DOCX fornecido. Hero e atlas 3D: gerados originalmente para este projeto.
Imagens publicadas em WebP; versões menores em srcset e hero mobile.
Fontes identificadas no CSS público da Geviti, copiadas para reprodução visual.
As licenças de redistribuição das fontes não foram verificadas; confirmar a licença
web própria, especialmente Victor Serif, antes de lançamento comercial.

## Escopo

As 11 páginas e o catálogo `/design-system.html` compartilham tokens e estilos.
Menu: Home, A Equipe, O Grupo, Oficinas, Textos e publicações, Contato.
Cinco oficinas possuem páginas próprias; equipe possui sete perfis.
WhatsApp e PDFs dependem de conteúdo adicional. Veja CONTENT.md e CONTACT_SETUP.md.
Canonical/sitemap usam o domínio provisório da Vercel. Preview está em noindex.
