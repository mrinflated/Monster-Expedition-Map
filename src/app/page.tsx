import Header from "@/components/Layout/Header";
import MapWrapper from "@/components/Map/MapWrapper";
import StatsPanel from "@/components/Stats/StatsPanel";

export default function Home() {
  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-white">
      {/* Map Area - 70% height */}
      <div className="basis-[70%] w-full relative shrink-0 bg-map-water">
        <MapWrapper />
      </div>
      
      {/* Navigation Bar */}
      <Header />
      
      {/* Stats Section - Fills remaining space */}
      <StatsPanel />
    </main>
  );
}
