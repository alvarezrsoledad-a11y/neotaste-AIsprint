import { DiscoverScreen } from "@/components/DiscoverScreen";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#E5E5EA] flex items-center justify-center py-8">
      {/* Phone frame */}
      <div
        className="relative rounded-[54px] overflow-hidden"
        style={{
          width: "414px",
          padding: "12px",
          background: "#1A1A1A",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.1), 0 40px 80px rgba(0,0,0,0.5), inset 0 0 0 2px #333",
        }}
      >
        {/* Inner screen */}
        <div className="rounded-[44px] overflow-hidden">
          <DiscoverScreen />
        </div>
      </div>
    </main>
  );
}
