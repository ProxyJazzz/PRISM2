import { getAuthHeaders } from '../lib/api';

const API_URL = 'http://localhost:5000';

export const uploadProposal = async (file: File) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/proposals/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  return response.json();
};

export const getProposals = async () => {
  const response = await fetch(`${API_URL}/proposals/my`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch proposals');
  return response.json();
};

export const getProposal = async (id: string) => {
  const response = await fetch(`${API_URL}/proposals/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch proposal');
  return response.json();
};

export const getProposalReport = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/proposals/${encodeURIComponent(id)}/report`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) throw new Error('Failed to download report');
  return response.blob();
};

export const getMetricExplanation = async (id: string, metric: string, score: number) => {
  const response = await fetch(`${API_URL}/proposals/${encodeURIComponent(id)}/explanation/${encodeURIComponent(metric.toLowerCase())}?score=${score}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch metric explanation');
  }
  return response.json();
};
