"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

interface Props {
  ws: string;
  minmaxUrl: string;
}

export default function VoltageChart({ ws, minmaxUrl }: Props) {
  const [labels, setLabels] = useState<string[]>([]);
  const [voltageR, setM3] = useState<number[]>([]);
  const [upperLine, setUpperLine] = useState<number[]>([]);
  const [max, setMax] = useState(500);

  useEffect(() => {
    fetch(minmaxUrl)
      .then((res) => res.json())
      .then((data) => {
        setMax(data.max);
      })
      .catch(() => {
        console.warn("ใช้ค่า max เริ่มต้น");
      });
  }, [minmaxUrl]);

  useEffect(() => {
    const socket = new WebSocket(ws);

    socket.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const time = new Date().toLocaleTimeString();

      setLabels((prev) => [...prev.slice(-29), time]);
      setM3((prev) => [...prev.slice(-29), res.m3]);
      setUpperLine((prev) => [...prev.slice(-29), max]);
    };

    return () => socket.close();
  }, [ws, max]);

  const data = {
    labels,
    datasets: [
      {
        label: "m3",
        data: voltageR,
        borderColor: "#87CEEB",
        backgroundColor: "transparent",
        pointBackgroundColor: "#87CEEB",
      },
      {
        label: "Upper Limit",
        data: upperLine,
        borderColor: "#ff0000",
        borderDash: [4, 4],
      },
    ],
  };

  const options = {
    animation: {
      duration: 0,
    },
    responsive: true,
    scales: {
      y: {
        max,
        ticks: {
          color: "#adb5bd",
        },
      },
      x: {
        ticks: {
          color: "#adb5bd",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: "#adb5bd",
        },
      },
    },
  };

return (
  <div className="rounded-xl p-4 h-full w-full flex flex-col">
      <Line data={data} options={options} />
  </div>
)
}
