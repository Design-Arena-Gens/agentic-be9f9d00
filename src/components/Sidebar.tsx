"use client";

import { SearchResult } from "@/lib/types";
import { debounce300 } from "@/lib/search";
import { useEffect, useMemo, useRef, useState } from "react";

export type ManualEntry = {
  title: string;
  type: "movie" | "tv";
  posterUrl?: string;
};

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  onSelectSearch: (result: SearchResult) => void;
  onAddManual: (entry: ManualEntry) => void;
  onExport: () => void;
  onImport: (json: string) => void;
};

export default function Sidebar({ collapsed, onToggle, onSelectSearch, onAddManual, onExport, onImport }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [manual, setManual] = useState<ManualEntry>({ title: "", type: "movie", posterUrl: "" });
  const [openDropdown, setOpenDropdown] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const runSearch = useMemo(
    () =>
      debounce300(async (q: string) => {
        if (!q.trim()) {
          setResults([]);
          return;
        }
        try {
          const { smartSearch } = await import("@/lib/search");
          const out = await smartSearch(q);
          setResults(out);
          setOpenDropdown(true);
        } catch {
          setResults([]);
        }
      }),
    []
  );

  useEffect(() => {
    runSearch(query);
  }, [query, runSearch]);

  return (
    <aside
      className={
        "relative h-full transition-[width] duration-300 " + (collapsed ? "w-[56px]" : "w-[340px]")
      }
    >
      <div className="absolute -right-3 top-3 z-20">
        <button
          onClick={onToggle}
          className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 shadow-lg backdrop-blur hover:bg-white/20"
          aria-label="Toggle sidebar"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>
      <div className="h-full overflow-y-auto rounded-2xl border border-white/15 bg-white/5 p-3 shadow-2xl backdrop-blur-xl">
        {collapsed ? (
          <div className="flex h-full items-center justify-center text-xs text-white/60">Menu</div>
        ) : (
          <div className="space-y-4">
            <div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies & TV"
                className="w-full rounded-xl border border-white/20 bg-white/10 p-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
                onFocus={() => query && setOpenDropdown(true)}
              />
              {openDropdown && results.length > 0 ? (
                <div className="mt-2 max-h-72 overflow-auto rounded-xl border border-white/15 bg-black/60 p-2 shadow-xl">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSelectSearch(r);
                        setQuery("");
                        setResults([]);
                        setOpenDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-white/90 hover:bg-white/10"
                    >
                      {r.posterUrl ? (
                        <img src={r.posterUrl} alt="" className="h-10 w-8 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-8 rounded bg-white/10" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm">{r.title}</div>
                        <div className="text-[10px] uppercase text-white/50">{r.type === "movie" ? "Movie" : "TV"}</div>
                      </div>
                      {r.year ? <div className="text-xs text-white/60">{r.year}</div> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-white/70">Add manual</div>
              <input
                value={manual.title}
                onChange={(e) => setManual((m) => ({ ...m, title: e.target.value }))}
                placeholder="Title"
                className="w-full rounded-lg border border-white/20 bg-white/10 p-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
              />
              <div className="flex gap-2">
                <select
                  value={manual.type}
                  onChange={(e) => setManual((m) => ({ ...m, type: e.target.value as "movie" | "tv" }))}
                  className="w-28 rounded-lg border border-white/20 bg-white/10 p-2 text-white outline-none"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV</option>
                </select>
                <input
                  value={manual.posterUrl}
                  onChange={(e) => setManual((m) => ({ ...m, posterUrl: e.target.value }))}
                  placeholder="Poster URL"
                  className="flex-1 rounded-lg border border-white/20 bg-white/10 p-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <button
                onClick={() => {
                  if (!manual.title.trim()) return;
                  onAddManual({ ...manual, posterUrl: manual.posterUrl || undefined });
                  setManual({ title: "", type: "movie", posterUrl: "" });
                }}
                className="w-full rounded-lg bg-white px-3 py-2 font-semibold text-black hover:bg-white/90"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-white/70">Import / Export</div>
              <div className="flex gap-2">
                <button onClick={onExport} className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white/80 hover:bg-white/20">
                  Export JSON
                </button>
                <button
                  onClick={() => importInputRef.current?.click()}
                  className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white/80 hover:bg-white/20"
                >
                  Import JSON
                </button>
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    onImport(text);
                    e.currentTarget.value = "";
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-white/70">Settings</div>
              <div className="rounded-lg border border-white/20 bg-white/5 p-3 text-sm text-white/70">Minimal UI</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
