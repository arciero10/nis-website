import Link from "next/link";

const values = [
  {
    title: "Responsabilita",
    description:
      "Ogni iniziativa nasce con l'idea di avere un impatto reale e coerente con il valore del progetto.",
  },
  {
    title: "Competenza",
    description:
      "La squadra rappresenta un mondo fatto di professionalita, esperienza e credibilita.",
  },
  {
    title: "Partecipazione",
    description:
      "Il progetto vive grazie alla capacita di coinvolgere persone, territori e realta diverse.",
  },
  {
    title: "Solidarieta",
    description:
      "Lo sport diventa strumento di sostegno, attenzione e vicinanza alle cause che meritano ascolto.",
  },
];

export default function LaNazionalePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f4f7fb_40%,#eef2f7_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,20,40,0.6),rgba(5,20,40,0.72)),url('/images/uniti-per-la-vita.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-4 text-sm text-white/70">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">La Nazionale</span>
          </div>
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-100 backdrop-blur-sm">
            Identita
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
                La Nazionale Italiana Sanitari
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">
                Un progetto che unisce professioni sanitarie, sport, responsabilita e solidarieta
                in un&apos;unica identita condivisa.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/rosa"
                  className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-300"
                >
                  Scopri la rosa
                </Link>
                <Link
                  href="/sostienici"
                  className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:border-white/40 hover:bg-white/15"
                >
                  Sostienici
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-100">
                Progetto
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Una squadra, una missione condivisa
              </h2>
              <p className="mt-4 text-base leading-7 text-white/80">
                La Nazionale Italiana Sanitari porta in campo una presenza riconoscibile, capace di
                trasformare lo sport in una forma concreta di rappresentazione, relazione e
                responsabilita sociale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white/88 p-8 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Chi siamo</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Chi siamo</h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">
            La Nazionale Italiana Sanitari nasce dall&apos;idea di dare forma a una comunita
            riconoscibile, capace di rappresentare attraverso lo sport il valore umano,
            professionale e sociale del mondo sanitario. La squadra diventa cosi un simbolo di
            partecipazione, presenza e responsabilita, dentro e fuori dal campo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 rounded-[2rem] border border-sky-300/20 bg-[linear-gradient(120deg,rgba(56,189,248,0.12)_0%,rgba(255,255,255,0.94)_48%,rgba(226,232,240,0.92)_100%)] p-8 shadow-[0_24px_56px_rgba(15,23,42,0.1)] md:grid-cols-[1fr_0.95fr] md:items-center md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Visione
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Una visione che va oltre il calcio
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            Il progetto non si esaurisce nella dimensione sportiva. Il calcio e il linguaggio che
            rende visibile una missione piu ampia: creare attenzione, generare coinvolgimento,
            sostenere iniziative concrete e avvicinare le persone a temi importanti come
            prevenzione, cura, benessere e solidarieta.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            I nostri valori
          </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Un&apos;identita costruita su principi chiari
            </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="h-1 w-14 rounded-full bg-sky-400" />
              <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                {value.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white/88 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Origine
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Come nasce il progetto
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">
            La Nazionale Italiana Sanitari prende forma per dare un&apos;identita forte a un gruppo di
            persone che condividono esperienze, valori e senso di appartenenza. L&apos;obiettivo e
            trasformare questa energia in una piattaforma capace di unire sport, presenza pubblica,
            relazione e impatto sociale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 rounded-[2rem] border border-sky-950/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(12,30,54,0.98)_54%,rgba(10,37,64,0.96)_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:grid-cols-[0.9fr_1.1fr] md:items-center md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              Perche il calcio
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Perche il calcio</h2>
          </div>
          <p className="text-lg leading-8 text-slate-300">
            Il calcio e uno spazio immediato, popolare e trasversale. Permette di parlare a
            pubblici diversi, di creare momenti di incontro e di dare forza a messaggi che
            altrimenti resterebbero lontani. In questo progetto diventa un mezzo, non un fine: uno
            strumento capace di dare visibilita e concretezza a un impegno piu grande.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white/88 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Collaborazioni
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Un progetto aperto a collaborazioni
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">
            La Nazionale Italiana Sanitari cresce anche attraverso relazioni, sponsor, partner,
            professionisti e sostenitori che scelgono di condividere il percorso. Per questo il
            progetto e pensato come una piattaforma aperta, in grado di accogliere energie,
            competenze e collaborazioni coerenti con la sua identita.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="grid gap-8 rounded-[2rem] border border-sky-300/20 bg-[linear-gradient(120deg,rgba(56,189,248,0.12)_0%,rgba(255,255,255,0.94)_48%,rgba(226,232,240,0.92)_100%)] p-8 shadow-[0_24px_56px_rgba(15,23,42,0.1)] md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Persone
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Scopri chi scende in campo per questo progetto
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Dalla rosa allo staff, ogni persona contribuisce a costruire un&apos;identita credibile,
              riconoscibile e capace di lasciare un segno.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            <Link
              href="/rosa"
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-400"
            >
              Scopri la rosa
            </Link>
            <Link
              href="/contatti"
              className="rounded-full border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-900 transition hover:border-sky-300 hover:bg-white"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
