"use client";

import { useEffect, useState } from "react";
import { WaterbuildingChart } from "@/components/WaterbuildingChart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FileUp } from "lucide-react";
type ReportType = "yearly" | "monthly" | "daily";

interface WaterData {
  label: string;
  water_drinking: number;
  water_bldg1: number;
  water_bldg2: number;
  water_usage1: number;
  water_usage2: number;
}

export default function Page() {
  const [reportType, setReportType] = useState<ReportType>("yearly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [data, setData] = useState<WaterData[]>([]);
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams({
        type: reportType,
        year: year.toString(),
        ...(reportType === "daily" ? { month: month.toString() } : {}),
      });

      const res = await fetch(`/api/building-water?${params}`);
      const result = await res.json();

      const formatted = result.map((item: any) => {
        const label =
          reportType === "yearly"
            ? item.year
            : reportType === "monthly"
              ? thaiMonths[new Date(item.month).getMonth()]
              : new Date(item.day).toLocaleDateString("th-TH");

        return {
          label,
          water_drinking: parseFloat(item.water_drinking ?? 0),
          water_bldg1: parseFloat(
            item.water_bldg1 ?? 0
          ),
          water_bldg2: parseFloat(
            item.water_bldg2 ?? 0
          ),
          water_usage1: parseFloat(item.water_usage1 ?? 0),
          water_usage2: parseFloat(item.water_usage2 ?? 0),
        };
      });

      setData(formatted);
    };

    fetchData();
  }, [reportType, year, month]);

  const exportCSV = () => {
    const headers =
      "ช่วงเวลา,น้ำดื่ม,น้ำแอร์รังผึ้งอาคาร 1,น้ำแอร์รังผึ้งอาคาร 2,น้ำใช้อาคาร 1,น้ำใช้อาคาร 2";
    const rows = data.map(
      (d) =>
        `${d.label},${d.water_drinking},${d.water_bldg1},${d.water_usage2},${d.water_usage1},${d.water_bldg2}`
    );

    const avg = {
      label: "AVG",
      water_drinking:
        data.reduce((sum, d) => sum + d.water_drinking, 0) / data.length,
      water_bldg1:
        data.reduce((sum, d) => sum + d.water_bldg1, 0) /
        data.length,
      water_bldg2:
        data.reduce((sum, d) => sum + d.water_bldg2, 0) /
        data.length,
      water_usage1:
        data.reduce((sum, d) => sum + d.water_usage1, 0) / data.length,
      water_usage2:
        data.reduce((sum, d) => sum + d.water_usage2, 0) / data.length,
    };

    const sum = {
      label: "SUM",
      water_drinking: data.reduce((sum, d) => sum + d.water_drinking, 0),
      water_bldg1: data.reduce(
        (sum, d) => sum + d.water_bldg1,
        0
      ),
      water_bldg2: data.reduce(
        (sum, d) => sum + d.water_bldg2,
        0
      ),
      water_usage1: data.reduce(
        (sum, d) => sum + d.water_usage1,
        0
      ),
      water_usage2: data.reduce(
        (sum, d) => sum + d.water_usage2,
        0
      ),
    };

    rows.push(
      `${avg.label},${avg.water_drinking.toFixed(
        2
      )},${avg.water_bldg1.toFixed(
        2
      )},${avg.water_bldg2.toFixed(
        2
      )},${avg.water_usage1.toFixed(2)}`,
      `${sum.label},${sum.water_drinking.toFixed(
        2
      )},${sum.water_bldg1.toFixed(
        2
      )},${sum.water_bldg2.toFixed(
        2
      )},${sum.water_usage1.toFixed(
        2
      )},${sum.water_usage2.toFixed(2)}`
    );

    const csv = [headers, ...rows].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const now = new Date();
    const timestamp = now
      .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
      .replace(/[-: ]/g, "")
      .slice(0, 15);

    let filename = `water_report_${reportType}_${year}`;
    if (reportType === "daily") {
      filename += `_month${month}`;
    }
    filename += `_${timestamp}.csv`;

    link.download = filename;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select
          value={reportType}
          onValueChange={(v) => setReportType(v as ReportType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="เลือกรูปแบบรายงาน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">รายปี</SelectItem>
            <SelectItem value="monthly">รายเดือน</SelectItem>
            <SelectItem value="daily">รายวัน</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(year)}
          onValueChange={(v) => setYear(parseInt(v))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="เลือกปี" />
          </SelectTrigger>
          <SelectContent>
            {[2023, 2024, 2025, 2026].map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {reportType === "daily" && (
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(parseInt(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="เลือกเดือน" />
            </SelectTrigger>
            <SelectContent>
              {thaiMonths.map((name, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button onClick={exportCSV} className="bg-green-400 hover:bg-green-500">
          <FileUp />
          ส่งออกเป็น CSV
        </Button>
      </div>
      <div className="flex justify-center w-full scroll-wrapper rounded-md shadow bg-zinc-900">
        <WaterbuildingChart
          labels={data.map((d) => d.label)}
          water_drinking={data.map((d) => d.water_drinking)}
          water_bldg1={data.map(
            (d) => d.water_bldg1
          )}
          water_bldg2={data.map(
            (d) => d.water_bldg2
          )}
          water_usage1={data.map((d) => d.water_usage1)}
          water_usage2={data.map((d) => d.water_usage2)}
        />
      </div>
      <div className="overflow-auto">
        <table className="min-w-full mt-4 text-sm overflow-hidden rounded-sm border">
          <thead className="bg-gray-200 text-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-center">ช่วงเวลา</th>
              <th className="px-4 py-2 text-center">น้ำดื่ม (m³)</th>
              <th className="px-4 py-2 text-center">
                น้ำแอร์รังผึ้งอาคาร 1 (m³)
              </th>

              <th className="px-4 py-2 text-center">น้ำแอร์รังผึ้งอาคาร 2 (m³)</th>
              <th className="px-4 py-2 text-center">น้ำใช้อาคาร 1 (m³)</th>
              <th className="px-4 py-2 text-center">
                น้ำใช้อาคาร 2 (m³)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2 text-center">{d.label}</td>
                <td className="px-4 py-2 text-center">
                  {d.water_drinking.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {d.water_bldg1.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {d.water_usage2.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {d.water_usage1.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {d.water_bldg2.toFixed(2)}
                </td>
              </tr>
            ))}

            <tr className="border-t bg-yellow-300 text-black font-semibold">
              <td className="px-4 py-2 text-center">AVG</td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce((sum, d) => sum + d.water_drinking, 0) /
                  data.length
                ).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce(
                    (sum, d) => sum + d.water_bldg1,
                    0
                  ) / data.length
                ).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce(
                    (sum, d) => sum + d.water_bldg2,
                    0
                  ) / data.length
                ).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce((sum, d) => sum + d.water_usage1, 0) /
                  data.length
                ).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce((sum, d) => sum + d.water_usage2, 0) /
                  data.length
                ).toFixed(2)}
              </td>
            </tr>

            <tr className="border-t bg-green-600 text-white font-semibold">
              <td className="px-4 py-2 text-center">SUM</td>
              <td className="px-4 py-2 text-center">
                {data.reduce((sum, d) => sum + d.water_drinking, 0).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {data
                  .reduce((sum, d) => sum + d.water_bldg1, 0)
                  .toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {data
                  .reduce((sum, d) => sum + d.water_bldg2, 0)
                  .toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center rounded-br-sm">
                {data
                  .reduce((sum, d) => sum + d.water_usage1, 0)
                  .toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center rounded-br-sm">
                {data
                  .reduce((sum, d) => sum + d.water_usage2, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
