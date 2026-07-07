export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/`;

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
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
  const cleanBase = BASE_URL.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
};

export default API_URL;
