import db from "@db";
import { advocates } from "@db/schema";
import { count } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam) : 1;
    if (isNaN(page) || page < 1) {
      return Response.json(
        { error: "Invalid page parameter. Must be a positive integer." },
        { status: 400 }
      );
    }

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 10;
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return Response.json(
        { error: "Invalid limit parameter. Must be between 1 and 100." },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      db.select().from(advocates).limit(limit).offset(offset),
      db.select({ count: count() }).from(advocates),
    ]);

    return Response.json({
      data,
      total: Number(countResult[0].count),
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching advocates:", error);

    return Response.json(
      { error: "An error occurred while fetching advocates." },
      { status: 500 }
    );
  }
}
