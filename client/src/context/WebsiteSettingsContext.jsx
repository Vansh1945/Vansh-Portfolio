import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const WebsiteSettingsContext = createContext(null);

export const WebsiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}settings`);
      if (res.data && res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching website settings:', err);
      setError(err.message || 'Failed to load website settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Hook for SEO Meta tags updates
  useEffect(() => {
    if (settings) {
      document.title = settings.metaTitle || settings.websiteName || 'Vansh Portfolio';

      // Update or create meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = settings.metaDescription || settings.tagline || '';

      // Update or create meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = settings.metaKeywords || '';

      // Update favicon
      if (settings.favicon) {
        let linkFavicon = document.querySelector('link[rel="icon"]');
        if (!linkFavicon) {
          linkFavicon = document.createElement('link');
          linkFavicon.rel = 'icon';
          document.head.appendChild(linkFavicon);
        }
        linkFavicon.href = settings.favicon;
      }
    }
  }, [settings]);

  return (
    <WebsiteSettingsContext.Provider value={{ settings, loading, error, refreshSettings: fetchSettings }}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
};

export const useWebsiteSettings = () => {
  const context = useContext(WebsiteSettingsContext);
  if (!context) {
    throw new Error('useWebsiteSettings must be used within a WebsiteSettingsProvider');
  }
  return context;
};
