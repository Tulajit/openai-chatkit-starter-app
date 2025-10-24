export const runtime = "edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, arguments: args } = await req.json();
    
    // Get the base URL for internal API calls
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    if (name === "get_items") {
      const r = await fetch(`${baseUrl}/api/fh/items`, { 
        cache: "no-store",
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!r.ok) {
        const errorText = await r.text();
        throw new Error(`get_items failed: ${r.status} - ${errorText}`);
      }
      
      return NextResponse.json(await r.json());
    }

    if (name === "get_availability") {
      const { item_id, date } = args || {};
      
      if (!item_id || !date) {
        return NextResponse.json(
          { error: "Missing required parameters: item_id and date" },
          { status: 400 }
        );
      }

      const url = `${baseUrl}/api/fh/availability?item=${encodeURIComponent(item_id)}&date=${encodeURIComponent(date)}`;
      const r = await fetch(url, { 
        cache: "no-store",
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!r.ok) {
        const errorText = await r.text();
        throw new Error(`get_availability failed: ${r.status} - ${errorText}`);
      }
      
      return NextResponse.json(await r.json());
    }

    if (name === "get_booking_link") {
      const { item_id, date } = args || {};
      
      if (!item_id) {
        return NextResponse.json(
          { error: "Missing required parameter: item_id" },
          { status: 400 }
        );
      }

      const shortname = process.env.FAREHARBOR_SHORTNAME || "triton-charters";
      
      // Build proper FareHarbor booking URL with optional date
      let bookingUrl = `https://fareharbor.com/embeds/book/${shortname}/items/${encodeURIComponent(item_id)}/calendar/`;
      
      if (date) {
        // Format: 2025-12-15 -> /calendar/2025/12/?date=2025-12-15
        const [year, month] = date.split('-');
        bookingUrl = `https://fareharbor.com/embeds/book/${shortname}/items/${encodeURIComponent(item_id)}/calendar/${year}/${month}/?date=${date}`;
      }
      
      return NextResponse.json({ url: bookingUrl });
    }

    return NextResponse.json(
      { error: `Unknown tool: ${name}` },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error("Tools API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
