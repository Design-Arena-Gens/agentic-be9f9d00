"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import CategorySection from "./CategorySection";
import EditModal from "./EditModal";
import { CategoryFilter, CategoryKey, Item, WatchlistState } from "@/lib/types";
import { initialData } from "@/lib/sampleData";
import { loadState, saveState } from "@/lib/storage";
import { generateId } from "@/lib/utils";

const categories: CategoryKey[] = [
  "currentlyWatching",
  "planning",
  "watched",
  "dropped",
];

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [state, setState] = useState<WatchlistState>(initialData);
  const [filters, setFilters] = useState<Record<CategoryKey, CategoryFilter>>({
    currentlyWatching: "all",
    planning: "all",
    watched: "all",
    dropped: "all",
  });
  const [editing, setEditing] = useState<Item | null>(null);

  // Load persisted state
  useEffect(() => {
    const persisted = loadState();
    if (persisted) setState(persisted);
  }, []);

  // Persist on change
  useEffect(() => {
    saveState(state);
  }, [state]);

  function addFromSearch(r: { id: string; title: string; type: "movie" | "tv"; posterUrl?: string }) {
    const item: Item = {
      id: generateId("item"),
      title: r.title,
      type: r.type,
      posterUrl: r.posterUrl,
      rating: null,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, planning: [item, ...s.planning] }));
  }

  function addManual(entry: { title: string; type: "movie" | "tv"; posterUrl?: string }) {
    addFromSearch({ id: "manual", title: entry.title, type: entry.type, posterUrl: entry.posterUrl });
  }

  function moveItem(to: CategoryKey, itemId: string, from: CategoryKey) {
    if (to === from) return;
    setState((s) => {
      const fromList = s[from];
      const idx = fromList.findIndex((i) => i.id === itemId);
      if (idx === -1) return s;
      const item = { ...fromList[idx], updatedAt: new Date().toISOString() };
      const newFrom = [...fromList.slice(0, idx), ...fromList.slice(idx + 1)];
      const newTo = [item, ...s[to]];
      return { ...s, [from]: newFrom, [to]: newTo } as WatchlistState;
    });
  }

  function updateItem(updated: Item) {
    setState((s) => {
      const next: WatchlistState = { ...s } as WatchlistState;
      for (const key of categories) {
        const idx = next[key].findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          next[key] = [...next[key]];
          next[key][idx] = updated;
          break;
        }
      }
      return next;
    });
    setEditing(null);
  }

  function deleteItem(id: string) {
    setState((s) => {
      const next: WatchlistState = { ...s } as WatchlistState;
      for (const key of categories) {
        next[key] = next[key].filter((i) => i.id !== id);
      }
      return next;
    });
    setEditing(null);
  }

  function onFilterChange(category: CategoryKey, filter: CategoryFilter) {
    setFilters((f) => ({ ...f, [category]: filter }));
  }

  const gridOrder: Array<{ key: CategoryKey }> = useMemo(
    () => [
      { key: "currentlyWatching" },
      { key: "planning" },
      { key: "watched" },
      { key: "dropped" },
    ],
    []
  );

  return (
    <div className="flex min-h-screen bg-[radial-gradient(80%_60%_at_50%_0%,#111,transparent)] from-black to-black text-white">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onSelectSearch={addFromSearch}
        onAddManual={addManual}
        onExport={() => {
          const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "watchlist.json";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }}
        onImport={(json) => {
          try {
            const parsed = JSON.parse(json) as WatchlistState;
            setState(parsed);
          } catch {}
        }}
      />
      <main className="flex-1 p-3 sm:p-6">
        <div className="mb-4 text-lg font-semibold tracking-wide text-white/90">Watchlist</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {gridOrder.map(({ key }) => (
            <CategorySection
              key={key}
              category={key}
              items={state[key]}
              filter={filters[key]}
              onFilterChange={onFilterChange}
              onOpen={(item) => setEditing(item)}
              onDragStart={() => {}}
              onDropItem={moveItem}
            />
          ))}
        </div>
      </main>
      {editing ? (
        <EditModal item={editing} onClose={() => setEditing(null)} onSave={updateItem} onDelete={deleteItem} />
      ) : null}
    </div>
  );
}
