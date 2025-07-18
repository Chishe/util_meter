"use client";

import React, { useState } from "react";
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
import { Trash } from 'lucide-react';
interface AlarmLog {
  id: number;
  location: string;
  event: string;
  status: string;
  created_at: string;
}

interface AlarmTableProps {
  alarms: AlarmLog[];
  onDelete: (id: number) => Promise<void>;
  onSuccess: (id: number) => Promise<void>; 
}

export default function AlarmTable({
  alarms,
  onDelete,
  onSuccess,
}: AlarmTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null); // สำหรับ dialog success

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 m-4">
      <h2 className="text-lg font-semibold mb-4">บันทึกการปิดใช้งานฟังก์ชันแจ้งเตือน (รายวัน)</h2>
      <div className="overflow-auto scroll-wrapper rounded-md border border-gray-300 dark:border-gray-700">
        <table className="w-full border-collapse table-auto text-sm text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">
                ลำดับ
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                วันที่/เวลา (Created At)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                ตำแหน่ง (Location)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                เหตุการณ์ (Event)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                สถานะ (Status)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {alarms.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  ไม่มีข้อมูลการปิดใช้งาน Alarm
                </td>
              </tr>
            )}
            {alarms.map((alarm, i) => (
              <tr
                key={alarm.id}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                }
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {i + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {new Date(alarm.created_at).toLocaleString("th-TH", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {alarm.location}
                </td>

                <td className="border border-gray-300 px-4 py-2 text-center">
                  {alarm.event}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 text-center ${
                    alarm.status === "Stop Alarm"
                      ? "bg-red-600 text-white"
                      : alarm.status === "Use alarm"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  {alarm.status}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center flex justify-center gap-2">
                  {/* ปุ่ม Success */}
                  <AlertDialog
                    open={successId === alarm.id}
                    onOpenChange={(open) => {
                      if (!open) setSuccessId(null);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-800"
                        onClick={() => setSuccessId(alarm.id)}
                      >
                        ใช้งาน alram
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ยืนยันการเปลี่ยนสถานะ
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณต้องการเปลี่ยนสถานะของ Alarm ลำดับที่ {i + 1} เป็น
                          ‘Use alarm’ เพื่อเปิดใช้งานฟังก์ชัน Alarm ใช่หรือไม่?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSuccessId(null)}>
                          ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={async () => {
                            await onSuccess(alarm.id);
                            setSuccessId(null);
                          }}
                        >
                          ยืนยัน
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* ปุ่ม Delete */}
                  <AlertDialog
                    open={deletingId === alarm.id}
                    onOpenChange={(open) => {
                      if (!open) setDeletingId(null);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setDeletingId(alarm.id)}
                      >
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณต้องการลบ Alarm ลำดับที่ {i + 1} ใช่หรือไม่?
                          การลบจะไม่สามารถกู้คืนได้
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingId(null)}>
                          ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={async () => {
                            await onDelete(alarm.id);
                            setDeletingId(null);
                          }}
                        >
                          ลบ
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
