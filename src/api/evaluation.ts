import { getAuthHeaders } from '../lib/api';

const API_URL = 'http://localhost:5000';

export const chatWithProposal = async (id: string, message: string) => {
  const response = await fetch(`${API_URL}/proposals/${encodeURIComponent(id)}/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error('Chat request failed');
  return response.json();
};
