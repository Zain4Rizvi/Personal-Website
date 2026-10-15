import { downloadExport, isUser, requireResearcher } from "@/lib/politicalDonations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await requireResearcher(request);
  if (!isUser(user)) return user;
  try {
    const body = await request.json();
    if (body.format && String(body.format).toLowerCase() !== "csv") {
      return Response.json({ error: `Unsupported format: ${String(body.format)}` }, { status: 400 });
    }
    const csv = await downloadExport({
      fields: Array.isArray(body.fields) ? body.fields.map(String) : [],
      yearStart: body.yearStart ? Number(body.yearStart) : null,
      yearEnd: body.yearEnd ? Number(body.yearEnd) : null,
      parties: Array.isArray(body.parties) && body.parties.length > 0 ? body.parties.map(String) : null,
    });
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": 'attachment; filename="research_export.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error && (err.message.startsWith("Unsupported") || err.message.startsWith("Select"))
      ? err.message
      : "Database unavailable";
    return Response.json({ error: message }, { status: message === "Database unavailable" ? 503 : 400 });
  }
}
