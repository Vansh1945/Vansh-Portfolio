import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/`;

// Global Axios interceptor: auto-redirect to login on expired/invalid token (401)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only redirect if we're on an admin page (not public pages)
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Resolve image URLs to correct absolute paths.
 * - Cloudinary URLs (res.cloudinary.com) are returned as-is.
 * - blob: and data: URLs (local previews) are returned as-is.
 * - Old localhost/uploads URLs are rewritten to use current BASE_URL.
 * - Relative paths are prefixed with BASE_URL.
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  // Local preview URLs — pass through
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  // Cloudinary URLs — already absolute and correct
  if (url.includes('res.cloudinary.com')) {
    return url;
  }
  // Absolute URLs with /uploads/ path (old localhost URLs) — rewrite host
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.pathname.startsWith('/uploads/')) {
        const cleanBase = BASE_URL.replace(/\/$/, '');
        return `${cleanBase}${parsedUrl.pathname}`;
      }
    } catch (e) {
      // Fallback
    }
    return url;
  }
  // Relative paths — prefix with BASE_URL
  const cleanBase = BASE_URL.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
};

export default API_URL;
