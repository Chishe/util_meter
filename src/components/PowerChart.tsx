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

export function PowerChart({
  labels,
  wastewater_pump_building1,
  wastewater_pump_building2,
  treatment_pond,
}: {
  labels: string[];
  wastewater_pump_building1: number[];
  wastewater_pump_building2: number[];
  treatment_pond: number[];
}) {
  return (
    <div className="w-[1200px] h-[400px]">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "บ่อสูบน้ำเสียอาคาร 1",
              data: wastewater_pump_building1,
              backgroundColor: "#F08080",
            },
            {
              label: "บ่อสูบน้ำเสียอาคาร 2",
              data: wastewater_pump_building2,
              backgroundColor: "#20B2AA",
            },
            {
              label: "บ่อบำบัด",
              data: treatment_pond,
              backgroundColor: "#28b463",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            title: {
              display: true,
              text: "มิเตอร์ไฟฟ้าระบบบำบัด",
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
            tooltip: {
              mode: 'index',
              intersect: false,
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
