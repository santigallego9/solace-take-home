import { NextResponse } from "next/server";
import db from "@db";
import { advocates } from "@db/schema";
import { specialties } from "@db/seed/specialties";

export async function GET() {
  try {
    // Get unique cities from the database
    const citiesResult = await db
      .selectDistinct({ city: advocates.city })
      .from(advocates);
    const cities = citiesResult.map((row) => row.city);

    // Get unique degrees from the database
    const degreesResult = await db
      .selectDistinct({ degree: advocates.degree })
      .from(advocates);
    const degrees = degreesResult.map((row) => row.degree);

    return NextResponse.json({
      success: true,
      data: {
        cities,
        degrees,
        specialties,
      },
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
