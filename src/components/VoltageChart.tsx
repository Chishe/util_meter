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
  const [voltageR, setVoltageR] = useState<number[]>([]);
  const [voltageS, setVoltageS] = useState<number[]>([]);
  const [voltageT, setVoltageT] = useState<number[]>([]);
  const [upperLine, setUpperLine] = useState<number[]>([]);
  const [lowerLine, setLowerLine] = useState<number[]>([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(500);
  const [colorMin, setColorMin] = useState("#00ff9d");
  const [colorMax, setColorMax] = useState("#ff0000");

  useEffect(() => {
    fetch(minmaxUrl)
      .then((res) => res.json())
      .then((data) => {
        setMin(data.min);
        setMax(data.max);
        setColorMin(data.colorMin ?? "#00FFFF");
        setColorMax(data.colorMax ?? "#FF0000");
      })
      .catch(() => {
        console.warn("ใช้ค่า min/max เริ่มต้น");
      });
  }, [minmaxUrl]);

  useEffect(() => {
    const socket = new WebSocket(ws);

    socket.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const time = new Date().toLocaleTimeString();

      setLabels((prev) => [...prev.slice(-29), time]);
      setVoltageR((prev) => [...prev.slice(-29), res.voltage_R]);
      setVoltageS((prev) => [...prev.slice(-29), res.voltage_S]);
      setVoltageT((prev) => [...prev.slice(-29), res.voltage_T]);
      setUpperLine((prev) => [...prev.slice(-29), max]);
      setLowerLine((prev) => [...prev.slice(-29), min]);
    };

    return () => socket.close();
  }, [ws, min, max]);

  const data = {
    labels,
    datasets: [
      {
        label: "Phase 1",
        data: voltageR,
        borderColor: "#513721",
        backgroundColor: "transparent",
        pointBackgroundColor: "#513721",
      },
      {
        label: "Phase 2",
        data: voltageS,
        borderColor: "#f6ae43",
        backgroundColor: "transparent",
        pointBackgroundColor: "#f6ae43",
      },
      {
        label: "Phase 3",
        data: voltageT,
        borderColor: "#fffc07",
        backgroundColor: "transparent",
        pointBackgroundColor: "#fffc07",
      },
      {
        label: "Upper Limit",
        data: upperLine,
        borderColor: colorMax,
        borderDash: [4, 4],
      },
      {
        label: "Lower Limit",
        data: lowerLine,
        borderColor: colorMin,
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
        min,
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
  );
}
