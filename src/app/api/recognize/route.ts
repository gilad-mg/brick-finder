import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { unstable_cache } from "next/cache";
import { getSet, getTheme } from "@/lib/rebrickable";

export const runtime = "nodejs";
export const maxDuration = 30;

const BRICKOGNIZE_URL = "https://api.brickognize.com/predict/sets/";
const TIMEOUT_MS = 15_000;
const MAX_BYTES = 5 * 1024 * 1024;

interface BrickognizeItem {
  id: string;
  name?: string;
  score?: number;
  img_url?: string;
}

interface BrickognizeResponse {
  items?: BrickognizeItem[];
}

interface RecognizedItem {
  setNum: string;
  confidence: number;
  name: string;
  themeName: string;
  year: number;
  numParts: number;
  imageUrl: string;
}

interface RecognizeResponse {
  items: RecognizedItem[];
  elapsedMs: number;
}

async function callBrickognize(bytes: Uint8Array, mime: string): Promise<BrickognizeResponse> {
  const form = new FormData();
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  form.append("query_image", new Blob([ab], { type: mime }), "upload.jpg");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(BRICKOGNIZE_URL, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Brickognize ${res.status}`);
    }
    return (await res.json()) as BrickognizeResponse;
  } finally {
    clearTimeout(timer);
  }
}

const recognizeByHash = unstable_cache(
  async (hash: string, bytesB64: string, mime: string): Promise<RecognizeResponse> => {
    const started = Date.now();
    const bytes = Buffer.from(bytesB64, "base64");
    const result = await callBrickognize(new Uint8Array(bytes), mime);
    const candidates = (result.items ?? []).slice(0, 5);

    const enriched = await Promise.all(
      candidates.map(async (item): Promise<RecognizedItem | null> => {
        const rawId = String(item.id ?? "").trim();
        if (!rawId) return null;
        const setNum = rawId.includes("-") ? rawId : `${rawId}-1`;
        const set = await getSet(setNum);
        if (!set) {
          return {
            setNum,
            confidence: typeof item.score === "number" ? item.score : 0,
            name: item.name ?? setNum,
            themeName: "",
            year: 0,
            numParts: 0,
            imageUrl: item.img_url ?? "",
          };
        }
        const theme = await getTheme(set.theme_id);
        return {
          setNum: set.set_num,
          confidence: typeof item.score === "number" ? item.score : 0,
          name: set.name,
          themeName: theme?.name ?? "",
          year: set.year,
          numParts: set.num_parts,
          imageUrl: set.set_img_url ?? item.img_url ?? "",
        };
      }),
    );

    const items = enriched.filter((x): x is RecognizedItem => x !== null);

    void hash;
    return { items, elapsedMs: Date.now() - started };
  },
  ["brickognize-recognize-v1"],
  { revalidate: 3600, tags: ["recognize"] },
);

export async function POST(request: Request): Promise<NextResponse<RecognizeResponse | { error: string }>> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart payload" }, { status: 400 });
  }

  const file = formData.get("image");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Empty image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 });
  }

  const mime = file.type || "image/jpeg";
  const bytes = new Uint8Array(await file.arrayBuffer());
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  const bytesB64 = Buffer.from(bytes).toString("base64");

  try {
    const data = await recognizeByHash(hash, bytesB64, mime);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("aborted")) {
      return NextResponse.json({ error: "Recognition timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
