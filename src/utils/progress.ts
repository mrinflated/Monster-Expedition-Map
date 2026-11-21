export interface Progress {
  exhibitsViewed: number[];
  huggedFriends: number[];
  islandsVisited: number[];
}

export const PROGRESS_KEY = 'monster-expedition-map.progress.v1';
export const MAX_SAVE_BYTES = 10 * 1024 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseProgress(text: string): Progress {
  let data: unknown;
  try {
    data = JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch {
    throw new Error('This file is not valid JSON. Choose the game file named save.');
  }

  if (!isRecord(data) || !isRecord(data.profile)) {
    throw new Error('Invalid save file: missing profile data. Choose the game file named save.');
  }

  const profile = data.profile;
  const readIds = (field: keyof Progress): number[] => {
    const value = profile[field];
    if (value === undefined) return [];
    if (!Array.isArray(value) || !value.every(id => typeof id === 'number' && Number.isSafeInteger(id))) {
      throw new Error(`Invalid save file: ${field} must be an array of integer IDs.`);
    }
    return [...new Set(value)];
  };

  return {
    exhibitsViewed: readIds('exhibitsViewed'),
    huggedFriends: readIds('huggedFriends'),
    islandsVisited: readIds('islandsVisited'),
  };
}

export function getStats(progress: Progress | null) {
  return {
    exhibitsViewed: progress?.exhibitsViewed.length ?? 0,
    huggedFriends: progress?.huggedFriends.length ?? 0,
    islandsVisited: progress?.islandsVisited.length ?? 0,
  };
}

export function readProgress(storage: Pick<Storage, 'getItem'>): Progress | null {
  try {
    const saved = storage.getItem(PROGRESS_KEY);
    return saved === null ? null : parseProgress(saved);
  } catch {
    return null;
  }
}

export function writeProgress(storage: Pick<Storage, 'setItem'>, progress: Progress): void {
  storage.setItem(PROGRESS_KEY, JSON.stringify({ profile: progress }));
}

interface ProgressSnapshot {
  text: string | null;
  temporary: boolean;
}

const PROGRESS_UPDATED = 'monster-expedition-map:progress-updated';
const SERVER_SNAPSHOT: ProgressSnapshot = { text: null, temporary: false };
let cachedSnapshot = SERVER_SNAPSHOT;
// A failed write still keeps this tab's import across client-side navigation.
let temporaryText: string | null = null;
let temporaryBase: string | null | undefined;

function getStoredText(): string | null | undefined {
  try {
    return window.localStorage.getItem(PROGRESS_KEY);
  } catch {
    return undefined;
  }
}

export function getProgressSnapshot(): ProgressSnapshot {
  const stored = getStoredText();
  // Detect a newer committed value even if the map was not mounted to receive its event.
  if (temporaryText !== null && stored !== undefined && temporaryBase !== undefined && stored !== temporaryBase) {
    temporaryText = null;
  }
  const text = temporaryText ?? stored ?? null;
  const temporary = temporaryText !== null;
  if (cachedSnapshot.text !== text || cachedSnapshot.temporary !== temporary) {
    cachedSnapshot = { text, temporary };
  }
  return cachedSnapshot;
}

export function getServerProgressSnapshot(): ProgressSnapshot {
  return SERVER_SNAPSHOT;
}

export function subscribeProgress(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_KEY || event.key === null) {
      temporaryText = null;
      onChange();
    }
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(PROGRESS_UPDATED, onChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(PROGRESS_UPDATED, onChange);
  };
}

export function saveBrowserProgress(progress: Progress): void {
  const previous = getStoredText();
  try {
    writeProgress(window.localStorage, progress);
    temporaryText = null;
  } catch {
    temporaryText = JSON.stringify({ profile: progress });
    temporaryBase = previous;
  }
  window.dispatchEvent(new Event(PROGRESS_UPDATED));
}
