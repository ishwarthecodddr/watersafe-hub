export type ReportDTO = {
  id: string;
  reportCode: string;
  location: string;
  coordinates?: string | null;
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  submittedByName?: string | null;
  submittedByEmail?: string | null;
  officialResponse?: string | null;
  actionTaken?: string | null;
  submittedAt: string;
  resolvedAt?: string | null;
};

// Frontend talks to our Express server. Configure via VITE_API_BASE.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5174/api';

if (!import.meta.env.VITE_API_BASE) {
  // Lightweight runtime guard so devs notice misconfiguration earlier.
  // eslint-disable-next-line no-console
  console.warn('[api] VITE_API_BASE not set; using fallback', API_BASE);
}

export async function listReports(): Promise<ReportDTO[]> {
  const res = await fetch(`${API_BASE}/reports`);
  if (!res.ok) throw new Error('Failed to load reports');
  return res.json();
}

export async function createReport(input: any): Promise<ReportDTO> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Failed to create report');
  return res.json();
}
