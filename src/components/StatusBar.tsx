"use client";

import { useState, useEffect } from "react";

interface StatusBarProps {
  /** "light" = white text (over dark/image bg), "dark" = black text (over white bg) */
  theme?: "light" | "dark";
  style?: React.CSSProperties;
  className?: string;
}

function useTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    };
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function StatusBar({ theme = "dark", style, className }: StatusBarProps) {
  const time = useTime();
  const color = theme === "light" ? "#fff" : "#0A0A0A";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
        padding: "0 20px",
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Time */}
      <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--font-poppins)", color, letterSpacing: "-0.3px", lineHeight: 1 }}>
        {time}
      </span>

      {/* Right icons: signal + wifi + battery */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Cellular signal — 4 bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"  y="8" width="3" height="4" rx="0.8" fill={color} />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill={color} />
          <rect x="9"  y="3" width="3" height="9" rx="0.8" fill={color} />
          <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill={color} />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" fill={color}/>
          <path d="M3.76 6.56A6.02 6.02 0 0 1 8 4.8c1.63 0 3.1.65 4.24 1.76l1.3-1.3A7.98 7.98 0 0 0 8 3a7.98 7.98 0 0 0-5.54 2.26l1.3 1.3z" fill={color} opacity="0.4"/>
          <path d="M5.88 8.44A3.03 3.03 0 0 1 8 7.6c.82 0 1.57.33 2.12.84l1.3-1.3A4.98 4.98 0 0 0 8 5.8a4.98 4.98 0 0 0-3.42 1.34l1.3 1.3z" fill={color} opacity="0.7"/>
        </svg>

        {/* Battery */}
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={{ position: "relative", width: 24, height: 12, borderRadius: 3.5, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", padding: "1.5px" }}>
            <div style={{ width: "80%", height: "100%", borderRadius: 2, background: color }} />
          </div>
          {/* Battery tip */}
          <div style={{ width: 2, height: 5, borderRadius: "0 1px 1px 0", background: color, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}
