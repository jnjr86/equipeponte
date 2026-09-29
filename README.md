# Equipe Ponte

Site institucional estático em HTML, CSS e JavaScript, com design system compartilhado.

## Executar localmente

```sh
python3 -m http.server 4173 --directory public
```

Abra `http://localhost:4173`. O catálogo de componentes está em `/design-system.html`.
Não há instalação de dependências nem etapa de build.

## Estrutura

- `public/`: único diretório publicado; Home, catálogo, assets e regras de indexação.
- `public/assets/styles.css`: fontes, tokens, componentes e layouts responsivos.
- `public/assets/site.js`: menu, formulário de contato e cópia de cores.
- `docs/frontend/`: decisões visuais, conteúdo, procedência e validação.
- `conteudo/`, `Links/`, `site-antigo/`: materiais de referência locais, fora do deploy.

## Deploy

O projeto Vercel deve usar o preset **Other**, raiz do repositório e output `public`.
`vercel.json` desativa instalação/build e publica somente `public`.
Branches de trabalho geram previews; `main` é a branch de produção da Vercel.
Para Locaweb, envie apenas o conteúdo de `public/` para a raiz pública da hospedagem.

Esta versão é um preview: meta robots, `robots.txt` e `X-Robots-Tag` bloqueiam indexação.
Antes do lançamento, confirme o domínio canônico, remova essas restrições, atualize
`canonical`/Open Graph/sitemap e revise conteúdo, contato e licenças de fontes.

## Verificação

```sh
node --check public/assets/site.js
python3 scripts/check_site.py
```

Faça também revisão visual em 390, 768, 1280 e 1920px, teste menu com teclado,
páginas das oficinas e validação do formulário. O contato usa o e-mail confirmado
nos documentos. WhatsApp depende do fornecimento do número oficial.

## Páginas e conteúdo final

Menu: Home | A Equipe | O Grupo | Oficinas | Textos e publicações | Contato.
As cinco oficinas possuem páginas próprias com seus textos integrais.

Fonte transcrita: `content/site-content.json`. Para regenerar após editar conteúdo:

```sh
python3 scripts/build_site.py
python3 scripts/check_site.py
node --test tests/contact.test.cjs
```

O site publicado já contém HTML pronto; Python não é necessário na hospedagem.
Detalhes e pendências: `docs/frontend/CONTENT.md`.
Formulário e ativação do envio direto: `docs/frontend/CONTACT_SETUP.md`.
