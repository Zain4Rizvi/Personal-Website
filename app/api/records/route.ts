import { getIndividualRecords, isUser, requireResearcher } from "@/lib/politicalDonations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SORT_KEYS = ["donor", "amount", "date"];

function positiveInt(value: string | null) {
  if (value === null) return true;
  const n = Number(value);
  return Number.isInteger(n) && n >= 1;
}

export async function GET(request: Request) {
  const user = await requireResearcher(request);
  if (!isUser(user)) return user;

  const query = new URL(request.url).searchParams;
  const page = query.get("page");
  const pageSize = query.get("pageSize");
  const sortBy = query.get("sortBy");
  const sortDir = query.get("sortDir");
  const yearFrom = query.get("yearFrom");
  const yearTo = query.get("yearTo");

  if (!positiveInt(page)) return Response.json({ error: "page must be a positive integer" }, { status: 400 });
  if (!positiveInt(pageSize)) return Response.json({ error: "pageSize must be a positive integer" }, { status: 400 });
  if (sortBy && !SORT_KEYS.includes(sortBy)) {
    return Response.json({ error: `sortBy must be one of: ${SORT_KEYS.join(", ")}` }, { status: 400 });
  }
  if (sortDir && sortDir !== "asc" && sortDir !== "desc") {
    return Response.json({ error: "sortDir must be 'asc' or 'desc'" }, { status: 400 });
  }
  if (yearFrom && yearTo && Number(yearFrom) > Number(yearTo)) {
    return Response.json({ error: "yearFrom must be less than or equal to yearTo" }, { status: 400 });
  }

  try {
    const result = await getIndividualRecords({
      year: query.get("year") ?? undefined,
      yearFrom: yearFrom ?? undefined,
      yearTo: yearTo ?? undefined,
      party: query.get("party") ?? undefined,
      donor: query.get("donor") ?? undefined,
      page: page ?? undefined,
      pageSize: pageSize ?? undefined,
      sortBy: sortBy ?? undefined,
      sortDir: sortDir ?? undefined,
    });
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }
}
