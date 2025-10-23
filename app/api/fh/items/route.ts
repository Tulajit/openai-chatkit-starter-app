export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function GET() {
  const shortname = process.env.FH_SHORTNAME;
  const appKey = process.env.FH_APP_KEY;
  const userKey = process.env.FH_USER_KEY;

  if (!shortname || !appKey || !userKey) {
    return NextResponse.json(
      { error: "Missing FareHarbor environment variables" },
      { status: 500 }
    );
  }

  try {
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
      const body = await res.text();
      return NextResponse.json(
        { error: "FareHarbor API request failed", status: res.status, body },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
