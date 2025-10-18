import { SearchResult } from "./types";

function debounce<P extends unknown[], R>(fn: (...args: P) => R, wait: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: P) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      void fn(...args);
    }, wait);
  };
}

export const debounce300 = <P extends unknown[]>(fn: (...args: P) => void) =>
  debounce(fn, 300);

type ITunesMovie = {
  trackId?: number;
  collectionId?: number;
  trackName?: string;
  collectionName?: string;
  releaseDate?: string;
  artworkUrl100?: string;
};

type ITunesResponse = {
  results?: ITunesMovie[];
};

async function searchITunesMovies(term: string): Promise<SearchResult[]> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    term
  )}&media=movie&limit=10`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: ITunesResponse = await res.json();
  const results: SearchResult[] = (data.results || []).map((r) => {
    const artwork: string | undefined = r.artworkUrl100
      ? r.artworkUrl100.replace(/100x100bb/, "600x600bb")
      : undefined;
    return {
      id: `itunes-${r.trackId ?? r.collectionId}`,
      title: r.trackName || r.collectionName || "Untitled",
      type: "movie",
      posterUrl: artwork,
      source: "itunes",
      year: r.releaseDate ? String(new Date(r.releaseDate).getFullYear()) : undefined,
    };
  });
  return results;
}

type TVMazeShow = {
  id: number;
  name?: string;
  premiered?: string;
  image?: { original?: string; medium?: string };
};

type TVMazeSearchItem = { show: TVMazeShow };

async function searchTVMaze(term: string): Promise<SearchResult[]> {
  const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: TVMazeSearchItem[] = await res.json();
  const results: SearchResult[] = (data || []).map((r) => {
    const show = r.show;
    const img: string | undefined = show.image?.original || show.image?.medium;
    return {
      id: `tvmaze-${show.id}`,
      title: show.name || "Untitled",
      type: "tv",
      posterUrl: img,
      source: "tvmaze",
      year: show.premiered ? String(new Date(show.premiered).getFullYear()) : undefined,
    };
  });
  return results;
}

export async function smartSearch(term: string): Promise<SearchResult[]> {
  if (!term.trim()) return [];
  const [movies, tv] = await Promise.all([
    searchITunesMovies(term).catch(() => []),
    searchTVMaze(term).catch(() => []),
  ]);
  // Merge and de-dup by title+type
  const seen = new Set<string>();
  const merged: SearchResult[] = [];
  for (const r of [...movies, ...tv]) {
    const key = `${r.title.toLowerCase()}-${r.type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(r);
  }
  return merged.slice(0, 15);
}
