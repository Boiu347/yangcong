/**
 * Global store for which default interview files are currently "active".
 * Active files control what data appears across Summary, Qualitative, and Competitive pages.
 */

import { useState, useEffect } from 'react';
import { DEFAULT_FILE_DEFS } from './defaultData';
import { EVIDENCE_SOURCE_MAP } from '../utils/evidenceLookup';

const STORAGE_KEY = 'active_default_file_ids';

export const DEFAULT_FILE_IDS = DEFAULT_FILE_DEFS.map((f) => f.id);

// Short display labels for chips
export const DEFAULT_FILE_LABELS: Record<string, string> = {
  default_file_1: '访谈1 · 山东济宁',
  default_file_2: '访谈2 · 北京昌平',
  default_file_3: '访谈3 · 广东中山',
  default_file_4: '访谈4 · 北京顺义',
  default_file_5: '访谈5 · 重庆渝中',
  default_file_6: '访谈6 · 河南郑州',
};

// Map fileId → full source file name (used for filtering evidence)
export const FILE_ID_TO_NAME: Record<string, string> = Object.fromEntries(
  DEFAULT_FILE_DEFS.map((f) => [f.id, f.name]),
);

// Module-level singleton
let _activeIds: Set<string> = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) return new Set(parsed);
    }
  } catch { /* ignore */ }
  // Default: all files active
  return new Set(DEFAULT_FILE_IDS);
})();

const _listeners = new Set<() => void>();

function _persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([..._activeIds]));
  } catch { /* ignore */ }
}

function _broadcast() {
  _persist();
  _listeners.forEach((fn) => fn());
}

export const activeFilesActions = {
  toggle(id: string) {
    const next = new Set(_activeIds);
    if (next.has(id)) {
      if (next.size <= 1) return; // keep at least one selected
      next.delete(id);
    } else {
      next.add(id);
    }
    _activeIds = next;
    _broadcast();
  },
  selectAll() {
    _activeIds = new Set(DEFAULT_FILE_IDS);
    _broadcast();
  },
};

function useSubscribe() {
  const [, rerender] = useState(0);
  useEffect(() => {
    const fn = () => rerender((x) => x + 1);
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  }, []);
}

/** Returns the set of active file IDs, re-renders on change */
export function useActiveFileIds(): Set<string> {
  useSubscribe();
  return _activeIds;
}

/** Returns the set of active file NAMES (for filtering evidence strings) */
export function useActiveFileNames(): Set<string> {
  useSubscribe();
  return new Set([..._activeIds].map((id) => FILE_ID_TO_NAME[id]).filter(Boolean));
}

/**
 * Filter a bullet's evidence list to only include quotes from active files.
 * Used by Qualitative and Competitive pages.
 */
export function filterEvidenceByActiveFiles(evidence: string[]): string[] {
  const activeNames = new Set([..._activeIds].map((id) => FILE_ID_TO_NAME[id]).filter(Boolean));
  return evidence.filter((e) => {
    const src = EVIDENCE_SOURCE_MAP[e];
    return !src || activeNames.has(src); // if no mapping, show it
  });
}

/** Snapshot (non-reactive) version for one-shot filtering */
export function getActiveFileIds(): Set<string> {
  return _activeIds;
}
