export type MediaType = "movie" | "tv";

export type CategoryKey =
  | "currentlyWatching"
  | "planning"
  | "watched"
  | "dropped";

export type Item = {
  id: string;
  title: string;
  type: MediaType;
  posterUrl?: string;
  rating: number | null;
  notes: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};

export type WatchlistState = Record<CategoryKey, Item[]>;

export type CategoryFilter = "all" | "movie" | "tv";

export type SearchResult = {
  id: string;
  title: string;
  type: MediaType;
  posterUrl?: string;
  source: "itunes" | "tvmaze" | "manual";
  year?: string;
};
