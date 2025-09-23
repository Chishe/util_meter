import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type powerYearly = {
  year: number;
  wastewater_pump_building1: bigint | null;
  wastewater_pump_building2: bigint | null;
  treatment_pond: bigint | null;
  wastewater_pump_building2_plus_reused: bigint | null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "yearly";
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || (type === "daily" && !month)) {
    return NextResponse.json(
      { error: "Missing required query parameters" },
      { status: 400 }
    );
  }

  try {
    if (type === "yearly") {
      const targetYear = Number(year);
      const prevYear = targetYear - 1;

      const dataRaw = await prisma.$queryRaw<powerYearly[]>`
      WITH years AS (
        SELECT generate_series(${prevYear}, ${targetYear}) AS year
      ),
      daily_diff AS (
        SELECT
          DATE_TRUNC('day', p.recorded_at) AS day,
          SUM(p.wastewater_pump_building1) AS wastewater_pump_building1,
          SUM(p.wastewater_pump_building2) AS wastewater_pump_building2,
          SUM(p.treatment_pond) AS treatment_pond
        FROM power_meters p
        WHERE EXTRACT(YEAR FROM p.recorded_at) IN (${prevYear}, ${targetYear})
        GROUP BY DATE_TRUNC('day', p.recorded_at)
      ),
      daily_diff_calc AS (
        SELECT
          day,
          ROUND((
            CASE
              WHEN LEAD(wastewater_pump_building1) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(wastewater_pump_building1) OVER (ORDER BY day) < wastewater_pump_building1 THEN
                LEAD(wastewater_pump_building1) OVER (ORDER BY day) + wastewater_pump_building1
              ELSE
                LEAD(wastewater_pump_building1) OVER (ORDER BY day) - wastewater_pump_building1
            END
          )::numeric, 2) AS wastewater_pump_building1_diff,
          ROUND((
            CASE
              WHEN LEAD(wastewater_pump_building2) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(wastewater_pump_building2) OVER (ORDER BY day) < wastewater_pump_building2 THEN
                LEAD(wastewater_pump_building2) OVER (ORDER BY day) + wastewater_pump_building2
              ELSE
                LEAD(wastewater_pump_building2) OVER (ORDER BY day) - wastewater_pump_building2
            END
          )::numeric, 2) AS wastewater_pump_building2_diff,
          ROUND((
            CASE
              WHEN LEAD(treatment_pond) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(treatment_pond) OVER (ORDER BY day) < treatment_pond THEN
                LEAD(treatment_pond) OVER (ORDER BY day) + treatment_pond
              ELSE
                LEAD(treatment_pond) OVER (ORDER BY day) - treatment_pond
            END
          )::numeric, 2) AS treatment_pond_diff
        FROM daily_diff
      ),
      yearly_agg AS (
        SELECT
          EXTRACT(YEAR FROM day) AS year,
          SUM(wastewater_pump_building1_diff) AS wastewater_pump_building1,
          SUM(wastewater_pump_building2_diff) AS wastewater_pump_building2,
          SUM(treatment_pond_diff) AS treatment_pond
        FROM daily_diff_calc
        GROUP BY year
      )
      SELECT
        y.year,
        COALESCE(ya.wastewater_pump_building1, 0) AS wastewater_pump_building1,
        COALESCE(ya.wastewater_pump_building2, 0) AS wastewater_pump_building2,
        COALESCE(ya.treatment_pond, 0) AS treatment_pond
      FROM years y
      LEFT JOIN yearly_agg ya ON y.year = ya.year
      ORDER BY y.year;
      
      `;

      const safeData = dataRaw.map((row) => ({
        year: Number(row.year),
        wastewater_pump_building1:
          row.wastewater_pump_building1 !== null
            ? Number(Number(row.wastewater_pump_building1).toFixed(2))
            : 0,
        wastewater_pump_building2:
          row.wastewater_pump_building2 !== null
            ? Number(Number(row.wastewater_pump_building2).toFixed(2))
            : 0,
        treatment_pond:
          row.treatment_pond !== null
            ? Number(Number(row.treatment_pond).toFixed(2))
            : 0,
      }));

      return NextResponse.json(safeData);
    }
    if (type === "monthly") {
      const data = await prisma.$queryRaw`
      WITH months AS (
        SELECT generate_series(
          MAKE_DATE(CAST(${year} AS INTEGER), 1, 1),
          MAKE_DATE(CAST(${year} AS INTEGER), 12, 1),
          INTERVAL '1 month'
        ) AS month
      ),
      daily_diff AS (
        SELECT
          DATE_TRUNC('month', day) AS month,
          ROUND((
            CASE
              WHEN LEAD(wastewater_pump_building1) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(wastewater_pump_building1) OVER (ORDER BY day) < wastewater_pump_building1 THEN
                LEAD(wastewater_pump_building1) OVER (ORDER BY day) + wastewater_pump_building1
              ELSE
                LEAD(wastewater_pump_building1) OVER (ORDER BY day) - wastewater_pump_building1
            END
          )::numeric, 2) AS wastewater_pump_building1_diff,
      
          ROUND((
            CASE
              WHEN LEAD(wastewater_pump_building2) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(wastewater_pump_building2) OVER (ORDER BY day) < wastewater_pump_building2 THEN
                LEAD(wastewater_pump_building2) OVER (ORDER BY day) + wastewater_pump_building2
              ELSE
                LEAD(wastewater_pump_building2) OVER (ORDER BY day) - wastewater_pump_building2
            END
          )::numeric, 2) AS wastewater_pump_building2_diff,
      
          ROUND((
            CASE
              WHEN LEAD(treatment_pond) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(treatment_pond) OVER (ORDER BY day) < treatment_pond THEN
                LEAD(treatment_pond) OVER (ORDER BY day) + treatment_pond
              ELSE
                LEAD(treatment_pond) OVER (ORDER BY day) - treatment_pond
            END
          )::numeric, 2) AS treatment_pond_diff
        FROM (
          SELECT
            DATE_TRUNC('day', p.recorded_at) AS day,
            SUM(p.wastewater_pump_building1) AS wastewater_pump_building1,
            SUM(p.wastewater_pump_building2) AS wastewater_pump_building2,
            SUM(p.treatment_pond) AS treatment_pond
          FROM power_meters p
          WHERE EXTRACT(YEAR FROM p.recorded_at)::int = CAST(${year} AS INTEGER)
          GROUP BY DATE_TRUNC('day', p.recorded_at)
        ) daily_data
      ),
      monthly_agg AS (
        SELECT
          month,
          SUM(wastewater_pump_building1_diff) AS wastewater_pump_building1,
          SUM(wastewater_pump_building2_diff) AS wastewater_pump_building2,
          SUM(treatment_pond_diff) AS treatment_pond
        FROM daily_diff
        GROUP BY month
      )
      SELECT
        m.month,
        COALESCE(ma.wastewater_pump_building1, 0) AS wastewater_pump_building1,
        COALESCE(ma.wastewater_pump_building2, 0) AS wastewater_pump_building2,
        COALESCE(ma.treatment_pond, 0) AS treatment_pond
      FROM months m
      LEFT JOIN monthly_agg ma
        ON DATE_TRUNC('month', m.month) = DATE_TRUNC('month', ma.month)
      ORDER BY m.month;
      
      `;

      return NextResponse.json(data);
    }

    if (type === "daily") {
      const data = await prisma.$queryRaw`
      WITH daily_data AS (
        SELECT
          DATE_TRUNC('day', p.recorded_at) AS day,
          SUM(p.wastewater_pump_building1) AS wastewater_pump_building1,
          SUM(p.wastewater_pump_building2) AS wastewater_pump_building2,
          SUM(p.treatment_pond) AS treatment_pond
        FROM power_meters p
        WHERE
          (
            EXTRACT(MONTH FROM p.recorded_at) <> 12 AND
            EXTRACT(YEAR FROM p.recorded_at) = ${Number(year)} AND
            EXTRACT(MONTH FROM p.recorded_at) = ${Number(month)}
          )
          OR
          (
            EXTRACT(MONTH FROM p.recorded_at) = 12 AND ${Number(month)} = 12 AND
            (
              (EXTRACT(YEAR FROM p.recorded_at) = ${Number(year)} AND EXTRACT(MONTH FROM p.recorded_at) = 12)
              OR
              (EXTRACT(YEAR FROM p.recorded_at) = ${Number(year)} + 1 AND EXTRACT(MONTH FROM p.recorded_at) = 1 AND EXTRACT(DAY FROM p.recorded_at) = 1)
            )
          )
          OR
          (
            EXTRACT(MONTH FROM p.recorded_at) <> 12 AND
            EXTRACT(YEAR FROM p.recorded_at) = ${Number(month) === 12 ? Number(year) + 1 : Number(year)} AND
            EXTRACT(MONTH FROM p.recorded_at) = ${Number(month) === 12 ? 1 : Number(month) + 1} AND
            EXTRACT(DAY FROM p.recorded_at) = 1
          )
        GROUP BY day
        HAVING
          SUM(p.wastewater_pump_building1) IS NOT NULL AND
          SUM(p.wastewater_pump_building2) IS NOT NULL AND
          SUM(p.treatment_pond) IS NOT NULL
      )
      
      SELECT *
      FROM (
        SELECT
          day,
          ROUND((
            CASE
              WHEN LEAD(wastewater_pump_building1) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(wastewater_pump_building1) OVER (ORDER BY day) < wastewater_pump_building1 THEN
                LEAD(wastewater_pump_building1) OVER (ORDER BY day) + wastewater_pump_building1
              ELSE
                LEAD(wastewater_pump_building1) OVER (ORDER BY day) - wastewater_pump_building1
            END
          )::numeric, 2) AS wastewater_pump_building1,
      
          ROUND((
            CASE
              WHEN LEAD(wastewater_pump_building2) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(wastewater_pump_building2) OVER (ORDER BY day) < wastewater_pump_building2 THEN
                LEAD(wastewater_pump_building2) OVER (ORDER BY day) + wastewater_pump_building2
              ELSE
                LEAD(wastewater_pump_building2) OVER (ORDER BY day) - wastewater_pump_building2
            END
          )::numeric, 2) AS wastewater_pump_building2,
      
          ROUND((
            CASE
              WHEN LEAD(treatment_pond) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(treatment_pond) OVER (ORDER BY day) < treatment_pond THEN
                LEAD(treatment_pond) OVER (ORDER BY day) + treatment_pond
              ELSE
                LEAD(treatment_pond) OVER (ORDER BY day) - treatment_pond
            END
          )::numeric, 2) AS treatment_pond
        FROM daily_data
      ) AS result
      WHERE
        wastewater_pump_building1 IS NOT NULL AND
        wastewater_pump_building2 IS NOT NULL AND
        treatment_pond IS NOT NULL
      ORDER BY day;
      
      
      `;
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
