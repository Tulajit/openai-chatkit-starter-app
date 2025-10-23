export const runtime = 'nodejs';
import { NextResponse } from "next/server";

/**
 * Fetches FareHarbor availability for the next 90 days for a given item ID.
 * Example: /api/fh/availability?item=52773
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("item");

  if (!itemId) {
    return NextResponse.json({ error: "Missing ?item parameter" }, { status: 400 });
  }

  const shortname = process.env.FH_SHORTNAME!;
  const appKey = process.env.FH_APP_KEY!;
  const userKey = process.env.FH_USER_KEY!;
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 90); // 90 days from today

  try {
    const url = `https://fareharbor.com/api/external/v1/companies/${shortname}/items/${itemId}/availability/?start_date=${today.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`;

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
      return NextResponse.json({ error: "FareHarbor availability request failed", status: res.status, body: text }, { status: res.status });
    }

    const data: unknown = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("FH availability route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

