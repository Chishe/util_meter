
"use client";
import { useEffect, useState } from "react";
import CubeChart from "@/components/CubeChart";
import StopAlarmButton from "@/components/StopAlarmButton";
export default function Page() {
  const [data, setData] = useState({
    m3: "รอข้อมูล..",
  });

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.35:1880/ws/meter2");

    socket.addEventListener("message", (event) => {
      const res = JSON.parse(event.data);

      setData({
        m3: `${res.m3} m3`,
      });
    });

    return () => socket.close();
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* ซ้าย */}
        <div className="bg-muted/50 aspect-video rounded-xl p-4 flex flex-col justify-between h-[250px] w-full">
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-4xl font-extrabold mb-4 text-center">
              สถานที่ : น้ำดื่ม
            </p>
            <div className="flex items-center">
              <img
                src="/Battery.gif"
                alt="Battery"
                className="w-[150px] h-[150px]"
              />
              <h1 className="ml-4 text-3xl">{data.m3}</h1>
            </div>
          </div>
        </div>
        {/* ขวา */}
        <div className="bg-muted/50 aspect-video rounded-xl p-4 overflow-auto flex justify-center items-center  h-[250px] w-full">
          <div className="flex flex-col items-center justify-center h-full">
            <StopAlarmButton location="น้ำดื่ม" status="Stop Alarm"/>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full scroll-wrapper rounded-md shadow bg-zinc-900">
        <CubeChart
          ws="ws://192.168.1.35:1880/ws/meter1"
          minmaxUrl="/api/threshold?tag=น้ำดื่ม"
        />
      </div>
    </div>
  );
}
