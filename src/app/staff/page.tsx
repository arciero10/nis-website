import Link from "next/link";
import staff from "@/data/staff.json";

type StaffMember = {
  nome: string;
  cognome: string;
  ruolo: string;
  area: "calcistico" | "istituzionale";
  descrizione: string;
  foto?: string;
};

const sectionContent = {
  calcistico: {
    label: "Area tecnica",
    title: "Staff calcistico",
    intro:
      "Una guida costruita su presenza, lettura del gruppo e continuita operativa. Lo staff calcistico accompagna la squadra nei momenti chiave del progetto sportivo.",
  },
  istituzionale: {
    label: "Area organizzativa",
    title: "Staff organizzativo e istituzionale",
    intro:
      "Una struttura che sostiene il progetto sul piano operativo, relazionale e di rappresentanza, con attenzione alla continuita e alla credibilita dell'iniziativa.",
  },
} as const;

function getFullName(member: StaffMember) {
  return `${member.cognome} ${member.nome}`;
}

function getInitials(member: StaffMember) {
  return `${member.nome[0] ?? ""}${member.cognome[0] ?? ""}`.toUpperCase();
}

function StaffProfileCard({ member }: { member: StaffMember }) {
  const hasPhoto = Boolean(member.foto && member.foto.trim() !== "");

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div className="flex h-full items-start gap-5">
        <div className="relative h-[176px] w-[124px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(186,230,253,0.22)_0%,rgba(255,255,255,0.94)_100%)] shadow-sm">
          {hasPhoto ? (
            <img
              src={member.foto}
              alt={`${member.nome} ${member.cognome}`}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-sky-800">
              {getInitials(member)}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-950">
            {getFullName(member)}
          </h2>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            {member.ruolo}
          </p>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
            {member.descrizione}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function StaffPage() {
  const typedStaff = staff as StaffMember[];
  const coachingStaff = typedStaff.filter((member) => member.area === "calcistico");
  const institutionalStaff = typedStaff.filter((member) => member.area === "istituzionale");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f5f7fb_42%,#eef2f7_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.92)_16%,rgba(240,249,255,0.84)_56%,rgba(248,250,252,0.94)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="mb-4 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">Staff</span>
          </div>
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-100/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Nazionale Italiana Sanitari
          </p>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">Staff</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Una struttura costruita su competenza, visione e responsabilita. Lo staff della
            Nazionale Italiana Sanitari accompagna il progetto dentro e fuori dal campo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-14">
          <section>
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {sectionContent.calcistico.label}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {sectionContent.calcistico.title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                {sectionContent.calcistico.intro}
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              {coachingStaff.map((member) => (
                <StaffProfileCard key={`${member.cognome}-${member.nome}`} member={member} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {sectionContent.istituzionale.label}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {sectionContent.istituzionale.title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                {sectionContent.istituzionale.intro}
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              {institutionalStaff.map((member) => (
                <StaffProfileCard key={`${member.cognome}-${member.nome}`} member={member} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
