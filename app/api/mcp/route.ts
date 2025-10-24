export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // MCP format: { method: "tools/call", params: { name: "...", arguments: {...} } }
    const method = body.method;
    const params = body.params || {};
    
    if (method === "tools/list") {
      // Return available tools
      return NextResponse.json({
        tools: [
          {
            name: "get_items",
            description: "Lists all available yacht charters",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "get_availability",
            description: "Checks availability for a specific date",
            inputSchema: {
              type: "object",
              properties: {
                item_id: { type: "string", description: "FareHarbor item ID" },
                date: { type: "string", description: "Date in YYYY-MM-DD format" }
              },
              required: ["item_id", "date"]
            }
          },
          {
            name: "get_booking_link",
            description: "Generates a booking URL",
            inputSchema: {
              type: "object",
              properties: {
                item_id: { type: "string", description: "FareHarbor item ID" },
                date: { type: "string", description: "Optional date" }
              },
              required: ["item_id"]
            }
          }
        ]
      });
    }
    
    if (method === "tools/call") {
      // Execute the tool by calling your existing /api/tool endpoint
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = req.headers.get('host') || 'localhost:3000';
      const baseUrl = `${protocol}://${host}`;
      
      const response = await fetch(`${baseUrl}/api/tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: params.name,
          arguments: params.arguments
        })
      });
      
      const result = await response.json();
      
      return NextResponse.json({
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ]
      });
    }
    
    return NextResponse.json({ error: "Unknown method" }, { status: 400 });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    console.error("MCP route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

