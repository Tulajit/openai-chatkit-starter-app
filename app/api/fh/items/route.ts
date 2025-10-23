export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shortname = process.env.FH_SHORTNAME!;
    const res = await fetch(
      `https://fareharbor.com/api/external/v1/companies/${shortname}/items/`,
      {
        headers: {
          "X-FareHarbor-API-App": process.env.FH_APP_KEY!,
          "X-FareHarbor-API-User": process.env.FH_USER_KEY!,
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "FH items error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("FH items route error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

