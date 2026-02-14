"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  Tooltip,
  ZoomControl,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { initialMarkers } from "@/data/markers";
import { getAssetPath } from "@/utils/paths";

const artifactIcon = new L.Icon({
  iconUrl: getAssetPath("/artifact.png"),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const friendIcon = new L.Icon({
  iconUrl: getAssetPath("/snowman.png"),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const solutionIcon = new L.Icon({
  iconUrl: getAssetPath("/idea.png"),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const mailboxIcon = new L.Icon({
  iconUrl: getAssetPath("/mailbox.png"),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function MouseCoordinates() {
  const map = useMapEvents({
    mousemove(e) {
      if (!isFocused) {
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        setInputValue(
          `${Math.round(e.latlng.lng)}, ${Math.round(e.latlng.lat)}`,
        );
      }
    },
    mouseout() {
      if (!isFocused) {
        setCoords(null);
        setInputValue("");
      }
    },
  });

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parts = inputValue.split(",").map((p) => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        // Input is x (lng), y (lat) -> Leaflet needs [lat, lng]
        // Fly to coordinates and zoom in to max level (5)
        map.flyTo([parts[1], parts[0]], 5);

        e.currentTarget.blur();
      }
    }
  };

  if (!coords && !isFocused && !inputValue) return null;

  return (
    <div className="absolute top-1 left-1 z-[1000]">
      <input
        type="text"
        value={inputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-transparent text-[wheat] px-3 py-1.5 rounded text-lg font-bold font-mono border-none focus:outline-none focus:bg-black/40 focus:ring-1 focus:ring-white/20 transition-colors w-[180px]"
        placeholder="x, y"
      />
    </div>
  );
}

export default function GameMap() {
  const [showExhibits, setShowExhibits] = useState(true);
  const [showFriends, setShowFriends] = useState(true);
  const [showMailboxes, setShowMailboxes] = useState(true);
  const [showSolutions, setShowSolutions] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Filter markers logic
  const visibleMarkers = initialMarkers.filter((marker) => {
    if (marker.type === "friend") return showFriends;
    if (marker.type === "exhibit") return showExhibits;
    if (marker.type === "mailbox") return showMailboxes;
    if (marker.type === "solution") return showSolutions;
    return true; // Show other types by default
  });

  return (
    <div className="h-full w-full bg-black relative">
      {/* Filter Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-stone-300">
        <h3 className="font-bold text-sm mb-2 text-stone-800">Map Filters</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700 hover:text-stone-900">
            <input
              type="checkbox"
              checked={showExhibits}
              onChange={(e) => setShowExhibits(e.target.checked)}
              className="rounded border-stone-400 text-stone-600 focus:ring-stone-500"
            />
            <span>Exhibits</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700 hover:text-stone-900">
            <input
              type="checkbox"
              checked={showFriends}
              onChange={(e) => setShowFriends(e.target.checked)}
              className="rounded border-stone-400 text-stone-600 focus:ring-stone-500"
            />
            <span>Friends</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700 hover:text-stone-900">
            <input
              type="checkbox"
              checked={showMailboxes}
              onChange={(e) => setShowMailboxes(e.target.checked)}
              className="rounded border-stone-400 text-stone-600 focus:ring-stone-500"
            />
            <span>Mailboxes</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700 hover:text-stone-900">
            <input
              type="checkbox"
              checked={showSolutions}
              onChange={(e) => setShowSolutions(e.target.checked)}
              className="rounded border-stone-400 text-stone-600 focus:ring-stone-500"
            />
            <span>Solutions</span>
          </label>
        </div>
      </div>

      <MapContainer
        center={[163, 262]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "black" }}
        crs={L.CRS.Simple}
        minZoom={1.2}
        maxZoom={6}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <ImageOverlay
          url={getAssetPath("/map-v2.webp")}
          bounds={[
            [-36, 0],
            [268, 440],
          ]}
          attribution='&copy; <a href="https://monsterexpedition.tgratzer.com">Taylor Gratzer</a> | &copy; Solutions by <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2239781361">Innocentive</a>'
        />
        <MouseCoordinates />
        {visibleMarkers.map((marker) => {
          const getIcon = () => {
            if (marker.type === "friend") return friendIcon;
            if (marker.type === "mailbox") return mailboxIcon;
            if (marker.type === "solution") return solutionIcon;
            return artifactIcon;
          };

          return (
            <Marker key={marker.id} position={marker.position} icon={getIcon()}>
              {marker.type === "exhibit" && (
                <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
                  <span className="font-bold">{marker.title}</span>
                </Tooltip>
              )}

              {marker.type === "exhibit" && marker.title && (
                <Popup>
                  <div className="max-w-xs">
                    <h3 className="font-bold font-serif text-lg mb-2">
                      {marker.title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {marker.description}
                    </p>
                  </div>
                </Popup>
              )}

              {marker.type === "mailbox" && (
                <Popup minWidth={500} maxWidth={800}>
                  <div className="max-w-sm">
                    <h3 className="font-bold font-mono text-sm mb-2">
                      {marker.position[1]}, {marker.position[0]}
                    </h3>
                  </div>
                </Popup>
              )}

              {marker.type === "solution" && (
                <Popup minWidth={500} maxWidth={800}>
                  <div className="max-w-sm">
                    <h3 className="font-bold font-mono text-sm mb-2">
                      {marker.position[1]}, {marker.position[0]}
                    </h3>
                    <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap mb-2 max-h-48 overflow-y-auto">
                      {marker.solution_text}
                    </pre>
                    {marker.images && marker.images.length > 0 && (
                      <div
                        className={`flex flex-col gap-2 ${marker.images.length > 1 ? "max-h-80 overflow-y-auto" : ""}`}
                      >
                        {marker.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={getAssetPath(`/guide/images/${img}`)}
                            alt={`Solution ${idx + 1}`}
                            className="w-80 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() =>
                              setLightboxImage(
                                getAssetPath(`/guide/images/${img}`),
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setShowHelp(true)}
                      className="absolute bottom-2 right-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Help"
                    >
                      <HelpCircle size={20} />
                    </button>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Solution"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                Solution Instructions
              </h2>
              <button
                className="text-gray-500 text-2xl hover:text-gray-700"
                onClick={() => setShowHelp(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm text-black">
              <div>
                <h3 className="font-bold mb-2">Single Step Directions</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 font-mono">L</td>
                      <td className="border px-2 py-1">Move left</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">R</td>
                      <td className="border px-2 py-1">Move right</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">U</td>
                      <td className="border px-2 py-1">Move up</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">D</td>
                      <td className="border px-2 py-1">Move down</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-2 text-gray-600">
                  Each dash indicates the manipulation of one specific item on
                  an island.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">General Directions</h3>
                <p className="text-gray-600 mb-2">
                  These rely on the UI coordinate display. A direction is
                  completed once the referenced coordinates are displayed.
                </p>
                <table className="w-full border-collapse text-xs">
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 font-mono">N: x - y</td>
                      <td className="border px-2 py-1">
                        Exit north to indicated coordinates
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">W: x - y</td>
                      <td className="border px-2 py-1">
                        Exit west to indicated coordinates
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">S: x - y</td>
                      <td className="border px-2 py-1">
                        Exit south to indicated coordinates
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">E: x - y</td>
                      <td className="border px-2 py-1">
                        Exit east to indicated coordinates
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">R-N: x - y</td>
                      <td className="border px-2 py-1">
                        Exit by raft heading north
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">R-W: x - y</td>
                      <td className="border px-2 py-1">
                        Exit by raft heading west
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">R-S: x - y</td>
                      <td className="border px-2 py-1">
                        Exit by raft heading south
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">R-E: x - y</td>
                      <td className="border px-2 py-1">
                        Exit by raft heading east
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">M: x - y</td>
                      <td className="border px-2 py-1">
                        Exit via mail to indicated coordinates
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">C: x - y</td>
                      <td className="border px-2 py-1">
                        Continue forward until you reach coordinates
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-mono">x - y:</td>
                      <td className="border px-2 py-1">
                        Go to coordinates and continue there
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
