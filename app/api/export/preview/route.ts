import { isUser, previewExport, requireResearcher } from "@/lib/politicalDonations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function exportInput(body: {
  fields?: unknown;
  yearStart?: unknown;
  yearEnd?: unknown;
  parties?: unknown;
  format?: unknown;
}) {
  if (body.format && String(body.format).toLowerCase() !== "csv") {
    throw new Error(`Unsupported format: ${String(body.format)}`);
  }
  return {
    fields: Array.isArray(body.fields) ? body.fields.map(String) : [],
    yearStart: body.yearStart ? Number(body.yearStart) : null,
    yearEnd: body.yearEnd ? Number(body.yearEnd) : null,
    parties: Array.isArray(body.parties) && body.parties.length > 0 ? body.parties.map(String) : null,
  };
}

export async function POST(request: Request) {
  const user = await requireResearcher(request);
  if (!isUser(user)) return user;
  try {
    const result = await previewExport(exportInput(await request.json()));
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const text = err instanceof Error ? err.message : "";
    const clientError = text.startsWith("Unsupported") || text.startsWith("Select");
    return Response.json(
      { error: clientError ? text : "Database unavailable" },
      { status: clientError ? 400 : 503 },
    );
  }
}
