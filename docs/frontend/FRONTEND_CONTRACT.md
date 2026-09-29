# Contrato de implementação

- HTML semântico, CSS e JavaScript puro. Sem dependências de execução ou build.
- Publicar apenas `public/`; materiais de trabalho ficam fora da raiz pública.
- Usar os tokens e componentes de `public/assets/styles.css` antes de criar padrões.
- Design system visual: `public/design-system.html`. Direção: `DESIGN.md`.
- Conteúdo final transcrito do DOCX; conferir com scripts/check_content.py.
- Não inventar depoimentos, estatísticas clínicas, CRPs, telefones ou disponibilidade.
- Verificar larguras de 320 a 1920px. Evitar overflow horizontal das páginas.
- Manter navegação por teclado, foco visível, textos alternativos e reduced motion.
- Não enviar formulários sensíveis: o contato inicial usa mailto explícito.
- Manter `noindex` até aprovação de lançamento e definição do domínio definitivo.
- Vercel cria previews por branch; Locaweb recebe o mesmo conteúdo de `public/`.
