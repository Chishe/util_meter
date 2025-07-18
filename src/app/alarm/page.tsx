"use client";

import React, { useEffect, useState } from "react";
import AlarmTable from "@/components/AlarmTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AlarmLog = {
  id: number;
  location: string;
  event: string;
  status: string;
  created_at: string;
};

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<AlarmLog[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchAlarms() {
    setLoading(true);
    try {
      const res = await fetch("/api/alarm-table");
      const data = await res.json();
      setAlarms(data);
    } catch {
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/alarm-table?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบข้อมูลไม่สำเร็จ");
      toast.success("ลบข้อมูลสำเร็จ");
      fetchAlarms();
    } catch (error) {
      toast.error("ลบข้อมูลไม่สำเร็จ");
      console.error(error);
    }
  }

  async function handleSuccess(id: number) {
    try {
      const alarm = alarms.find((a) => a.id === id);
      if (!alarm) throw new Error("ไม่พบข้อมูล Alarm");

      const res = await fetch("/api/alarm-table", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: alarm.location,
          event: alarm.event,
          status: "Use alarm",
        }),
      });
      if (!res.ok) throw new Error("อัพเดตสถานะไม่สำเร็จ");
      toast.success("เปลี่ยนสถานะเป็น Use alarm เรียบร้อยแล้ว");
      fetchAlarms();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAlarms();
  }, []);

  return (
    <>
      <AlarmTable
        alarms={alarms}
        onDelete={handleDelete}
        onSuccess={handleSuccess}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
