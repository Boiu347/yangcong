import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchContent, saveContent, seedContent } from '../api/content';
import { isEditor } from '../components/auth/PasswordGate';
import { toast } from 'sonner';

interface UseContentStoreResult<T> {
  data: T;
  saving: boolean;
  save: (next: T) => Promise<void>;
  seed: () => Promise<void>;
  reload: () => Promise<void>;
}

export function useContentStore<T>(
  key: string,
  defaultData: T,
): UseContentStoreResult<T> {
  const [data, setData] = useState<T>(defaultData);
  const [saving, setSaving] = useState(false);
  const defaultRef = useRef(defaultData);

  const load = useCallback(async () => {
    const remote = await fetchContent<T>(key);
    if (remote !== null) {
      setData(remote);
    } else {
      setData(defaultRef.current);
    }
  }, [key]);

  useEffect(() => { void load(); }, [load]);

  const save = useCallback(async (next: T) => {
    setData(next);
    setSaving(true);
    try {
      const ok = await saveContent(key, next);
      if (ok) {
        toast.success('保存成功');
      } else {
        toast.error('保存失败，数据库可能未配置');
      }
    } finally {
      setSaving(false);
    }
  }, [key]);

  const seed = useCallback(async () => {
    if (!isEditor()) return;
    setSaving(true);
    try {
      const ok = await seedContent(key, defaultRef.current);
      if (ok) {
        setData(defaultRef.current);
        toast.success('数据已重置为默认值');
      } else {
        toast.error('重置失败');
      }
    } finally {
      setSaving(false);
    }
  }, [key]);

  return { data, saving, save, seed, reload: load };
}
