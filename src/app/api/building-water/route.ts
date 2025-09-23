import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type WaterYearly = {
  year: number;
  drinking_water: bigint | null;
  air_cooling_water_building1: bigint | null;
  air_cooling_water_building2: bigint | null;
  water_usage_building1: bigint | null;
  water_usage_building2: bigint | null;
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

      const dataRaw = await prisma.$queryRaw<WaterYearly[]>`
        WITH years AS (
          SELECT generate_series(${prevYear}, ${targetYear}) AS year
        ),
        daily_diff AS (
          SELECT
            DATE_TRUNC('day', bwm.recorded_at) AS day,
            SUM(bwm.drinking_water) AS drinking_water,
            SUM(bwm.air_cooling_water_building1) AS air_cooling_water_building1,
            SUM(bwm.air_cooling_water_building2) AS air_cooling_water_building2,
            SUM(bwm.water_usage_building1) AS water_usage_building1,
            SUM(bwm.water_usage_building2) AS water_usage_building2
          FROM building_water_meters bwm
          WHERE EXTRACT(YEAR FROM bwm.recorded_at) IN (${prevYear}, ${targetYear})
          GROUP BY day
        ),
        daily_diff_calc AS (
          SELECT
            day,
            ROUND((
              CASE
                WHEN LEAD(drinking_water) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(drinking_water) OVER (ORDER BY day) < drinking_water THEN
                  LEAD(drinking_water) OVER (ORDER BY day) + drinking_water
                ELSE
                  LEAD(drinking_water) OVER (ORDER BY day) - drinking_water
              END
            )::numeric, 2) AS drinking_water_diff,
    
            ROUND((
              CASE
                WHEN LEAD(air_cooling_water_building1) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(air_cooling_water_building1) OVER (ORDER BY day) < air_cooling_water_building1 THEN
                  LEAD(air_cooling_water_building1) OVER (ORDER BY day) + air_cooling_water_building1
                ELSE
                  LEAD(air_cooling_water_building1) OVER (ORDER BY day) - air_cooling_water_building1
              END
            )::numeric, 2) AS air_cooling_water_building1_diff,
    
            ROUND((
              CASE
                WHEN LEAD(air_cooling_water_building2) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(air_cooling_water_building2) OVER (ORDER BY day) < air_cooling_water_building2 THEN
                  LEAD(air_cooling_water_building2) OVER (ORDER BY day) + air_cooling_water_building2
                ELSE
                  LEAD(air_cooling_water_building2) OVER (ORDER BY day) - air_cooling_water_building2
              END
            )::numeric, 2) AS air_cooling_water_building2_diff,
    
            ROUND((
              CASE
                WHEN LEAD(water_usage_building1) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(water_usage_building1) OVER (ORDER BY day) < water_usage_building1 THEN
                  LEAD(water_usage_building1) OVER (ORDER BY day) + water_usage_building1
                ELSE
                  LEAD(water_usage_building1) OVER (ORDER BY day) - water_usage_building1
              END
            )::numeric, 2) AS water_usage_building1_diff,
    
            ROUND((
              CASE
                WHEN LEAD(water_usage_building2) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(water_usage_building2) OVER (ORDER BY day) < water_usage_building2 THEN
                  LEAD(water_usage_building2) OVER (ORDER BY day) + water_usage_building2
                ELSE
                  LEAD(water_usage_building2) OVER (ORDER BY day) - water_usage_building2
              END
            )::numeric, 2) AS water_usage_building2_diff
          FROM daily_diff
        ),
        yearly_agg AS (
          SELECT
            EXTRACT(YEAR FROM day) AS year,
            SUM(drinking_water_diff) AS drinking_water,
            SUM(air_cooling_water_building1_diff) AS air_cooling_water_building1,
            SUM(air_cooling_water_building2_diff) AS air_cooling_water_building2,
            SUM(water_usage_building1_diff) AS water_usage_building1,
            SUM(water_usage_building2_diff) AS water_usage_building2
          FROM daily_diff_calc
          GROUP BY year
        )
        SELECT
          y.year,
          COALESCE(ya.drinking_water, 0) AS drinking_water,
          COALESCE(ya.air_cooling_water_building1, 0) AS air_cooling_water_building1,
          COALESCE(ya.air_cooling_water_building2, 0) AS air_cooling_water_building2,
          COALESCE(ya.water_usage_building1, 0) AS water_usage_building1,
          COALESCE(ya.water_usage_building2, 0) AS water_usage_building2
        FROM years y
        LEFT JOIN yearly_agg ya ON y.year = ya.year
        ORDER BY y.year;
      `;

      const safeData = dataRaw.map((row) => ({
        year: Number(row.year),
        drinking_water:
          row.drinking_water !== null
            ? Number(Number(row.drinking_water).toFixed(2))
            : 0,
        air_cooling_water_building1:
          row.air_cooling_water_building1 !== null
            ? Number(Number(row.air_cooling_water_building1).toFixed(2))
            : 0,
        air_cooling_water_building2:
          row.air_cooling_water_building2 !== null
            ? Number(Number(row.air_cooling_water_building2).toFixed(2))
            : 0,
        water_usage_building1:
          row.water_usage_building1 !== null
            ? Number(Number(row.water_usage_building1).toFixed(2))
            : 0,
        water_usage_building2:
          row.water_usage_building2 !== null
            ? Number(Number(row.water_usage_building2).toFixed(2))
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
        daily_data AS (
          SELECT
            DATE_TRUNC('day', bwm.recorded_at) AS day,
            SUM(bwm.drinking_water) AS drinking_water,
            SUM(bwm.air_cooling_water_building1) AS air_cooling_water_building1,
            SUM(bwm.air_cooling_water_building2) AS air_cooling_water_building2,
            SUM(bwm.water_usage_building1) AS water_usage_building1,
            SUM(bwm.water_usage_building2) AS water_usage_building2
          FROM building_water_meters bwm
          WHERE (
            EXTRACT(YEAR FROM bwm.recorded_at) = ${year} -- ทุกเดือนในปีปัจจุบัน
          ) OR (
            EXTRACT(YEAR FROM bwm.recorded_at) = ${year + 1} AND
            EXTRACT(MONTH FROM bwm.recorded_at) = 1 AND
            EXTRACT(DAY FROM bwm.recorded_at) = 1 -- วันที่ 1 ของ ม.ค. ปีถัดไป
          )
          GROUP BY DATE_TRUNC('day', bwm.recorded_at)
        ),
        daily_diff AS (
          SELECT
            DATE_TRUNC('month', day) AS month,
            ROUND((
              CASE
                WHEN LEAD(drinking_water) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(drinking_water) OVER (ORDER BY day) < drinking_water
                  THEN LEAD(drinking_water) OVER (ORDER BY day) + drinking_water
                ELSE LEAD(drinking_water) OVER (ORDER BY day) - drinking_water
              END
            )::numeric, 2) AS drinking_water_diff,
    
            ROUND((
              CASE
                WHEN LEAD(air_cooling_water_building1) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(air_cooling_water_building1) OVER (ORDER BY day) < air_cooling_water_building1
                  THEN LEAD(air_cooling_water_building1) OVER (ORDER BY day) + air_cooling_water_building1
                ELSE LEAD(air_cooling_water_building1) OVER (ORDER BY day) - air_cooling_water_building1
              END
            )::numeric, 2) AS air_cooling_water_building1_diff,
    
            ROUND((
              CASE
                WHEN LEAD(air_cooling_water_building2) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(air_cooling_water_building2) OVER (ORDER BY day) < air_cooling_water_building2
                  THEN LEAD(air_cooling_water_building2) OVER (ORDER BY day) + air_cooling_water_building2
                ELSE LEAD(air_cooling_water_building2) OVER (ORDER BY day) - air_cooling_water_building2
              END
            )::numeric, 2) AS air_cooling_water_building2_diff,
    
            ROUND((
              CASE
                WHEN LEAD(water_usage_building1) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(water_usage_building1) OVER (ORDER BY day) < water_usage_building1
                  THEN LEAD(water_usage_building1) OVER (ORDER BY day) + water_usage_building1
                ELSE LEAD(water_usage_building1) OVER (ORDER BY day) - water_usage_building1
              END
            )::numeric, 2) AS water_usage_building1_diff,
    
            ROUND((
              CASE
                WHEN LEAD(water_usage_building2) OVER (ORDER BY day) IS NULL THEN NULL
                WHEN LEAD(water_usage_building2) OVER (ORDER BY day) < water_usage_building2
                  THEN LEAD(water_usage_building2) OVER (ORDER BY day) + water_usage_building2
                ELSE LEAD(water_usage_building2) OVER (ORDER BY day) - water_usage_building2
              END
            )::numeric, 2) AS water_usage_building2_diff
          FROM daily_data
        ),
        monthly_agg AS (
          SELECT
            month,
            SUM(drinking_water_diff) AS drinking_water,
            SUM(air_cooling_water_building1_diff) AS air_cooling_water_building1,
            SUM(air_cooling_water_building2_diff) AS air_cooling_water_building2,
            SUM(water_usage_building1_diff) AS water_usage_building1,
            SUM(water_usage_building2_diff) AS water_usage_building2
          FROM daily_diff
          GROUP BY month
        )
        SELECT
          m.month,
          COALESCE(ma.drinking_water, 0) AS drinking_water,
          COALESCE(ma.air_cooling_water_building1, 0) AS air_cooling_water_building1,
          COALESCE(ma.air_cooling_water_building2, 0) AS air_cooling_water_building2,
          COALESCE(ma.water_usage_building1, 0) AS water_usage_building1,
          COALESCE(ma.water_usage_building2, 0) AS water_usage_building2
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
          DATE_TRUNC('day', bwm.recorded_at) AS day,
          SUM(bwm.drinking_water) AS drinking_water,
          SUM(bwm.air_cooling_water_building1) AS air_cooling_water_building1,
          SUM(bwm.air_cooling_water_building2) AS air_cooling_water_building2,
          SUM(bwm.water_usage_building1) AS water_usage_building1,
          SUM(bwm.water_usage_building2) AS water_usage_building2
        FROM building_water_meters bwm
        WHERE
          (
            EXTRACT(MONTH FROM bwm.recorded_at) <> 12 AND
            EXTRACT(YEAR FROM bwm.recorded_at) = ${Number(year)} AND
            EXTRACT(MONTH FROM bwm.recorded_at) = ${Number(month)}
          )
          OR
          (
            EXTRACT(MONTH FROM bwm.recorded_at) = 12 AND ${Number(month)} = 12 AND
            (
              (EXTRACT(YEAR FROM bwm.recorded_at) = ${Number(year)} AND EXTRACT(MONTH FROM bwm.recorded_at) = 12)
              OR
              (EXTRACT(YEAR FROM bwm.recorded_at) = ${Number(year)} + 1 AND EXTRACT(MONTH FROM bwm.recorded_at) = 1 AND EXTRACT(DAY FROM bwm.recorded_at) = 1)
            )
          )
          OR
          (
            EXTRACT(MONTH FROM bwm.recorded_at) <> 12 AND
            EXTRACT(YEAR FROM bwm.recorded_at) = ${Number(month) === 12 ? Number(year) + 1 : Number(year)} AND
            EXTRACT(MONTH FROM bwm.recorded_at) = ${Number(month) === 12 ? 1 : Number(month) + 1} AND
            EXTRACT(DAY FROM bwm.recorded_at) = 1
          )
        GROUP BY day
      ),
      
      data_with_diff AS (
        SELECT
          day,
      
          ROUND((
            CASE
              WHEN LEAD(drinking_water) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(drinking_water) OVER (ORDER BY day) < drinking_water THEN
                LEAD(drinking_water) OVER (ORDER BY day) + drinking_water
              ELSE
                LEAD(drinking_water) OVER (ORDER BY day) - drinking_water
            END
          )::numeric, 2) AS drinking_water,
      
          ROUND((
            CASE
              WHEN LEAD(air_cooling_water_building1) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(air_cooling_water_building1) OVER (ORDER BY day) < air_cooling_water_building1 THEN
                LEAD(air_cooling_water_building1) OVER (ORDER BY day) + air_cooling_water_building1
              ELSE
                LEAD(air_cooling_water_building1) OVER (ORDER BY day) - air_cooling_water_building1
            END
          )::numeric, 2) AS air_cooling_water_building1,
      
          ROUND((
            CASE
              WHEN LEAD(air_cooling_water_building2) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(air_cooling_water_building2) OVER (ORDER BY day) < air_cooling_water_building2 THEN
                LEAD(air_cooling_water_building2) OVER (ORDER BY day) + air_cooling_water_building2
              ELSE
                LEAD(air_cooling_water_building2) OVER (ORDER BY day) - air_cooling_water_building2
            END
          )::numeric, 2) AS air_cooling_water_building2,
      
          ROUND((
            CASE
              WHEN LEAD(water_usage_building1) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(water_usage_building1) OVER (ORDER BY day) < water_usage_building1 THEN
                LEAD(water_usage_building1) OVER (ORDER BY day) + water_usage_building1
              ELSE
                LEAD(water_usage_building1) OVER (ORDER BY day) - water_usage_building1
            END
          )::numeric, 2) AS water_usage_building1,
      
          ROUND((
            CASE
              WHEN LEAD(water_usage_building2) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(water_usage_building2) OVER (ORDER BY day) < water_usage_building2 THEN
                LEAD(water_usage_building2) OVER (ORDER BY day) + water_usage_building2
              ELSE
                LEAD(water_usage_building2) OVER (ORDER BY day) - water_usage_building2
            END
          )::numeric, 2) AS water_usage_building2
      
        FROM daily_data
      )
      
      SELECT *
      FROM data_with_diff
      WHERE drinking_water IS NOT NULL
        AND air_cooling_water_building1 IS NOT NULL
        AND air_cooling_water_building2 IS NOT NULL
        AND water_usage_building1 IS NOT NULL
        AND water_usage_building2 IS NOT NULL
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
