export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const method = body.method;
    const params = body.params || {};
    
    // Handle tools/list request
    if (method === "tools/list") {
      return NextResponse.json({
        tools: [
          {
            name: "get_items",
            description: "Lists all available yacht charters and experiences",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "get_availability",
            description: "Checks real-time availability for a specific charter on a given date",
            inputSchema: {
              type: "object",
              properties: {
                item_id: { 
                  type: "string", 
                  description: "FareHarbor item ID (e.g., 257108 for Harbor Cruise)" 
                },
                date: { 
                  type: "string", 
                  description: "Date in YYYY-MM-DD format (e.g., 2025-12-25)" 
                }
              },
              required: ["item_id", "date"]
            }
          },
          {
            name: "get_booking_link",
            description: "Generates a FareHarbor booking URL with optional pre-filled date",
            inputSchema: {
              type: "object",
              properties: {
                item_id: { 
                  type: "string", 
                  description: "FareHarbor item ID" 
                },
                date: { 
                  type: "string", 
                  description: "Optional date in YYYY-MM-DD format to pre-fill calendar" 
                }
              },
              required: ["item_id"]
            }
          }
        ]
      });
    }
    
    // Handle tools/call request
    if (method === "tools/call") {
      const toolName = params.name;
      const toolArgs = params.arguments || {};
      
      // Call your existing /api/tool endpoint
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = req.headers.get('host') || 'localhost:3000';
      const baseUrl = `${protocol}://${host}`;
      
      const response = await fetch(`${baseUrl}/api/tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: toolName,
          arguments: toolArgs
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tool execution failed: ${errorText}`);
      }
      
      const result = await response.json();
      
      return NextResponse.json({
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      });
    }
    
    return NextResponse.json(
      { error: `Unknown method: ${method}` }, 
      { status: 400 }
    );
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("MCP route error:", error);
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
}

// Support GET for testing/verification
export async function GET() {
  return NextResponse.json({
    message: "MCP server is running. Send POST requests with method: 'tools/list' or 'tools/call'",
    endpoints: [
      { method: "tools/list", description: "List available tools" },
      { method: "tools/call", description: "Execute a tool" }
    ]
  });
}
