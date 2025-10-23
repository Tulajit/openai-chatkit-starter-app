/* eslint-disable @typescript-eslint/no-explicit-any */

export const runtime = 'nodejs';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Hardcode only the items your chatbot should use
    const items = [
      {
        id: 52773,
        name: "Sunset Cruise",
        description: "A 2.5-hour evening cruise around San Diego Bay with live music and cocktails.",
        duration: "2.5 hours",
        url: "https://fareharbor.com/missionbaysportcenter/items/52773/"
      },
      {
        id: 52770,
        name: "Private Charter",
        description: "Book a private yacht charter for any occasion, up to 80 guests.",
        duration: "Flexible",
        url: "https://fareharbor.com/missionbaysportcenter/items/52770/"
      }
    ];

    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("Items route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
