# Ativar envio direto do formulário

## Estado atual

O site estático funciona sem serviço de e-mail. O botão “Abrir no meu e-mail” monta
uma mensagem para `equipeponte@gmail.com`; o visitante confirma o envio em seu próprio
aplicativo. Não há confirmação falsa de entrega.

## Vercel + Resend (opção preparada)

1. Criar uma conta Resend e verificar um domínio remetente próprio.
2. Na Vercel, configurar os segredos `RESEND_API_KEY` e `CONTACT_FROM` para o ambiente
   desejado. `CONTACT_FROM` deve ser um remetente do domínio verificado, por exemplo
   `Equipe Ponte <site@dominio-verificado>`; não usar Gmail como domínio remetente.
3. Em `public/assets/site-config.js`, definir `contactEndpoint: "/api/contact"`.
4. Fazer um novo deploy. O botão passa a “Enviar mensagem”.
5. Fazer um envio de validação autorizado e confirmar o recebimento na caixa da equipe.

O endpoint opcional `api/contact.js` usa fetch nativo, valida tamanho/tipo/campos,
rejeita origens divergentes e inclui honeypot. O destinatário é fixo. Não grava o
conteúdo do contato em logs. Antes de abrir para tráfego público, configurar limites
de requisição na Vercel; honeypot e verificação de origem não substituem rate limiting.

Respostas de falha preservam os campos preenchidos. Somente uma resposta de sucesso
confirmada pelo provedor limpa o formulário. Nenhum envio real foi feito nos testes.

## Locaweb

O frontend continua estático: copiar `public/` para a hospedagem. O envio direto exige
um endpoint HTTPS no mesmo domínio, implementado no ambiente da hospedagem (por exemplo,
PHP com SMTP) e compatível com o contrato JSON `{name,email,message,company}`.
Manter `contactEndpoint` vazio até esse endpoint existir. A função Node em `api/` é
específica do deploy Vercel e não precisa ser copiada para uma hospedagem PHP.

Referências: https://resend.com/docs/api-reference/emails/send-email e
https://vercel.com/docs/functions/runtimes/node-js.
