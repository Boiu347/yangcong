import { useState, useEffect } from 'react';
import { Project, ProjectFile, BrandReport, SummaryData } from '../types/voc';
import { buildDefaultProject } from './defaultData';
import { useActiveFileIds } from './activeFilesStore';

const STORAGE_KEY = 'voc_projects_v3';

// ── Data migration helpers ────────────────────────────────────────────────

/** Ensure every element in a string array is actually a string (AI sometimes returns objects) */
function normalizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        return String(o.finding ?? o.text ?? o.content ?? o.description ?? o.item ?? JSON.stringify(item));
      }
      return String(item);
    })
    .filter(Boolean);
}

/** Migrate a raw project object loaded from localStorage to the current Project shape */
function migrateProject(raw: Record<string, unknown>): Project {
  const p = raw as unknown as Project;

  // Migrate summaryData.coreFindings / actionItems if they contain objects
  if (p.summaryData) {
    p.summaryData = {
      ...p.summaryData,
      coreFindings: normalizeStringArray(p.summaryData.coreFindings),
      actionItems: normalizeStringArray(p.summaryData.actionItems),
    };
  }

  // Ensure files array exists
  if (!Array.isArray(p.files)) {
    (p as unknown as Record<string, unknown>).files = [];
  }

  return p;
}

// ── Module-level singleton (shared across all hook instances) ──────────────

const _listeners = new Set<() => void>();

function _persist(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('persist failed', e);
  }
}

let _projects: Project[] = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First run: seed with default project containing real interview data
      const defaultProject = buildDefaultProject();
      const initial = [defaultProject];
      _persist(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [buildDefaultProject()];
      _persist(initial);
      return initial;
    }
    const migrated = parsed.map((p) => migrateProject(p as Record<string, unknown>));
    // Ensure the default project is always present (inject if missing)
    const defaultIdx = migrated.findIndex((p) => p.id === 'default_project');
    if (defaultIdx === -1) {
      const injected = [...migrated, buildDefaultProject()];
      _persist(injected);
      return injected;
    }
    // Also restore default files if user deleted them
    const defaultProj = migrated[defaultIdx];
    const hasDefaultFiles = defaultProj.files.some((f) => f.id === 'default_file_1');
    if (!hasDefaultFiles) {
      const restored = buildDefaultProject();
      migrated[defaultIdx] = { ...defaultProj, files: restored.files };
      _persist(migrated);
    }
    return migrated;
  } catch {
    const fallback = [buildDefaultProject()];
    _persist(fallback);
    return fallback;
  }
})();

function _broadcast() {
  _persist(_projects);
  _listeners.forEach((fn) => fn());
}

// ── Actions (callable outside React) ─────────────────────────────────────

export const projectActions = {
  create(name: string): Project {
    const p: Project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: Date.now(),
      files: [],
    };
    _projects = [p, ..._projects];
    _broadcast();
    return p;
  },

  delete(id: string) {
    _projects = _projects.filter((p) => p.id !== id);
    _broadcast();
  },

  rename(id: string, name: string) {
    _projects = _projects.map((p) => (p.id === id ? { ...p, name } : p));
    _broadcast();
  },

  addFile(projectId: string, file: ProjectFile) {
    _projects = _projects.map((p) =>
      p.id !== projectId ? p : { ...p, files: [file, ...p.files] },
    );
    _broadcast();
  },

  updateFile(
    projectId: string,
    fileId: string,
    updates: Partial<ProjectFile>,
  ) {
    _projects = _projects.map((p) =>
      p.id !== projectId
        ? p
        : {
            ...p,
            files: p.files.map((f) =>
              f.id === fileId ? { ...f, ...updates } : f,
            ),
          },
    );
    _broadcast();
  },

  removeFile(projectId: string, fileId: string) {
    _projects = _projects.map((p) =>
      p.id !== projectId
        ? p
        : { ...p, files: p.files.filter((f) => f.id !== fileId) },
    );
    _broadcast();
  },

  setSummary(projectId: string, data: SummaryData) {
    _projects = _projects.map((p) =>
      p.id !== projectId ? p : { ...p, summaryData: data },
    );
    _broadcast();
  },

  setBrandReports(projectId: string, data: Record<string, BrandReport>) {
    _projects = _projects.map((p) =>
      p.id !== projectId ? p : { ...p, brandReports: data },
    );
    _broadcast();
  },

  clearReports(projectId: string) {
    _projects = _projects.map((p) =>
      p.id !== projectId
        ? p
        : { ...p, summaryData: undefined, brandReports: undefined },
    );
    _broadcast();
  },
};

// ── React hooks ───────────────────────────────────────────────────────────

function useSubscribe() {
  const [, rerender] = useState(0);
  useEffect(() => {
    const fn = () => rerender((x) => x + 1);
    _listeners.add(fn);
    return () => {
      _listeners.delete(fn);
    };
  }, []);
}

/** Returns the full project list, re-renders on any change */
export function useProjects(): Project[] {
  useSubscribe();
  return _projects;
}

/** Returns a single project by id, re-renders on any change */
export function useProject(id: string | undefined): Project | undefined {
  useSubscribe();
  return id ? _projects.find((p) => p.id === id) : undefined;
}

/** Returns all VOCItems across all ready files in a project, filtered by active default files */
export function useProjectVOCs(id: string | undefined) {
  useSubscribe();
  const activeIds = useActiveFileIds();
  const project = id ? _projects.find((p) => p.id === id) : undefined;
  if (!project) return [];
  return project.files
    .filter((f) => f.status === 'ready')
    .filter((f) => !f.id.startsWith('default_file_') || activeIds.has(f.id))
    .flatMap((f) => f.vocList);
}
