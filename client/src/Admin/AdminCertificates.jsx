import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import {
  Award,
  Trash2,
  Edit,
  Plus,
  X,
  Upload,
  ExternalLink,
  ArrowLeft,
  Loader,
  Eye
} from 'lucide-react';
import Pagination from './Pagination';

const AdminCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [category, setCategory] = useState('Course');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const openAddForm = () => {
    setEditMode(false);
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setDate('');
    setCredentialId('');
    setCategory('Course');
    setDescription('');
    setDisplayOrder(0);
    setImageFile(null);
    setImagePreview(null);
    setError('');
    setShowAddForm(true);
  };

  const openEditForm = (cert) => {
    setEditMode(true);
    setEditingId(cert._id);
    setTitle(cert.title || '');
    setIssuer(cert.issuer || '');
    setDate(cert.date || '');
    setCredentialId(cert.credentialId || '');
    setCategory(cert.category || 'Course');
    setDescription(cert.description || '');
    setDisplayOrder(cert.displayOrder || 0);
    setImageFile(null);
    setImagePreview(cert.image || null);
    setError('');
    setShowAddForm(true);
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}certificates`);
      if (res.data && res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editMode && !imageFile) {
      setError('Please select a certificate image file to upload.');
      return;
    }

    setSubmitLoading(true);
    const token = localStorage.getItem('adminToken');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('issuer', issuer);
    formData.append('date', date);
    formData.append('credentialId', credentialId);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('displayOrder', displayOrder);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let res;
      if (editMode) {
        res = await axios.put(`${API_URL}certificates/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        res = await axios.post(`${API_URL}certificates`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }

      if (res.data && res.data.success) {
        setSuccess(editMode ? 'Certificate updated successfully!' : 'Certificate added successfully!');
        // Reset Form
        setTitle('');
        setIssuer('');
        setDate('');
        setCredentialId('');
        setCategory('Course');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        setShowAddForm(false);
        setEditMode(false);
        setEditingId(null);
        // Refresh Certificates
        fetchCertificates();
      }
    } catch (err) {
      console.error('Error saving certificate:', err);
      setError(err.response?.data?.message || 'Failed to save certificate.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.delete(`${API_URL}certificates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data && res.data.success) {
        setSuccess('Certificate deleted successfully!');
        fetchCertificates();
      }
    } catch (err) {
      console.error('Error deleting certificate:', err);
      setError(err.response?.data?.message || 'Failed to delete certificate.');
    }
  };

  return (
    <div className="min-h-screen bg-backgroundLightAlt pt-12 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Navigation */}
        <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Manage Certificates</h2>
            </div>
          </div>
          <button
            onClick={() => {
              if (showAddForm) {
                setShowAddForm(false);
              } else {
                openAddForm();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'Cancel' : 'Add Certificate'}
          </button>
        </div>

        {/* Success/Error Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-xs font-semibold">
            {success}
          </div>
        )}

        {/* Add Certificate Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-left relative max-h-[90vh] overflow-y-auto my-8">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                {editMode ? 'Edit Certificate Details' : 'New Certificate Details'}
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Certificate Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Full Stack Web Development"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Issuer Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Udemy, Coursera, Meta"
                        value={issuer}
                        onChange={(e) => setIssuer(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Issue Date (Year/Month)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2024 or Dec 2023"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Category Tag</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="Course">Course</option>
                          <option value="Internship">Internship</option>
                          <option value="Hackathon">Hackathon</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Credential ID (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. UC-45a892b1-0982"
                          value={credentialId}
                          onChange={(e) => setCredentialId(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Display Order</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={displayOrder}
                          onChange={(e) => setDisplayOrder(Number(e.target.value))}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload Certificate Image */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Certificate Image Upload</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer min-h-[160px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {imagePreview ? (
                          <img
                            src={getImageUrl(imagePreview)}
                            alt="Preview"
                            className="max-h-[150px] rounded-lg object-contain"
                          />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xxs font-bold text-gray-500">Drag & Drop or Click to Upload</span>
                            <span className="text-[9px] text-gray-400 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        rows="3"
                        placeholder="Brief description of course modules or skills validated..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
                  >
                    {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Certificate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Certificate List Grid */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-xs font-semibold text-gray-400">No certificates found. Add your first certificate above.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {certificates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((cert) => (
                <div
                  key={cert._id || cert.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4 hover:shadow-md hover:border-gray-200 transition-all"
                >
                <div className="w-24 h-24 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                  <img
                    src={getImageUrl(cert.image)}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-extrabold text-gray-900 line-clamp-1">{cert.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedCert(cert);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditForm(cert)}
                          className="text-primary hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-all"
                          title="Edit Certificate"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert._id)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xxs text-primary font-bold mt-0.5">{cert.issuer}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Issued: {cert.date} | Tag: {cert.category}</p>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <a
                      href={cert.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-500 hover:text-primary transition-colors"
                    >
                      View Source Image
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(certificates.length / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={certificates.length}
            itemsPerPage={itemsPerPage}
          />
        </>
        )}

      </div>

      {/* Certificate Detail Modal */}
      {showDetailModal && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left relative max-h-[90vh] overflow-y-auto my-8">
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedCert(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] bg-primary/5 text-primary font-bold px-2 py-0.5 rounded-full">
                {selectedCert.category || 'Certification'}
              </span>
              <h3 className="text-base font-extrabold text-gray-900 mt-2">{selectedCert.title}</h3>
              <p className="text-xs font-bold text-primary mt-1">{selectedCert.issuer}</p>
            </div>

            {selectedCert.image && (
              <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                <img
                  src={getImageUrl(selectedCert.image)}
                  alt={selectedCert.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-4">
              {selectedCert.description && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description / Syllabus</h4>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{selectedCert.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3 text-[11px] text-gray-500 font-semibold">
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase font-bold">Issue Date</span>
                  {selectedCert.date}
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase font-bold">Credential ID</span>
                  {selectedCert.credentialId || 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <a
                href={selectedCert.image}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-lg transition-all"
              >
                View Full Size Image <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCert(null);
                }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
