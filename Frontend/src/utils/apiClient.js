import axios from 'axios';

const rawBase = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || (process && process.env && process.env.REACT_APP_API_URL) || 'http://localhost:5000';
export const API_BASE = rawBase.replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export default api;

export function endpoint(path = '') {
  if (!path) return API_BASE;
  return API_BASE + (path.startsWith('/') ? path : `/${path}`);
}
