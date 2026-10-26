# CONTEXTO DO PROJETO — leia isto se você é uma IA continuando o trabalho

Você está numa pasta **autossuficiente**. Ela contém um site de loja **estático**
(HTML + CSS + JavaScript puro) feito para a **Carioca InfoCell / Carioca Games**,
loja de celulares, acessórios, informática, papelaria e assistência técnica em
Icaraí, Caucaia/CE. Não há backend, banco de dados, framework, npm, build step
nem dependência para instalar. Abrir `index.html` no navegador já é o site completo.

## Estado atual: pronto para revisão do dono, NÃO publicado

O visual foi refeito e aprovado em teste local (prints em `prints/`).
O que falta **não é código** — são dados comerciais que só o dono da loja confirma.

## Mapa dos arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | Home: hero, faixa de vantagens, categorias com foto, destaques, assistência técnica, "como comprar", CTA |
| `loja.html` | Catálogo: busca, chips de categoria, ordenação, grade de produtos |
| `produto.html` | Página do produto — `produto.html?id=CODIGO` |
| `carrinho.html` | Carrinho + dados do cliente + botão que abre o WhatsApp |
| `servicos.html` | Assistência técnica e dúvidas frequentes |
| `contato.html` | Contato, horários, mapa do Google, fotos da loja |
| `assets/js/config.js` | **DADOS DA LOJA**: WhatsApp, endereço, horários, Pix, e-mail, Instagram |
| `assets/js/catalogo.js` | **PRODUTOS E PREÇOS** (`PRODUTOS`) e as categorias (`CATEGORIAS`, com foto) |
| `assets/js/app.js` | IIFE: renderiza cabeçalho/rodapé, despacha por `body[data-page]`, carrinho (`localStorage`), checkout WhatsApp, animações de entrada |
| `assets/css/style.css` | Todo o visual (variáveis CSS no `:root`, responsivo, `prefers-reduced-motion`) |
| `assets/img/` | 17 fotos (produtos, categorias, loja, assistência) |
| `prints/` | Capturas desktop e celular da versão atual — use para comparar antes/depois |
| `LEIA-ME.md` | Instruções para o dono da loja (abrir, editar, publicar) |

## Como rodar

```bash
# opção 1: dois cliques em index.html (funciona: tudo é caminho relativo)

# opção 2: servidor local (recomendado para testar no celular da mesma rede)
python -m http.server 8099 --bind 127.0.0.1
# depois abra http://127.0.0.1:8099/index.html
```

## Como testar (sem navegador, com jsdom)

Fluxo que já foi usado neste projeto:

```bash
mkdir -p "$TMPDIR/sitetest" && cd "$TMPDIR/sitetest" && npm init -y && npm i jsdom
node test.js   # lê os HTML do disco, avalia os <script src> na mão e valida tudo
```

Atenção nas armadilhas do jsdom: `ResourceLoader` não é exportado (não use
`resources:"usable"`), dispare `DOMContentLoaded` na mão, intercepte `window.open`
para ler a mensagem do WhatsApp e registre `VirtualConsole.on("jsdomError")`.
Teste: renderização de todas as páginas, contagem do catálogo, busca, filtro por
categoria, ordenação, página de produto, adicionar/remover/quantidade no carrinho,
subtotal, validação de nome/telefone e o texto final do pedido.

## Regras de trabalho (violá-las quebra o site ou inventa dado)

1. **Nunca invente preço, telefone, horário ou chave Pix.** `preco: null` rende
   "Sob consulta" no card e o item entra no pedido sem valor.
2. **WhatsApp em `wa.me` só com dígitos**: `55` + DDD + número.
3. Carrinho vazio **não** mostra o formulário de checkout (o bloco `#ladoCheckout`
   é escondido) e o badge de contagem some quando é `0`.
4. Toda `img:` de `catalogo.js` precisa existir em `assets/img/` — confira com um
   `os.path.exists` em lote; foto faltando é o defeito visual mais comum.
5. Escape todo texto do catálogo antes de jogar em `innerHTML` (existe `esc()` no
   `app.js`) e formate dinheiro com `toLocaleString("pt-BR")`.
6. Se for capturar prints com Chrome headless, **use um `--user-data-dir` novo a
   cada rodada** — reaproveitar o diretório faz o Chrome servir o CSS antigo do
   cache e o print sai igual ao anterior.

## Imagens

As fotos vieram de material público da própria loja (Instagram/plano de negócio).
**Antes de publicar, troque pelas definitivas e confirme a autorização de uso** —
é a única parte do site com risco de direito de imagem.

**Confira o conteúdo, não o nome do arquivo.** Dois arquivos estavam trocados e já
foram corrigidos: `tripe-flexivel.jpg` é o tripé azul (838x838) e
`notebook-seminovo.jpg` é o notebook Dell (1440x1440). O antigo
`papelaria-cadernos.jpg` era o tripé e foi renomeado; não existe mais.
`lapis-decorados.jpg` são os lápis coloridos (720x1280, retrato);
`notebook-dell-5490.jpg` tem o preço "R$ 3899" queimado na arte.

**Enquadramento das fotos.** Cada item de `CATEGORIAS`/`PRODUTOS` aceita
`ajuste:"cover"` quando a foto é retrato e a caixa é quadrada — sem esse campo a
foto aparece inteira sobre fundo claro (com faixa). Categorias usam caixa 4:5,
produtos 1:1, galeria da home usa a proporção natural de cada foto
(`.galeria`), e hero/ambiente usam `cover` com ponto focal.

**Mapa.** `assets/img/mapa-loja.jpg` é um mosaico de tiles do OpenStreetMap
gerado localmente (crédito "© OpenStreetMap" na própria imagem), clicável e
apontando para `LOJA.mapa`. O embed do Google Maps foi removido porque responde
301 e deixa a caixa em branco.

## Checklist antes de divulgar

- [ ] WhatsApp confirmado em `config.js` e testado no celular
- [ ] Horário de funcionamento confirmado
- [ ] Pix / formas de pagamento conferidas
- [ ] Preços revisados item por item (principalmente usados e "sob consulta")
- [ ] Endereço, CNPJ e mapa conferidos
- [ ] Fotos definitivas no lugar das atuais
- [ ] Um pedido teste enviado ao WhatsApp da loja
- [ ] Publicar (Netlify Drop, GitHub Pages ou hospedagem própria — ver `LEIA-ME.md`)