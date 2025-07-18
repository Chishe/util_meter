import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { location, event, status } = await req.json();

  if (!location || !event || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const result = await prisma.alarmLog.create({
      data: {
        location,
        event,
        status,
        created_at: new Date(),
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Insert alarm_log error:", error);
    return NextResponse.json({ error: "Failed to insert log" }, { status: 500 });
  }
}
