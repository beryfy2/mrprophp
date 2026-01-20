export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('mrpro_admin_token') || '';
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeaders() } });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
  try {
      const data = await res.json();
      msg = String((data && (data.error || data.message)) || msg);
    } catch {
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch { void 0; }
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function sendForm<T>(path: string, form: FormData, method: 'POST' | 'PUT' = 'POST') {
  let actualMethod = method;
  let actualPath = path;
  // PHP workaround for PUT with FormData
  if (method === 'PUT') {
    actualMethod = 'POST';
    const separator = path.includes('?') ? '&' : '?';
    actualPath = `${path}${separator}_method=PUT`;
  }

  const res = await fetch(`${API_BASE}${actualPath}`, { method: actualMethod, headers: { ...authHeaders() }, body: form });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
  try {
      const data = await res.json();
      msg = String((data && (data.error || data.message)) || msg);
    } catch {
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch { void 0; }
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function sendJSON<T>(path: string, body: unknown, method: 'POST' | 'PUT' = 'POST') {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
  try {
      const data = await res.json();
      msg = String((data && (data.error || data.message)) || msg);
    } catch {
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch { void 0; }
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function delJSON<T>(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
  try {
      const data = await res.json();
      msg = String((data && (data.error || data.message)) || msg);
    } catch {
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch { void 0; }
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('mrpro_admin_token', data.token);
  return data.token as string;
}

export function logout() {
  localStorage.removeItem('mrpro_admin_token');
}
