"use client";
import { useEffect, useState } from "react";
import VoltageChart from "@/components/VoltageChart";

export default function Page() {
  const [data, setData] = useState({
    kwh: "รอข้อมูล..",
    voltage_R: "รอข้อมูล..",
    voltage_S: "รอข้อมูล..",
    voltage_T: "รอข้อมูล..",
    current_R: "รอข้อมูล..",
    current_S: "รอข้อมูล..",
    current_T: "รอข้อมูล..",
  });

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.35:1880/ws/meter1");

    socket.addEventListener("message", (event) => {
      const res = JSON.parse(event.data);

      setData({
        kwh: `${res.kwh} kWh`,
        voltage_R: res.voltage_R,
        voltage_S: res.voltage_S,
        voltage_T: res.voltage_T,
        current_R: res.Current_R,
        current_S: res.Current_S,
        current_T: res.Current_T,
      });
    });

    return () => socket.close();
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {/* ซ้าย */}
        <div className="bg-muted/50 aspect-video rounded-xl p-4 flex flex-col justify-between">
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-4xl font-extrabold mb-4 text-center">
              สถานที่ : บ่อสูบน้ำเสียอาคาร 1
            </p>
            <div className="flex items-center">
              <img
                src="/Battery.gif"
                alt="Battery"
                className="w-[150px] h-[150px]"
              />
              <h1 className="ml-4 text-3xl">{data.kwh}</h1>
            </div>
          </div>
        </div>

        {/* กลาง */}
        <div className="bg-muted/50 aspect-video rounded-xl p-4 overflow-auto flex flex-col justify-between h-full">
          <table className="table-auto w-full border-collapse h-full">
            <thead>
              <tr>
                <th className="text-center border-b pb-2 bg">Phase</th>
                <th className="text-center border-b pb-2">Voltage(V)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center align-middle ">
                  <span className="font-bold bg-amber-900 rounded-lg p-2 text-green-500">
                    Phase 1
                  </span>
                </td>
                <td className="text-center align-middle">{data.voltage_R}</td>
              </tr>
              <tr>
                <td className="text-center align-middle">
                  <span className="font-bold bg-yellow-500 rounded-lg p-2 text-green-500">
                    Phase 2
                  </span>
                </td>
                <td className="text-center align-middle">{data.voltage_S}</td>
              </tr>
              <tr>
                <td className="text-center align-middle">
                  <span className="font-bold bg-yellow-300 rounded-lg p-2 text-green-500">
                    Phase 3
                  </span>
                </td>
                <td className="text-center align-middle">{data.voltage_T}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ขวา */}
        <div className="bg-muted/50 aspect-video rounded-xl p-4 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="table-auto w-full border-collapse h-full">
              <thead>
                <tr>
                  <th className="text-center border-b pb-2">Phase</th>
                  <th className="text-center border-b pb-2">Current(A)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center align-middle">
                    <span className="font-bold bg-amber-900 rounded-lg p-2 text-green-500">
                      Phase 1
                    </span>
                  </td>
                  <td className="text-center align-middle">{data.current_R}</td>
                </tr>
                <tr>
                  <td className="text-center align-middle">
                    <span className="font-bold bg-yellow-500 rounded-lg p-2 text-green-500">
                      Phase 2
                    </span>
                  </td>
                  <td className="text-center align-middle">{data.current_S}</td>
                </tr>
                <tr>
                  <td className="text-center align-middle">
                    <span className="font-bold bg-yellow-300 rounded-lg p-2 text-green-500">
                      Phase 3
                    </span>
                  </td>
                  <td className="text-center align-middle">{data.current_T}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* กราฟ */}
      <div className="flex justify-center w-full scroll-wrapper rounded-md shadow bg-zinc-900">
        <VoltageChart
          ws="ws://192.168.1.35:1880/ws/meter1"
          minmaxUrl="/api/threshold?tag=บ่อสูบน้ำเสียอาคาร 1"
        />
      </div>
    </div>
  );
}
