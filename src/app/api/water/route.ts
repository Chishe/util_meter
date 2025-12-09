import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type YearlyItem = {
  year: number;
  [key: string]: number;
};

type MonthlyItem = {
  month: string;
  [key: string]: number | string;
};

type DailyItem = {
  day: string;
  [key: string]: number | string;
};

type WaterRow = {
  remark_code: string;
  period: number;
  sum_diff_m3: number;
};

const metersMap: Record<string, string> = {
  water_in: "water_in",
  water_out: "water_out",
  reused_treated_water: "water_reused"
};

function initResult(keys: string[], periods: number[]) {
  const result: Record<number, Record<string, number>> = {};
  periods.forEach(p => {
    result[p] = {};
    keys.forEach(key => {
      result[p][key] = 0;
    });
    result[p]["waterOutPlusReused"] = 0; // เพิ่มฟิลด์รวม
  });
  return result;
}

function fillData(result: Record<number, Record<string, number>>, data: WaterRow[]) {
  data.forEach(row => {
    const period = Number(row.period);
    const key = metersMap[row.remark_code] || row.remark_code;
    if (!result[period]) result[period] = {};
    result[period][key] = Number(row.sum_diff_m3?.toFixed(2) || 0);
    // คำนวณ waterOutPlusReused ทุกครั้งที่ update
    result[period]["waterOutPlusReused"] = 
      (result[period]["water_out"] || 0) + (result[period]["water_reused"] || 0);
  });
  return result;
}

function formatResult(
  result: Record<number, Record<string, number>>,
  type: "yearly" | "monthly" | "daily",
  year?: number,
  month?: number
): Array<YearlyItem | MonthlyItem | DailyItem> {
  if (type === "yearly") {
    const data: YearlyItem[] = Object.entries(result).map(([period, values]) => ({
      year: Number(period),
      ...values
    }));
    return data.sort((a, b) => a.year - b.year);
  }

  if (type === "monthly") {
    const data: MonthlyItem[] = Object.entries(result).map(([period, values]) => {
      const p = Number(period);
      const date = new Date(year!, p, 0); // last day of month
      return { month: date.toISOString(), ...values };
    });
    return data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }

  if (type === "daily") {
    const data: DailyItem[] = Object.entries(result).map(([period, values]) => {
      const p = Number(period);
      const date = new Date(year!, month! - 1, p);
      return { day: date.toISOString(), ...values };
    });
    return data.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  }

  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "yearly";
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  if (!yearParam || (type === "daily" && !monthParam)) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }

  const year = Number(yearParam);
  const month = monthParam ? Number(monthParam) : undefined;

  try {
    if (type === "yearly") {
      const prevYear = year - 1;
      const dataRaw = await prisma.$queryRaw<WaterRow[]>`
        SELECT
          remark_code,
          EXTRACT(YEAR FROM datetime)::int AS period,
          SUM(diff_m3) AS sum_diff_m3
        FROM water_log_10min
        WHERE EXTRACT(YEAR FROM datetime) IN (${prevYear}, ${year})
        GROUP BY remark_code, period
        ORDER BY period, remark_code;
      `;
      const result = fillData(initResult(Object.values(metersMap), [prevYear, year]), dataRaw);
      return NextResponse.json(formatResult(result, "yearly"));
    }

    if (type === "monthly") {
      const dataRaw = await prisma.$queryRaw<WaterRow[]>`
        SELECT
          remark_code,
          EXTRACT(MONTH FROM datetime)::int AS period,
          SUM(diff_m3) AS sum_diff_m3
        FROM water_log_10min
        WHERE EXTRACT(YEAR FROM datetime) = ${year}
        GROUP BY remark_code, period
        ORDER BY period, remark_code;
      `;
      const result = fillData(
        initResult(Object.values(metersMap), Array.from({ length: 12 }, (_, i) => i + 1)),
        dataRaw
      );
      return NextResponse.json(formatResult(result, "monthly", year));
    }

    if (type === "daily") {
      const dataRaw = await prisma.$queryRaw<WaterRow[]>`
        SELECT
          remark_code,
          EXTRACT(DAY FROM datetime)::int AS period,
          SUM(diff_m3) AS sum_diff_m3
        FROM water_log_10min
        WHERE EXTRACT(YEAR FROM datetime) = ${year}
          AND EXTRACT(MONTH FROM datetime) = ${month}
        GROUP BY remark_code, period
        ORDER BY period, remark_code;
      `;
      const daysWithData = [...new Set(dataRaw.map(d => Number(d.period)))];
      const result = fillData(initResult(Object.values(metersMap), daysWithData), dataRaw);
      return NextResponse.json(formatResult(result, "daily", year, month));
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
