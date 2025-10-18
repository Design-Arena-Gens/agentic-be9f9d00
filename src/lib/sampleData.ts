import { WatchlistState, Item } from "./types";

function createItem(partial: Partial<Item> & Pick<Item, "title">): Item {
  const now = new Date().toISOString();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: partial.title,
    type: partial.type ?? "movie",
    posterUrl: partial.posterUrl,
    rating: partial.rating ?? null,
    notes: partial.notes ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

export const initialData: WatchlistState = {
  currentlyWatching: [
    createItem({
      title: "Dune: Part Two",
      type: "movie",
      posterUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Video116/v4/2e/3b/65/2e3b6520-2b4a-3a8c-3a4e-3f2e2d0d2d2a/Job7f7edab2-3f31-43dd-83d8-3a8c10e2c3b5-128075910-PreviewImage_PSM.jpg/600x600bb.jpg",
      rating: 8,
    }),
    createItem({
      title: "The Bear",
      type: "tv",
      posterUrl: "https://static.tvmaze.com/uploads/images/original_untouched/425/1064982.jpg",
      rating: 9,
    }),
    createItem({
      title: "Fallout",
      type: "tv",
      posterUrl: "https://static.tvmaze.com/uploads/images/original_untouched/514/1286401.jpg",
      rating: 7,
    }),
  ],
  planning: [
    createItem({
      title: "Poor Things",
      type: "movie",
      posterUrl:
        "https://is3-ssl.mzstatic.com/image/thumb/Video116/v4/1e/2e/6a/1e2e6a69-5a1c-b8d7-5b40-3cf67a6257f2/Job7e3a861b-1a77-4a8d-bd16-9f16198eb5f1-128082546-PreviewImage_PSM.jpg/600x600bb.jpg",
    }),
    createItem({
      title: "Severance",
      type: "tv",
      posterUrl: "https://static.tvmaze.com/uploads/images/original_untouched/384/961983.jpg",
    }),
    createItem({
      title: "The Godfather",
      type: "movie",
      posterUrl:
        "https://is2-ssl.mzstatic.com/image/thumb/Video125/v4/4d/20/78/4d2078d8-3af8-1bd5-6b3e-c2b51d6e7e7a/pr_source.png/600x600bb.jpg",
    }),
  ],
  watched: [
    createItem({
      title: "Oppenheimer",
      type: "movie",
      posterUrl:
        "https://is5-ssl.mzstatic.com/image/thumb/Video116/v4/1e/80/04/1e800482-61e1-c2a0-54a5-7e821d331d45/Jobd3a35f44-6f01-4e73-9312-0b9ad7a2bfd3-136628133-PreviewImage_PSM.jpg/600x600bb.jpg",
      rating: 9,
    }),
    createItem({
      title: "Breaking Bad",
      type: "tv",
      posterUrl: "https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg",
      rating: 10,
    }),
    createItem({
      title: "Spider-Man: Into the Spider-Verse",
      type: "movie",
      posterUrl:
        "https://is5-ssl.mzstatic.com/image/thumb/Video115/v4/2c/51/a7/2c51a763-b1f1-4b3c-0c0f-b5457a30e7b1/pr_source.png/600x600bb.jpg",
      rating: 10,
    }),
  ],
  dropped: [
    createItem({
      title: "The Walking Dead",
      type: "tv",
      posterUrl: "https://static.tvmaze.com/uploads/images/original_untouched/0/2402.jpg",
      rating: 4,
    }),
    createItem({
      title: "Morbius",
      type: "movie",
      posterUrl:
        "https://is3-ssl.mzstatic.com/image/thumb/Video116/v4/ef/3d/c9/ef3dc92c-eec7-a4c3-6d10-3b66dea087d7/Job25b3f2fc-8be2-4e4f-8d1e-2a1db0aabe4f-128978891-PreviewImage_PSM.jpg/600x600bb.jpg",
      rating: 2,
    }),
    createItem({
      title: "Riverdale",
      type: "tv",
      posterUrl: "https://static.tvmaze.com/uploads/images/original_untouched/105/262214.jpg",
      rating: 3,
    }),
  ],
};
