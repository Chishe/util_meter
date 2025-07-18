import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");

  if (!tag) return NextResponse.json({ error: "Tag is required" }, { status: 400 });

  const data = await prisma.valueThreshold.findFirst({ where: { tag } });
  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { id, max, min, colorMax, colorMin, tag } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required for update" }, { status: 400 });
    }

    const updated = await prisma.valueThreshold.update({
      where: { id },
      data: {
        max,
        min,
        colorMax,
        colorMin,
        tag,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
