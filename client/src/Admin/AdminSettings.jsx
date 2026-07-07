import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import {
  Settings,
  Info,
  Image as ImageIcon,
  Share2,
  FileText,
  Search,
  CheckSquare,
  Loader,
  ArrowLeft,
  Save,
  Trash2,
  Eye
} from 'lucide-react';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { settings: globalSettings, refreshSettings } = useWebsiteSettings();

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    websiteName: '',
    tagline: '',
    developerName: '',
    designation: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: '',
    whatsapp: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    robotsIndex: 'index, follow',
    googleAnalyticsId: '',
    googleSearchConsoleVerification: '',
  });

  // Local file previews
  const [previews, setPreviews] = useState({
    profileImage: '',
    heroImage: '',
    logo: '',
    favicon: '',
    resumePdf: ''
  });

  // Selected files to upload
  const [files, setFiles] = useState({
    profileImage: null,
    heroImage: null,
    logo: null,
    favicon: null,
    resumePdf: null
  });

  // Populate data when globalSettings loads
  useEffect(() => {
    if (globalSettings) {
      setFormData({
        websiteName: globalSettings.websiteName || '',
        tagline: globalSettings.tagline || '',
        developerName: globalSettings.developerName || '',
        designation: globalSettings.designation || '',
        email: globalSettings.email || '',
        phone: globalSettings.phone || '',
        location: globalSettings.location || '',
        github: globalSettings.github || '',
        linkedin: globalSettings.linkedin || '',
        instagram: globalSettings.instagram || '',
        twitter: globalSettings.twitter || '',
        facebook: globalSettings.facebook || '',
        youtube: globalSettings.youtube || '',
        whatsapp: globalSettings.whatsapp || '',
        metaTitle: globalSettings.metaTitle || '',
        metaDescription: globalSettings.metaDescription || '',
        metaKeywords: globalSettings.metaKeywords || '',
        canonicalUrl: globalSettings.canonicalUrl || '',
        robotsIndex: globalSettings.robotsIndex || 'index, follow',
        googleAnalyticsId: globalSettings.googleAnalyticsId || '',
        googleSearchConsoleVerification: globalSettings.googleSearchConsoleVerification || ''
      });

      setPreviews({
        profileImage: globalSettings.profileImage || '',
        heroImage: globalSettings.heroImage || '',
        logo: globalSettings.logo || '',
        favicon: globalSettings.favicon || '',
        resumePdf: globalSettings.resumePdf || ''
      });
    }
  }, [globalSettings]);

  // Handle inputs changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selections
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    setFiles(prev => ({ ...prev, [fieldName]: file }));

    // Generate previews
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or other
      setPreviews(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  // Update text settings
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`${API_URL}settings`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.success) {
        setSuccess('Text settings updated successfully!');
        refreshSettings();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Failed to update settings text data');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Upload profile images
  const handleImagesUpload = async () => {
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const uploadData = new FormData();

      let hasFiles = false;
      if (files.profileImage) { uploadData.append('profileImage', files.profileImage); hasFiles = true; }
      if (files.heroImage) { uploadData.append('heroImage', files.heroImage); hasFiles = true; }
      if (files.logo) { uploadData.append('logo', files.logo); hasFiles = true; }
      if (files.favicon) { uploadData.append('favicon', files.favicon); hasFiles = true; }

      if (!hasFiles) {
        setError('No images selected to upload');
        setSubmitLoading(false);
        return;
      }

      const res = await axios.patch(`${API_URL}settings/images`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data && res.data.success) {
        setSuccess('Images uploaded and updated successfully!');
        // Reset selections
        setFiles({ profileImage: null, heroImage: null, logo: null, favicon: null, resumePdf: null });
        refreshSettings();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload setting images');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Upload resume PDF
  const handleResumeUpload = async () => {
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!files.resumePdf) {
        setError('No resume PDF selected to upload');
        setSubmitLoading(false);
        return;
      }

      const uploadData = new FormData();
      uploadData.append('resumePdf', files.resumePdf);

      const res = await axios.patch(`${API_URL}settings/resume`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data && res.data.success) {
        setSuccess('Resume PDF uploaded and updated successfully!');
        setFiles(prev => ({ ...prev, resumePdf: null }));
        refreshSettings();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload resume PDF');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete resume PDF
  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the registered Resume PDF?')) return;
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.delete(`${API_URL}settings/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.success) {
        setSuccess('Resume PDF deleted successfully!');
        setPreviews(prev => ({ ...prev, resumePdf: '' }));
        setFiles(prev => ({ ...prev, resumePdf: null }));
        refreshSettings();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete resume PDF');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 text-left">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Global Website Settings
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage details, tags, footer details, resume, and profile pictures</p>
            </div>
          </div>
        </div>

        {/* Message banners */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 mb-6 bg-green-50 border border-green-100 text-green-600 rounded-xl text-xs font-bold">
            {success}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0 bg-white border border-gray-100 rounded-2xl p-4 shadow-xs h-fit space-y-1">
            <button
              onClick={() => setActiveTab('basic')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'basic' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Info className="w-4 h-4" /> Basic Information
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'images' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <ImageIcon className="w-4 h-4" /> Profile Images
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'social' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Share2 className="w-4 h-4" /> Social Links
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'resume' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <FileText className="w-4 h-4" /> Resume PDF
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'seo' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Search className="w-4 h-4" /> SEO Settings
            </button>

          </div>

          {/* Form Content Area */}
          <div className="flex-grow bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-xs">

            {/* 1. BASIC INFORMATION TAB */}
            {activeTab === 'basic' && (
              <form onSubmit={handleTextSubmit} className="space-y-6">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Website Name</label>
                    <input
                      type="text"
                      required
                      name="websiteName"
                      value={formData.websiteName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Developer Name</label>
                    <input
                      type="text"
                      required
                      name="developerName"
                      value={formData.developerName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Designation / Role Title</label>
                    <input
                      type="text"
                      name="designation"
                      placeholder="e.g. Full Stack Developer"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Hero Section Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Contact Email</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Contact Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Office Location Address</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Basic Info</>}
                </button>
              </form>
            )}

            {/* 2. PROFILE IMAGES TAB */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Profile & Brand Images</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Profile Image */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Profile Avatar Image</label>
                    {previews.profileImage && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-white">
                        <img src={previews.profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profileImage')}
                      className="text-xxs font-bold text-gray-500"
                    />
                  </div>

                  {/* Hero Illustration */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Hero Banner/Illustration</label>
                    {previews.heroImage && (
                      <div className="aspect-[16/9] max-h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                        <img src={previews.heroImage} alt="Hero banner preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'heroImage')}
                      className="text-xxs font-bold text-gray-500"
                    />
                  </div>

                  {/* Brand Logo */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Branding Logo</label>
                    {previews.logo && (
                      <div className="h-10 max-w-[150px] overflow-hidden border border-gray-200 bg-white p-1 rounded flex items-center justify-center">
                        <img src={previews.logo} alt="Logo preview" className="max-h-full object-contain" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={(e) => handleFileChange(e, 'logo')}
                      className="text-xxs font-bold text-gray-500"
                    />
                  </div>

                  {/* Favicon */}
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Tab Favicon</label>
                    {previews.favicon && (
                      <div className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center p-0.5">
                        <img src={previews.favicon} alt="Favicon preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'favicon')}
                      className="text-xxs font-bold text-gray-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleImagesUpload}
                  disabled={submitLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 mt-4"
                >
                  {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Upload Selected Images</>}
                </button>
              </div>
            )}

            {/* 3. SOCIAL LINKS TAB */}
            {activeTab === 'social' && (
              <form onSubmit={handleTextSubmit} className="space-y-6">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Social Profiles Mapping</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(formData).filter(key => [
                    'github', 'linkedin', 'instagram', 'twitter', 'facebook', 'youtube', 'whatsapp'
                  ].includes(key)).map((social) => (
                    <div key={social}>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">{social} Link URL</label>
                      <input
                        type="text"
                        name={social}
                        value={formData[social]}
                        onChange={handleChange}
                        placeholder={`https://${social}.com/...`}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Social Profiles</>}
                </button>
              </form>
            )}

            {/* 4. RESUME UPLOAD TAB */}
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Resume Document Upload</h2>

                <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/50 space-y-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Resume File (PDF Only)</label>
                  {previews.resumePdf ? (
                    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <FileText className="w-8 h-8 text-red-500 shrink-0" />
                      <div className="flex-grow min-w-0">
                        <span className="block text-xs font-bold text-gray-900 truncate">Current Registered PDF</span>
                        <a
                          href={previews.resumePdf}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-semibold mt-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Uploaded Document
                        </a>
                      </div>
                      <button
                        onClick={handleResumeDelete}
                        className="p-2 border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100 rounded-lg transition-colors"
                        title="Delete resume PDF from server"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 font-semibold">No resume PDF uploaded yet.</p>
                  )}

                  <div className="pt-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, 'resumePdf')}
                      className="text-xxs font-bold text-gray-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={submitLoading || !files.resumePdf}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Upload Selected PDF</>}
                </button>
              </div>
            )}

            {/* 5. SEO SETTINGS TAB */}
            {activeTab === 'seo' && (
              <form onSubmit={handleTextSubmit} className="space-y-6">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Search Engine Optimization (SEO)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Meta Title Tag</label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Canonical URL Link</label>
                    <input
                      type="text"
                      name="canonicalUrl"
                      placeholder="https://yourdomain.com/"
                      value={formData.canonicalUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Meta Description Tag</label>
                    <textarea
                      rows="3"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Meta Keywords (Comma separated)</label>
                    <input
                      type="text"
                      name="metaKeywords"
                      placeholder="react developer, full stack web apps, Node.js"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Robots Index Instructions</label>
                    <select
                      name="robotsIndex"
                      value={formData.robotsIndex}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none bg-white"
                    >
                      <option value="index, follow">index, follow (Indexing Enabled)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Indexing Disabled)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Google Analytics Tracking ID (G-XXXXX)</label>
                    <input
                      type="text"
                      name="googleAnalyticsId"
                      value={formData.googleAnalyticsId}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Google Search Console Verification Tag</label>
                    <input
                      type="text"
                      name="googleSearchConsoleVerification"
                      value={formData.googleSearchConsoleVerification}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save SEO Settings</>}
                </button>
              </form>
            )}


          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
