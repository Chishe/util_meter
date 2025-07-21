"use client";
import { useEffect, useState } from "react";
import TypingText from "@/components/TypingText";
export default function Page() {
  const [data, setData] = useState({
    total_sum_wateryear: "รอข้อมูล..",
    total_sum_watermonth: "รอข้อมูล..",
    total_sum_wateryesterday: "รอข้อมูล..",
    total_sum_poweryear: "รอข้อมูล..",
    total_sum_powermonth: "รอข้อมูล..",
    total_sum_poweryesterday: "รอข้อมูล..",
    kwh_treatment_pond: "รอข้อมูล..",
    kwh_wastewater_pump_building1: "รอข้อมูล..",
    kwh_wastewater_pump_building2: "รอข้อมูล..",
    water_in: "รอข้อมูล..",
    water_out: "รอข้อมูล..",
    water_usage_building2: "รอข้อมูล..",
    reused_treated_water: "รอข้อมูล..",
    drinking_water: "รอข้อมูล..",
    air_cooling_water_building1: "รอข้อมูล..",
    air_cooling_water_building2: "รอข้อมูล..",
    water_usage_building1: "รอข้อมูล..",
    status: 0,
  });

  useEffect(() => {
    const socket = new WebSocket("ws://172.16.0.71:1880/ws/dashboard");

    socket.onmessage = (event) => {
      try {
        const res = JSON.parse(event.data);
        console.log("Parsed data:", res);

        setData({
          total_sum_wateryear: res.total_sum_wateryear ?? 0,
          total_sum_watermonth: res.total_sum_watermonth ?? 0,
          total_sum_wateryesterday: res.total_sum_wateryesterday ?? 0,
          total_sum_poweryear: res.total_sum_poweryear ?? 0,
          total_sum_powermonth: res.total_sum_powermonth ?? 0,
          total_sum_poweryesterday: res.total_sum_poweryesterday ?? 0,
          kwh_treatment_pond: res.kwh_treatment_pond ?? 0,
          kwh_wastewater_pump_building1: res.kwh_wastewater_pump_building1 ?? 0,
          kwh_wastewater_pump_building2: res.kwh_wastewater_pump_building2 ?? 0,
          water_in: res.water_in ?? 0,
          water_out: res.water_out ?? 0,
          water_usage_building2: res.water_usage_building2 ?? 0,
          reused_treated_water: res.reused_treated_water ?? 0,
          drinking_water: res.drinking_water ?? 0,
          air_cooling_water_building1: res.air_cooling_water_building1 ?? 0,
          air_cooling_water_building2: res.air_cooling_water_building2 ?? 0,
          water_usage_building1: res.water_usage_building1 ?? 0,
          status: res.status ?? 0
        });
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    };

    return () => {
      socket.close();
    };
  }, []);


  return (
    <div className="grid grid-cols-1 md:grid-cols-7 grid-rows-7 gap-4 p-4 ">
      <div className="bg-muted/50 rounded-xl order-1 min-h-[100px] md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-1">
        <div className="flex items-center justify-between mx-4 md:mx-10 h-full px-4">
          <div className="flex flex-col items-center mr-6">
            <TypingText text="YEAR" />
          </div>
          <div className="flex flex-col justify-center whitespace-nowrap">
            <div className="flex items-center gap-2 mr-6">
              <img
                src="/Battery.gif"
                className="w-[40px] h-[40px]"
                alt="Battery GIF"
              />
              <div>{data.total_sum_poweryear} kWh</div>
            </div>
            <div className="flex items-center gap-2 mr-6">
              <img
                src="/Water.gif"
                className="w-[40px] h-[40px]"
                alt="Water GIF"
              />
              <div>{data.total_sum_wateryear} m³</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl order-2 min-h-[100px] md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-3">
        <div className="flex items-center justify-between mx-4 md:mx-10 h-full px-4">
          <div className="flex flex-col items-center mr-6">
            <TypingText text="MONTH" />
          </div>
          <div className="flex flex-col justify-center whitespace-nowrap">
            <div className="flex items-center gap-2 mr-6">
              <img
                src="/Battery.gif"
                className="w-[40px] h-[40px]"
                alt="Battery GIF"
              />
              <div>{data.total_sum_powermonth} kWh</div>
            </div>
            <div className="flex items-center gap-2 mr-6">
              <img
                src="/Water.gif"
                className="w-[40px] h-[40px]"
                alt="Water GIF"
              />
              <div>{data.total_sum_watermonth} m³</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl order-3 min-h-[100px] md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-5">
        <div className="flex items-center justify-between mx-4 md:mx-10 h-full px-4">
          <div className="flex flex-col items-center mr-6">
            <TypingText text="YESTERDAY" />
          </div>
          <div className="flex flex-col justify-center whitespace-nowrap">
            <div className="flex items-center gap-2 mr-6">
              <img
                src="/Battery.gif"
                className="w-[40px] h-[40px]"
                alt="Battery GIF"
              />
              <div>{data.total_sum_poweryesterday} kWh</div>
            </div>
            <div className="flex items-center gap-2 mr-6">
              <img
                src="/Water.gif"
                className="w-[40px] h-[40px]"
                alt="Water GIF"
              />
              <div>{data.total_sum_wateryesterday} m³</div>
            </div>

          </div>
        </div>
      </div>

      {/* Column 4 */}
      <div className="bg-muted/50 rounded-xl order-4 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-1">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>บ่อบำบัด :</div>
            <div>{data.kwh_treatment_pond} kWh</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-5 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-2">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>บ่อสูบน้ำเสีย อาคาร 1 :</div>
            <div>{data.kwh_wastewater_pump_building1} kWh</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-6 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-3">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>บ่อสูบน้ำเสีย อาคาร 2 :</div>
            <div>{data.kwh_wastewater_pump_building2} kWh</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-7 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-4">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>รวม :</div>
            <div>
              {(
                parseFloat(data.kwh_treatment_pond) +
                parseFloat(data.kwh_wastewater_pump_building1) +
                parseFloat(data.kwh_wastewater_pump_building2)
              ).toFixed(2)}{" "}
              kWh
            </div>

          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-8 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-5">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำเข้า :</div>
            <div>{data.water_in} m³</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-9 min-h-[100px] md:col-span-2 md:col-start-4 md:row-start-6">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำออก :</div>
            <div>{data.water_out} m³</div>
          </div>
        </div>
      </div>

      {/* Column 6 */}
      <div className="bg-muted/50 rounded-xl order-10 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-1">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำแอร์รังผึ้งอาคาร 2 :</div>
            <div>{data.air_cooling_water_building2} m³</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-11 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-2">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำใช้อาคาร 2 :</div>
            <div>{data.water_usage_building2} m³</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-12 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-3">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำบำบัดกลับมาใช้ใหม่ :</div>
            <div>{data.reused_treated_water} m³</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-13 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-4">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำดื่ม :</div>
            <div>{data.drinking_water} m³</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-14 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-5">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำแอร์รังผึ้งอาคาร 1 :</div>
            <div>{data.air_cooling_water_building1} m³</div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl order-15 min-h-[100px] md:col-span-2 md:col-start-6 md:row-start-6">
        <div className="flex items-center justify-between mx-[10vh] h-full px-4">
          <div className="flex items-center mr-6 whitespace-nowrap">
            <img
              src="/Battery.gif"
              className="w-[40px] h-[40px]"
              alt="Battery GIF"
            />
            <div>น้ำใช้อาคาร 1 :</div>
            <div>{data.water_usage_building1} m³</div>
          </div>
        </div>
      </div>

      {/* Footer full width */}
      <div className="bg-muted/50 rounded-xl order-16 min-h-[100px] md:col-span-7 md:row-start-7 overflow-hidden flex items-center">
        <div className="flex flex-col justify-center bg-gray-500 w-full h-[10vh]">
          <div className="animate-marquee2 whitespace-nowrap inline-block w-full">
            {data.status === 1 ? (
              <span className="text-6xl mx-4 text-red-500 font-bold">
                ABNORMAL
              </span>
            ) : (
              <span className="text-6xl mx-4 text-green-500 font-bold">
                NORMAL
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
