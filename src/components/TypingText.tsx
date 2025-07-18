'use client'

import React from 'react'

export default function TypingText({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-max">
        <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-5xl text-white font-bold">
          {text}
        </h1>
      </div>
    </div>
  )
}
