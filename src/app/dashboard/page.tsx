"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {
  EVENT_STORAGE_KEY,
  formatReservedDate,
  getInitialUsers,
  getUserInitials,
  normalizeReservedUsers,
  PlayerAvailability,
  ReservedUser,
  SelectionStatus,
  SESSION_STORAGE_KEY,
  USERS_STORAGE_KEY,
} from "@/lib/reserved-area";

type TeamEvent = {
  title: string;
  date: string;
  location: string;
  opponent: string;
  description: string;
  meetingTime: string;
  officialNotes: string;
};

type DashboardState =
  | {
      status: "loading" | "unauthenticated";
      users: ReservedUser[];
      currentEmail: string;
      activeEvent: TeamEvent;
    }
  | {
      status: "authenticated";
      users: ReservedUser[];
      currentEmail: string;
      activeEvent: TeamEvent;
    };

const defaultActiveEvent: TeamEvent = {
  title: "Raduno squadra NIS",
  date: "Da definire",
  location: "Centro sportivo da confermare",
  opponent: "Avversario da definire",
  description:
    "Appuntamento riservato ai membri della squadra per attivita tecnica, organizzativa e aggiornamenti sul progetto.",
  meetingTime: "Da definire",
  officialNotes: "Le note ufficiali saranno pubblicate dall'ufficio stampa.",
};

const teamMessages = [
  {
    title: "Flusso evento attivo",
    date: "19 aprile 2026",
    description:
      "Ufficio stampa, giocatori e allenatore possono coordinare evento, disponibilita, convocazioni e staff al seguito.",
  },
  {
    title: "Disponibilita giocatori",
    date: "Sempre aggiornabile",
    description:
      "Ogni giocatore puo indicare se e disponibile, infortunato o assente per l'evento attivo.",
  },
];

const availabilityOptions: PlayerAvailability[] = ["disponibile", "infortunato", "assente"];
const selectionOptions: SelectionStatus[] = ["convocato", "tribuna", "non_convocato"];

function loadUsers() {
  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    const users = getInitialUsers();
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return users;
  }

  const users = normalizeReservedUsers(JSON.parse(storedUsers) as Partial<ReservedUser>[]);
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return users;
}

function loadEvent() {
  const storedEvent = window.localStorage.getItem(EVENT_STORAGE_KEY);

  if (!storedEvent) {
    window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(defaultActiveEvent));
    return defaultActiveEvent;
  }

  return {
    ...defaultActiveEvent,
    ...(JSON.parse(storedEvent) as Partial<TeamEvent>),
  };
}

function hasRole(user: ReservedUser, role: string) {
  return user.ruoli.includes(role as never);
}

function formatRole(role: string) {
  return role.replace("_", " ");
}

function getMembershipStatus(user: ReservedUser) {
  if (user.quota_attiva) {
    return {
      label: "Attiva",
      className: "border-emerald-300/40 bg-emerald-400/12 text-emerald-100",
      dotClassName: "bg-emerald-300",
    };
  }

  if (user.data_pagamento) {
    return {
      label: "In verifica",
      className: "border-amber-300/40 bg-amber-400/12 text-amber-100",
      dotClassName: "bg-amber-300",
    };
  }

  return {
    label: "Non attiva",
    className: "border-red-300/40 bg-red-400/12 text-red-100",
    dotClassName: "bg-red-300",
  };
}

function getProfilePhoto(user: ReservedUser) {
  return user.foto?.trim() ?? "";
}

function getDaysUntil(value: string) {
  if (!value) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(value);
  expiryDate.setHours(0, 0, 0, 0);

  return Math.ceil((expiryDate.getTime() - today.getTime()) / 86_400_000);
}

function getQuotaProgress(user: ReservedUser) {
  if (!user.quota_attiva || !user.data_pagamento || !user.scadenza_quota) {
    return 0;
  }

  const startDate = new Date(user.data_pagamento).getTime();
  const endDate = new Date(user.scadenza_quota).getTime();
  const now = Date.now();

  if (endDate <= startDate) {
    return 100;
  }

  const progress = ((now - startDate) / (endDate - startDate)) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardState, setDashboardState] = useState<DashboardState>(() => {
    if (typeof window === "undefined") {
      return {
        status: "loading",
        users: [],
        currentEmail: "",
        activeEvent: defaultActiveEvent,
      };
    }

    const sessionEmail = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!sessionEmail) {
      return {
        status: "unauthenticated",
        users: [],
        currentEmail: "",
        activeEvent: loadEvent(),
      };
    }

    return {
      status: "authenticated",
      users: loadUsers(),
      currentEmail: sessionEmail,
      activeEvent: loadEvent(),
    };
  });
  const [eventDraft, setEventDraft] = useState<Partial<TeamEvent>>({});
  const [availabilityDraft, setAvailabilityDraft] = useState<PlayerAvailability | null>(null);
  const [feedback, setFeedback] = useState<{ key: string; message: string } | null>(null);

  useEffect(() => {
    if (dashboardState.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [dashboardState.status, router]);

  const { users, currentEmail, activeEvent } = dashboardState;
  const currentUser = users.find((user) => user.email === currentEmail);

  function persistUsers(nextUsers: ReservedUser[]) {
    setDashboardState((state) => ({
      ...state,
      users: nextUsers,
    }));
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  }

  function updateUser(userId: string, field: keyof ReservedUser, value: string | boolean) {
    const nextUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            [field]: value,
          }
        : user
    );

    persistUsers(nextUsers);
  }

  function showFeedback(key: string, message: string) {
    setFeedback({ key, message });
    window.setTimeout(() => {
      setFeedback((currentFeedback) => (currentFeedback?.key === key ? null : currentFeedback));
    }, 3200);
  }

  function saveCurrentUserAvailability() {
    if (!currentUser) {
      return;
    }

    const value = availabilityDraft ?? currentUser.disponibilita;
    updateUser(currentUser.id, "disponibilita", value);
    setAvailabilityDraft(null);
    showFeedback("availability", "Disponibilita inviata all'allenatore");
  }

  function updateEventDraft(field: keyof TeamEvent, value: string) {
    setEventDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function saveEvent() {
    const nextEvent = {
      ...activeEvent,
      ...eventDraft,
    };

    setDashboardState((state) => ({
      ...state,
      activeEvent: nextEvent,
    }));
    window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(nextEvent));
    setEventDraft({});
    showFeedback("event", "Evento aggiornato correttamente");
  }

  function publishConvocations() {
    persistUsers(users);
    showFeedback("convocations", "Convocazioni pubblicate");
  }

  function saveQuotaChanges() {
    persistUsers(users);
    showFeedback("quota", "Quota aggiornata");
  }

  function handleLogout() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setDashboardState({
      status: "unauthenticated",
      users: [],
      currentEmail: "",
      activeEvent,
    });
    router.push("/login");
  }

  if (dashboardState.status !== "authenticated" || !currentUser) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">Caricamento area riservata...</div>
      </main>
    );
  }

  const membershipStatus = getMembershipStatus(currentUser);
  const profilePhoto = getProfilePhoto(currentUser);
  const daysUntilExpiry = getDaysUntil(currentUser.scadenza_quota);
  const quotaProgress = getQuotaProgress(currentUser);
  const activeQuotes = users.filter((user) => user.quota_attiva).length;
  const inactiveQuotes = users.length - activeQuotes;
  const players = users.filter((user) => hasRole(user, "giocatore"));
  const staffMembers = users.filter((user) => hasRole(user, "staff"));
  const officialCalledPlayers = players.filter((user) => user.convocazione === "convocato");
  const officialBenchPlayers = players.filter((user) => user.convocazione === "tribuna");
  const officialNotCalledPlayers = players.filter((user) => user.convocazione === "non_convocato");
  const followingStaff = staffMembers.filter((user) => user.staff_al_seguito);
  const calledPlayers = players.filter((user) => user.convocazione === "convocato").length;
  const benchPlayers = players.filter((user) => user.convocazione === "tribuna").length;
  const notCalledPlayers = players.filter((user) => user.convocazione === "non_convocato").length;
  const isPlayer = hasRole(currentUser, "giocatore");
  const isCoach = hasRole(currentUser, "allenatore");
  const isPressOffice = hasRole(currentUser, "ufficio_stampa");
  const isAdmin = hasRole(currentUser, "dirigente");
  const isFollowingStaff = hasRole(currentUser, "staff") && currentUser.staff_al_seguito;
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071827_0%,#eef4fb_34%,#e7edf6_100%)] px-6 py-6 text-slate-900 md:py-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-white/65">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Area Squadra</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-sky-300/50 hover:bg-white/15"
          >
            Esci
          </button>
        </div>

        <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.28),transparent_35%),linear-gradient(135deg,rgba(8,47,73,0.98),rgba(15,23,42,0.98))] p-6 text-white shadow-[0_28px_70px_rgba(8,15,30,0.28)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                Nazionale Italiana Sanitari
              </p>
              <h1 className="mt-3 text-5xl font-bold tracking-tight md:text-7xl">Area Squadra</h1>
              <p className="mt-3 text-xl font-semibold text-white/85">Uniti per la vita</p>

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 shadow-[0_18px_38px_rgba(14,165,233,0.2)] backdrop-blur-sm">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={`${currentUser.nome} ${currentUser.cognome}`}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                      {getUserInitials(currentUser)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight md:text-4xl">
                    {currentUser.nome} {currentUser.cognome}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentUser.ruoli.map((role) => (
                      <span
                        key={role}
                        className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100"
                      >
                        {formatRole(role)}
                      </span>
                    ))}
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${membershipStatus.className}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${membershipStatus.dotClassName}`} />
                      {membershipStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <article className="rounded-[2rem] border border-white/12 bg-white/10 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.22)] backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-100">
                Evento attivo
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">{activeEvent.title}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DarkInfoBlock label="Data" value={activeEvent.date} />
                <DarkInfoBlock label="Luogo" value={activeEvent.location} />
                <DarkInfoBlock label="Avversario" value={activeEvent.opponent} />
                <DarkInfoBlock label="Ritrovo" value={activeEvent.meetingTime} />
              </div>
            </article>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {isPlayer || isFollowingStaff ? (
            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/92 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:col-span-2">
              <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
                <div
                  className={`p-6 text-white md:p-8 ${
                    currentUser.convocazione === "convocato" || isFollowingStaff
                      ? "bg-[linear-gradient(135deg,#065f46,#0f766e)]"
                      : currentUser.convocazione === "tribuna"
                        ? "bg-[linear-gradient(135deg,#92400e,#b45309)]"
                        : "bg-[linear-gradient(135deg,#7f1d1d,#991b1b)]"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                    Distinta convocazione
                  </p>
                  <h2 className="mt-4 text-4xl font-bold tracking-tight">
                    {isFollowingStaff ? "Staff al seguito" : formatRole(currentUser.convocazione)}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/78">
                    {isFollowingStaff
                      ? "Sei indicato tra i membri dello staff che seguiranno la squadra."
                      : "Esito impostato dall'allenatore per l'evento attivo."}
                  </p>
                  <span className="mt-6 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    Scheda evento ufficiale
                  </span>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 md:p-8">
                  <InfoBlock label="Evento" value={activeEvent.title} />
                  <InfoBlock label="Data" value={activeEvent.date} />
                  <InfoBlock label="Luogo" value={activeEvent.location} />
                  <InfoBlock label="Avversario" value={activeEvent.opponent} />
                  <InfoBlock label="Orario ritrovo" value={activeEvent.meetingTime} />
                  <InfoBlock label="Disponibilita" value={formatRole(currentUser.disponibilita)} />
                  <InfoBlock label="Convocazione" value={formatRole(currentUser.convocazione)} />
                  <InfoBlock
                    label="Staff al seguito"
                    value={isFollowingStaff ? "Incluso" : "Non incluso"}
                  />
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Note ufficiali
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7 text-slate-800">
                      {activeEvent.officialNotes}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {isPlayer ? (
            <article className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-8 lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Distinta ufficiale convocazione
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight">{activeEvent.title}</h2>
                </div>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                  Evento attivo
                </span>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                <OfficialListCard
                  title="Convocati"
                  tone="green"
                  members={officialCalledPlayers}
                  emptyText="Nessun convocato pubblicato"
                />
                <OfficialListCard
                  title="Tribuna"
                  tone="amber"
                  members={officialBenchPlayers}
                  emptyText="Nessun giocatore in tribuna"
                />
                <OfficialListCard
                  title="Staff al seguito"
                  tone="blue"
                  members={followingStaff}
                  emptyText="Nessuno staff selezionato"
                />
              </div>

              {officialNotCalledPlayers.length > 0 ? (
                <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Non convocati
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {officialNotCalledPlayers.map((player) => (
                      <span
                        key={player.id}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                      >
                        {player.nome} {player.cognome}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ) : null}

          {isPlayer ? (
            <article className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                La tua disponibilita
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">Risposta per l&apos;evento</h2>
              <select
                value={availabilityDraft ?? currentUser.disponibilita}
                onChange={(event) => setAvailabilityDraft(event.target.value as PlayerAvailability)}
                className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-sky-300"
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatRole(option)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={saveCurrentUserAvailability}
                className="mt-5 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400"
              >
                Salva disponibilita
              </button>
              {feedback?.key === "availability" ? (
                <FeedbackMessage message={feedback.message} />
              ) : null}
            </article>
          ) : null}

          <article className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Quota associativa
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  {currentUser.quota_attiva
                    ? `Quota attiva fino al ${formatReservedDate(currentUser.scadenza_quota)}`
                    : "La quota associativa non risulta attiva. Verifica il pagamento."}
                </h2>
              </div>
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                  currentUser.quota_attiva
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {currentUser.quota_attiva ? "Attivo" : "Non attivo"}
              </span>
            </div>
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-4 text-sm font-semibold text-slate-600">
                <span>Avanzamento annuale</span>
                <span>
                  {daysUntilExpiry === null
                    ? "Scadenza da completare"
                    : daysUntilExpiry > 0
                      ? `${daysUntilExpiry} giorni mancanti`
                      : "Quota scaduta"}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    currentUser.quota_attiva ? "bg-emerald-500" : "bg-red-400"
                  }`}
                  style={{ width: `${quotaProgress}%` }}
                />
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoBlock label="Data pagamento" value={formatReservedDate(currentUser.data_pagamento)} />
              <InfoBlock label="Scadenza" value={formatReservedDate(currentUser.scadenza_quota)} />
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Comunicazioni
            </p>
            <div className="mt-6 space-y-4">
              {teamMessages.map((message) => (
                <article
                  key={message.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {message.date}
                  </p>
                  <h2 className="mt-3 text-xl font-bold tracking-tight">{message.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{message.description}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        {isPressOffice ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Gestione evento
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Pannello ufficio stampa</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <EventInput
                label="Titolo"
                value={eventDraft.title ?? activeEvent.title}
                onChange={(value) => updateEventDraft("title", value)}
              />
              <EventInput
                label="Data"
                value={eventDraft.date ?? activeEvent.date}
                onChange={(value) => updateEventDraft("date", value)}
              />
              <EventInput
                label="Luogo"
                value={eventDraft.location ?? activeEvent.location}
                onChange={(value) => updateEventDraft("location", value)}
              />
              <EventInput
                label="Avversario"
                value={eventDraft.opponent ?? activeEvent.opponent}
                onChange={(value) => updateEventDraft("opponent", value)}
              />
              <EventInput
                label="Orario ritrovo"
                value={eventDraft.meetingTime ?? activeEvent.meetingTime}
                onChange={(value) => updateEventDraft("meetingTime", value)}
              />
              <EventTextArea
                label="Descrizione"
                value={eventDraft.description ?? activeEvent.description}
                onChange={(value) => updateEventDraft("description", value)}
              />
              <EventTextArea
                label="Note ufficiali"
                value={eventDraft.officialNotes ?? activeEvent.officialNotes}
                onChange={(value) => updateEventDraft("officialNotes", value)}
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={saveEvent}
                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400"
              >
                Salva evento
              </button>
              {feedback?.key === "event" ? <FeedbackMessage message={feedback.message} /> : null}
            </div>
          </section>
        ) : null}

        {isCoach ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Pannello allenatore
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Convocazioni e staff</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <AdminMetric label="Convocati" value={calledPlayers.toString()} tone="green" />
              <AdminMetric label="Tribuna" value={benchPlayers.toString()} />
              <AdminMetric label="Non convocati" value={notCalledPlayers.toString()} tone="red" />
            </div>

            <div className="mt-8 space-y-4">
              {players.map((player) => (
                <article
                  key={player.id}
                  className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 md:grid-cols-[1.1fr_0.7fr_0.8fr]"
                >
                  <div>
                    <p className="text-lg font-bold">
                      {player.nome} {player.cognome}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Disponibilita: {formatRole(player.disponibilita)}
                    </p>
                  </div>
                  <AvailabilityBadge value={player.disponibilita} />
                  <select
                    value={player.convocazione}
                    onChange={(event) =>
                      updateUser(player.id, "convocazione", event.target.value as SelectionStatus)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-300"
                  >
                    {selectionOptions.map((option) => (
                      <option key={option} value={option}>
                        {formatRole(option)}
                      </option>
                    ))}
                  </select>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                Staff al seguito
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {staffMembers.map((staffMember) => (
                  <label
                    key={staffMember.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <span>
                      <span className="block text-base font-bold">
                        {staffMember.nome} {staffMember.cognome}
                      </span>
                      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {staffMember.ruoli.map(formatRole).join(" / ")}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={staffMember.staff_al_seguito}
                      onChange={(event) =>
                        updateUser(staffMember.id, "staff_al_seguito", event.target.checked)
                      }
                      className="h-5 w-5 accent-sky-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={publishConvocations}
                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400"
              >
                Pubblica convocazioni
              </button>
              {feedback?.key === "convocations" ? (
                <FeedbackMessage message={feedback.message} />
              ) : null}
            </div>
          </section>
        ) : null}

        {isAdmin ? (
          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur-sm md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                Area admin
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Gestione quote utenti</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                Dirigenti e admin mantengono la gestione quote e la supervisione generale.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <AdminMetric label="Totale membri" value={users.length.toString()} />
                <AdminMetric label="Quote attive" value={activeQuotes.toString()} tone="green" />
                <AdminMetric label="Quote non attive" value={inactiveQuotes.toString()} tone="red" />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={saveQuotaChanges}
                  className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400"
                >
                  Salva modifiche quote
                </button>
                {feedback?.key === "quota" ? <FeedbackMessage message={feedback.message} /> : null}
              </div>
            </div>

            <div className="space-y-5">
              {users.map((user) => (
                <article
                  key={user.id}
                  className="grid gap-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] lg:grid-cols-[1.1fr_0.55fr_0.75fr_0.75fr_1fr]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-bold">
                        {user.nome} {user.cognome}
                      </p>
                      <UserStatusBadge user={user} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                      {user.ruoli.map(formatRole).join(" / ")}
                    </p>
                  </div>

                  <label className="text-sm font-semibold text-slate-600">
                    Quota
                    <select
                      value={user.quota_attiva ? "true" : "false"}
                      onChange={(event) =>
                        updateUser(user.id, "quota_attiva", event.target.value === "true")
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-300"
                    >
                      <option value="true">Attiva</option>
                      <option value="false">Non attiva</option>
                    </select>
                  </label>

                  <DateInput
                    label="Pagamento"
                    value={user.data_pagamento}
                    onChange={(event) => updateUser(user.id, "data_pagamento", event.target.value)}
                  />

                  <DateInput
                    label="Scadenza"
                    value={user.scadenza_quota}
                    onChange={(event) => updateUser(user.id, "scadenza_quota", event.target.value)}
                  />

                  <label className="text-sm font-semibold text-slate-600">
                    Note
                    <textarea
                      value={user.note}
                      onChange={(event) => updateUser(user.id, "note", event.target.value)}
                      rows={3}
                      className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-300"
                    />
                  </label>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-bold capitalize text-slate-900">{value}</p>
    </div>
  );
}

function FeedbackMessage({ message }: { message: string }) {
  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
      {message}
    </span>
  );
}

function DarkInfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{label}</p>
      <p className="mt-2 text-base font-bold capitalize text-white">{value}</p>
    </div>
  );
}

function AvailabilityBadge({ value }: { value: PlayerAvailability }) {
  const className =
    value === "disponibile"
      ? "bg-emerald-50 text-emerald-700"
      : value === "infortunato"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${className}`}
    >
      {formatRole(value)}
    </span>
  );
}

function OfficialListCard({
  title,
  members,
  emptyText,
  tone,
}: {
  title: string;
  members: ReservedUser[];
  emptyText: string;
  tone: "green" | "amber" | "blue";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-sky-50 text-sky-700 border-sky-100";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${toneClass}`}
        >
          {members.length}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                {getUserInitials(member)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {member.nome} {member.cognome}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {member.ruoli.map(formatRole).join(" / ")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-slate-500">
            {emptyText}
          </p>
        )}
      </div>
    </div>
  );
}

function AdminMetric({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: string;
  tone?: "blue" | "green" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-800"
      : tone === "red"
        ? "bg-red-50 text-red-800"
        : "bg-sky-50 text-sky-800";

  return (
    <div className={`rounded-[1.5rem] border border-slate-200 p-5 ${toneClass}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-3 text-4xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function UserStatusBadge({ user }: { user: ReservedUser }) {
  const status = getMembershipStatus(user);
  const lightClassName =
    status.label === "Attiva"
      ? "bg-emerald-50 text-emerald-700"
      : status.label === "In verifica"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${lightClassName}`}
    >
      <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} />
      {status.label}
    </span>
  );
}

function EventInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-600">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-300"
      />
    </label>
  );
}

function EventTextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-600 md:col-span-2">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-300"
      />
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-600">
      {label}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-300"
      />
    </label>
  );
}
