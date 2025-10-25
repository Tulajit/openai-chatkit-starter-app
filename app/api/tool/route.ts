export const runtime = "edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PIPEDREAM_URL = "https://eowv0t158mirlw7.m.pipedream.net";

interface PipedreamSlot {
  start_time: string;
  end_time: string;
  seats_open: number;
  online_booking_status: string;
}

interface PipedreamResponse {
  results?: PipedreamSlot[];
}

export async function POST(req: NextRequest) {
  try {
    const { name, arguments: args } = await req.json();
    
    if (name === "get_items") {
      // Return hardcoded list of items
      const items = [
        { id: 257108, name: "Ticketed Harbor Cruise" },
        { id: 613759, name: "Sunset Cruise in San Diego Bay" },
        { id: 656686, name: "Two Hour Private Charter" },
        { id: 658230, name: "Three Hour Private Charter" },
        { id: 658231, name: "Four Hour Private Charter" },
        { id: 662847, name: "Five Hour Private Charter" },
        { id: 665608, name: "Six Hour Private Charter" }
      ];
      
      return NextResponse.json({ items });
    }

    if (name === "get_availability") {
      const { item_id, date } = args || {};
      
      if (!item_id || !date) {
        return NextResponse.json(
          { error: "Missing item_id or date" },
          { status: 400 }
        );
      }

      // Call Pipedream with proper format
      const response = await fetch(PIPEDREAM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_pk: item_id,
          start: date,
          end: date,
          tz: "America/Los_Angeles"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pipedream error: ${errorText}`);
      }

      const data = await response.json() as PipedreamResponse;
      
      // Simplify response for the agent
      const slots = (data.results || [])
        .filter((slot) => slot.seats_open > 0)
        .map((slot) => ({
          time: `${slot.start_time} - ${slot.end_time}`,
          seats_available: slot.seats_open,
          status: slot.online_booking_status
        }));

      if (slots.length === 0) {
        return NextResponse.json({
          available: false,
          message: `No availability found on ${date}`
        });
      }

      return NextResponse.json({
        available: true,
        date: date,
        slots: slots
      });
    }

    if (name === "get_booking_link") {
      const { item_id, date } = args || {};
      
      if (!item_id) {
        return NextResponse.json(
          { error: "Missing item_id" },
          { status: 400 }
        );
      }

      const shortname = "triton-charters";
      let bookingUrl = `https://fareharbor.com/embeds/book/${shortname}/items/${item_id}/calendar/`;
      
      if (date) {
        const [year, month] = date.split('-');
        bookingUrl = `https://fareharbor.com/embeds/book/${shortname}/items/${item_id}/calendar/${year}/${month}/?date=${date}`;
      }
      
      return NextResponse.json({ url: bookingUrl });
    }

    return NextResponse.json(
      { error: `Unknown tool: ${name}` },
      { status: 400 }
    );
    
  } catch (error: unknown) {
    console.error("Tools API Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
