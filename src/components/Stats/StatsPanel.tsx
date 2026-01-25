'use client';

import { useState, useRef } from 'react';

interface SaveData {
  profile?: {
    islandsVisited?: number[];
    exhibitsViewed?: number[];
    huggedFriends?: number[];
  };
}

interface Stats {
  exhibitsViewed: number;
  huggedFriends: number;
  islandsVisited: number;
}

const TOTAL_EXHIBITS = 162;
const TOTAL_FRIENDS = 60;

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats>({
    exhibitsViewed: 0,
    huggedFriends: 0,
    islandsVisited: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const saveData: SaveData = JSON.parse(text);

      if (!saveData.profile) {
        throw new Error('Invalid save file: missing profile data');
      }

      const exhibitsViewed = saveData.profile.exhibitsViewed?.length ?? 0;
      const huggedFriends = saveData.profile.huggedFriends?.length ?? 0;
      // Get unique islands visited
      const uniqueIslands = new Set(saveData.profile.islandsVisited ?? []);
      const islandsVisited = uniqueIslands.size;

      setStats({
        exhibitsViewed,
        huggedFriends,
        islandsVisited,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse save file');
    } finally {
      setIsLoading(false);
      // Reset file input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const exhibitPercentage = Math.round((stats.exhibitsViewed / TOTAL_EXHIBITS) * 100);
  const friendPercentage = Math.round((stats.huggedFriends / TOTAL_FRIENDS) * 100);

  return (
    <div className="flex-1 bg-white relative z-10 overflow-y-auto w-full">
      <div className="container mx-auto max-w-4xl p-6">
        {/* Upload Button */}
        <div className="mb-8 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="*"
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="px-6 py-3 bg-primary-green text-white rounded-lg font-semibold 
                       hover:bg-opacity-90 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Loading...' : 'Upload Save'}
          </button>
          {error && (
            <p className="mt-2 text-red-500 text-sm">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Viewed Exhibits */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-2">Viewed Exhibits</h3>
            <div className="font-serif text-4xl font-bold text-gray-800">
              {stats.exhibitsViewed} / {TOTAL_EXHIBITS}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-primary-green h-2 rounded-full transition-all duration-500" style={{ width: `${exhibitPercentage}%` }}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">({exhibitPercentage}%)</div>
          </div>

          {/* Hugged Friends */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-2">Hugged Friends</h3>
            <div className="font-serif text-4xl font-bold text-gray-800">
              {stats.huggedFriends} / {TOTAL_FRIENDS}
            </div>
             <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-primary-green h-2 rounded-full transition-all duration-500" style={{ width: `${friendPercentage}%` }}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">({friendPercentage}%)</div>
          </div>

          {/* Visited Islands */}
          <div className="flex flex-col items-center">
             <h3 className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-2">Visited Islands</h3>
            <div className="font-serif text-4xl font-bold text-gray-800">
              {stats.islandsVisited}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              (Unique islands visited)
            </div>
          </div>

        </div>

        <div className="mt-12 text-center text-sm text-gray-500 space-y-3">
          <p>Load your save file to see which exhibits and friends you&apos;ve found!</p>
          <p>
            Select the latest file named <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">save</code> (not an image!) under the numbered save slot folder.
          </p>
          <div className="text-xs space-y-2 mt-4">
            <div className="flex items-center justify-center gap-2">
              <strong className="text-gray-600">Windows:</strong>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono break-all">
                %USERPROFILE%\AppData\LocalLow\Draknek and Friends\A Monster&apos;s Expedition\&lt;Slot-Number&gt;
              </code>
              <button
                onClick={() => navigator.clipboard.writeText('%USERPROFILE%\\AppData\\LocalLow\\Draknek and Friends\\A Monster\'s Expedition\\<Slot-Number>')}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy Windows path"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <strong className="text-gray-600">Linux:</strong>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono break-all">
                &lt;Steam-folder&gt;/steamapps/compatdata/1052990/pfx/&lt;Slot-Number&gt;
              </code>
              <button
                onClick={() => navigator.clipboard.writeText('<Steam-folder>/steamapps/compatdata/1052990/pfx/<Slot-Number>')}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy Linux path"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
