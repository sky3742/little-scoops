import { NextResponse } from "next/server";
import { db } from "@/db";
import { babysitterDays } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db().select().from(babysitterDays).orderBy(desc(babysitterDays.date));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching babysitter days:", error);
    return NextResponse.json({ error: "Failed to fetch babysitter days" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    const result = await db().insert(babysitterDays).values({ date }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error adding babysitter day:", error);
    return NextResponse.json({ error: "Failed to add babysitter day" }, { status: 500 });
  }
}
