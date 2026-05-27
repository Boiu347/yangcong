import { EVIDENCE_SOURCE_MAP } from './evidenceLookup';

/**
 * Look up the source interview file for an evidence quote.
 * Uses a pre-computed exact-key map (100% coverage, built at analysis time).
 */
export function lookupSource(evidence: string, _brand?: string): string | null {
  const plain = evidence.replace(/\*\*/g, '');
  return EVIDENCE_SOURCE_MAP[plain] ?? EVIDENCE_SOURCE_MAP[evidence] ?? null;
}

/**
 * Shorten a source file name for compact display.
 * "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI" → "访谈4 · 北京顺义"
 */
export function shortSource(sourceFileName: string): string {
  const parts = sourceFileName.split('·');
  // parts[0] = "用户访谈N"  parts[1] = "年级"  parts[2] = "城市"
  const numMatch = sourceFileName.match(/访谈(\d+)/);
  const city = parts[2] ?? '';
  if (numMatch && city) {
    return `访谈${numMatch[1]} · ${city}`;
  }
  return parts.slice(0, 2).join(' · ');
}
