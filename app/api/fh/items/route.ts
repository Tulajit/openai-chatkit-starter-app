export const runtime = 'nodejs';

import { NextResponse } from "next/server";

/**
 * Fetches all FareHarbor items (tours/products) for the configured company.
 * Reads FH_SHORTNAME, FH_APP_KEY, FH_USER_KEY from environment variables.
 */
export async function GET() {
  try {
    const shortname = process.env.FH_SHORTNAME;
    const appKey = process.env.FH_APP_KEY;
    const userKey = process.env.FH_USER_KEY;

    if (!shortname || !appKey || !userKey) {
      return NextResponse.json(
        { error: "Missing FareHarbor environment variables" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://fareharbor.com/api/external/v1/companies/${shortname}/items/`,
      {
        headers: {
          "X-FareHarbor-API-App": appKey,
          "X-FareHarbor-API-User": userKey,
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "FareHarbor API request failed", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data: unknown = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    console.error("FH items route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
