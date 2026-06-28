"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  getInitialUsers,
  normalizeReservedUsers,
  ReservedUser,
  SESSION_STORAGE_KEY,
  USERS_STORAGE_KEY,
} from "@/lib/reserved-area";

function readUsers() {
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem(SESSION_STORAGE_KEY)) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const users = readUsers();
    const user = users.find(
      (currentUser) =>
        currentUser.email.toLowerCase() === email.trim().toLowerCase() &&
        currentUser.password === password
    );

    if (!user) {
      setError("Credenziali non valide. Verifica email e password.");
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, user.email);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_48%,#e7edf6_100%)] px-6 py-12 text-slate-900">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(rgba(10,25,47,0.75),rgba(10,25,47,0.85)),url('/images/uniti-per-la-vita.jpg')] bg-cover bg-center p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] md:p-10">
            <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-end">
              <div className="mb-6 text-sm text-white/70">
                <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Login</span>
            </div>
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-100 backdrop-blur-sm">
              Area riservata
            </p>
            <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-6xl">
              Accesso squadra
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">
              Uno spazio personale per giocatori, staff e dirigenti della Nazionale Italiana
              Sanitari, pensato per consultare lo stato quota e le informazioni operative di base.
            </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur-sm md:p-8"
          >
            <h2 className="text-3xl font-bold tracking-tight">Login</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Inserisci email e password personale per accedere alla dashboard.
            </p>

            <label className="mt-8 block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base normal-case tracking-normal text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
                placeholder="nome.cognome@email.it"
              />
            </label>

            <label className="mt-5 block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base normal-case tracking-normal text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
                placeholder="Password"
              />
            </label>

            {error ? (
              <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-400"
            >
              Accedi
            </button>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Sistema semplice pronto per una futura integrazione con database e autenticazione
              sicura prima del go-live.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
