# Camada de movimento

A camada mantém o design aprovado e usa `assets/motion.css` e `assets/motion.js` em todas as páginas. O gerador inclui os mesmos arquivos. Bibliotecas locais: GSAP/ScrollTrigger 3.15.0 e Lenis 1.3.26; avisos de licença em `assets/vendor/`.

## Mapeamento e intensidade

- Entrada: documento 0,6 s, header 0,65 s, conteúdo inicial em sequência.
- Hero/títulos: máscara vertical, linhas explícitas reveladas em sequência no desktop. O texto e a ênfase são preservados; no celular mantém-se a quebra natural original.
- `.prose`: entrada por parágrafo, sem separar palavras; duração 0,8 s.
- `.reading-aside`, headings, pessoas, oficinas e publicações: sequências de 0,09 s, ativadas em `top 82%`, uma única vez.
- Fotografias: entrada lateral conforme a posição no grid (esquerda/direita; imagens centrais alternam), máscara horizontal e escala temporária 1,04 → 1. Deslocamento de 40 px no desktop e 14 px no celular, duração 1 s/0,7 s. Labels, ícones e CTAs das colunas laterais entram de forma discreta com 24 px/10 px. Figuras principais têm deslocamento de −12 a +12 px com scrub 1,1, mantendo o recorte original da foto.
- Lenis: lerp 0,1 apenas com apontador preciso e viewport acima de 600 px. Touch permanece nativo. Não há pin, snapping ou scroll obrigatório.
- Header: threshold de 70 px e fade/translate de 0,4 s. Mantém a posição original no documento: não adiciona fixação ou sticky.
- Menu: abertura 0,3 s com links sequenciais e fechamento inverso. `aria-expanded`, Escape e foco continuam no script global `site.js`.
- Navegação interna: saída 0,3 s com fallback de 450 ms; nova página continua sendo HTML independente. Links externos, downloads, modificadores e nova aba ficam com comportamento nativo.
- Âncoras: hash preservado e foco transferido ao destino. A seta de Explore oscila 5 px.

## Acessibilidade e recuperação

Sem JS ou sem bibliotecas, todo o conteúdo permanece visível. `prefers-reduced-motion` desativa a camada e Lenis; mudanças de preferência e viewport desmontam o contexto, restauram estilos e eliminam listeners/ticker anteriores. Retorno pelo histórico restaura conteúdo que passou pelo fade-out. Imagens/fontes atualizam as posições dos triggers. Animações de revelação liberam seus estilos ao concluir.

## Verificação realizada

- Links/ativos locais, conteúdo do DOCX e menu em 12 páginas: passaram.
- Carregamento de todas as 13 páginas, incluindo design system, no navegador integrado: sem erros de console ou overflow horizontal no desktop.
- Dimensões do Hero e H1 comparadas com produção: idênticas após a entrada.
- Viewport 390 px, abertura/fechamento do menu, Escape, navegação Home → A Equipe, botão voltar e âncora Conheça a Ponte: verificados.
- Preferência de movimento reduzido simulada em página temporária de QA: conteúdo imediato, sem Lenis ou wrappers de linhas. Arquivo temporário removido.
- Chrome/Safari/Firefox independentes, dispositivos físicos e trackpad físico não estavam expostos ao controle de browser desta sessão; essa matriz não está certificada.
