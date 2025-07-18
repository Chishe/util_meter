import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ปรับ path ถ้าคุณเก็บไฟล์ prisma ต่างที่

export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get("tag");

  if (!tag) {
    return NextResponse.json(
      { error: "Missing tag parameter" },
      { status: 400 }
    );
  }

  try {
    const threshold = await prisma.valueThreshold.findFirst({
      where: { tag },
    });

    if (!threshold) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({
      min: threshold.min ?? 0,
      max: threshold.max,
      colorMin: threshold.colorMin ?? null,
      colorMax: threshold.colorMax,
    });
  } catch (error) {
    console.error("Threshold API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
