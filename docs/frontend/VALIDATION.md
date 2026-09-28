# Validação — 28/09/2026

## Verificado

- Sintaxe JavaScript: `node --check public/assets/site.js`.
- Referências locais HTML/CSS, âncoras, h1 único e alt em imagens: `python3 scripts/check_site.py`.
- Revisão visual da Home em desktop (1280px) e celular (390px).
- Sem overflow horizontal da página em 320, 390, 768 e 1920px; carrossel rola dentro de seu contêiner.
- Menu mobile abre, fecha ao selecionar seção e atualiza aria-expanded.
- Detalhes da oficina abrem em diálogo; Escape fecha e devolve foco ao acionador.
- Carrossel avança e habilita o botão anterior após rolar.
- FAQ expande a resposta selecionada.
- Catálogo: botão copia `#6ec597` e anuncia confirmação; sem overflow em 390px.
- Contrastes sólidos: Cinza01/Verde01 8,22:1; Cinza01/Cinza02 8,34:1;
  branco/Verde02 7,13:1; branco/Cinza01 17,10:1; texto secundário/superfície 6,05:1.
- Assets locais, imagens WebP e fontes WOFF2; total de public aproximadamente 1,2 MB.

## Limites

Não foi executado Lighthouse nem auditoria completa de WCAG/leitor de tela.
Contraste sobre fotografia exige revisão contextual; a Home inclui overlay escuro.
Os conteúdos são uma adaptação editorial inicial dos materiais fornecidos.
Licença web própria das fontes, domínio final e número de WhatsApp aguardam confirmação.
