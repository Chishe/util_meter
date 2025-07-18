"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from 'lucide-react';

type ThresholdData = {
  max: number;
  min: number | null;
  colorMax: string;
  colorMin: string | null;
  tag: string;
};

export default function ValueThresholdCard({ tag }: { tag: string }) {
  const [data, setData] = useState<ThresholdData | null>(null);
  const [editData, setEditData] = useState<ThresholdData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/thresholds?tag=${encodeURIComponent(tag)}`);
      const json = await res.json();
      setData(json);
      setEditData(json);
    };
    fetchData();
  }, [tag]);

  if (!data || !editData) return <p><Loader /></p>;

  function handleChange(field: keyof ThresholdData, value: string) {
    setEditData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]:
          field === "max" || field === "min"
            ? value === ""
              ? null
              : Number(value)
            : value,
      };
    });
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/thresholds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      const saved = await res.json();
      setData(saved);
      setEditData(saved);
      toast.success("บันทึกข้อมูลสำเร็จ");
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-4 border rounded-sm shadow-md text-white">
      <label className="block font-semibold mb-2">UPPER</label>
      <div className="flex gap-3 mb-4">
        <div className="flex flex-col flex-1">
          <label className="text-sm mb-1">Max Color</label>
          <input
            type="color"
            value={editData.colorMax}
            onChange={(e) => handleChange("colorMax", e.target.value)}
            className="border rounded w-full h-10 cursor-pointer"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm mb-1">Max Value</label>
          <input
            type="number"
            value={editData.max}
            onChange={(e) => handleChange("max", e.target.value)}
            className="border rounded w-full px-2 h-10"
          />
        </div>
      </div>

      {editData.min !== null && (
        <div className="flex gap-3 mb-4">
          <div className="flex flex-col flex-1">
            <label className="text-sm mb-1">Min Color</label>
            <input
              type="color"
              value={editData.colorMin || "#000000"}
              onChange={(e) => handleChange("colorMin", e.target.value)}
              className="border rounded w-full h-10 cursor-pointer"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm mb-1">Min Value</label>
            <input
              type="number"
              value={editData.min ?? ""}
              onChange={(e) => handleChange("min", e.target.value)}
              className="border rounded w-full px-2 h-10"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 inline-flex items-center justify-center"
      >
        {loading ? (
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 me-3 text-white animate-spin mr-2"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591
                 C22.3858 100.591 0 78.2051 0 50.5908
                 C0 22.9766 22.3858 0.59082 50 0.59082
                 C77.6142 0.59082 100 22.9766 100 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539
                 C95.2932 28.8227 92.871 24.3692 89.8167 20.348
                 C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289
                 C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124
                 C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873
                 C39.2613 1.69328 37.813 4.19778 38.4501 6.62326
                 C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071
                 C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491
                 C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552
                 C75.2735 17.9648 79.3347 21.5619 82.5849 25.841
                 C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758
                 C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <Save />
        )}
      </button>

      {/* ใส่ ToastContainer ไว้ใน component นี้ หรือใน root component */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
