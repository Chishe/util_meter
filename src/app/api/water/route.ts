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
      CASE
        WHEN LAG(water_in) OVER (ORDER BY day) IS NULL THEN NULL
        WHEN water_in >= LAG(water_in) OVER (ORDER BY day) THEN water_in - LAG(water_in) OVER (ORDER BY day)
        ELSE water_in + LAG(water_in) OVER (ORDER BY day)
      END AS water_in_diff,
      CASE
        WHEN LAG(water_out) OVER (ORDER BY day) IS NULL THEN NULL
        WHEN water_out >= LAG(water_out) OVER (ORDER BY day) THEN water_out - LAG(water_out) OVER (ORDER BY day)
        ELSE water_out + LAG(water_out) OVER (ORDER BY day)
      END AS water_out_diff,
      CASE
        WHEN LAG(reused_treated_water) OVER (ORDER BY day) IS NULL THEN NULL
        WHEN reused_treated_water >= LAG(reused_treated_water) OVER (ORDER BY day) THEN reused_treated_water - LAG(reused_treated_water) OVER (ORDER BY day)
        ELSE reused_treated_water + LAG(reused_treated_water) OVER (ORDER BY day)
      END AS reused_treated_water_diff,
      CASE
        WHEN LAG(water_out_plus_reused) OVER (ORDER BY day) IS NULL THEN NULL
        WHEN water_out_plus_reused >= LAG(water_out_plus_reused) OVER (ORDER BY day) THEN water_out_plus_reused - LAG(water_out_plus_reused) OVER (ORDER BY day)
        ELSE water_out_plus_reused + LAG(water_out_plus_reused) OVER (ORDER BY day)
      END AS water_out_plus_reused_diff
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
    CASE
      WHEN LAG(water_in) OVER (ORDER BY day) IS NULL THEN NULL
      WHEN water_in >= LAG(water_in) OVER (ORDER BY day) THEN water_in - LAG(water_in) OVER (ORDER BY day)
      ELSE water_in + LAG(water_in) OVER (ORDER BY day)
    END AS water_in_diff,
    CASE
      WHEN LAG(water_out) OVER (ORDER BY day) IS NULL THEN NULL
      WHEN water_out >= LAG(water_out) OVER (ORDER BY day) THEN water_out - LAG(water_out) OVER (ORDER BY day)
      ELSE water_out + LAG(water_out) OVER (ORDER BY day)
    END AS water_out_diff,
    CASE
      WHEN LAG(reused_treated_water) OVER (ORDER BY day) IS NULL THEN NULL
      WHEN reused_treated_water >= LAG(reused_treated_water) OVER (ORDER BY day) THEN reused_treated_water - LAG(reused_treated_water) OVER (ORDER BY day)
      ELSE reused_treated_water + LAG(reused_treated_water) OVER (ORDER BY day)
    END AS reused_treated_water_diff,
    CASE
      WHEN LAG(water_out_plus_reused) OVER (ORDER BY day) IS NULL THEN NULL
      WHEN water_out_plus_reused >= LAG(water_out_plus_reused) OVER (ORDER BY day) THEN water_out_plus_reused - LAG(water_out_plus_reused) OVER (ORDER BY day)
      ELSE water_out_plus_reused + LAG(water_out_plus_reused) OVER (ORDER BY day)
    END AS water_out_plus_reused_diff
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
), monthly_agg AS (
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
        SELECT
          day,

          CASE
            WHEN LAG(water_in) OVER (ORDER BY day) IS NULL THEN NULL
            WHEN water_in >= LAG(water_in) OVER (ORDER BY day) THEN water_in - LAG(water_in) OVER (ORDER BY day)
            ELSE water_in + LAG(water_in) OVER (ORDER BY day)
          END AS water_in,

          CASE
            WHEN LAG(water_out) OVER (ORDER BY day) IS NULL THEN NULL
            WHEN water_out >= LAG(water_out) OVER (ORDER BY day) THEN water_out - LAG(water_out) OVER (ORDER BY day)
            ELSE water_out + LAG(water_out) OVER (ORDER BY day)
          END AS water_out,

          CASE
            WHEN LAG(reused_treated_water) OVER (ORDER BY day) IS NULL THEN NULL
            WHEN reused_treated_water >= LAG(reused_treated_water) OVER (ORDER BY day) THEN reused_treated_water - LAG(reused_treated_water) OVER (ORDER BY day)
            ELSE reused_treated_water + LAG(reused_treated_water) OVER (ORDER BY day)
          END AS reused_treated_water,

          CASE
            WHEN LAG(water_out_plus_reused) OVER (ORDER BY day) IS NULL THEN NULL
            WHEN water_out_plus_reused >= LAG(water_out_plus_reused) OVER (ORDER BY day) THEN water_out_plus_reused - LAG(water_out_plus_reused) OVER (ORDER BY day)
            ELSE water_out_plus_reused + LAG(water_out_plus_reused) OVER (ORDER BY day)
          END AS water_out_plus_reused

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
          WHERE EXTRACT(YEAR FROM wm.recorded_at) = ${Number(year)}
            AND EXTRACT(MONTH FROM wm.recorded_at) = ${Number(month)}
          GROUP BY day
        ) daily_data
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
