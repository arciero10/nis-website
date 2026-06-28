import Link from "next/link";

type Action = {
  label: string;
  href: string;
  external?: boolean;
  secondary?: boolean;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  actions?: Action[];
};

export function PageHero({ eyebrow, title, description, image, actions = [] }: PageHeroProps) {
  const background = image
    ? `linear-gradient(rgba(7,24,39,0.72),rgba(7,24,39,0.82)),url('${image}')`
    : "linear-gradient(135deg,#071827,#0f2741 56%,#071827)";

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: background }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-100 backdrop-blur-sm">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">{description}</p>

        {actions.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {actions.map((action) =>
              action.external ? (
                <a
                  key={action.href + action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    action.secondary
                      ? "rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/15"
                      : "rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-300"
                  }
                >
                  {action.label}
                </a>
              ) : (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className={
                    action.secondary
                      ? "rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/15"
                      : "rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-300"
                  }
                >
                  {action.label}
                </Link>
              ),
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
