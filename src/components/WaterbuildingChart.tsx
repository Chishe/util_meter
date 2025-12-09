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
const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
export function WaterbuildingChart({
  labels,
  water_drinking,
  water_bldg1,
  water_bldg2,
  water_usage1,
  water_usage2,
}: {
  labels: string[];
  water_drinking: number[];
  water_bldg1: number[];
  water_bldg2: number[];
  water_usage1: number[];
  water_usage2: number[];
}) {
  return (
    <div className="w-[1200px] h-[400px]">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "น้ำดื่ม",
              data: water_drinking,
              backgroundColor: '#4C9FEC',
            },
            {
              label: "น้ำแอร์รังผึ้งอาคาร 1",
              data: water_bldg1,
              backgroundColor: '#7ED6A2',
            },
            {
              label: "น้ำแอร์รังผึ้งอาคาร 2",
              data: water_bldg2,
              backgroundColor: '#A29BFE',
            },
            {
              label: "น้ำใช้อาคาร 1",
              data: water_usage1,
              backgroundColor: '#FFB085',
            },
            {
              label: "น้ำใช้อาคาร 2",
              data: water_usage2,
              backgroundColor: '#778CA3',
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
              text: "มิเตอร์กิจกรรมการใช้น้ำ",
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
