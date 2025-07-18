"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface StopAlarmButtonProps {
  location: string;
  status: string; // เปลี่ยนเป็น status เพราะจะกลายเป็น "Stop Alarm" หรือ "Success"
}

export default function StopAlarmButton({ location, status }: StopAlarmButtonProps) {
  const [event, setEvent] = useState(""); // เปลี่ยนจาก reason เป็น event
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStopAlarm = async () => {
    if (!event.trim()) {
      toast.error("กรุณากรอกเหตุการณ์ที่เกิดขึ้น");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/alarm-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          event: event.trim(), // กลายเป็น event
          status,              // ค่าคงที่ เช่น "Stop Alarm"
        }),
      });

      if (!res.ok) throw new Error("Failed to stop alarm");

      toast.success("บันทึก Alarm สำเร็จ");
      setEvent("");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึก Alarm");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={isSubmitting}
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Stop Alarm
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการหยุด Alarm</AlertDialogTitle>
            <AlertDialogDescription>
              กรุณากรอกเหตุการณ์ที่เกิดขึ้นเพื่อหยุด Alarm:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-6 pb-4">
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm resize-none"
              rows={3}
              placeholder="ระบุเหตุการณ์ เช่น ซ่อมแซมท่อประปา, ฯลฯ"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isSubmitting}
              className="bg-gray-300 hover:bg-gray-400 text-white"
            >
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStopAlarm}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ToastContainer />
    </>
  );
}
