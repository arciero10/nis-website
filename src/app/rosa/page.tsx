import giocatoriData from "../../data/giocatori.json";
import Link from "next/link";

type Player = {
  nome: string;
  cognome?: string;
  foto?: string;
  ruolo: string;
  professione?: string;
  numero?: number | null;
  note?: string | null;
  bio?: string;
  citta?: string;
  struttura?: string;
  categoria?: string;
};

const filters = [
  "Portieri",
  "Difensori",
  "Centrocampisti",
  "Attaccanti",
];

const fallbackPlayers: Player[] = [
  {
    nome: "Alessandro De Santis",
    ruolo: "Portiere",
    professione: "Fisioterapista",
    numero: 1,
    bio: "Leader silenzioso, guida il reparto con presenza e pulizia tecnica nelle uscite.",
    citta: "Roma",
    struttura: "Policlinico Gemelli",
    categoria: "portieri",
  },
  {
    nome: "Gabriele Conti",
    ruolo: "Difensore",
    professione: "Chirurgo ortopedico",
    numero: 4,
    bio: "Difensore di lettura e personalita, forte nell'anticipo e nella gestione dei tempi.",
    citta: "Milano",
    struttura: "IRCCS San Raffaele",
    categoria: "difensori",
  },
  {
    nome: "Luca Bianchi",
    ruolo: "Difensore",
    professione: "Medico",
    numero: 5,
    bio: "Profilo affidabile, interpreta il ruolo con attenzione tattica e grande disciplina.",
    citta: "Bologna",
    struttura: "Ospedale Maggiore",
    categoria: "difensori",
  },
  {
    nome: "Mario Rossi",
    ruolo: "Centrocampista",
    professione: "Infermiere",
    numero: 8,
    bio: "Motore del centrocampo, unisce intensita, visione e sensibilita nella gestione del gioco.",
    citta: "Firenze",
    struttura: "Careggi",
    categoria: "centrocampisti",
  },
  {
    nome: "Federico Marini",
    ruolo: "Centrocampista",
    professione: "Tecnico di radiologia",
    numero: 14,
    bio: "Interno moderno, accompagna l'azione e garantisce equilibrio nelle due fasi.",
    citta: "Torino",
    struttura: "Citta della Salute",
    categoria: "centrocampisti",
  },
  {
    nome: "Davide Serra",
    ruolo: "Attaccante",
    professione: "Medico dello sport",
    numero: 9,
    bio: "Terminale offensivo di riferimento, attacca la profondita con continuita e carattere.",
    citta: "Napoli",
    struttura: "AORN Cardarelli",
    categoria: "attaccanti",
  },
];

const roleCategoryMap: Record<string, string> = {
  Portiere: "portieri",
  Difensore: "difensori",
  Centrocampista: "centrocampisti",
  Attaccante: "attaccanti",
};

const categoryLabels: Record<string, string> = {
  portieri: "Portieri",
  difensori: "Difensori",
  centrocampisti: "Centrocampisti",
  attaccanti: "Attaccanti",
};

const defaultBios: Record<string, string> = {
  Portiere:
    "Interpreta il ruolo con personalita, sicurezza nelle uscite e grande attenzione ai dettagli.",
  Difensore:
    "Garantisce compattezza, letture puntuali e solidita in una struttura di gioco ambiziosa.",
  Centrocampista:
    "Dona ritmo, equilibrio e qualita tecnica a una squadra costruita sull'intelligenza collettiva.",
  Attaccante:
    "Attaccante mobile e generoso, porta profondita e presenza offensiva nei momenti chiave.",
  Mister:
    "Guida il gruppo con esperienza, cultura sportiva e attenzione costante alla crescita collettiva.",
};

const defaultProfessions: Record<string, string> = {
  portieri: "Professionista sanitario",
  difensori: "Professionista sanitario",
  centrocampisti: "Professionista sanitario",
  attaccanti: "Professionista sanitario",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getFullName(player: Player) {
  return [player.nome, player.cognome].filter(Boolean).join(" ");
}

function getCardSummary(player: Player) {
  return (
    player.bio ??
    `${player.ruolo} della Nazionale Italiana Sanitari, parte della rosa ufficiale del team.`
  );
}

function slugifyPlayer(player: Player) {
  return getFullName(player)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePlayer(player: Player, index: number): Player {
  const fallback = fallbackPlayers[index % fallbackPlayers.length];
  const rawCategory = player.categoria?.toLowerCase().trim();
  const category = rawCategory ?? roleCategoryMap[player.ruolo] ?? fallback.categoria ?? "staff";

  return {
    ...fallback,
    ...player,
    foto: player.foto ?? undefined,
    categoria: category,
    bio: player.bio ?? defaultBios[player.ruolo] ?? fallback.bio,
    citta: player.citta ?? fallback.citta,
    struttura: player.struttura ?? fallback.struttura,
    professione: player.professione ?? fallback.professione ?? defaultProfessions[category],
    numero: player.numero ?? fallback.numero,
  };
}

const normalizedDataset = giocatoriData.map((player, index) => normalizePlayer(player as Player, index));

const rosterFromDataset = normalizedDataset.filter((player) =>
  ["portieri", "difensori", "centrocampisti", "attaccanti"].includes(player.categoria ?? ""),
);

const roster =
  rosterFromDataset.length > 0
    ? rosterFromDataset
    : fallbackPlayers.filter((player) =>
        ["portieri", "difensori", "centrocampisti", "attaccanti"].includes(player.categoria ?? ""),
      );

const sections = [
  { title: "Portieri", id: "portieri", category: "portieri" },
  { title: "Difensori", id: "difensori", category: "difensori" },
  { title: "Centrocampisti", id: "centrocampisti", category: "centrocampisti" },
  { title: "Attaccanti", id: "attaccanti", category: "attaccanti" },
];

const playersBySection = sections.map((section) => ({
  ...section,
  players: roster.filter((player) => player.categoria === section.category),
}));

export default function RosaPage() {
  return (
    <main
      className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f5f7fb_42%,#eef2f7_100%)] text-slate-900"
      style={{ scrollBehavior: "smooth" }}
    >
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.92)_16%,rgba(240,249,255,0.84)_56%,rgba(248,250,252,0.94)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="mb-4 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">Rosa</span>
          </div>
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-100/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Nazionale Italiana Sanitari
          </p>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">Rosa</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Un gruppo costruito su competenza, identita e senso di responsabilita: professionisti
            della salute che portano in campo valori, esperienza e visione condivisa.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="flex flex-wrap gap-3 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
          {filters.map((filter) => (
            <a
              key={filter}
              href={`#${filter.toLowerCase()}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-sky-300/40 hover:bg-white hover:text-slate-950"
            >
              {filter}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="space-y-14">
          {playersBySection.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Reparto
                  </p>
                  <h2 className="mt-3 text-3xl font-bold md:text-4xl">{section.title}</h2>
                </div>
                <p className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600">
                  {section.players.length} profili
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {section.players.map((player) => {
                  const fullName = getFullName(player);
                  const hasPhoto = !!player.foto && player.foto.trim() !== "";
                  const slug = slugifyPlayer(player);
                  const summary = getCardSummary(player);

                  return (
                    <Link
                      key={`${fullName}-${player.numero}`}
                      href={`/rosa/${slug}`}
                      className="group relative overflow-hidden rounded-[2rem] border border-sky-950/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(12,30,54,0.98)_54%,rgba(10,37,64,0.96)_100%)] text-white shadow-[0_22px_56px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-[0_26px_68px_rgba(15,23,42,0.22)]"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_36%)] opacity-90" />

                      <div className="relative flex h-full items-start gap-5 p-6">
                        <div className="relative h-[188px] w-[132px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-sky-200/20 via-white/10 to-slate-950 shadow-lg">
                          {hasPhoto ? (
                            <img
                              src={player.foto ?? ""}
                              alt={`${player.nome} ${player.cognome}`}
                              className="h-full w-full object-cover object-top"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,rgba(186,230,253,0.18)_0%,rgba(15,23,42,0.22)_100%)] text-4xl font-bold text-white">
                              <span>{getInitials(fullName)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                            {categoryLabels[player.categoria ?? ""] ?? section.title}
                          </p>
                          <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white">
                            {fullName}
                          </h3>
                          <p className="mt-3 text-lg font-semibold leading-none text-sky-300">
                            #{player.numero ?? "—"}
                          </p>
                          <p className="mt-3 text-sm font-medium text-slate-300">
                            {player.ruolo}
                          </p>
                          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-300">
                            {summary}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {section.players.length === 0 ? (
                  <article className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 text-slate-600 shadow-xl backdrop-blur-sm sm:col-span-2 xl:col-span-3">
                    Nessun profilo disponibile per questo reparto al momento.
                  </article>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
