/* =====================================================================
   CATÁLOGO — produtos da Carioca InfoCell
   Baseado nas publicações reais da loja (@cariocainfocellce) e no
   cadastro público (CNPJ 41.119.997/0001-80).

   preco: número em reais  |  null = "Sob consulta" (preço pelo WhatsApp)
   precoDe: valor "de" para promoções (opcional)
   tag: "Usado" | "Promoção" | "Novo" | null
   ===================================================================== */
window.CATEGORIAS = [
  { id:"celulares",   nome:"Celulares",              ico:"📱", img:"assets/img/smartphone-a03s.jpg" },
  { id:"capinhas",    nome:"Capinhas e Películas",   ico:"🛡️", img:"assets/img/capinha-a32.jpg" },
  { id:"carregadores",nome:"Carregadores e Cabos",   ico:"🔌", img:"assets/img/cabo-usb.jpg", ajuste:"cover" },
  { id:"audio",       nome:"Fones e Áudio",          ico:"🎧", img:"assets/img/fone-hmaston.jpg" },
  { id:"informatica", nome:"Informática",            ico:"💻", img:"assets/img/pc-c3plus.jpg" },
  { id:"acessorios",  nome:"Acessórios",             ico:"🧰", img:"assets/img/tripe-flexivel.jpg" },
  { id:"papelaria",   nome:"Papelaria e Escritório", ico:"✏️", img:"assets/img/lapis-decorados.jpg", ajuste:"cover" }
];

window.PRODUTOS = [
  /* ---------- CELULARES ---------- */
  {
    id:"samsung-a01-32",
    nome:"Samsung Galaxy A01 32GB",
    cat:"celulares", tag:"Usado",
    preco:399.00, parcelas:6,
    img:"assets/img/smartphone-a03s.jpg",
    desc:"Aparelho revisado na nossa bancada, bateria testada e funcionando 100%. Acompanha carregador.",
    destaque:true
  },
  {
    id:"samsung-j5-16",
    nome:"Samsung Galaxy J5 16GB",
    cat:"celulares", tag:"Usado",
    preco:459.00, parcelas:5,
    img:"assets/img/samsung-j5-usado.jpg", ajuste:"cover",
    desc:"Tela original, bom estado de conservação. Revisado e com garantia de funcionamento.",
    destaque:true
  },
  {
    id:"moto-g5-32",
    nome:"Motorola Moto G5 Plus 32GB",
    cat:"celulares", tag:"Usado",
    preco:349.00, parcelas:5,
    img:"assets/img/moto-g5-plus.jpg",
    desc:"Wi-Fi e 5G habilitados, 32GB de memória. Aparelho testado, pronto para uso.",
    destaque:true
  },
  {
    id:"celular-a-combinar",
    nome:"Celular novo — consulte modelos disponíveis",
    cat:"celulares", tag:"Novo",
    preco:null,
    img:"assets/img/loja-prateleiras.jpg", ajuste:"cover",
    desc:"Trabalhamos com as principais marcas (Samsung, Motorola, Xiaomi). Chame no WhatsApp e veja os modelos em estoque hoje."
  },

  /* ---------- CAPINHAS ---------- */
  {
    id:"capinha-simples",
    nome:"Capinha de silicone — a partir de R$ 10,00",
    cat:"capinhas", tag:"Promoção", destaque:true,
    preco:10.00,
    img:"assets/img/capinha-a32.jpg",
    desc:"Modelos para Samsung, Motorola e Xiaomi. Várias cores — livro de modelo na loja. Preço a partir de R$ 10,00 conforme o aparelho."
  },
  {
    id:"capinha-popsocket",
    nome:"Capinha com pop socket (tema animal)",
    cat:"capinhas",
    preco:null,
    img:"assets/img/capinhas-animais.jpg",
    desc:"Linha decorativa com glitter e pop socket combinando. Escolha o tema na loja."
  },
  {
    id:"pelicula-vidro",
    nome:"Película de vidro + aplicação",
    cat:"capinhas",
    preco:null,
    img:"assets/img/loja-interior.jpg",
    desc:"Aplicação na hora, sem bolhas. Consulte o valor do seu modelo."
  },

  /* ---------- CARREGADORES E CABOS ---------- */
  {
    id:"cabo-usb-rapido",
    nome:"Cabo USB rápido 1m 4.8A (H'Maston SJX09-2)",
    cat:"carregadores",
    preco:null,
    img:"assets/img/cabo-usb.jpg",
    desc:"Cabo reforçado para carga rápida. Também temos cabos tipo C e Lightning."
  },
  {
    id:"carregador-fonte",
    nome:"Carregador / fonte turbo",
    cat:"carregadores",
    preco:null,
    img:"assets/img/loja-interior.jpg",
    desc:"Fontes turbo com entrada USB para todas as marcas. Consulte a amperagem."
  },
  {
    id:"bateria-reposicao",
    nome:"Bateria de reposição",
    cat:"carregadores",
    preco:null,
    img:"assets/img/assistencia-tela.jpg",
    desc:"Baterias para os modelos mais comuns, com troca feita na hora."
  },

  /* ---------- ÁUDIO ---------- */
  {
    id:"fone-bluetooth",
    nome:"Fone de ouvido sem fio (Bluetooth)",
    cat:"audio", tag:"Promoção", precoDe:29.00,
    preco:29.00, parcelas:3,
    img:"assets/img/fone-hmaston.jpg",
    desc:"Fones a partir de R$ 29,00 com estojo de carregamento. Modelos originais e paralelos.",
    destaque:true
  },

  /* ---------- INFORMÁTICA ---------- */
  {
    id:"notebook-dell-5490",
    nome:"Notebook Dell Latitude 5490 — i5 8ª, 8GB, HD 1TB",
    cat:"informatica", tag:"Usado", destaque:true,
    preco:3899.00, parcelas:10,
    img:"assets/img/notebook-dell-5490.jpg", ajuste:"cover",
    desc:"Intel Core i5 8ª geração, 8GB de RAM e 1TB de HD. Notebook revisado, 10x sem juros."
  },
  {
    id:"notebook-seminovo",
    nome:"Notebook seminovo — quase novo",
    cat:"informatica", tag:"Usado",
    preco:null,
    img:"assets/img/notebook-seminovo.jpg",
    desc:"Aparelhos com pouco tempo de uso (aceitamos o seu na troca). Consulte os modelos disponíveis."
  },
  {
    id:"pc-c3plus",
    nome:"Computador completo — gabinete C3PLUS",
    cat:"informatica", destaque:true,
    preco:null,
    img:"assets/img/pc-c3plus.jpg",
    desc:"Desktops montados sob medida para estudo, trabalho e loja. Fale com a gente e montamos a configuração."
  },
  {
    id:"manutencao-pc",
    nome:"Limpeza e manutenção de notebook/PC",
    cat:"informatica",
    preco:null,
    img:"assets/img/loja-interior.jpg",
    desc:"Limpeza interna, troca de pasta térmica, formatação e backup. Orçamento na hora."
  },

  /* ---------- ACESSÓRIOS ---------- */
  {
    id:"tripe-flexivel",
    nome:"Tripé flexível para celular",
    cat:"acessorios", tag:"Promoção", precoDe:19.00,
    preco:10.00,
    img:"assets/img/tripe-flexivel.jpg",
    desc:"Pernas flexíveis que seguram em qualquer superfície. De R$ 19,00 por R$ 10,00.",
    destaque:true
  },
  {
    id:"suporte-celular",
    nome:"Suportes, cabos e utilidades para o dia a dia",
    cat:"acessorios",
    preco:null,
    img:"assets/img/loja-interior.jpg",
    desc:"Suportes de mesa, anéis, adaptadores, cartões de memória e mais. Passe na loja ou chame no WhatsApp."
  },

  /* ---------- PAPELARIA ---------- */
  {
    id:"material-escolar",
    nome:"Material escolar e de escritório",
    cat:"papelaria",
    preco:null,
    img:"assets/img/lapis-decorados.jpg", ajuste:"cover",
    desc:"Cadernos, canetas, lápis decorados, calculadoras, pastas e impressão de documentos."
  },
  {
    id:"lapis-decorados",
    nome:"Lápis decorados e material de festa",
    cat:"papelaria",
    preco:null,
    img:"assets/img/lapis-decorados.jpg", ajuste:"cover",
    desc:"Linha fofa de lápis e canetas para lembrancinhas e presentes."
  }
];
