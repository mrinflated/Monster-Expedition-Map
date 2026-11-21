import assert from 'node:assert/strict';
import test from 'node:test';
import { parseProgress, getStats, readProgress, writeProgress, PROGRESS_KEY } from '../src/utils/progress.ts';
import * as progressModule from '../src/utils/progress.ts';

test('import keeps unique progress IDs and discards unrelated save data', () => {
  const progress = parseProgress(JSON.stringify({
    profile: { exhibitsViewed: [0, 7, 7], huggedFriends: [5, 5], islandsVisited: [2, 3, 2], privateData: 'ignored' },
    otherData: 'ignored',
  }));
  assert.deepEqual(progress, { exhibitsViewed: [0, 7], huggedFriends: [5], islandsVisited: [2, 3] });
  assert.deepEqual(getStats(progress), { exhibitsViewed: 2, huggedFriends: 1, islandsVisited: 2 });
});

test('empty progress arrays may be omitted and UTF-8 BOM is accepted', () => {
  assert.deepEqual(parseProgress('\uFEFF{"profile":{}}'), { exhibitsViewed: [], huggedFriends: [], islandsVisited: [] });
});

test('malformed files and non-object profiles are rejected', () => {
  for (const text of ['invalid', 'null', '{}', '{"profile":null}', '{"profile":[]}', '{"profile":"abc"}']) {
    assert.throws(() => parseProgress(text), Error);
  }
});

test('integer IDs retain their sign instead of inventing a positive-only restriction', () => {
  assert.deepEqual(parseProgress('{"profile":{"exhibitsViewed":[-1,0,2,-1]}}').exhibitsViewed, [-1, 0, 2]);
});

test('every progress field requires an array of safe integers', () => {
  for (const field of ['exhibitsViewed', 'huggedFriends', 'islandsVisited']) {
    for (const value of ['abc', null, {}, [true], ['2'], [1.5], [null], [Number.MAX_SAFE_INTEGER + 1]]) {
      assert.throws(() => parseProgress(JSON.stringify({ profile: { [field]: value } })), Error);
    }
  }
});

test('progress survives a fresh storage read without retaining the full save', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const progress = parseProgress('{"profile":{"exhibitsViewed":[2],"huggedFriends":[3],"islandsVisited":[4],"extra":"not retained"}}');
  writeProgress(storage, progress);
  assert.deepEqual(readProgress(storage), { exhibitsViewed: [2], huggedFriends: [3], islandsVisited: [4] });
  assert.equal(values.has(PROGRESS_KEY), true);
  assert.equal(values.get(PROGRESS_KEY).includes('not retained'), false);
});

test('missing or corrupt saved progress falls back safely', () => {
  for (const value of [null, 'broken', '{"profile":{"huggedFriends":"wrong"}}']) {
    assert.equal(readProgress({ getItem: () => value }), null);
  }
  assert.equal(readProgress({ getItem: () => { throw new Error('Storage blocked'); } }), null);
});

test('storage write failures are surfaced so the UI cannot claim progress was saved', () => {
  assert.throws(() => writeProgress({ setItem: () => { throw new Error('Quota exceeded'); } }, {
    exhibitsViewed: [], huggedFriends: [], islandsVisited: [],
  }), /Quota exceeded/);
});

test('temporary imports survive resubscription and yield to a newer cross-tab import', () => {
  assert.equal(typeof progressModule.saveBrowserProgress, 'function');
  const previousWindow = globalThis.window;
  const values = new Map();
  const browser = new EventTarget();
  browser.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: () => { throw new Error('Quota exceeded'); },
  };
  globalThis.window = browser;
  let unsubscribe;
  try {
    unsubscribe = progressModule.subscribeProgress(() => {});
    progressModule.saveBrowserProgress({ exhibitsViewed: [1, 2], huggedFriends: [], islandsVisited: [] });
    assert.equal(progressModule.getProgressSnapshot().temporary, true);
    unsubscribe();
    unsubscribe = progressModule.subscribeProgress(() => {});
    assert.equal(progressModule.getProgressSnapshot().temporary, true);
    assert.equal(getStats(parseProgress(progressModule.getProgressSnapshot().text)).exhibitsViewed, 2);
    values.set(PROGRESS_KEY, '{"profile":{"exhibitsViewed":[9]}}');
    browser.dispatchEvent(Object.assign(new Event('storage'), { key: PROGRESS_KEY }));
    assert.equal(progressModule.getProgressSnapshot().temporary, false);
    assert.equal(getStats(parseProgress(progressModule.getProgressSnapshot().text)).exhibitsViewed, 1);
    values.delete(PROGRESS_KEY);
    browser.dispatchEvent(Object.assign(new Event('storage'), { key: PROGRESS_KEY }));
    assert.equal(progressModule.getProgressSnapshot().text, null);
  } finally {
    unsubscribe?.();
    globalThis.window = previousWindow;
  }
});

test('a committed change made while unsubscribed supersedes temporary progress', () => {
  assert.equal(typeof progressModule.saveBrowserProgress, 'function');
  const previousWindow = globalThis.window;
  let stored = null;
  const browser = new EventTarget();
  browser.localStorage = { getItem: () => stored, setItem: () => { throw new Error('Quota exceeded'); } };
  globalThis.window = browser;
  try {
    progressModule.saveBrowserProgress({ exhibitsViewed: [1], huggedFriends: [], islandsVisited: [] });
    stored = '{"profile":{"exhibitsViewed":[7,8]}}';
    const snapshot = progressModule.getProgressSnapshot();
    assert.equal(snapshot.temporary, false);
    assert.equal(getStats(parseProgress(snapshot.text)).exhibitsViewed, 2);
    stored = null;
    progressModule.getProgressSnapshot();
  } finally {
    globalThis.window = previousWindow;
  }
});
