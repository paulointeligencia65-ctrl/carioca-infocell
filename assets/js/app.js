/* =====================================================================
   CARIOCA INFOCELL — loja virtual
   app.js: layout, catálogo, carrinho e checkout pelo WhatsApp.
   Não precisa de servidor: funciona abrindo o index.html.

   Fotos: toda imagem entra numa moldura .foto / .foto-mini, que mostra
   a foto INTEIRA (object-fit:contain) sobre um fundo desfocado dela
   mesma. É o que garante que nenhuma foto saia cortada.
   ===================================================================== */
(function () {
  "use strict";
  var L = window.LOJA, CATS = window.CATEGORIAS, PRODS = window.PRODUTOS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- utilidades ---------- */
  function brl(n) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  /* mesma formatação, mas com espaço comum: o WhatsApp recebe "R$ 798,00"
     em vez de "R$&nbsp;798,00", que alguns aparelhos exibem torto. */
  function brlZap(n) {
    return brl(n).replace(/\u00A0/g, " ");
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function zap(msg) {
    return "https://wa.me/" + L.whatsapp + "?text=" + encodeURIComponent(msg);
  }
  function param(nome) {
    var m = new RegExp("[?&]" + nome + "=([^&]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }
  function toast(txt) {
    var t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = txt; t.classList.add("on");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("on"); }, 2400);
  }
  function catNome(id) {
    var c = CATS.filter(function (x) { return x.id === id; })[0];
    return c ? c.nome : id;
  }
  function prod(id) { return PRODS.filter(function (p) { return p.id === id; })[0]; }

  /* ---------- moldura de foto (nunca corta) ---------- */
  function urlSegura(src) { return String(src || "").replace(/["'()\\]/g, encodeURIComponent); }
  function foto(src, alt, extraClasse) {
    return '<span class="foto-bg" style="background-image:url(&quot;' + urlSegura(src) + '&quot;)" aria-hidden="true"></span>' +
      '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async"' +
      (extraClasse ? ' class="' + extraClasse + '"' : '') + '>';
  }
  function fotoMini(src, alt) {
    return '<span class="foto-mini">' + foto(src, alt) + '</span>';
  }

  /* ---------- carrinho (localStorage) ---------- */
  var CHAVE = "carioca_carrinho_v1";
  function lerCarrinho() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch (e) { return []; }
  }
  function salvarCarrinho(c) {
    localStorage.setItem(CHAVE, JSON.stringify(c));
    pintarBadge();
  }
  function addItem(id, qtd) {
    var c = lerCarrinho(), p = prod(id);
    if (!p) return;
    var it = c.filter(function (x) { return x.id === id; })[0];
    if (it) { it.qtd += (qtd || 1); } else { c.push({ id: id, qtd: qtd || 1 }); }
    salvarCarrinho(c);
    toast("Adicionado ao carrinho 👍");
  }
  function setQtd(id, q) {
    var c = lerCarrinho().map(function (x) { if (x.id === id) x.qtd = q; return x; })
      .filter(function (x) { return x.qtd > 0; });
    salvarCarrinho(c);
  }
  function remover(id) {
    salvarCarrinho(lerCarrinho().filter(function (x) { return x.id !== id; }));
  }
  function totalCarrinho() {
    return lerCarrinho().reduce(function (s, x) {
      var p = prod(x.id); return s + (p && p.preco ? p.preco * x.qtd : 0);
    }, 0);
  }
  function qtdTotal() {
    return lerCarrinho().reduce(function (s, x) { return s + x.qtd; }, 0);
  }

  /* ---------- layout (cabeçalho/rodapé) ---------- */
  var PAGINAS = [
    ["index.html", "Início"],
    ["loja.html", "Loja"],
    ["servicos.html", "Assistência Técnica"],
    ["contato.html", "Contato"]
  ];
  function cabecalho() {
    var aqui = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var menu = PAGINAS.map(function (p) {
      var on = (p[0] === aqui) ? " class=\"ativo\"" : "";
      return "<a href=\"" + p[0] + "\"" + on + ">" + p[1] + "</a>";
    }).join("");
    return "" +
      "<div class=\"topo-info\"><div class=\"wrap\">" +
        "<span>📍 " + esc(L.endereco.rua) + " — " + esc(L.endereco.bairro) + ", " + esc(L.endereco.cidade) + "/" + esc(L.endereco.uf) + "</span>" +
        "<span>💬 <a href=\"" + zap("Olá! Vim pelo site da Carioca InfoCell.") + "\" target=\"_blank\" rel=\"noopener\">WhatsApp " + esc(L.whatsappExibicao) + "</a> · ✉ " + esc(L.email) + "</span>" +
      "</div></div>" +
      "<header class=\"site\"><div class=\"wrap\"><div class=\"bar\">" +
        "<a class=\"logo\" href=\"index.html\">" + fotoMini("assets/img/logo.jpg", "Logo Carioca InfoCell") +
          "<span>Carioca InfoCell<small>" + esc(L.slogan) + "</small></span></a>" +
        "<button class=\"menu-toggle\" aria-label=\"Abrir menu\" onclick=\"document.querySelector('nav.menu').classList.toggle('aberto')\">☰</button>" +
        "<nav class=\"menu\">" + menu + "</nav>" +
        "<button class=\"btn-carrinho\" onclick=\"window.ABRIR_CARRINHO()\">🛒 <span class=\"badge\" id=\"badge\">0</span></button>" +
      "</div></div></header>";
  }
  function rodape() {
    return "<footer class=\"site\"><div class=\"wrap\">" +
      "<div class=\"cols\">" +
        "<div>" +
          "<div class=\"marca\">" + fotoMini("assets/img/logo.jpg", "Logo " + L.nome) + "<strong>" + esc(L.nome) + "</strong></div>" +
          "<p style=\"font-size:.9rem\">" + esc(L.slogan) + " em " + esc(L.endereco.cidade) + "/" + esc(L.endereco.uf) + ". " +
          "Celulares, acessórios, informática, papelaria e conserto na hora.</p>" +
          "<p style=\"font-size:.82rem;opacity:.8\">CNPJ " + esc(L.cnpj) + "</p>" +
        "</div>" +
        "<div><h4>Loja</h4><ul>" +
          "<li><a href=\"loja.html\">Todos os produtos</a></li>" +
          "<li><a href=\"loja.html?cat=celulares\">Celulares</a></li>" +
          "<li><a href=\"loja.html?cat=acessorios\">Acessórios</a></li>" +
          "<li><a href=\"servicos.html\">Assistência técnica</a></li>" +
        "</ul></div>" +
        "<div><h4>Atendimento</h4><ul>" +
          "<li><a href=\"" + zap("Olá! Preciso de ajuda com um pedido.") + "\" target=\"_blank\" rel=\"noopener\">WhatsApp " + esc(L.whatsappExibicao) + "</a></li>" +
          "<li><a href=\"mailto:" + esc(L.email) + "\">" + esc(L.email) + "</a></li>" +
          (L.instagram ? "<li><a href=\"" + esc(L.instagram) + "\" target=\"_blank\" rel=\"noopener\">Instagram @cariocainfocellce</a></li>" : "") +
          L.horarios.map(function (h) { return "<li>" + esc(h[0]) + ": " + esc(h[1]) + "</li>"; }).join("") +
        "</ul></div>" +
        "<div><h4>Onde estamos</h4><ul>" +
          "<li>" + esc(L.endereco.rua) + "</li>" +
          "<li>" + esc(L.endereco.bairro) + " — " + esc(L.endereco.cidade) + "/" + esc(L.endereco.uf) + "</li>" +
          "<li>CEP " + esc(L.endereco.cep) + "</li>" +
          "<li><a href=\"" + L.mapa + "\" target=\"_blank\" rel=\"noopener\">Ver no mapa →</a></li>" +
          (L.instagram ? "<li><a href=\"" + L.instagram + "\" target=\"_blank\" rel=\"noopener\">Instagram @cariocainfocellce</a></li>" : "") +
        "</ul></div>" +
      "</div>" +
      "<div class=\"copy\">" +
        "<span>© " + new Date().getFullYear() + " " + esc(L.nome) + " — " + esc(L.razaoSocial) + ". Todos os direitos reservados.</span>" +
        "<span>Preços e estoque sujeitos a alteração. Pagamento: " + esc(L.pagamentos.join(" · ")) + ".</span>" +
      "</div>" +
    "</div></footer>";
  }
  function pintarBadge() {
    var b = $("#badge"); if (b) { var n = qtdTotal(); b.textContent = n; b.style.display = n ? "" : "none"; }
  }
  function iniciarLayout() {
    var h = $("#topo"); if (h) h.innerHTML = cabecalho();
    var f = $("#rodape"); if (f) f.innerHTML = rodape();
    if (!$("#zapFloat")) {
      var a = document.createElement("a");
      a.id = "zapFloat"; a.className = "zap-float"; a.target = "_blank"; a.rel = "noopener";
      a.title = "Falar no WhatsApp";
      a.href = zap("Olá! Vim pelo site da Carioca InfoCell e quero mais informações.");
      a.innerHTML = "<b>💬</b><span>Fale conosco</span>";
      document.body.appendChild(a);
    }
    if (!$("#topoBtn")) {
      var t = document.createElement("button");
      t.id = "topoBtn"; t.className = "topo-btn"; t.type = "button";
      t.setAttribute("aria-label", "Voltar ao topo"); t.innerHTML = "↑";
      t.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
      document.body.appendChild(t);
    }
    efeitoRolagem();
    pintarBadge();
  }
  function efeitoRolagem() {
    var cab = $("header.site"), btn = $("#topoBtn"), agendado = false;
    function aplicar() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (cab) cab.classList.toggle("scrolled", y > 12);
      if (btn) btn.classList.toggle("on", y > 520);
      agendado = false;
    }
    window.addEventListener("scroll", function () {
      if (agendado) return; agendado = true;
      window.requestAnimationFrame(aplicar);
    }, { passive: true });
    aplicar();
  }

  /* ---------- gaveta lateral do carrinho ---------- */
  function criarGaveta() {
    if ($("#gaveta")) return;
    var d = document.createElement("div");
    d.id = "gaveta"; d.className = "gaveta";
    d.innerHTML = "<div class=\"painel\"><h3>Seu carrinho <button class=\"fechar\" aria-label=\"Fechar\" onclick=\"window.FECHAR_CARRINHO()\">×</button></h3>" +
      "<div id=\"gavetaItens\"></div><div id=\"gavetaResumo\"></div></div>";
    d.addEventListener("click", function (e) { if (e.target === d) fechar(); });
    document.body.appendChild(d);
  }
  function abrir() {
    criarGaveta();
    var c = lerCarrinho();
    var box = $("#gavetaItens");
    if (!c.length) {
      box.innerHTML = "<p class=\"vazio\">Seu carrinho está vazio.<br><a href=\"loja.html\">Ver produtos →</a></p>";
      $("#gavetaResumo").innerHTML = "";
    } else {
      box.innerHTML = c.map(function (x) {
        var p = prod(x.id); if (!p) return "";
        return "<div class=\"item\">" + fotoMini(p.img, p.nome) +
          "<div><h4>" + esc(p.nome) + "</h4><div class=\"p\">" + (p.preco ? brl(p.preco) : "Sob consulta") + "</div>" +
          "<div class=\"qtd\"><button onclick=\"window.MUDAR('" + p.id + "'," + (x.qtd - 1) + ")\">−</button><span>" + x.qtd + "</span>" +
          "<button onclick=\"window.MUDAR('" + p.id + "'," + (x.qtd + 1) + ")\">+</button></div></div>" +
          "<div><button class=\"remover\" onclick=\"window.TIRAR('" + p.id + "')\">remover</button></div></div>";
      }).join("");
      $("#gavetaResumo").innerHTML =
        "<div class=\"resumo\"><div class=\"total\"><span>Subtotal</span><span>" + brl(totalCarrinho()) + "</span></div>" +
        "<p style=\"font-size:.82rem;color:#5b6472\">Itens marcados como <b>sob consulta</b> são cotados no WhatsApp.</p>" +
        "<a class=\"btn btn-amarelo\" style=\"width:100%;justify-content:center\" href=\"carrinho.html\">Fechar pedido →</a></div>";
    }
    $("#gaveta").classList.add("aberta");
  }
  function fechar() { var d = $("#gaveta"); if (d) d.classList.remove("aberta"); }
  window.ABRIR_CARRINHO = abrir;
  window.FECHAR_CARRINHO = fechar;
  window.MUDAR = function (id, q) { setQtd(id, q); abrir(); };
  window.TIRAR = function (id) { remover(id); abrir(); };
  window.ADD = function (id) { addItem(id, 1); abrir(); };

  /* ---------- card de produto ---------- */
  function card(p) {
    var tag = p.tag ? "<span class=\"tag " + p.tag.toLowerCase().replace("ç", "c") + "\">" + esc(p.tag) + "</span>" : "";
    var off = (p.precoDe && p.preco && p.precoDe > p.preco)
      ? "<span class=\"off\">-" + Math.round((1 - p.preco / p.precoDe) * 100) + "%</span>" : "";
    var antigo = p.precoDe && p.precoDe > p.preco ? "<small style=\"text-decoration:line-through;color:#8a93a5\">" + brl(p.precoDe) + "</small> " : "";
    var precoHtml = p.preco
      ? "<div class=\"preco\">" + antigo + brl(p.preco) +
        (p.parcelas ? "<small>ou " + p.parcelas + "x de " + brl(p.preco / p.parcelas) + " sem juros</small>" : "<small>à vista</small>") + "</div>"
      : "<div class=\"consultar\">Sob consulta</div>";
    var link = "produto.html?id=" + p.id;
    var linkAbs = location.href.split("?")[0].replace(/[^/]*$/, "produto.html?id=" + p.id);
    return "<article class=\"card\">" +
      "<a class=\"foto" + (p.ajuste === "cover" ? " cobrir" : "") + "\" href=\"" + link + "\" aria-label=\"" + esc(p.nome) + "\">" + tag + off + foto(p.img, p.nome) + "</a>" +
      "<div class=\"corpo\">" +
        "<span class=\"cat\">" + esc(catNome(p.cat)) + "</span>" +
        "<h3><a href=\"" + link + "\" style=\"color:inherit\">" + esc(p.nome) + "</a></h3>" +
        "<p class=\"desc\">" + esc(p.desc) + "</p>" +
        precoHtml +
        "<div class=\"acoes\">" +
          "<button class=\"btn btn-azul\" onclick=\"window.ADD('" + p.id + "')\">Adicionar</button>" +
          "<a class=\"btn btn-zap\" target=\"_blank\" rel=\"noopener\" href=\"" +
            zap("Olá! Tenho interesse no produto: " + p.nome + " (" + linkAbs + "). Quanto está?") + "\">WhatsApp</a>" +
        "</div>" +
      "</div></article>";
  }

  /* ---------- página: loja ---------- */
  function iniciarLoja() {
    var alvo = $("#lista");
    var estado = { busca: "", cat: param("cat") || "todos", ordem: "relevancia" };
    var chips = ["<button class=\"chip\" data-cat=\"todos\">Todos</button>"].concat(
      CATS.map(function (c) { return "<button class=\"chip\" data-cat=\"" + c.id + "\">" + c.ico + " " + esc(c.nome) + "</button>"; })
    ).join("");
    $("#chips").innerHTML = chips;

    function aplicar() {
      var lista = PRODS.slice();
      if (estado.cat !== "todos") lista = lista.filter(function (p) { return p.cat === estado.cat; });
      if (estado.busca) {
        var q = estado.busca.toLowerCase();
        lista = lista.filter(function (p) {
          return (p.nome + " " + p.desc + " " + catNome(p.cat)).toLowerCase().indexOf(q) > -1;
        });
      }
      if (estado.ordem === "menor") lista.sort(function (a, b) { return (a.preco || 1e9) - (b.preco || 1e9); });
      if (estado.ordem === "maior") lista.sort(function (a, b) { return (b.preco || -1) - (a.preco || -1); });
      if (estado.ordem === "nome") lista.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
      if (estado.ordem === "relevancia") lista.sort(function (a, b) { return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0); });
      $("#contador").textContent = lista.length + (lista.length === 1 ? " produto" : " produtos");
      alvo.innerHTML = lista.length ? lista.map(card).join("")
        : "<p class=\"vazio\">Nenhum produto encontrado. Chame no WhatsApp que a gente procura pra você 😉</p>";
      $$(".chip").forEach(function (b) { b.classList.toggle("on", b.dataset.cat === estado.cat); });
    }

    $("#busca").addEventListener("input", function (e) { estado.busca = e.target.value; aplicar(); });
    $("#ordem").addEventListener("change", function (e) { estado.ordem = e.target.value; aplicar(); });
    $("#chips").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      estado.cat = b.dataset.cat; aplicar();
      history.replaceState(null, "", b.dataset.cat === "todos" ? "loja.html" : "loja.html?cat=" + b.dataset.cat);
    });
    if (location.hash) {
      var h = location.hash.slice(1);
      if (CATS.some(function (c) { return c.id === h; })) estado.cat = h;
    }
    aplicar();
  }

  /* ---------- página: produto ---------- */
  function iniciarProduto() {
    var p = prod(param("id")) || PRODS.filter(function (x) { return x.destaque; })[0];
    if (!p) { $("#palco").innerHTML = "<p class=\"vazio\">Produto não encontrado.</p>"; return; }
    document.title = p.nome + " — " + L.nome;
    var precoHtml = p.preco
      ? "<div class=\"preco\">" + brl(p.preco) +
        (p.parcelas ? "<small>ou " + p.parcelas + "x de " + brl(p.preco / p.parcelas) + " sem juros no cartão</small>" : "") + "</div>"
      : "<div class=\"consultar\" style=\"font-size:1.5rem;margin:14px 0\">Sob consulta</div>";
    var linkProduto = location.href;
    $("#palco").innerHTML =
      "<a class=\"voltar\" href=\"loja.html\">← Voltar para a loja</a>" +
      "<div class=\"detalhe\">" +
        "<div class=\"foto\">" + foto(p.img, p.nome, "sem-fundo") + "</div>" +
        "<div>" +
          "<span class=\"cat\">" + esc(catNome(p.cat)) + "</span>" +
          (p.tag ? " <span class=\"tag\" style=\"position:static\">" + esc(p.tag) + "</span>" : "") +
          "<h1>" + esc(p.nome) + "</h1>" +
          precoHtml +
          "<p style=\"color:#5b6472\">" + esc(p.desc) + "</p>" +
          "<ul>" +
            "<li>Retirada na loja em " + esc(L.endereco.bairro) + ", " + esc(L.endereco.cidade) + "/" + esc(L.endereco.uf) + "</li>" +
            "<li>Pagamento: " + esc(L.pagamentos.join(", ")) + "</li>" +
            "<li>Garantia de funcionamento nos aparelhos revisados</li>" +
          "</ul>" +
          "<div class=\"comprar\">" +
            (p.preco ? "<button class=\"btn btn-amarelo\" onclick=\"window.ADD('" + p.id + "')\">🛒 Adicionar ao carrinho</button>" : "") +
            "<a class=\"btn btn-zap\" target=\"_blank\" rel=\"noopener\" href=\"" +
              zap("Olá! Vi no site e tenho interesse em: " + p.nome + ". " + linkProduto) + "\">Tirar dúvida no WhatsApp</a>" +
          "</div>" +
          "<div class=\"aviso\" style=\"margin-top:20px\">Estoque muda todo dia — confirme a disponibilidade pelo WhatsApp antes de sair de casa.</div>" +
        "</div>" +
      "</div>";
  }

  /* ---------- página: carrinho/checkout ---------- */
  function iniciarCarrinho() {
    var palco = $("#carrinhoPalco");
    function render() {
      var c = lerCarrinho();
      var lado = $("#ladoCheckout");
      if (!c.length) {
        if (lado) lado.style.display = "none";
        palco.innerHTML = "<p class=\"vazio\">Seu carrinho está vazio.<br><br><a class=\"btn btn-azul\" href=\"loja.html\">Ver produtos</a></p>";
        return;
      }
      if (lado) lado.style.display = "";
      var itens = c.map(function (x) {
        var p = prod(x.id); if (!p) return "";
        return "<div class=\"item\">" + fotoMini(p.img, p.nome) +
          "<div><h4>" + esc(p.nome) + "</h4>" +
          "<div class=\"p\">" + (p.preco ? brl(p.preco) : "Sob consulta") + "</div>" +
          "<div class=\"qtd\"><button onclick=\"window.MUDAR('" + p.id + "'," + (x.qtd - 1) + ")\">−</button><span>" + x.qtd + "</span>" +
          "<button onclick=\"window.MUDAR('" + p.id + "'," + (x.qtd + 1) + ")\">+</button></div>" +
          "<button class=\"remover\" onclick=\"window.TIRAR('" + p.id + "')\">remover</button></div>" +
          "<div style=\"font-weight:900;color:#0d3b8f\">" + (p.preco ? brl(p.preco * x.qtd) : "—") + "</div></div>";
      }).join("");

      palco.innerHTML = "<div id=\"listaItens\">" + itens + "</div>";
      var sub = totalCarrinho();
      $("#subtotal").textContent = brl(sub);
      $("#total").textContent = brl(sub);
      var semPreco = c.filter(function (x) { var p = prod(x.id); return !p.preco; }).length;
      $("#obsSemPreco").style.display = semPreco ? "block" : "none";
    }
    render();
    window.RERENDER_CARRINHO = render;

    var btn = $("#enviar");
    btn.addEventListener("click", function () {
      var nome = $("#nome").value.trim(), fone = $("#fone").value.trim();
      var entrega = $("#entrega").value, pag = $("#pagamento").value, obs = $("#obs").value.trim();
      if (!nome || nome.length < 2) { toast("Informe seu nome 🙂"); $("#nome").focus(); return; }
      if (!fone || fone.replace(/\D/g, "").length < 10) { toast("Informe um telefone com DDD"); $("#fone").focus(); return; }

      var c = lerCarrinho();
      var linhas = c.map(function (x, i) {
        var p = prod(x.id);
        return (i + 1) + ") " + x.qtd + "x " + p.nome + " — " + (p.preco ? brlZap(p.preco * x.qtd) : "sob consulta");
      });
      var msg = "🛒 *NOVO PEDIDO — site Carioca InfoCell*\n\n" +
        "*Cliente:* " + nome + "\n" +
        "*Telefone:* " + fone + "\n" +
        "*Entrega:* " + entrega + "\n" +
        "*Pagamento:* " + pag + "\n";
      if (obs) msg += "*Observação:* " + obs + "\n";
      msg += "\n*Itens:*\n" + linhas.join("\n") +
        "\n\n*Subtotal (itens com preço):* " + brlZap(totalCarrinho()) + "\n" +
        (semPrecoItens(c) ? "*Itens sob consulta:* " + semPrecoItens(c) + "\n" : "") +
        "\nAguardo a confirmação. Obrigado!";
      window.open(zap(msg), "_blank");
      toast("Pedido aberto no WhatsApp ✅");
    });
  }
  function semPrecoItens(c) {
    return c.filter(function (x) { var p = prod(x.id); return !p.preco; })
      .map(function (x) { return x.qtd + "x " + prod(x.id).nome; }).join("; ");
  }

  /* ---------- página: index ---------- */
  function iniciarInicio() {
    var d = PRODS.filter(function (p) { return p.destaque; }).slice(0, 8);
    if ($("#destaques")) {
      $("#destaques").innerHTML = d.map(function (p, i) {
        return card(p).replace('class="card"', 'class="card reveal" style="--d:' + (i * 70) + 'ms"');
      }).join("");
    }
    if ($("#categorias")) {
      $("#categorias").innerHTML = CATS.map(function (c, i) {
        var q = PRODS.filter(function (p) { return p.cat === c.id; }).length;
        return "<a class=\"cat-card reveal" + (c.ajuste === "cover" ? " cobrir" : "") + "\" style=\"--d:" + (i * 60) + "ms\" href=\"loja.html?cat=" + c.id + "\">" +
          (c.img ? foto(c.img, c.nome) : "") +
          "<span class=\"ico\">" + c.ico + "</span>" +
          "<span class=\"cat-txt\"><h3>" + esc(c.nome) + "</h3><p>" + q + (q === 1 ? " item" : " itens") + "</p></span></a>";
      }).join("");
    }
    observar();
  }

  /* ---------- animação de entrada ---------- */
  function observar() {
    var semAnim = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var alvos = $$(".card, .cat-card, .servico, .titulo, .hero-txt, .hero-card, .faixa-item, .two > div, .resumo, .item, .comprarBox, .moldura, .detalhe > div");
    if (semAnim || !("IntersectionObserver" in window)) {
      alvos.forEach(function (el) { el.classList.add("reveal", "vis"); });
      return;
    }
    var io = new IntersectionObserver(function (lista) {
      lista.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: .06 });
    alvos.forEach(function (el) {
      if (!el.classList.contains("reveal")) el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* ---------- start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    iniciarLayout();
    var pg = document.body.dataset.page;
    if (pg === "inicio") iniciarInicio();
    if (pg === "loja") iniciarLoja();
    if (pg === "produto") iniciarProduto();
    if (pg === "carrinho") iniciarCarrinho();
    observar();
    var _mudar = window.MUDAR, _tirar = window.TIRAR;
    window.MUDAR = function (id, q) { _mudar(id, q); if (window.RERENDER_CARRINHO) window.RERENDER_CARRINHO(); };
    window.TIRAR = function (id) { _tirar(id); if (window.RERENDER_CARRINHO) window.RERENDER_CARRINHO(); };
  });
})();