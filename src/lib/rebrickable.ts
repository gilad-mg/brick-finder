import "server-only";
import { unstable_cache } from "next/cache";

const API_BASE = "https://rebrickable.com/api/v3";

export interface RebrickableSet {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string | null;
  set_url: string;
  last_modified_dt: string;
}

export interface RebrickableTheme {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface RebrickableSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RebrickableSet[];
}

export interface RebrickableAlternate {
  id: number;
  set_num: string;
  url: string;
  set_img_url: string | null;
}

function getApiKey(): string {
  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) {
    throw new Error("REBRICKABLE_API_KEY is not configured");
  }
  return key;
}

async function rebrickableFetch<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `key ${getApiKey()}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Rebrickable ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

export const searchSets = unstable_cache(
  async (query: string, page = 1, pageSize = 24): Promise<RebrickableSearchResponse> => {
    const params = new URLSearchParams({
      search: query,
      page: String(page),
      page_size: String(pageSize),
      ordering: "-year",
    });
    return rebrickableFetch<RebrickableSearchResponse>(`/lego/sets/?${params}`);
  },
  ["rebrickable-search-v2"],
  { revalidate: 3600, tags: ["rebrickable"] },
);

export const getSet = unstable_cache(
  async (setNum: string): Promise<RebrickableSet | null> => {
    try {
      return await rebrickableFetch<RebrickableSet>(`/lego/sets/${encodeURIComponent(setNum)}/`);
    } catch {
      return null;
    }
  },
  ["rebrickable-set-v2"],
  { revalidate: 3600, tags: ["rebrickable"] },
);

export const getSetAlternates = unstable_cache(
  async (setNum: string): Promise<RebrickableAlternate[]> => {
    try {
      const data = await rebrickableFetch<{ results: RebrickableAlternate[] }>(
        `/lego/sets/${encodeURIComponent(setNum)}/alternates/`,
      );
      return data.results ?? [];
    } catch {
      return [];
    }
  },
  ["rebrickable-alternates-v2"],
  { revalidate: 3600, tags: ["rebrickable"] },
);

export const getTheme = unstable_cache(
  async (themeId: number): Promise<RebrickableTheme | null> => {
    try {
      return await rebrickableFetch<RebrickableTheme>(`/lego/themes/${themeId}/`);
    } catch {
      return null;
    }
  },
  ["rebrickable-theme-v2"],
  { revalidate: 86400, tags: ["rebrickable"] },
);

export async function getSetsByIds(ids: string[]): Promise<RebrickableSet[]> {
  const unique = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));
  const results = await Promise.all(unique.map((id) => getSet(id)));
  return results.filter((s): s is RebrickableSet => s !== null);
}
