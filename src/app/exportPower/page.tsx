"use client";

import { useEffect, useState } from "react";
import { PowerChart } from "@/components/PowerChart";
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
  wastewater_pump_building1: number;
  wastewater_pump_building2: number;
  treatment_pond: number;
  wastewater_pump_building2_plus_reused: number;
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

      const res = await fetch(`/api/power?${params}`);
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
          wastewater_pump_building1: parseFloat(
            item.wastewater_pump_building1 ?? 0
          ),
          wastewater_pump_building2: parseFloat(
            item.wastewater_pump_building2 ?? 0
          ),
          treatment_pond: parseFloat(item.treatment_pond ?? 0),
          wastewater_pump_building2_plus_reused: parseFloat(
            item.wastewater_pump_building2_plus_reused ?? 0
          ),
        };
      });

      setData(formatted);
    };

    fetchData();
  }, [reportType, year, month]);

  const exportCSV = () => {
    const headers =
      "ช่วงเวลา,บ่อสูบน้ำเสียอาคาร 1,บ่อสูบน้ำเสียอาคาร 2,บ่อบำบัด";
    const rows = data.map(
      (d) =>
        `${d.label},${d.wastewater_pump_building1},${d.wastewater_pump_building2},${d.treatment_pond},${d.wastewater_pump_building2_plus_reused}`
    );

    const avg = {
      label: "AVG",
      wastewater_pump_building1:
        data.reduce((sum, d) => sum + d.wastewater_pump_building1, 0) /
        data.length,
      wastewater_pump_building2:
        data.reduce((sum, d) => sum + d.wastewater_pump_building2, 0) /
        data.length,
      treatment_pond:
        data.reduce((sum, d) => sum + d.treatment_pond, 0) / data.length,
      wastewater_pump_building2_plus_reused:
        data.reduce(
          (sum, d) => sum + d.wastewater_pump_building2_plus_reused,
          0
        ) / data.length,
    };

    const sum = {
      label: "SUM",
      wastewater_pump_building1: data.reduce(
        (sum, d) => sum + d.wastewater_pump_building1,
        0
      ),
      wastewater_pump_building2: data.reduce(
        (sum, d) => sum + d.wastewater_pump_building2,
        0
      ),
      treatment_pond: data.reduce((sum, d) => sum + d.treatment_pond, 0),
      wastewater_pump_building2_plus_reused: data.reduce(
        (sum, d) => sum + d.wastewater_pump_building2_plus_reused,
        0
      ),
    };

    rows.push(
      `${avg.label},${avg.wastewater_pump_building1.toFixed(
        2
      )},${avg.wastewater_pump_building2.toFixed(
        2
      )},${avg.treatment_pond.toFixed(
        2
      )},${avg.wastewater_pump_building2_plus_reused.toFixed(2)}`,
      `${sum.label},${sum.wastewater_pump_building1.toFixed(
        2
      )},${sum.wastewater_pump_building2.toFixed(
        2
      )},${sum.treatment_pond.toFixed(
        2
      )},${sum.wastewater_pump_building2_plus_reused.toFixed(2)}`
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
        <PowerChart
          labels={data.map((d) => d.label)}
          wastewater_pump_building1={data.map(
            (d) => d.wastewater_pump_building1
          )}
          wastewater_pump_building2={data.map(
            (d) => d.wastewater_pump_building2
          )}
          treatment_pond={data.map((d) => d.treatment_pond)}
        />
      </div>
      <div className="overflow-auto">
        <table className="min-w-full mt-4 text-sm overflow-hidden rounded-sm border">
          <thead className="bg-gray-200 text-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-center">ช่วงเวลา</th>
              <th className="px-4 py-2 text-center">
                บ่อสูบน้ำเสียอาคาร 1 (m³)
              </th>
              <th className="px-4 py-2 text-center">
                บ่อสูบน้ำเสียอาคาร 2 (m³)
              </th>
              <th className="px-4 py-2 text-center">บ่อบำบัด (m³)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2 text-center">{d.label}</td>
                <td className="px-4 py-2 text-center">
                  {d.wastewater_pump_building1.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {d.wastewater_pump_building2.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {d.treatment_pond.toFixed(2)}
                </td>
              </tr>
            ))}

            <tr className="border-t bg-yellow-300 text-black font-semibold">
              <td className="px-4 py-2 text-center">AVG</td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce(
                    (sum, d) => sum + d.wastewater_pump_building1,
                    0
                  ) / data.length
                ).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce(
                    (sum, d) => sum + d.wastewater_pump_building2,
                    0
                  ) / data.length
                ).toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {(
                  data.reduce((sum, d) => sum + d.treatment_pond, 0) /
                  data.length
                ).toFixed(2)}
              </td>
            </tr>

            <tr className="border-t bg-green-600 text-white font-semibold">
              <td className="px-4 py-2 text-center">SUM</td>
              <td className="px-4 py-2 text-center">
                {data
                  .reduce((sum, d) => sum + d.wastewater_pump_building1, 0)
                  .toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {data
                  .reduce((sum, d) => sum + d.wastewater_pump_building2, 0)
                  .toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {data.reduce((sum, d) => sum + d.treatment_pond, 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
