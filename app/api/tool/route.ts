export const runtime = "edge";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, arguments: args } = await req.json();

    if (name === "get_items") {
      const r = await fetch(
        "https://openai-chatkit-starter-app-ezgk.vercel.app/api/fh/items",
        { cache: "no-store" }
      );
      if (!r.ok) throw new Error(`get_items failed: ${r.status}`);
      return NextResponse.json(await r.json());
    }

    if (name === "get_availability") {
      const { item_id, date } = args || {};
      if (!item_id || !date) {
        return NextResponse.json(
          { error: "Missing item_id or date" },
          { status: 400 }
        );
      }
      const url = `https://openai-chatkit-starter-app-ezgk.vercel.app/api/fh/availability?item=${encodeURIComponent(
        item_id
      )}&date=${encodeURIComponent(date)}`;
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(`get_availability failed: ${r.status}`);
      return NextResponse.json(await r.json());
    }

    if (name === "get_booking_link") {
      const { item_id } = args || {};
      if (!item_id) {
        return NextResponse.json({ error: "Missing item_id" }, { status: 400 });
      }
      return NextResponse.json({
        url: `https://fareharbor.com/triton-charters/items/${encodeURIComponent(
          item_id
        )}/`
      });
    }

    return NextResponse.json({ error: `Unknown tool: ${name}` }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
