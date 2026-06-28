import initialUsers from "@/data/area-riservata-users.json";

export type ReservedUserRole = "giocatore" | "staff" | "dirigente";
export type ReservedAreaRole =
  | "giocatore"
  | "staff"
  | "dirigente"
  | "allenatore"
  | "ufficio_stampa";
export type PlayerAvailability = "disponibile" | "infortunato" | "assente";
export type SelectionStatus = "convocato" | "tribuna" | "non_convocato";

export type ReservedUser = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  password: string;
  ruoli: ReservedAreaRole[];
  ruolo?: ReservedUserRole;
  foto?: string;
  quota_attiva: boolean;
  data_pagamento: string;
  scadenza_quota: string;
  disponibilita: PlayerAvailability;
  convocazione: SelectionStatus;
  staff_al_seguito: boolean;
  note: string;
};

export const USERS_STORAGE_KEY = "nis_reserved_area_users";
export const SESSION_STORAGE_KEY = "nis_reserved_area_session";
export const EVENT_STORAGE_KEY = "nis_reserved_area_event";

export function getInitialUsers(): ReservedUser[] {
  return initialUsers as ReservedUser[];
}

export function normalizeReservedUsers(users: Partial<ReservedUser>[]): ReservedUser[] {
  const initialUsersById = new Map(getInitialUsers().map((user) => [user.id, user]));
  const storedUsersById = new Map(
    users
      .filter((user): user is Partial<ReservedUser> & { id: string } => typeof user.id === "string")
      .map((user) => [user.id, user]),
  );
  const allIds = new Set([...initialUsersById.keys(), ...storedUsersById.keys()]);

  return Array.from(allIds).map((id) => {
    const initialUser = initialUsersById.get(id);
    const storedUser: Partial<ReservedUser> = storedUsersById.get(id) ?? {};
    const legacyRole = storedUser.ruolo ? [storedUser.ruolo] : [];

    return {
      ...(initialUser ?? getInitialUsers()[0]),
      ...storedUser,
      id,
      ruoli:
        storedUser.ruoli && storedUser.ruoli.length > 0
          ? storedUser.ruoli
          : initialUser?.ruoli ?? legacyRole,
      disponibilita: storedUser.disponibilita ?? initialUser?.disponibilita ?? "disponibile",
      convocazione: storedUser.convocazione ?? initialUser?.convocazione ?? "non_convocato",
      staff_al_seguito: storedUser.staff_al_seguito ?? initialUser?.staff_al_seguito ?? false,
    } as ReservedUser;
  });
}

export function getUserInitials(user: Pick<ReservedUser, "nome" | "cognome">) {
  return `${user.nome.charAt(0)}${user.cognome.charAt(0)}`.toUpperCase();
}

export function formatReservedDate(value: string) {
  if (!value) {
    return "Da completare";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
