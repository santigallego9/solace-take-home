import db from "@db";
import { advocates } from "@db/schema";
import {
  sql,
  and,
  between,
  desc,
  asc,
  eq,
  or,
  arrayOverlaps,
  count,
} from "drizzle-orm";
import { SearchParams } from "@custom-types/search";

const sortKeyToColumn = {
  firstName: advocates.firstName,
  lastName: advocates.lastName,
  city: advocates.city,
  degree: advocates.degree,
  yearsOfExperience: advocates.yearsOfExperience,
} as const;

const computeWhereClause = (body: SearchParams) => {
  const conditions = [];
  if (body.search) {
    conditions.push(
      sql`
        to_tsvector('english', concat_ws(' ',
          ${advocates.firstName},
          ${advocates.lastName},
          ${advocates.city},
          ${advocates.degree},
          array_to_string(${advocates.specialties}, ' ')
        )) @@ plainto_tsquery('english', ${body.search})
      `
    );
  }

  if (body.cities?.length) {
    if (body.cities.length === 1) {
      conditions.push(eq(advocates.city, body.cities[0]));
    } else {
      const cityConditions = body.cities.map((city) =>
        eq(advocates.city, city)
      );
      conditions.push(or(...cityConditions));
    }
  }

  if (body.degrees?.length) {
    if (body.degrees.length === 1) {
      conditions.push(eq(advocates.degree, body.degrees[0]));
    } else {
      const degreeConditions = body.degrees.map((degree) =>
        eq(advocates.degree, degree)
      );
      conditions.push(or(...degreeConditions));
    }
  }

  if (body.specialties?.length) {
    conditions.push(arrayOverlaps(advocates.specialties, body.specialties));
  }

  if (body.experience) {
    conditions.push(
      between(
        advocates.yearsOfExperience,
        body.experience.min,
        body.experience.max
      )
    );
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
};

const computeSortClause = (body: SearchParams) => {
  if (!body.sortConfig) {
    return asc(advocates.id);
  }

  const sortKey = body.sortConfig?.key;
  const sortDirection = body.sortConfig?.direction;

  if (!sortKeyToColumn[sortKey as keyof typeof sortKeyToColumn]) {
    return asc(advocates.id);
  }

  return sortDirection === "desc"
    ? desc(sortKeyToColumn[sortKey as keyof typeof sortKeyToColumn])
    : asc(sortKeyToColumn[sortKey as keyof typeof sortKeyToColumn]);
};

export async function POST(request: Request) {
  try {
    let body: SearchParams;
    try {
      body = await request.json();
    } catch (error) {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const page = body.page ? body.page : 1;
    if (isNaN(page) || page < 1) {
      return Response.json(
        { error: "Invalid page parameter. Must be a positive integer." },
        { status: 400 }
      );
    }

    const limit = body.limit ? body.limit : 10;
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return Response.json(
        { error: "Invalid limit parameter. Must be between 1 and 100." },
        { status: 400 }
      );
    }

    if (
      body.experience &&
      (typeof body.experience.min !== "number" ||
        typeof body.experience.max !== "number" ||
        body.experience.min < 0 ||
        body.experience.max < body.experience.min)
    ) {
      return Response.json(
        { error: "Invalid experience range" },
        { status: 400 }
      );
    }

    if (body.sortConfig) {
      const sortKey = body.sortConfig?.key;
      const sortDirection = body.sortConfig?.direction;

      const validSortKeys = Object.keys(sortKeyToColumn);
      if (!!sortKey && !validSortKeys.includes(sortKey)) {
        return Response.json(
          { error: `Invalid sort key: ${sortKey}` },
          { status: 400 }
        );
      }

      if (!["asc", "desc"].includes(sortDirection)) {
        return Response.json(
          {
            error: `Invalid sort direction: ${sortDirection}. Must be 'asc' or 'desc'`,
          },
          { status: 400 }
        );
      }
    }

    const whereClause = computeWhereClause(body);
    const offset = (page - 1) * limit;
    const sortClause = computeSortClause(body);

    let query = db
      .select()
      .from(advocates)
      .where(whereClause)
      .limit(limit)
      .orderBy(sortClause)
      .offset(offset);

    const queryPromise = Promise.all([
      query,
      db.select({ count: count() }).from(advocates).where(whereClause),
    ]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database query timeout")), 10000)
    );

    const [data, countResult] = (await Promise.race([
      queryPromise,
      timeoutPromise,
    ])) as [(typeof advocates.$inferSelect)[], { count: number }[]];

    return Response.json({
      data,
      total: Number(countResult[0].count),
      page,
      limit,
    });
  } catch (error) {
    console.error("Search endpoint error:", error);

    if (error instanceof Error && error.message === "Database query timeout") {
      return Response.json({ error: "Request timed out" }, { status: 504 });
    }

    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
