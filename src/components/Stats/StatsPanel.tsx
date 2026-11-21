'use client';

import { useState, useRef, useMemo, useSyncExternalStore, useEffect } from 'react';
import { getStats, MAX_SAVE_BYTES, parseProgress, readProgress, saveBrowserProgress, getProgressSnapshot, getServerProgressSnapshot, subscribeProgress } from '@/utils/progress';

const TOTAL_EXHIBITS = 162;
const TOTAL_FRIENDS = 60;

export default function StatsPanel() {
  const snapshot = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const progress = useMemo(() => readProgress({ getItem: () => snapshot.text }), [snapshot.text]);
  const stats = getStats(progress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importing = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || importing.current) return;

    importing.current = true;
    setIsLoading(true);
    setError(null);

    try {
      if (file.size > MAX_SAVE_BYTES) {
        throw new Error('This file is too large. Choose a save file up to 10 MiB.');
      }
      const imported = parseProgress(await file.text());
      if (!mounted.current) return;
      saveBrowserProgress(imported);
    } catch (err) {
      if (mounted.current) {
        setError(err instanceof Error ? err.message : 'Could not read this file. Choose the game file named save and try again.');
      }
    } finally {
      importing.current = false;
      if (mounted.current) setIsLoading(false);
      // Reset file input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const exhibitPercentage = Math.round((stats.exhibitsViewed / TOTAL_EXHIBITS) * 100);
  const friendPercentage = Math.round((stats.huggedFriends / TOTAL_FRIENDS) * 100);
  const warning = snapshot.temporary
    ? 'Progress loaded for this visit. Browser storage is unavailable, so import your save again after reloading.'
    : snapshot.text !== null && !progress
      ? 'Saved progress could not be restored. Import your game save again.'
      : null;

  return (
    <div className="flex-1 bg-white relative z-10 overflow-y-auto w-full">
      <div className="container mx-auto max-w-4xl p-6">
        {/* Upload Button */}
        <div className="mb-8 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            aria-label="Import game save"
            aria-invalid={Boolean(error)}
            aria-describedby="save-import-feedback save-import-help"
            disabled={isLoading}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-describedby="save-import-feedback save-import-help"
            className="min-w-36 px-6 py-3 bg-primary-green text-white rounded-lg font-semibold cursor-pointer
                       hover:brightness-90 active:brightness-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none
                       shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Importing…' : 'Import save'}
          </button>
          <div id="save-import-feedback" className="mt-2 min-h-12 text-sm">
            {error && <p role="alert" className="text-red-700">{error}</p>}
            {warning && <p role="status" className="text-amber-800">{warning}</p>}
            {!warning && <p role="status" className="text-gray-600">
              {progress ? 'Progress saved in this browser.' : 'Choose your game save to view your progress.'}
            </p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Viewed Exhibits */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-2">Viewed Exhibits</h3>
            <div className="font-serif text-4xl font-bold text-gray-800">
              {stats.exhibitsViewed} / {TOTAL_EXHIBITS}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-primary-green h-2 rounded-full transition-all duration-500 motion-reduce:transition-none" style={{ width: `${Math.min(exhibitPercentage, 100)}%` }}></div>
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
              <div className="bg-primary-green h-2 rounded-full transition-all duration-500 motion-reduce:transition-none" style={{ width: `${Math.min(friendPercentage, 100)}%` }}></div>
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
          <p id="save-import-help">Import your save file (up to 10 MiB) to see which exhibits and friends you&apos;ve found. The file stays on your device; only progress IDs are saved in this browser.</p>
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
