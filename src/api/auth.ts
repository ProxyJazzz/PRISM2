import { getAuthHeaders } from '../lib/api';

const API_URL = 'http://localhost:5000';

export const getMe = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Not authenticated');
  return response.json();
};
