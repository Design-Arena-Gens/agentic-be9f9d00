import { WatchlistState } from "./types";

const STORAGE_KEY = "watchlist_v1";

export function loadState(): WatchlistState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "currentlyWatching" in parsed &&
      "planning" in parsed &&
      "watched" in parsed &&
      "dropped" in parsed
    ) {
      return parsed as WatchlistState;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveState(state: WatchlistState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
