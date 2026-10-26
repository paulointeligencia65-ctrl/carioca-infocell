# Carioca InfoCell — site com loja virtual

Site estático (HTML + CSS + JavaScript), **sem precisar de servidor nem banco de dados**.
O catálogo fica em um arquivo de texto e o pedido é fechado pelo **WhatsApp**.

```
carioca-site/
├── index.html        Página inicial (destaques, categorias, serviços)
├── loja.html         Catálogo com busca, filtro por categoria e ordenação
├── produto.html      Página do produto (produto.html?id=CODIGO)
├── carrinho.html     Carrinho + dados do cliente + envio do pedido
├── servicos.html     Assistência técnica
├── contato.html      Contato, horários, mapa
└── assets/
    ├── css/style.css
    ├── js/config.js      ← DADOS DA LOJA (WhatsApp, endereço, horários)
    ├── js/catalogo.js    ← PRODUTOS E PREÇOS
    └── img/              fotos usadas no site
```

---

## 1. Como abrir no computador

**Jeito mais simples:** dê dois cliques em `index.html`.
(Também funciona por `python -m http.server` dentro da pasta, se preferir.)

## 2. Como publicar de graça (3 opções)

**A) Netlify Drop (mais rápido, sem conta de programador)**
1. Acesse <https://app.netlify.com/drop>
2. Arraste a pasta `carioca-site` inteira para a página.
3. Pronto: ele devolve um endereço tipo `https://algo.netlify.app`.
4. Em *Site settings → Change site name* você troca por algo como `cariocainfocell`.

**B) GitHub Pages**
1. Crie um repositório e envie o conteúdo da pasta.
2. *Settings → Pages → Source: main / root*.
3. Fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

**C) Hospedagem própria (se já tiver domínio)**
Basta copiar os arquivos para a pasta pública (`public_html`, `www`...).
Não precisa de PHP, banco ou Node.

## 3. Como editar

### Trocar WhatsApp, endereço, horário  → `assets/js/config.js`
Abra no bloco de notas e altere o texto entre aspas:
- `whatsapp`: **somente números**, com 55 + DDD + número (ex.: `558588975842`)
- `whatsappExibicao`: como aparece na tela (ex.: `(85) 98897-5842`)
- `horarios`, `email`, `pix`, `endereco`, `mapa`, `instagram`

> ⚠️ **Confirme com o dono da loja** o número de WhatsApp, o e-mail, a chave Pix e
> o horário de funcionamento antes de publicar. Os dados atuais vieram de material
> público e podem estar desatualizados.

### Adicionar/alterar produto → `assets/js/catalogo.js`
Cada produto é um bloco assim:

```js
{
  id: "capa-nova",              // único, sem espaços (usado no endereço)
  nome: "Nome do produto",
  cat: "celulares",             // celulares | acessorios | capinhas | informatica | papelaria | assistencia
  preco: 199.90,                // número (ponto, não vírgula); use null para "Sob consulta"
  parcelas: 4,                  // opcional: "ou 4x de R$ ..."
  precoDe: 249.90,              // opcional: preço antigo riscado
  tag: "Oferta",                // opcional: selo no card
  destaque: true,               // opcional: aparece na página inicial
  img: "assets/img/foto.jpg",   // foto dentro de assets/img
  desc: "Uma linha explicando o produto."
}
```

### Trocar foto
Coloque o arquivo em `assets/img/` e aponte o `img:` do produto para ele.

## 4. Como o cliente compra

1. Escolhe o produto → **Adicionar** (abre a gaveta do carrinho).
2. Em `carrinho.html` informa nome, telefone, entrega e pagamento.
3. Clica em **Enviar pedido no WhatsApp**: abre o WhatsApp já com o pedido escrito
   (itens, quantidades, subtotal e observação).
4. A loja confirma estoque, valor final e combina retirada/entrega na conversa.

**Sem gateway de pagamento e sem taxa** — o pedido cai direto no WhatsApp da loja.
Se um dia quiser pagamento online, dá para plugar Mercado Pago/PagSeguro depois
(nesse caso precisa de um servidor pequeno para gerar o link de pagamento).

## 5. Itens "Sob consulta"

Produtos com `preco: null` aparecem como **Sob consulta**: entram no pedido do
WhatsApp sem valor, para a loja cotar na conversa. Use isso enquanto o preço não
estiver confirmado.

---

## Checklist antes de divulgar

- [ ] WhatsApp confirmado (`config.js`) e testado no celular
- [ ] Horário de funcionamento confirmado
- [ ] Pix / formas de pagamento conferidas
- [ ] Preços revisados item por item (principalmente os usados/sob consulta)
- [ ] Endereço e mapa conferidos
- [ ] Fotos trocadas pelas definitivas (as atuais vieram de material público)
- [ ] Pedido teste enviado ao WhatsApp da loja

## Observações técnicas

- Carrinho guardado no navegador do cliente (`localStorage`), chave `carioca_carrinho_v1`.
- Testado com jsdom: catálogo, filtros, ordenação, produto, gaveta do carrinho,
  cálculo de subtotal, remoção de item, validação do formulário e geração da
  mensagem do WhatsApp — 100% passando.
- Site responsivo (celular, tablet e computador). Não usa cookies de rastreamento.
