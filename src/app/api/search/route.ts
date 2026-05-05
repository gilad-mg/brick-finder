import { NextResponse } from "next/server";
import { searchSets } from "@/lib/rebrickable";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(48, Math.max(1, Number.parseInt(searchParams.get("page_size") ?? "24", 10) || 24));

  if (!q) {
    return NextResponse.json({ count: 0, next: null, previous: null, results: [] });
  }

  try {
    const data = await searchSets(q, page, pageSize);
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=600" } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
