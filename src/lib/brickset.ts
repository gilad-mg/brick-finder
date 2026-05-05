import "server-only";
import { unstable_cache } from "next/cache";

interface BricksetPrice {
  region: string;
  formatted: string;
}

export interface BricksetSummary {
  prices: BricksetPrice[];
}

interface BricksetSetResponse {
  status?: string;
  matches?: number;
  sets?: Array<{
    LEGOCom?: {
      US?: { retailPrice?: number };
      UK?: { retailPrice?: number };
      DE?: { retailPrice?: number };
      CA?: { retailPrice?: number };
    };
  }>;
}

export function isBricksetEnabled(): boolean {
  return Boolean(process.env.BRICKSET_API_KEY);
}

function formatCurrency(amount: number, region: string): string {
  const map: Record<string, { locale: string; currency: string }> = {
    US: { locale: "en-US", currency: "USD" },
    UK: { locale: "en-GB", currency: "GBP" },
    DE: { locale: "de-DE", currency: "EUR" },
    CA: { locale: "en-CA", currency: "CAD" },
  };
  const cfg = map[region];
  if (!cfg) return `${amount}`;
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: "currency",
      currency: cfg.currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount}`;
  }
}

export const getBricksetSummary = unstable_cache(
  async (setNum: string): Promise<BricksetSummary | null> => {
    const key = process.env.BRICKSET_API_KEY;
    if (!key) return null;
    const params = new URLSearchParams({
      apiKey: key,
      userHash: "",
      params: JSON.stringify({ setNumber: setNum }),
    });
    try {
      const res = await fetch(`https://brickset.com/api/v3.asmx/getSets?${params}`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as BricksetSetResponse;
      const set = data.sets?.[0];
      if (!set?.LEGOCom) return null;
      const prices: BricksetPrice[] = [];
      const lego = set.LEGOCom;
      (["US", "UK", "DE", "CA"] as const).forEach((region) => {
        const price = lego[region]?.retailPrice;
        if (typeof price === "number" && price > 0) {
          prices.push({ region, formatted: formatCurrency(price, region) });
        }
      });
      if (prices.length === 0) return null;
      return { prices };
    } catch {
      return null;
    }
  },
  ["brickset-summary-v1"],
  { revalidate: 86400, tags: ["brickset"] },
);
