export const runtime = 'nodejs';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Only include "On" status public tours for Triton Charters
    const items = [
      { id: 257108, name: "Ticketed Harbor Cruise", url: "https://fareharbor.com/triton-charters/items/257108/" },
      { id: 613759, name: "Sunset Cruise in San Diego Bay!", url: "https://fareharbor.com/triton-charters/items/613759/" },
      { id: 656686, name: "Two Hour Private Charter", url: "https://fareharbor.com/triton-charters/items/656686/" },
      { id: 658230, name: "Three Hour Private Charter", url: "https://fareharbor.com/triton-charters/items/658230/" },
      { id: 658231, name: "Four Hour Private Charter", url: "https://fareharbor.com/triton-charters/items/658231/" },
      { id: 662847, name: "Five Hour Private Charter", url: "https://fareharbor.com/triton-charters/items/662847/" },
      { id: 665608, name: "Six Hour Private Charter", url: "https://fareharbor.com/triton-charters/items/665608/" },
      { id: 467066, name: "Aquata Charters | Luxury and Speed!", url: "https://fareharbor.com/triton-charters/items/467066/" },
      { id: 296555, name: "Fourth of July Firework Sailabration", url: "https://fareharbor.com/triton-charters/items/296555/" },
      { id: 297942, name: "Mother's Day Brunch on San Diego's Largest Catamaran! 🌸", url: "https://fareharbor.com/triton-charters/items/297942/" },
      { id: 320731, name: "Yo Ho, Yo Ho! Triton’s Halloween Party For Me! 🎃", url: "https://fareharbor.com/triton-charters/items/320731/" },
      { id: 320733, name: "San Diego Bay Parade of Lights on Triton Charters 🎄", url: "https://fareharbor.com/triton-charters/items/320733/" },
      { id: 353912, name: "Valentine's Day Sunset Charter ❤️", url: "https://fareharbor.com/triton-charters/items/353912/" },
      { id: 371891, name: "Easter Sunday Brunch Cruise 🐣", url: "https://fareharbor.com/triton-charters/items/371891/" },
      { id: 373834, name: "Father's Day Brunch Cruise 💙", url: "https://fareharbor.com/triton-charters/items/373834/" },
      { id: 324336, name: "Splash and Sail!", url: "https://fareharbor.com/triton-charters/items/324336/" },
      { id: 478471, name: "Shelter Island's Annual Summer at the Docks! ☀️⛵🍹", url: "https://fareharbor.com/triton-charters/items/478471/" },
      { id: 604734, name: "Triton's Love Boat Sunset Charter 💕", url: "https://fareharbor.com/triton-charters/items/604734/" }
    ];

    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("Items route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
