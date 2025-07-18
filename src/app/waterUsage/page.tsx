"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { websocketWaterUsage } from "@/config/websocketWaterUsage";

export default function Page() {
  const [values, setValues] = useState<Record<string, React.ReactNode>>({
    value1: "รอข้อมูล...",
    value2: "รอข้อมูล...",
    value4: "รอข้อมูล...",
    value5: "รอข้อมูล...",
    value6: "รอข้อมูล...",
  });

  useEffect(() => {
    websocketWaterUsage.forEach(({ id, url, label }) => {
      const socket = new WebSocket(url);

      socket.onmessage = (event) => {
        const res = JSON.parse(event.data);
        const m3value = res?.m3 ?? 0;

        setValues((prev) => ({
          ...prev,
          [id]: (
            <span className="flex items-center gap-2">
              <img src="/Water.gif" className="w-6 h-6 inline" alt="water" />
              {label}: {m3value.toFixed(2)} m³
            </span>
          ),
        }));
      };
      return () => {
        socket.close();
      };
    });
  }, []);

  const goToPage = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/layout-water-usage.png')] bg-no-repeat bg-center bg-contain" />

        <div className="absolute top-[27%] left-[22%]">
          <Button
            onClick={() => goToPage("/airCoolingWaterBuilding1")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value1}
            </span>
          </Button>
        </div>

        <div className="absolute top-[20%] left-[33%]">
          <Button
            onClick={() => goToPage("/waterUsageBuilding1")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value2}
            </span>
          </Button>
        </div>

        <div className="absolute top-[27%] left-[60%]">
          <Button
            onClick={() => goToPage("/airCoolingWaterBuilding2")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value4}
            </span>
          </Button>
        </div>

        <div className="absolute top-[27%] left-[75%]">
          <Button
            onClick={() => goToPage("/waterUsageBuilding2")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value5}
            </span>
          </Button>
        </div>

        <div className="absolute top-[78%] left-[65.2%]">
          <Button
            onClick={() => goToPage("/drinkingWater")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value6}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
