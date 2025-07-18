"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { websocketTreatmentwater } from "@/config/websocketTreatmentwater";

export default function Page() {
  const [values, setValues] = useState<Record<string, React.ReactNode>>({
    value1: "รอข้อมูล...",
    value2: "รอข้อมูล...",
    value4: "รอข้อมูล...",
    value5: "รอข้อมูล...",
    value6: "รอข้อมูล...",
    value7: "รอข้อมูล...",
  });

  useEffect(() => {
    websocketTreatmentwater.forEach(({ id, url, label, unit }) => {
      const socket = new WebSocket(url);

      socket.onmessage = (event) => {
        const res = JSON.parse(event.data);
        const value = res?.m3 ?? 0;

        const iconSrc = unit === "kWh" ? "/Battery.gif" : "/Water.gif";

        setValues((prev) => ({
          ...prev,
          [id]: (
            <span className="flex items-center gap-2">
              <img src={iconSrc} className="w-6 h-6 inline" alt={unit} />
              {label}: {value.toFixed(2)} {unit}
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
        <div className="absolute inset-0 bg-[url('/layout-treatment-water.png')] bg-no-repeat bg-center bg-contain" />

        <div className="absolute top-[27%] left-[72%]">
          <Button
            onClick={() => goToPage("/wastewaterPumpBuilding2")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value1}
            </span>
          </Button>
        </div>

        <div className="absolute top-[27%] left-[48%]">
          <Button
            onClick={() => goToPage("/wastewaterPumpBuilding1")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value2}
            </span>
          </Button>
        </div>

        <div className="absolute top-[27%] left-[22%]">
          <Button
            onClick={() => goToPage("/treatmentPond")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value4}
            </span>
          </Button>
        </div>

        <div className="absolute top-[47%] left-[55%]">
          <Button
            onClick={() => goToPage("/waterIn")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value6}
            </span>
          </Button>
        </div>

        <div className="absolute top-[47%] left-[80%]">
          <Button
            onClick={() => goToPage("/waterOut")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value6}
            </span>
          </Button>
        </div>
        <div className="absolute top-[40%] left-[63.7%]">
          <Button
            onClick={() => goToPage("/reusedTreatedWater")}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              {values.value7}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
