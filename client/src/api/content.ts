import { getStoredPassword } from '../components/auth/PasswordGate';

const headers = () => ({
  'Content-Type': 'application/json',
  'x-access-password': getStoredPassword(),
});

export async function fetchContent<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/content/${key}`, { headers: headers() });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export async function saveContent<T>(key: string, data: T): Promise<boolean> {
  try {
    const res = await fetch(`/api/content/${key}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function seedContent<T>(key: string, data: T): Promise<boolean> {
  try {
    const res = await fetch(`/api/content/${key}/seed`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
