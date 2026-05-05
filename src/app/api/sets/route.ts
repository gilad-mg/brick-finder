import { NextResponse } from "next/server";
import { getSetsByIds } from "@/lib/rebrickable";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 60);

  if (ids.length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await getSetsByIds(ids);
    return NextResponse.json({ results }, { headers: { "Cache-Control": "public, s-maxage=600" } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
