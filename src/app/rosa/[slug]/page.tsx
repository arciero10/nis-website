import Link from "next/link";
import { notFound } from "next/navigation";
import giocatoriData from "../../../data/giocatori.json";

type Player = {
  nome: string;
  cognome?: string;
  foto?: string | null;
  ruolo: string;
  professione?: string;
  numero?: number | null;
  note?: string | null;
  bio?: string;
  citta?: string;
  struttura?: string;
  categoria?: string;
};

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

function getInstitutionalSummary(player: Player) {
  return `${player.ruolo} della Nazionale Italiana Sanitari, parte della rosa ufficiale impegnata nei progetti sportivi e solidali del team.`;
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
    ...player,
    foto: player.foto ?? undefined,
    categoria: category,
    bio: player.bio ?? undefined,
    citta: player.citta ?? undefined,
    struttura: player.struttura ?? undefined,
    professione: player.professione ?? undefined,
    numero: player.numero ?? null,
    note: player.note ?? null,
  };
}

const normalizedDataset = giocatoriData.map((player, index) => normalizePlayer(player as Player, index));

const roster = normalizedDataset.filter((player) =>
  ["portieri", "difensori", "centrocampisti", "attaccanti"].includes(player.categoria ?? ""),
);

export function generateStaticParams() {
  return roster.map((player) => ({
    slug: slugifyPlayer(player),
  }));
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = roster.find((entry) => slugifyPlayer(entry) === slug);

  if (!player) {
    notFound();
  }

  const fullName = getFullName(player);
  const hasPhoto = !!player.foto && player.foto.trim() !== "";
  const summary = player.bio ?? getInstitutionalSummary(player);
  const infoItems = [
    player.numero !== null && player.numero !== undefined
      ? { label: "Numero maglia", value: String(player.numero) }
      : null,
    player.ruolo ? { label: "Ruolo", value: player.ruolo } : null,
    player.note ? { label: "Note", value: player.note } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-sky-950 to-slate-900 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.92)_20%,rgba(8,47,73,0.74)_58%,rgba(15,23,42,0.95)_100%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Link
            href="/rosa"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-sky-300/30 hover:text-white"
          >
            Torna alla Rosa
          </Link>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(15,23,42,0.82)_100%)] p-6 shadow-2xl backdrop-blur-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[280px,1fr] lg:items-center">
              <div className="mx-auto">
                <div className="relative h-[420px] w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-300/25 via-sky-400/10 to-slate-950 shadow-2xl">
                  {hasPhoto ? (
                    <img
                      src={player.foto ?? ""}
                      alt={fullName}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-white">
                      {getInitials(fullName)}
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                      {categoryLabels[player.categoria ?? ""] ?? "Profilo giocatore"}
                    </p>
                    <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                      {fullName}
                    </h1>
                    <p className="mt-3 text-lg font-medium text-slate-300">{player.ruolo}</p>
                  </div>

                  {player.numero !== null && player.numero !== undefined ? (
                    <div className="inline-flex w-fit shrink-0 flex-col rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-left shadow-lg md:text-right">
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Maglia
                      </span>
                      <span className="mt-2 text-5xl font-bold leading-none text-sky-300">
                        {player.numero}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 max-w-2xl rounded-[1.5rem] border border-white/10 bg-black/15 p-5">
                  <p className="text-base leading-7 text-slate-300">{summary}</p>
                </div>
              </div>
            </div>
          </div>

          {infoItems.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9)_0%,rgba(15,23,42,0.76)_100%)] p-5 shadow-xl backdrop-blur-sm"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
