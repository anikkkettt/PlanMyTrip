"use client"

import { useState, useEffect } from "react"

export default function PlaceholderImage({ text, width = 800, height = 600, className = "", alt = "Image" }) {
  const [bgColor, setBgColor] = useState("#f3f4f6")
  const [textColor, setTextColor] = useState("#6b7280")

  // Generate a consistent color based on the text
  useEffect(() => {
    if (text) {
      // Simple hash function to generate a color from text
      let hash = 0
      for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash)
      }

      // Generate a pastel background color
      const h = Math.abs(hash) % 360
      const s = 25 + (Math.abs(hash) % 30) // 25-55% saturation
      const l = 85 + (Math.abs(hash) % 10) // 85-95% lightness

      setBgColor(`hsl(${h}, ${s}%, ${l}%)`)
      setTextColor(`hsl(${h}, ${s + 10}%, 30%)`)
    }
  }, [text])

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: bgColor,
        color: textColor,
        aspectRatio: width / height,
      }}
      aria-label={alt}
    >
      <div className="text-center p-4">
        <div className="text-lg font-medium line-clamp-3">{text || "No image available"}</div>
      </div>
    </div>
  )
}

