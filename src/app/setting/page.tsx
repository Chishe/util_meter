"use client";

import { useState } from "react";
import { MapPlus } from "lucide-react";
import ValueThresholdCard from "@/components/ValueThresholdCard";
const tabs = [
  {
    id: "1",
    label: "บ่อบำบัด",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          บ่อบำบัด
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="บ่อบำบัด" />
        </div>
      </>
    ),
  },
  {
    id: "2",
    label: "บ่อสูบน้ำเสียอาคาร 1",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          บ่อสูบน้ำเสียอาคาร 1
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="บ่อสูบน้ำเสียอาคาร 1" />
        </div>
      </>
    ),
  },
  {
    id: "3",
    label: "บ่อสูบน้ำเสียอาคาร 2",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          บ่อสูบน้ำเสียอาคาร 2
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="บ่อสูบน้ำเสียอาคาร 2" />
        </div>
      </>
    ),
  },
  {
    id: "4",
    label: "น้ำเข้า",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำเข้า
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำเข้า" />
        </div>
      </>
    ),
  },
  {
    id: "5",
    label: "น้ำออก",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำออก
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำออก" />
        </div>
      </>
    ),
  },
  {
    id: "6",
    label: "น้ำใช้อาคาร 2",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำใช้อาคาร 2
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำใช้อาคาร 2" />
        </div>
      </>
    ),
  },
  {
    id: "7",
    label: "น้ำแอร์รังผึ้งอาคาร 2",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำแอร์รังผึ้งอาคาร 2
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำแอร์รังผึ้งอาคาร 2" />
        </div>
      </>
    ),
  },

  {
    id: "8",
    label: "น้ำบำบัดกลับมาใช้ใหม่",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำบำบัดกลับมาใช้ใหม่
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำบำบัดกลับมาใช้ใหม่" />
        </div>
      </>
    ),
  },
  {
    id: "9",
    label: "น้ำดื่ม",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำดื่ม
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำดื่ม" />
        </div>
      </>
    ),
  },
  {
    id: "10",
    label: "น้ำแอร์รังผึ้งอาคาร 1",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำแอร์รังผึ้งอาคาร 1
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำแอร์รังผึ้งอาคาร 1" />
        </div>
      </>
    ),
  },
  {
    id: "11",
    label: "น้ำใช้อาคาร 1",
    content: (
      <>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          น้ำใช้อาคาร 1
        </h3>
        <div className="flex justify-center">
          <ValueThresholdCard tag="น้ำใช้อาคาร 1" />
        </div>
      </>
    ),
  },
];

export default function page() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 m-4">
      <div className="md:flex">
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-700 text-white dark:bg-blue-600"
                    : "bg-gray-50 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <span className="me-2 text-amber-200">
                  <MapPlus />
                </span>
                {tab.label}
              </button>
            </li>
          ))}

          <li>
            <button
              disabled
              className="inline-flex items-center px-4 py-3 text-gray-400 rounded-lg cursor-not-allowed bg-gray-50 w-full dark:bg-gray-800 dark:text-gray-500"
            >
              <span className="me-2">❌</span>
              Disabled
            </button>
          </li>
        </ul>

        <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}
