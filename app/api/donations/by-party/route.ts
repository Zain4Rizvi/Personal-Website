import { getRegionYearPartyTotals } from "@/lib/politicalDonations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await getRegionYearPartyTotals();
    if (!Array.isArray(rows) || rows.length === 0) {
      return Response.json({ error: "Database unavailable" }, { status: 503 });
    }
    return Response.json(rows, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }
}
