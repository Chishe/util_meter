"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Image from "next/image";

export function ImageAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="w-full space-y-2">
      <Accordion.Item value="item-1" className="border rounded-md">
        <Accordion.Header>
          <Accordion.Trigger className="w-full text-left p-4 bg-gray-800 text-white font-semibold">
            หัวข้อที่ 1
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="p-4 bg-gray-900 flex flex-wrap gap-4">
          <Image
            src="/1.png"
            alt="ภาพที่ 1"
            width={150}
            height={100}
            className="rounded-md"
          />
          <Image
            src="/2.png"
            alt="ภาพที่ 2"
            width={150}
            height={100}
            className="rounded-md"
          />
          <Image
            src="/3.png"
            alt="ภาพที่ 3"
            width={150}
            height={100}
            className="rounded-md"
          />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
