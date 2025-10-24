export const runtime = 'nodejs';
import { NextResponse } from "next/server";

interface FareHarborCustomerType {
  singular: string;
  plural: string;
  note: string;
}

interface FareHarborCustomerTypeRate {
  total: number;
  customer_type: FareHarborCustomerType;
}

interface FareHarborAvailability {
  start_at: string;
  end_at: string;
  capacity: number;
  online_booking_status: string;
  customer_type_rates?: FareHarborCustomerTypeRate[];
}

interface FareHarborResponse {
  availabilities: FareHarborAvailability[];
  item?: {
    name?: string;
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("item");
  const date = searchParams.get("date");

  if (!itemId || !date) {
    return NextResponse.json(
      { error: "Missing required parameters. Use ?item=ITEM_ID&date=YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const shortname = process.env.FAREHARBOR_SHORTNAME || process.env.FH_SHORTNAME;
  const appKey = process.env.FAREHARBOR_APP_KEY || process.env.FH_APP_KEY;
  const userKey = process.env.FAREHARBOR_USER_KEY || process.env.FH_USER_KEY;

  if (!shortname || !appKey || !userKey) {
    return NextResponse.json(
      { error: "Missing FareHarbor credentials in environment variables" },
      { status: 500 }
    );
  }

  try {
    const url = `https://fareharbor.com/api/external/v1/companies/${shortname}/items/${itemId}/availabilities/date/${date}/`;
    
    const res = await fetch(url, {
      headers: {
        "X-FareHarbor-API-App": appKey,
        "X-FareHarbor-API-User": userKey,
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "FareHarbor API request failed", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json() as FareHarborResponse;
    
    // Simplify to just the essential info
    if (!data.availabilities || data.availabilities.length === 0) {
      return NextResponse.json({
        available: false,
        message: `No availability found for ${data.item?.name || 'this charter'} on ${date}`
      });
    }

    // Format times in readable format
    const availabilitySlots = data.availabilities.map((slot: FareHarborAvailability) => {
      const startTime = new Date(slot.start_at).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles'
      });
      const endTime = new Date(slot.end_at).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles'
      });
      
      const bookingStatus = slot.online_booking_status === 'available' ? 'Available' : 'Call to book';
      
      // Get pricing
      const adultRate = slot.customer_type_rates?.find((r: FareHarborCustomerTypeRate) => 
        r.customer_type.singular === 'Adult'
      );
      const price = adultRate ? `$${(adultRate.total / 100).toFixed(2)}` : 'Contact for pricing';
      
      return {
        time: `${startTime} - ${endTime}`,
        status: bookingStatus,
        capacity: slot.capacity,
        price: price
      };
    });

    return NextResponse.json({
      available: true,
      item_name: data.item?.name || 'Charter',
      date: date,
      slots: availabilitySlots
    }, { status: 200 });
    
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("FH availability route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
