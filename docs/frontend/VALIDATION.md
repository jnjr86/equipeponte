# Validação — 28/09/2026

## Versão multipágina

- `python3 scripts/check_site.py`: referências locais HTML/CSS, âncoras, h1 único e alt.
- `python3 scripts/check_content.py`: 33 parágrafos integrais do DOCX preservados e menu
  exato de seis itens em todas as 11 páginas de conteúdo.
- `node --check public/assets/site.js`: sintaxe válida.
- `node --test tests/contact.test.cjs`: quatro testes aprovados, cobrindo validação,
  método/origem/tamanho, falta de configuração, destinatário fixo e erro do provedor.
  Fetch simulado; nenhum e-mail real enviado.
- Todas as 11 páginas abertas em 390px: títulos e seis itens do menu presentes,
  sem overflow horizontal da página.
- Revisão visual desktop: Home, A Equipe, Oficinas e catálogo do design system.
- Revisão visual mobile: oficinas, contato e validação de campos obrigatórios.
- Formulário vazio: envio impedido, foco no campo Nome, campos inválidos identificados.
- Menu mobile: abre/fecha e navega para as páginas; aria-expanded atualizado.
- Contrastes sólidos: Cinza01/Verde01 8,22:1; Cinza01/Cinza02 8,34:1;
  branco/Verde02 7,13:1; branco/Cinza01 17,10:1; texto secundário/superfície 6,05:1.
- Cópia de cor no catálogo: confirmação acessível e código #6ec597 correto.

## Limites

Não foi executado Lighthouse nem auditoria completa de WCAG/leitor de tela.
Contraste sobre fotografia exige revisão contextual; a Home inclui overlay escuro.
Envio real depende da configuração do provedor. PDFs não fornecidos.
A licença web própria das fontes e o domínio definitivo ainda precisam ser confirmados.
