import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  X,
  Loader,
  Calendar,
  Eye,
  ExternalLink
} from 'lucide-react';
import Pagination from './Pagination';

const AdminExperience = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal controls
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState('active');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}experiences`);
      if (res.data && res.data.success) {
        // Sort by displayOrder or date
        const sorted = res.data.data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setExperiences(sorted);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch experiences list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setTitle('');
    setOrganization('');
    setEmploymentType('Full Time');
    setStartDate('');
    setEndDate('');
    setCurrentlyWorking(false);
    setLocation('');
    setSummary('');
    setResponsibilities('');
    setDisplayOrder(0);
    setFeatured(false);
    setStatus('active');
    setLogoFile(null);
    setLogoPreview('');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const openEditModal = (exp) => {
    setEditMode(true);
    setEditingId(exp._id);
    setTitle(exp.title || '');
    setOrganization(exp.organization || '');
    setEmploymentType(exp.employmentType || 'Full Time');
    setStartDate(formatDateForInput(exp.startDate));
    setEndDate(formatDateForInput(exp.endDate));
    setCurrentlyWorking(exp.currentlyWorking || false);
    setLocation(exp.location || '');
    setSummary(exp.summary || '');
    setResponsibilities(Array.isArray(exp.responsibilities) ? exp.responsibilities.join(', ') : '');
    setDisplayOrder(exp.displayOrder || 0);
    setFeatured(exp.featured || false);
    setStatus(exp.status || 'active');
    setLogoFile(null);
    setLogoPreview(exp.companyLogo || '');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openDetailModal = (exp) => {
    setSelectedExp(exp);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }
    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.delete(`${API_URL}experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setSuccess('Experience deleted successfully!');
        fetchExperiences();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete experience.');
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();

    formData.append('title', title);
    formData.append('organization', organization);
    formData.append('employmentType', employmentType);
    formData.append('startDate', startDate);
    if (!currentlyWorking && endDate) {
      formData.append('endDate', endDate);
    }
    formData.append('currentlyWorking', currentlyWorking);
    formData.append('location', location);
    formData.append('summary', summary);
    formData.append('displayOrder', displayOrder);
    formData.append('featured', featured);
    formData.append('status', status);

    // Lists
    formData.append('responsibilities', responsibilities);

    if (logoFile) {
      formData.append('companyLogo', logoFile);
    }

    try {
      if (editMode) {
        const res = await axios.put(`${API_URL}experiences/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Experience updated successfully!');
        }
      } else {
        const res = await axios.post(`${API_URL}experiences`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Experience created successfully!');
        }
      }
      setShowModal(false);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please check fields.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-backgroundLightAlt pt-12 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Control Bar */}
        <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Manage Experience</h2>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm ml-auto"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-left">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-xs font-semibold text-left">
            {success}
          </div>
        )}

        {/* Experience Listing Table */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-xs font-semibold text-gray-400">No experiences registered yet. Add one above.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Logo</th>
                    <th className="px-6 py-4">Role / Title</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {experiences.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        {exp.companyLogo ? (
                          <img
                            src={getImageUrl(exp.companyLogo)}
                            alt={exp.organization}
                            className="w-9 h-9 rounded object-contain border border-gray-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                            <Briefcase className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{exp.title}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{exp.organization} ({exp.employmentType})</td>
                      <td className="px-6 py-4 text-gray-500 font-semibold">
                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} –{' '}
                        {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${exp.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {exp.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${exp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openDetailModal(exp)}
                            className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(exp)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(experiences.length / itemsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={experiences.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

      </div>

      {/* Modal Form Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left relative max-h-[90vh] overflow-y-auto my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              {editMode ? 'Edit Experience' : 'Add New Experience'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Job Title / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Inc."
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Location (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. remote / Delhi, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">End Date</label>
                  <input
                    type="date"
                    disabled={currentlyWorking}
                    value={currentlyWorking ? '' : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="currentlyWorking"
                  checked={currentlyWorking}
                  onChange={(e) => setCurrentlyWorking(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="currentlyWorking" className="text-xxs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Summary / Pitch</label>
                <textarea
                  rows="2"
                  placeholder="Short role summary..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Responsibilities (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Developed REST APIs, Optimized React render cycles"
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Company Logo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full text-xxs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xxs file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex items-center pt-5 justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Featured</span>
                  </label>
                </div>
              </div>

              {logoPreview && (
                <div className="flex items-center gap-2.5 p-2 bg-gray-50 border border-gray-150 rounded-xl w-max">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Logo Preview:</span>
                  <img src={logoPreview} className="w-8 h-8 rounded object-contain border bg-white" alt="Preview" />
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100 gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 min-w-[100px]"
                >
                  {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal Dialog */}
      {showDetailModal && selectedExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-left relative max-h-[90vh] overflow-y-auto my-8">
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedExp(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-4 flex items-start gap-4">
              {selectedExp.companyLogo ? (
                <img
                  src={getImageUrl(selectedExp.companyLogo)}
                  alt={selectedExp.organization}
                  className="w-16 h-16 rounded border object-contain bg-white"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-gray-50 border flex items-center justify-center text-gray-400">
                  <Briefcase className="w-8 h-8" />
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    {selectedExp.employmentType}
                  </span>
                  {selectedExp.featured && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${selectedExp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedExp.status}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">{selectedExp.title}</h3>
                <p className="text-xs font-bold text-gray-500">{selectedExp.organization} • {selectedExp.location || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Role Summary</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{selectedExp.summary || 'No summary provided.'}</p>
              </div>

              {selectedExp.responsibilities && selectedExp.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Key Responsibilities</h4>
                  <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                    {selectedExp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedExp(null);
                }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminExperience;
