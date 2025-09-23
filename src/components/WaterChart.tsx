"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export function WaterChart({
  labels,
  waterIn,
  waterOutPlusReused,
}: {
  labels: string[];
  waterIn: number[];
  waterOutPlusReused: number[];
}) {
  return (
    <div className="w-[1200px] h-[400px]">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "น้ำเข้า",
              data: waterIn,
              backgroundColor: "#F08080",
            },
            {
              label: "น้ำออก + น้ำกลับมาใช้ใหม่",
              data: waterOutPlusReused,
              backgroundColor: "#20B2AA",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction:{
            mode:'index',
            intersect:false
          },
          plugins: {
            title: {
              display: true,
              text: "มิเตอร์น้ำระบบบำบัด",
              font: {
                size: 20,
              },
              color: "#fff", // ทำให้ title เป็นสีขาว
            },
            legend: {
              position: "top",
              labels: {
                color: "#fff", // ทำให้ legend เป็นสีขาว
              },
            },
            tooltip:{
              mode:'index',
              intersect:false,
            },
          },
          scales: {
            x: {
              ticks: { color: "#fff" }, // ทำให้แกน x เป็นสีขาว
            },
            y: {
              ticks: { color: "#fff" }, // ทำให้แกน y เป็นสีขาว
              title: {
                display: true,
                text: "ปริมาณ (m³)",
                color: "#fff", // ทำให้ title แกน y เป็นสีขาว
              },
            },
          },
        }}
      />
    </div>
  );
}
