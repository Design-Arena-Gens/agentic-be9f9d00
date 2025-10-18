"use client";

import { Item } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { classNames } from "@/lib/utils";

type Props = {
  item: Item;
  onClose: () => void;
  onSave: (updated: Item) => void;
  onDelete: (id: string) => void;
};

export default function EditModal({ item, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(item.title);
  const [posterUrl, setPosterUrl] = useState(item.posterUrl || "");
  const [notes, setNotes] = useState(item.notes);
  const [rating, setRating] = useState<number | null>(item.rating);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSave() {
    onSave({ ...item, title, posterUrl: posterUrl || undefined, notes, rating, updatedAt: new Date().toISOString() });
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-[min(92vw,800px)] rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 p-1 text-white/80 hover:bg-white/20"
        >
          ×
        </button>
        <div className="grid gap-4 sm:grid-cols-[240px_1fr]">
          <div className="overflow-hidden rounded-xl border border-white/15 bg-white/5">
            {posterUrl ? (
              <img src={posterUrl} alt={title} className="aspect-[2/3] w-full object-cover" />
            ) : (
              <div className="aspect-[2/3] w-full" />
            )}
          </div>
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-lg border border-white/20 bg-white/10 p-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
            />
            <input
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="Poster URL"
              className="w-full rounded-lg border border-white/20 bg-white/10 p-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
            />
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-white/70">Score</div>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={classNames(
                      "rounded-md px-2 py-1 text-sm transition",
                      rating === n ? "bg-white text-black" : "bg-white/15 text-white/90 hover:bg-white/25"
                    )}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setRating(null)}
                  className="col-span-2 rounded-md bg-white/10 px-2 py-1 text-sm text-white/70 hover:bg-white/20"
                >
                  Clear
                </button>
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-white/70">Notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes"
                className="w-full resize-y rounded-lg border border-white/20 bg-white/10 p-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white/80 hover:bg-white/20"
              >
                Delete
              </button>
              <div className="space-x-2">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white/80 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-white px-3 py-2 font-semibold text-black hover:bg-white/90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
