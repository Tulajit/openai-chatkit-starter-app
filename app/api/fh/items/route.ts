export const runtime = 'nodejs';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Only include tours you want your chatbot to talk about
    const items = [
      {
        id: 52773,
        name: "Sunset Cruise",
        description: "A 2.5-hour evening cruise around San Diego Bay aboard the Triton Catamaran, featuring cocktails, music, and stunning skyline views.",
        duration: "2.5 hours",
        url: "https://fareharbor.com/triton-charters/items/52773/"
      },
      {
        id: 52770,
        name: "Private Charter",
        description: "A private yacht charter aboard the Triton Catamaran for birthdays, bachelorette parties, and corporate events. Fully customizable.",
        duration: "Flexible",
        url: "https://fareharbor.com/triton-charters/items/52770/"
      }
    ];

    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("Items route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
