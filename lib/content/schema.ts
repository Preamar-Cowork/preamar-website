/*
 * Editable content for every section of the landing page.
 *
 * DEFAULT_SECTIONS holds the current copy (what the site shows until you
 * save something in /admin). SECTION_DEFS describes, per section, which
 * fields the admin shows and how. Stored values live in
 * site_content.sections (jsonb) and are merged over these defaults, so a
 * missing or broken value can never blank a section.
 */

export const DEFAULT_SECTIONS = {
  problem: {
    label: "O problema",
    blocks: [
      {
        title: "A casa não é\num escritório.",
        text: "Trabalhas ao lado do berço, com a máquina de lavar a três metros.",
        image: "",
        caption: "escritório improvisado em casa",
        alt: "",
      },
      {
        title: "A ponte come-te\nduas horas por dia.",
        text: "E o teu trabalho podia ser feito a dez minutos de casa.",
        image: "",
        caption: "trânsito na ponte, hora de ponta",
        alt: "",
      },
      {
        title: "Receber um cliente\nna cozinha não é\nreceber um cliente.",
        text: "",
        image: "",
        caption: "reunião improvisada",
        alt: "",
      },
    ],
  },
  space: {
    label: "O espaço",
    text: "Um espaço no Montijo pensado para trabalhar bem: luz natural em todas as salas, e a maré do estuário a dois passos da porta.",
    image: "",
    imageAlt: "",
    amenities: [
      "Secretárias fixas e flexíveis",
      "Gabinetes privados",
      "Sala de reuniões",
      "Cabine insonorizada para chamadas",
      "Copa",
      "Cacifos",
      "Morada fiscal",
      "Internet dedicada",
      "Muita luz natural",
      "Estacionamento fácil",
    ],
  },
  plans: {
    label: "Planos e preços",
    unit: "por mês, IVA incluído",
    plans: [
      {
        name: "Flexível",
        desc: "Secretária livre, horário de escritório.",
        prefix: "",
        price: 90,
        highlight: false,
        optionsLabel: "Passe",
        defaultOption: 3,
        options: [
          { label: "Dia", price: 12, unit: "por dia, IVA incluído", detail: "Válido num dia útil, 9h–19h.", people: 0 },
          { label: "Semana", price: 45, unit: "por semana, IVA incluído", detail: "5 dias úteis seguidos.", people: 0 },
          { label: "Mês", price: 90, unit: "por mês, IVA incluído", detail: "Todos os dias úteis durante um mês.", people: 0 },
        ],
        note: "Cacifo disponível por +10 €/mês.",
      },
      {
        name: "Fixo",
        desc: "A tua secretária, sempre a mesma. Acesso alargado, cacifo incluído.",
        prefix: "",
        price: 150,
        highlight: true,
        optionsLabel: "",
        defaultOption: 1,
        options: [] as { label: string; price: number; unit: string; detail: string; people: number }[],
        note: "",
      },
      {
        name: "Gabinete",
        desc: "Sala privada, com porta, para a tua equipa. Morada fiscal incluída.",
        prefix: "",
        price: 400,
        highlight: false,
        optionsLabel: "Pessoas",
        defaultOption: 1,
        options: [
          { label: "2", price: 400, unit: "por mês, IVA incluído", detail: "", people: 2 },
          { label: "3", price: 540, unit: "por mês, IVA incluído", detail: "", people: 3 },
          { label: "4", price: 640, unit: "por mês, IVA incluído", detail: "", people: 4 },
          { label: "5", price: 775, unit: "por mês, IVA incluído", detail: "", people: 5 },
          { label: "6", price: 900, unit: "por mês, IVA incluído", detail: "", people: 6 },
        ],
        note: "Quanto maior a equipa, menor o preço por pessoa.",
      },
    ],
    features: [
      { label: "Internet dedicada, café e copa", p1: true, p2: true, p3: true },
      { label: "Acesso em horário de escritório", p1: true, p2: true, p3: true },
      { label: "Secretária sempre a mesma", p1: false, p2: true, p3: true },
      { label: "Cacifo individual", p1: false, p2: true, p3: true },
      { label: "Acesso alargado, com chave", p1: false, p2: true, p3: true },
      { label: "Receção de correio", p1: false, p2: true, p3: true },
      { label: "Sala de reuniões (2 h/mês)", p1: false, p2: true, p3: true },
      { label: "Sala privada com porta", p1: false, p2: false, p3: true },
      { label: "Morada fiscal", p1: false, p2: false, p3: true },
    ],
  },
  fiscal: {
    label: "Morada fiscal e domiciliação de empresas",
    price: 30,
    headline: "Sede da tua empresa\n{morada-fiscal} por mês, IVA incluído",
    text: "Receção de correio e encomendas, digitalização e aviso por email.",
  },
  about: {
    label: "O que é Preamar",
    text: "Preamar é a maré cheia — o ponto mais alto, quando a água chega ao máximo e fica parada uns minutos antes de virar. Acontece duas vezes por dia no estuário aqui ao lado. É a janela em que os barcos entram e saem. Pareceu-nos um bom nome para um sítio onde o trabalho tem finalmente condições.",
  },
  form: {
    heading: "Diz-nos o que precisas.",
    text: "Respondemos em menos de 24 horas úteis e combinamos uma visita ao espaço.",
    phNome: "Nome",
    phEmail: "Email",
    phTelefone: "Telemóvel",
    phProfissao: "Profissão ou empresa",
    ondeLabel: "Onde moras",
    onde: ["Montijo", "Alcochete", "Outro"],
    interesseLabel: "O que te interessa",
    interesse: [
      "Secretária flexível",
      "Secretária fixa",
      "Gabinete privado",
      "Só morada fiscal",
      "Sala de reuniões pontual",
      "Ainda não sei",
    ],
    gabineteLabel: "Para quantas pessoas",
    gabinete: ["1-2", "3-4", "5-6", "Mais"],
    diasLabel: "Quantos dias por semana",
    dias: ["1-2", "3-4", "5", "Ocasionalmente"],
    quandoLabel: "Quando precisarias",
    quando: ["Já", "1-3 meses", "3-6 meses", "Só a explorar"],
    cacifoLabel: "Precisas de cacifo?",
    cacifo: ["Sim", "Não", "Talvez"],
    sinalLabel: "Reserva com sinal",
    sinalAmount: 20,
    sinalAmountOffice: 100,
    sinalTitle: "Garante já o teu lugar com um sinal de {valor}.",
    sinalTitleOffice: "Garante já o teu gabinete com um sinal de {valor}.",
    sinalDesc:
      "Totalmente reembolsável se decidires não avançar. Não pagas nada agora — enviamos os dados de pagamento depois de falarmos contigo. Quem reserva com sinal tem prioridade na escolha do lugar.",
    privacyText: "Aceito a política de privacidade",
    submitText: "Reservar o meu lugar",
    successTitle: "Recebemos o teu pedido.",
    successText: "Entramos em contacto brevemente para tratar do resto. Até já.",
  },
  faq: {
    label: "Perguntas frequentes",
    items: [
      { q: "Onde fica exatamente?", a: "No centro do Montijo, junto ao estuário do Tejo." },
      {
        q: "Quanto tempo demoro de carro?",
        a: "Do centro de Lisboa, cerca de 20 minutos sem ponte — pela A12 ou de barco até ao Barreiro/Montijo. De Alcochete ou Moita, menos de 15.",
      },
      { q: "Tem estacionamento?", a: "Sim, estacionamento fácil junto ao edifício." },
      { q: "Quando abre?", a: "Estamos em fase de pré-abertura — as reservas agora garantem lugar desde o primeiro dia." },
      { q: "Posso visitar antes?", a: "Sim, marcamos uma visita ao espaço antes de decidires." },
      {
        q: "O sinal é mesmo reembolsável?",
        a: "Sim. O sinal — {sinal} para secretárias, {sinal-gabinete} para gabinetes — é totalmente reembolsável se decidires não avançar.",
      },
      { q: "Posso mudar de plano?", a: "Sim, os planos podem ser ajustados às tuas necessidades." },
      {
        q: "Posso usar a PREAMAR como sede da minha empresa?",
        a: "Sim. A morada fiscal custa {morada-fiscal} por mês, IVA incluído, e já vem incluída nos gabinetes. Inclui receção de correio e encomendas, digitalização e aviso por email.",
      },
      {
        q: "Quanto custa um cowork no Montijo?",
        a: "Na PREAMAR, uma secretária flexível custa {flexivel-dia} por dia, {flexivel-semana} por semana ou {flexivel-mes} por mês; uma secretária fixa {fixo} por mês; e um gabinete privado desde {gabinete-2} por mês para 2 pessoas. Todos os preços têm IVA incluído.",
      },
    ],
  },
  footer: {
    place: "Montijo",
    mapsUrl: "",
    email: "ola@preamar.pt",
    phone: "+351 210 000 000",
    instagram: "@preamar.montijo",
    note: "Espaço em fase de pré-abertura.",
  },
};

export type SiteSections = typeof DEFAULT_SECTIONS;
export type SectionKey = keyof SiteSections;

/* ---------- admin field descriptions ---------- */

export type Field =
  | { key: string; label: string; type: "text"; help?: string; max?: number }
  | { key: string; label: string; type: "textarea"; help?: string; rows?: number; max?: number }
  | { key: string; label: string; type: "lines"; help?: string } // \n = line break on the site
  | { key: string; label: string; type: "image"; help?: string }
  | { key: string; label: string; type: "number"; help?: string; min?: number; max?: number }
  | { key: string; label: string; type: "bool"; help?: string }
  | { key: string; label: string; type: "strings"; help?: string; itemLabel: string; max?: number }
  | {
      key: string;
      label: string;
      type: "items";
      help?: string;
      itemLabel: string;
      fields: Field[];
      fixed?: boolean; // number of items can't change (layout depends on it)
      max?: number;
    };

export type SectionDef = { key: SectionKey; title: string; fields: Field[] };

const LINES_HELP = "Cada linha aqui é uma linha no site.";
const IMG_HELP = "JPG ou PNG, idealmente 2000 px de largura e menos de 1 MB.";
const ALT_HELP = "Descreve o que se vê, com o sítio: ex. “secretárias com luz natural no cowork PREAMAR, Montijo”.";

/** In site order — also drives the admin menu. */
export const SECTION_DEFS: SectionDef[] = [
  {
    key: "problem",
    title: "O problema",
    fields: [
      { key: "label", label: "Título da secção", type: "text" },
      {
        key: "blocks",
        label: "Blocos",
        type: "items",
        itemLabel: "Bloco",
        fixed: true,
        fields: [
          { key: "title", label: "Título", type: "lines", help: LINES_HELP },
          { key: "text", label: "Texto", type: "textarea", rows: 3 },
          { key: "image", label: "Imagem", type: "image", help: IMG_HELP },
          { key: "caption", label: "Legenda (aparece por baixo da imagem)", type: "text" },
          { key: "alt", label: "Descrição da imagem (Google e leitores de ecrã)", type: "text", help: ALT_HELP },
        ],
      },
    ],
  },
  {
    key: "space",
    title: "O espaço",
    fields: [
      { key: "label", label: "Título da secção", type: "text" },
      { key: "text", label: "Texto", type: "textarea", rows: 4 },
      { key: "image", label: "Imagem grande (esquerda)", type: "image", help: IMG_HELP },
      { key: "imageAlt", label: "Descrição da imagem (Google e leitores de ecrã)", type: "text", help: ALT_HELP },
      { key: "amenities", label: "Lista de comodidades", type: "strings", itemLabel: "Comodidade", max: 20 },
    ],
  },
  {
    key: "plans",
    title: "Planos",
    fields: [
      { key: "label", label: "Título da secção", type: "text" },
      { key: "unit", label: "Texto por baixo do preço (planos sem opções)", type: "text" },
      {
        key: "plans",
        label: "Planos",
        type: "items",
        itemLabel: "Plano",
        fixed: true,
        fields: [
          { key: "name", label: "Nome", type: "text" },
          { key: "desc", label: "Descrição (aparece por cima do preço)", type: "textarea", rows: 2 },
          { key: "prefix", label: "Antes do preço (ex.: “desde ”)", type: "text" },
          { key: "price", label: "Preço (€) — usado quando não há opções", type: "number", min: 0, max: 100000 },
          { key: "highlight", label: "Destacar este plano", type: "bool" },
          {
            key: "optionsLabel",
            label: "Nome das opções (ex.: Passe, Pessoas)",
            type: "text",
            help: "Se o plano tiver opções, aparecem como botões e o preço muda conforme a escolha.",
          },
          {
            key: "options",
            label: "Opções de preço",
            type: "items",
            itemLabel: "Opção",
            max: 8,
            fields: [
              { key: "label", label: "Botão (ex.: Mês, 4)", type: "text", max: 20 },
              { key: "price", label: "Preço (€)", type: "number", min: 0, max: 100000 },
              { key: "unit", label: "Texto por baixo do preço", type: "text" },
              { key: "detail", label: "Detalhe (ex.: 5 dias úteis seguidos)", type: "text" },
              {
                key: "people",
                label: "Nº de pessoas (para mostrar o preço por pessoa; 0 = não mostrar)",
                type: "number",
                min: 0,
                max: 50,
              },
            ],
          },
          {
            key: "defaultOption",
            label: "Opção selecionada ao abrir a página (1 = primeira)",
            type: "number",
            min: 1,
            max: 8,
          },
          { key: "note", label: "Nota final (pequena)", type: "text" },
        ],
      },
      {
        key: "features",
        label: "O que cada plano inclui",
        type: "items",
        itemLabel: "Linha",
        max: 20,
        help: "Cada linha aparece nos três planos, com ✓ ou —.",
        fields: [
          { key: "label", label: "Texto", type: "text" },
          { key: "p1", label: "Incluído no plano 1 (Flexível)", type: "bool" },
          { key: "p2", label: "Incluído no plano 2 (Fixo)", type: "bool" },
          { key: "p3", label: "Incluído no plano 3 (Gabinete)", type: "bool" },
        ],
      },
    ],
  },
  {
    key: "fiscal",
    title: "Morada fiscal",
    fields: [
      { key: "label", label: "Título da secção", type: "text" },
      { key: "price", label: "Preço da morada fiscal (€)", type: "number", min: 0, max: 10000, help: "Usado em todo o site como {morada-fiscal}." },
      { key: "headline", label: "Frase grande", type: "lines", help: LINES_HELP },
      { key: "text", label: "Texto", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "about",
    title: "O que é Preamar",
    fields: [
      { key: "label", label: "Título da secção", type: "text" },
      { key: "text", label: "Texto", type: "textarea", rows: 7 },
    ],
  },
  {
    key: "form",
    title: "Reserva",
    fields: [
      { key: "heading", label: "Título", type: "text" },
      { key: "text", label: "Texto", type: "textarea", rows: 2 },
      { key: "phNome", label: "Campo: nome", type: "text" },
      { key: "phEmail", label: "Campo: email", type: "text" },
      { key: "phTelefone", label: "Campo: telemóvel", type: "text" },
      { key: "phProfissao", label: "Campo: profissão", type: "text" },
      { key: "ondeLabel", label: "Pergunta: onde moras", type: "text" },
      { key: "onde", label: "Opções: onde moras", type: "strings", itemLabel: "Opção", max: 12 },
      { key: "interesseLabel", label: "Pergunta: interesse", type: "text" },
      {
        key: "interesse",
        label: "Opções: interesse",
        type: "strings",
        itemLabel: "Opção",
        max: 12,
        help: "A pergunta do gabinete aparece quando a opção escolhida contém a palavra “gabinete”.",
      },
      { key: "gabineteLabel", label: "Pergunta: pessoas no gabinete", type: "text" },
      { key: "gabinete", label: "Opções: pessoas no gabinete", type: "strings", itemLabel: "Opção", max: 8 },
      { key: "diasLabel", label: "Pergunta: dias por semana", type: "text" },
      { key: "dias", label: "Opções: dias por semana", type: "strings", itemLabel: "Opção", max: 8 },
      { key: "quandoLabel", label: "Pergunta: quando", type: "text" },
      { key: "quando", label: "Opções: quando", type: "strings", itemLabel: "Opção", max: 5 },
      { key: "cacifoLabel", label: "Pergunta: cacifo", type: "text" },
      { key: "cacifo", label: "Opções: cacifo", type: "strings", itemLabel: "Opção", max: 4 },
      { key: "sinalLabel", label: "Sinal: etiqueta pequena", type: "text" },
      { key: "sinalAmount", label: "Sinal: valor para secretárias (€)", type: "number", min: 0, max: 10000 },
      {
        key: "sinalAmountOffice",
        label: "Sinal: valor para gabinetes (€)",
        type: "number",
        min: 0,
        max: 10000,
        help: "Usado quando a opção escolhida em “interesse” contém a palavra “gabinete”.",
      },
      { key: "sinalTitle", label: "Sinal: frase (secretárias)", type: "text", help: "{valor} é substituído pelo valor do sinal." },
      { key: "sinalTitleOffice", label: "Sinal: frase (gabinetes)", type: "text", help: "{valor} é substituído pelo valor do sinal." },
      { key: "sinalDesc", label: "Sinal: explicação", type: "textarea", rows: 3 },
      { key: "privacyText", label: "Caixa da privacidade", type: "text" },
      { key: "submitText", label: "Botão", type: "text" },
      { key: "successTitle", label: "Depois de enviar: título", type: "text" },
      { key: "successText", label: "Depois de enviar: texto", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "faq",
    title: "Perguntas frequentes",
    fields: [
      { key: "label", label: "Título da secção", type: "text" },
      {
        key: "items",
        label: "Perguntas",
        type: "items",
        itemLabel: "Pergunta",
        max: 20,
        fields: [
          { key: "q", label: "Pergunta", type: "text" },
          { key: "a", label: "Resposta", type: "textarea", rows: 3 },
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "Rodapé",
    fields: [
      { key: "place", label: "Local / morada", type: "text", help: "Ao clicar, abre no mapa (Apple Maps no iPhone/Mac, a app de mapas no Android, Google Maps no resto)." },
      { key: "mapsUrl", label: "Link do mapa (opcional)", type: "text", help: "Se preencheres (ex.: o link do Perfil de Empresa no Google Maps), o local abre sempre este link." },
      { key: "email", label: "Email", type: "text", help: "Ao clicar, abre o email." },
      { key: "phone", label: "Telefone", type: "text", help: "Ao clicar, liga (no telemóvel)." },
      { key: "instagram", label: "Instagram", type: "text", help: "@utilizador ou link — ao clicar, abre o Instagram." },
      { key: "note", label: "Nota final", type: "text" },
    ],
  },
];

export const SECTION_KEYS = SECTION_DEFS.map((d) => d.key);
export const getSectionDef = (key: string) => SECTION_DEFS.find((d) => d.key === key);

/* ---------- sanitizing: stored JSON → complete, safe content ---------- */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);

function sanitizeField(f: Field, raw: unknown, fallback: unknown): unknown {
  switch (f.type) {
    case "text":
      return typeof raw === "string" ? raw.slice(0, f.max ?? 300) : fallback;
    case "textarea":
      return typeof raw === "string" ? raw.slice(0, f.max ?? 3000) : fallback;
    case "lines":
      return typeof raw === "string" ? raw.slice(0, 400) : fallback;
    case "image":
      // only our own storage URLs (or empty = placeholder)
      return typeof raw === "string" && (raw === "" || /^https:\/\/[^\s"']+$/.test(raw)) ? raw : fallback;
    case "number": {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(n)) return fallback;
      return Math.min(f.max ?? 1e9, Math.max(f.min ?? -1e9, n));
    }
    case "bool":
      return typeof raw === "boolean" ? raw : fallback;
    case "strings": {
      if (!Array.isArray(raw)) return fallback;
      const list = raw.filter((s): s is string => typeof s === "string").map((s) => s.slice(0, 200));
      return list.slice(0, f.max ?? 50);
    }
    case "items": {
      const defaults = Array.isArray(fallback) ? (fallback as Obj[]) : [];
      if (!Array.isArray(raw)) return defaults;
      const count = f.fixed ? defaults.length : Math.min(raw.length, f.max ?? 50);
      return Array.from({ length: count }, (_, i) => {
        const item = isObj(raw[i]) ? raw[i] : {};
        const base: Obj = defaults[i] ?? {};
        const out: Obj = {};
        for (const sub of f.fields) out[sub.key] = sanitizeField(sub, item[sub.key], base[sub.key] ?? emptyOf(sub));
        return out;
      });
    }
  }
}

function emptyOf(f: Field): unknown {
  switch (f.type) {
    case "number":
      return 0;
    case "bool":
      return false;
    case "strings":
    case "items":
      return [];
    default:
      return "";
  }
}

export function sanitizeSection<K extends SectionKey>(key: K, raw: unknown): SiteSections[K] {
  const def = getSectionDef(key)!;
  const defaults = DEFAULT_SECTIONS[key] as Obj;
  const src = isObj(raw) ? raw : {};
  const out: Obj = {};
  for (const f of def.fields) out[f.key] = sanitizeField(f, src[f.key], defaults[f.key]);
  return out as SiteSections[K];
}

export function sanitizeSections(raw: unknown): SiteSections {
  const src = isObj(raw) ? raw : {};
  const out = {} as Record<SectionKey, unknown>;
  for (const key of SECTION_KEYS) out[key] = sanitizeSection(key, src[key]);
  return out as SiteSections;
}
