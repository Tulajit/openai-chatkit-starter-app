export const runtime = 'nodejs';
import { NextResponse } from "next/server";

/**
 * Fetches FareHarbor availability for a specific date and item.
 * Example: /api/fh/availability?item=52773&date=2025-10-26
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("item");
  const date = searchParams.get("date"); // YYYY-MM-DD format

  if (!itemId || !date) {
    return NextResponse.json(
      { error: "Missing required parameters. Use ?item=ITEM_ID&date=YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const shortname = process.env.FH_SHORTNAME!;
  const appKey = process.env.FH_APP_KEY!;
  const userKey = process.env.FH_USER_KEY!;

  try {
    const url = `https://fareharbor.com/api/external/v1/companies/${shortname}/items/${itemId}/availability/${date}/`;

    const res = await fetch(url, {
      headers: {
        "X-FareHarbor-API-App": appKey,
        "X-FareHarbor-API-User": userKey,
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "FareHarbor API request failed", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("FH availability route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
