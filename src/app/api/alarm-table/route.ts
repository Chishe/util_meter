import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/alarm-table  ดึงข้อมูลทั้งหมด
export async function GET() {
  try {
    const alarms = await prisma.alarmLog.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(alarms);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch alarm logs" },
      { status: 500 }
    );
  }
}

// PUT /api/alarm-table  อัพเดตสถานะตาม location + event
export async function PUT(req: NextRequest) {
  try {
    const { location, event, status } = await req.json();

    if (!location || !event || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updated = await prisma.alarmLog.updateMany({
      where: { location, event },
      data: { status },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Update alarm_log error:", error);
    return NextResponse.json(
      { error: "Failed to update log" },
      { status: 500 }
    );
  }
}

// DELETE /api/alarm-table?id=123 ลบข้อมูลตาม id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const deleted = await prisma.alarmLog.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Deleted", deleted });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete alarm log" },
      { status: 500 }
    );
  }
}
