import { Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// ── Schema ──────────────────────────────────────────────────────────────────

export const contentStore = pgTable('content_store', {
  key: text('key').primaryKey(),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── Singleton connection ────────────────────────────────────────────────────

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  _client = postgres(url);
  _db = drizzle(_client);
  return _db;
}

// ── CRUD helpers ────────────────────────────────────────────────────────────

const logger = new Logger('ContentDB');

export async function ensureTable() {
  const db = getDb();
  if (!db) return;
  try {
    await (_client!)`
      CREATE TABLE IF NOT EXISTS content_store (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    logger.log('content_store table ready');
  } catch (err) {
    logger.error('Failed to ensure content_store table', err);
  }
}

export async function getContent(key: string): Promise<unknown | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(contentStore).where(eq(contentStore.key, key));
  return rows[0]?.data ?? null;
}

export async function setContent(key: string, data: unknown): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Database not available');
  await db
    .insert(contentStore)
    .values({ key, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: contentStore.key,
      set: { data, updatedAt: new Date() },
    });
}

export async function seedIfEmpty(key: string, defaultData: unknown): Promise<void> {
  const existing = await getContent(key);
  if (existing) {
    logger.log(`content_store["${key}"] already seeded, skipping`);
    return;
  }
  await setContent(key, defaultData);
  logger.log(`content_store["${key}"] seeded with default data`);
}
