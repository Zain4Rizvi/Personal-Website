import fs from "fs";
import path from "path";
import pg from "pg";

const ENV_KEYS = ["SUPABASE_DB_URL", "SUPABASE_URL", "SUPABASE_ANON_KEY"] as const;
const ALLOWED_DOMAINS = ["utoronto.ca", "mail.utoronto.ca", "gmail.com"];

type PoolGlobal = typeof globalThis & { politicalDonationsPool?: pg.Pool };

function ensureDonationsEnv() {
  if (ENV_KEYS.every((key) => process.env[key])) return;
  const envPath = path.join(process.cwd(), "Canadian Political Donations Platform", "backend", ".env");
  let text: string;
  try {
    text = fs.readFileSync(envPath, "utf8");
  } catch {
    return;
  }
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!ENV_KEYS.includes(key as (typeof ENV_KEYS)[number]) || process.env[key]) continue;
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function pool() {
  ensureDonationsEnv();
  if (!process.env.SUPABASE_DB_URL) throw new Error("database not configured");
  const g = globalThis as PoolGlobal;
  if (!g.politicalDonationsPool) {
    g.politicalDonationsPool = new pg.Pool({
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
      query_timeout: 20000,
      max: 3,
    });
  }
  return g.politicalDonationsPool;
}

export async function getRegionYearPartyTotals() {
  const sql = `
    SELECT p.code AS region,
           d.fiscal_year AS year,
           pp.name AS party,
           ROUND(SUM(d.monetary_amount), 2)::float8 AS total
    FROM public.donations d
    JOIN public.provinces p ON p.id = d.province_id
    JOIN public.political_parties pp ON pp.id = d.political_party_id
    GROUP BY p.code, d.fiscal_year, pp.name
    ORDER BY p.code, d.fiscal_year, pp.name
  `;
  const result = await pool().query(sql);
  return result.rows as { region: string; year: number; party: string; total: number }[];
}

const SORT_COLUMNS: Record<string, string> = {
  donor: "d.donor_full_name",
  amount: "d.monetary_amount",
  date: "d.date_received",
};

function blank(value: unknown) {
  return value === undefined || value === null || value === "";
}

function yearParam(value: unknown) {
  return blank(value) || Number.isNaN(Number(value)) ? null : Number(value);
}

export async function getIndividualRecords(args: Record<string, string | undefined>) {
  let fromRaw = args.yearFrom;
  let toRaw = args.yearTo;
  if (blank(args.yearFrom) && blank(args.yearTo) && !blank(args.year)) {
    fromRaw = args.year;
    toRaw = args.year;
  }
  const party = blank(args.party) ? null : String(args.party).trim();
  const donorTrimmed = blank(args.donor) ? null : String(args.donor).trim();
  const donor = donorTrimmed === null ? null : donorTrimmed.replace(/[\\%_]/g, "\\$&");
  const pageNum = args.page ? Number(args.page) : 1;
  const sizeNum = Math.min(args.pageSize ? Number(args.pageSize) : 50, 200);
  const sortColumn = args.sortBy && SORT_COLUMNS[args.sortBy] ? SORT_COLUMNS[args.sortBy] : null;
  const sortDirection = String(args.sortDir).toLowerCase() === "asc" ? "ASC" : "DESC";
  const orderBy = sortColumn
    ? `ORDER BY ${sortColumn} ${sortDirection}, d.id`
    : "ORDER BY d.fiscal_year DESC, d.id";
  const sql = `
    SELECT d.id AS id,
           d.donor_full_name AS donor,
           d.monetary_amount::float8 AS amount,
           d.date_received AS date,
           d.fiscal_year AS "fiscalYear",
           d.postal_code AS postal_code,
           d.city AS city,
           p.code AS province,
           pp.name AS party
    FROM public.donations d
    LEFT JOIN public.provinces p ON p.id = d.province_id
    LEFT JOIN public.political_parties pp ON pp.id = d.political_party_id
    WHERE (($1::int IS NULL OR d.fiscal_year >= $1)
       AND ($2::int IS NULL OR d.fiscal_year <= $2))
      AND ($3::text IS NULL OR d.political_party_id =
             (SELECT id FROM public.political_parties WHERE name = $3))
      AND ($4::text IS NULL OR d.donor_full_name ILIKE '%' || $4 || '%')
    ${orderBy}
    LIMIT $5 OFFSET $6
  `;
  const result = await pool().query(sql, [
    yearParam(fromRaw),
    yearParam(toRaw),
    party,
    donor,
    sizeNum,
    (pageNum - 1) * sizeNum,
  ]);
  return { page: pageNum, pageSize: sizeNum, records: result.rows };
}

const FIELD_COLUMN_MAP: Record<string, string> = {
  donor: "d.donor_full_name AS donor",
  amount: "d.monetary_amount AS amount",
  date: "to_char(d.date_received, 'YYYY-MM-DD') AS date",
  postal_code: "d.postal_code AS postal_code",
  recipient: "d.recipient_full_name AS recipient",
  region: "pr.code AS region",
};

export function buildExportQuery(input: { fields: string[]; yearStart?: number | null; yearEnd?: number | null; parties?: string[] | null }) {
  const invalid = input.fields.filter((field) => !FIELD_COLUMN_MAP[field]);
  if (input.fields.length === 0 || invalid.length > 0) {
    throw new Error(invalid.length ? `Unsupported field(s): ${invalid.join(", ")}` : "Select at least one field for export.");
  }
  const params: unknown[] = [];
  const clauses: string[] = [];
  if (input.yearStart) {
    params.push(input.yearStart);
    clauses.push(`d.fiscal_year >= $${params.length}`);
  }
  if (input.yearEnd) {
    params.push(input.yearEnd);
    clauses.push(`d.fiscal_year <= $${params.length}`);
  }
  if (input.parties && input.parties.length > 0) {
    params.push(input.parties);
    clauses.push(`pp.name = ANY($${params.length}::text[])`);
  }
  const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const from = `
    FROM donations d
    LEFT JOIN provinces pr ON pr.id = d.province_id
    LEFT JOIN political_parties pp ON pp.id = d.political_party_id
  `;
  const selectList = input.fields.map((field) => FIELD_COLUMN_MAP[field]).join(", ");
  return {
    selectSql: `SELECT ${selectList} ${from} ${whereSql} ORDER BY d.date_received DESC`,
    countSql: `SELECT COUNT(*)::int AS total ${from} ${whereSql}`,
    params,
  };
}

export async function previewExport(input: { fields: string[]; yearStart?: number | null; yearEnd?: number | null; parties?: string[] | null }) {
  const { selectSql, countSql, params } = buildExportQuery(input);
  const [sample, count] = await Promise.all([
    pool().query(`${selectSql} LIMIT 20`, params),
    pool().query(countSql, params),
  ]);
  return { schema: input.fields, sample: sample.rows, totalRecords: count.rows[0].total as number };
}

function csvCell(value: unknown) {
  return `"${value == null ? "" : String(value).replace(/"/g, '""')}"`;
}

export async function downloadExport(input: { fields: string[]; yearStart?: number | null; yearEnd?: number | null; parties?: string[] | null }) {
  const { selectSql, params } = buildExportQuery(input);
  // ponytail: cap at 5000 rows so a public download cannot pull the whole donations table. Drop the LIMIT if a signed-in researcher needs the full extract.
  const result = await pool().query(`${selectSql} LIMIT 5000`, params);
  const header = input.fields.map(csvCell).join(",");
  const lines = result.rows.map((row) => input.fields.map((field) => csvCell(row[field])).join(","));
  return [header, ...lines].join("\r\n");
}

function allowedEmail(email: string) {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase();
  return ALLOWED_DOMAINS.includes(domain) || domain.endsWith(".utoronto.ca");
}

export async function requireResearcher(request: Request) {
  ensureDonationsEnv();
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return Response.json({ error: "Sign-in required" }, { status: 401 });
  }
  try {
    const res = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: process.env.SUPABASE_ANON_KEY },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return Response.json({ error: "Sign-in required" }, { status: 401 });
    const user = (await res.json()) as { id?: string; email?: string };
    if (!user.id || !user.email) return Response.json({ error: "Sign-in required" }, { status: 401 });
    if (!allowedEmail(user.email)) {
      return Response.json({ error: "Researcher access requires a university-affiliated account" }, { status: 403 });
    }
    return { id: user.id, email: user.email };
  } catch {
    return Response.json({ error: "Sign-in required" }, { status: 401 });
  }
}

export function isUser(value: { id: string; email: string } | Response): value is { id: string; email: string } {
  return !(value instanceof Response);
}
