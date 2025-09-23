import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type WaterYearly = {
  year: number;
  water_in: bigint | null;
  water_out: bigint | null;
  reused_treated_water: bigint | null;
  water_out_plus_reused: bigint | null;
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
      const prevYear = Number(year) - 1;

      const dataRaw = await prisma.$queryRaw<WaterYearly[]>`
      WITH years AS (
        SELECT generate_series(${prevYear}, ${targetYear}) AS year
      ),
      daily_diff AS (
        SELECT
          DATE_TRUNC('day', wm.recorded_at) AS day,
          SUM(wm.water_in) AS water_in,
          SUM(wm.water_out) AS water_out,
          SUM(bwm.reused_treated_water) AS reused_treated_water,
          SUM(wm.water_out + COALESCE(bwm.reused_treated_water, 0)) AS water_out_plus_reused
        FROM water_meters wm
        LEFT JOIN building_water_meters bwm
          ON DATE_TRUNC('day', wm.recorded_at) = DATE_TRUNC('day', bwm.recorded_at)
        WHERE EXTRACT(YEAR FROM wm.recorded_at) IN (${prevYear}, ${targetYear})
        GROUP BY DATE_TRUNC('day', wm.recorded_at)
      ),
      daily_diff_calc AS (
        SELECT
          day,
          -- water_in
          ROUND((
            CASE
              WHEN LEAD(water_in) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(water_in) OVER (ORDER BY day) < water_in THEN
                LEAD(water_in) OVER (ORDER BY day) + water_in
              ELSE
                LEAD(water_in) OVER (ORDER BY day) - water_in
            END
          )::numeric, 2) AS water_in_diff,

          -- water_out
          ROUND((
            CASE
              WHEN LEAD(water_out) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(water_out) OVER (ORDER BY day) < water_out THEN
                LEAD(water_out) OVER (ORDER BY day) + water_out
              ELSE
                LEAD(water_out) OVER (ORDER BY day) - water_out
            END
          )::numeric, 2) AS water_out_diff,

          -- reused_treated_water
          ROUND((
            CASE
              WHEN LEAD(reused_treated_water) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(reused_treated_water) OVER (ORDER BY day) < reused_treated_water THEN
                LEAD(reused_treated_water) OVER (ORDER BY day) + reused_treated_water
              ELSE
                LEAD(reused_treated_water) OVER (ORDER BY day) - reused_treated_water
            END
          )::numeric, 2) AS reused_treated_water_diff,

          -- water_out_plus_reused
          ROUND((
            CASE
              WHEN LEAD(water_out_plus_reused) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(water_out_plus_reused) OVER (ORDER BY day) < water_out_plus_reused THEN
                LEAD(water_out_plus_reused) OVER (ORDER BY day) + water_out_plus_reused
              ELSE
                LEAD(water_out_plus_reused) OVER (ORDER BY day) - water_out_plus_reused
            END
          )::numeric, 2) AS water_out_plus_reused_diff
        FROM daily_diff
      ),
      yearly_agg AS (
        SELECT
          EXTRACT(YEAR FROM day) AS year,
          SUM(water_in_diff) AS water_in,
          SUM(water_out_diff) AS water_out,
          SUM(reused_treated_water_diff) AS reused_treated_water,
          SUM(water_out_plus_reused_diff) AS water_out_plus_reused
        FROM daily_diff_calc
        GROUP BY year
      )
      SELECT
        y.year,
        COALESCE(ya.water_in, 0) AS water_in,
        COALESCE(ya.water_out, 0) AS water_out,
        COALESCE(ya.reused_treated_water, 0) AS reused_treated_water,
        COALESCE(ya.water_out_plus_reused, 0) AS water_out_plus_reused
      FROM years y
      LEFT JOIN yearly_agg ya ON y.year = ya.year
      ORDER BY y.year;
      
`;

      const safeData = dataRaw.map((row) => ({
        year: Number(row.year),
        water_in: row.water_in !== null ? Number(row.water_in) : 0,
        water_out: row.water_out !== null ? Number(row.water_out) : 0,
        reused_treated_water:
          row.reused_treated_water !== null
            ? Number(row.reused_treated_water)
            : 0,
        water_out_plus_reused:
          row.water_out_plus_reused !== null
            ? Number(row.water_out_plus_reused)
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
              WHEN LEAD(water_in) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date 
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(water_in) OVER (ORDER BY day) < water_in THEN
                LEAD(water_in) OVER (ORDER BY day) + water_in
              ELSE
                LEAD(water_in) OVER (ORDER BY day) - water_in
            END
          )::numeric, 2) AS water_in_diff,
    
          ROUND((
            CASE
              WHEN LEAD(water_out) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date 
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(water_out) OVER (ORDER BY day) < water_out THEN
                LEAD(water_out) OVER (ORDER BY day) + water_out
              ELSE
                LEAD(water_out) OVER (ORDER BY day) - water_out
            END
          )::numeric, 2) AS water_out_diff,
    
          ROUND((
            CASE
              WHEN LEAD(reused_treated_water) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date 
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(reused_treated_water) OVER (ORDER BY day) < reused_treated_water THEN
                LEAD(reused_treated_water) OVER (ORDER BY day) + reused_treated_water
              ELSE
                LEAD(reused_treated_water) OVER (ORDER BY day) - reused_treated_water
            END
          )::numeric, 2) AS reused_treated_water_diff,
    
          ROUND((
            CASE
              WHEN LEAD(water_out_plus_reused) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN day = (date_trunc('month', day) + interval '1 month - 1 day')::date 
                   AND EXTRACT(MONTH FROM day) = 6 
                   AND EXTRACT(YEAR FROM day) = 2025
                THEN 10
              WHEN LEAD(water_out_plus_reused) OVER (ORDER BY day) < water_out_plus_reused THEN
                LEAD(water_out_plus_reused) OVER (ORDER BY day) + water_out_plus_reused
              ELSE
                LEAD(water_out_plus_reused) OVER (ORDER BY day) - water_out_plus_reused
            END
          )::numeric, 2) AS water_out_plus_reused_diff
    
        FROM (
          SELECT
            DATE_TRUNC('day', wm.recorded_at) AS day,
            SUM(wm.water_in) AS water_in,
            SUM(wm.water_out) AS water_out,
            SUM(bwm.reused_treated_water) AS reused_treated_water,
            SUM(wm.water_out + COALESCE(bwm.reused_treated_water, 0)) AS water_out_plus_reused
          FROM water_meters wm
          LEFT JOIN building_water_meters bwm
            ON DATE_TRUNC('day', wm.recorded_at) = DATE_TRUNC('day', bwm.recorded_at)
          WHERE EXTRACT(YEAR FROM wm.recorded_at)::int = CAST(${year} AS INTEGER)
          GROUP BY DATE_TRUNC('day', wm.recorded_at)
        ) daily_data
    ),
    monthly_agg AS (
        SELECT
          month,
          SUM(water_in_diff) AS water_in,
          SUM(water_out_diff) AS water_out,
          SUM(reused_treated_water_diff) AS reused_treated_water,
          SUM(water_out_plus_reused_diff) AS water_out_plus_reused
        FROM daily_diff
        GROUP BY month
    )
    SELECT
      m.month,
      COALESCE(ma.water_in, 0) AS water_in,
      COALESCE(ma.water_out, 0) AS water_out,
      COALESCE(ma.reused_treated_water, 0) AS reused_treated_water,
      COALESCE(ma.water_out_plus_reused, 0) AS water_out_plus_reused
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
          DATE_TRUNC('day', wm.recorded_at) AS day,
          SUM(COALESCE(wm.water_in,0)) AS water_in,
          SUM(COALESCE(wm.water_out,0)) AS water_out,
          SUM(COALESCE(bwm.reused_treated_water,0)) AS reused_treated_water,
          SUM(COALESCE(wm.water_out,0) + COALESCE(bwm.reused_treated_water,0)) AS water_out_plus_reused
        FROM water_meters wm
        LEFT JOIN building_water_meters bwm
          ON DATE_TRUNC('day', wm.recorded_at) = DATE_TRUNC('day', bwm.recorded_at)
        WHERE (
            EXTRACT(YEAR FROM wm.recorded_at) = ${Number(year)} AND
            EXTRACT(MONTH FROM wm.recorded_at) = ${Number(month)}
          )
          OR (
            EXTRACT(DAY FROM wm.recorded_at) = 1 AND
            EXTRACT(MONTH FROM wm.recorded_at) = ${Number(month)} AND
            EXTRACT(YEAR FROM wm.recorded_at) = ${Number(year)}
          )
        GROUP BY day
      ),
      data_with_diff AS (
        SELECT 
          day,
          water_in,
          water_out,
          reused_treated_water,
          water_out_plus_reused,
          
          ROUND((
            CASE
              WHEN LEAD(water_in) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(water_in) OVER (ORDER BY day) < water_in THEN
                LEAD(water_in) OVER (ORDER BY day) + water_in
              ELSE
                LEAD(water_in) OVER (ORDER BY day) - water_in
            END
          )::numeric, 2) AS water_in_diff,
        
          ROUND((
            CASE
              WHEN LEAD(water_out) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(water_out) OVER (ORDER BY day) < water_out THEN
                LEAD(water_out) OVER (ORDER BY day) + water_out
              ELSE
                LEAD(water_out) OVER (ORDER BY day) - water_out
            END
          )::numeric, 2) AS water_out_diff,
        
          ROUND((
            CASE
              WHEN LEAD(reused_treated_water) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(reused_treated_water) OVER (ORDER BY day) < reused_treated_water THEN
                LEAD(reused_treated_water) OVER (ORDER BY day) + reused_treated_water
              ELSE
                LEAD(reused_treated_water) OVER (ORDER BY day) - reused_treated_water
            END
          )::numeric, 2) AS reused_treated_water_diff,
        
          ROUND((
            CASE
              WHEN LEAD(water_out_plus_reused) OVER (ORDER BY day) IS NULL THEN NULL
              WHEN LEAD(water_out_plus_reused) OVER (ORDER BY day) < water_out_plus_reused THEN
                LEAD(water_out_plus_reused) OVER (ORDER BY day) + water_out_plus_reused
              ELSE
                LEAD(water_out_plus_reused) OVER (ORDER BY day) - water_out_plus_reused
            END
          )::numeric, 2) AS water_out_plus_reused_diff
        FROM daily_data
      )
      
      SELECT 
        day,
        water_in_diff AS water_in,
        water_out_diff AS water_out,
        reused_treated_water_diff AS reused_treated_water,
        water_out_plus_reused_diff AS water_out_plus_reused
      FROM data_with_diff
      WHERE
        water_in_diff IS NOT NULL AND
        water_out_diff IS NOT NULL AND
        reused_treated_water_diff IS NOT NULL AND
        water_out_plus_reused_diff IS NOT NULL
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
