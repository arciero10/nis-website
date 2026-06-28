type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  light = false,
}: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.22em] ${
          light ? "text-sky-300" : "text-sky-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl font-bold tracking-tight md:text-5xl ${
          light ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-lg leading-8 ${light ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
