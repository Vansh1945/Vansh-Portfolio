import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  X,
  Loader
} from 'lucide-react';

const AdminSkills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal controls
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}skills`);
      if (res.data && res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch skills list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setName('');
    setLogoFile(null);
    setLogoPreview('');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (skill) => {
    setEditMode(true);
    setEditingId(skill._id);
    setName(skill.name);
    setLogoFile(null);
    setLogoPreview(skill.logo);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.delete(`${API_URL}skills/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data && res.data.success) {
        setSuccess('Skill deleted successfully!');
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete skill.');
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size must be under 2MB.');
        return;
      }
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
    formData.append('name', name);
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      if (editMode) {
        const res = await axios.put(`${API_URL}skills/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Skill updated successfully!');
        }
      } else {
        const res = await axios.post(`${API_URL}skills`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Skill added successfully!');
        }
      }
      setShowModal(false);
      fetchSkills();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save skill. Check file type.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-150 rounded-2xl p-6 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Wrench className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Manage Skills</h2>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm ml-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Skill
          </button>
        </div>

        {/* Feedback Alert messages */}
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

        {/* Loading / List Grid */}
        {loading ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center">
            <p className="text-xs font-semibold text-gray-400">No skills registered yet. Add one to show on your website!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-between group relative hover:border-blue-500/20 hover:shadow transition-all duration-200"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl p-2 border border-gray-100 mb-3">
                  <img
                    src={getImageUrl(skill.logo)}
                    alt={skill.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h4 className="text-xs font-bold text-gray-800 tracking-wide text-center truncate w-full">{skill.name}</h4>

                {/* Edit / Delete Hover overlays */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-1 bg-red-50 hover:bg-red-100 rounded text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Dialog Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-6 text-left relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              {editMode ? 'Edit Skill' : 'Add New Skill'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Logo File</label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editMode}
                  onChange={handleLogoChange}
                  className="w-full text-xxs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xxs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />

                {logoPreview && (
                  <div className="mt-3 flex items-center gap-3 p-2 border border-gray-100 rounded-lg bg-gray-50 max-w-max">
                    <span className="text-[10px] text-gray-400 font-bold">Preview:</span>
                    <div className="w-8 h-8 flex items-center justify-center p-1 bg-white border rounded">
                      <img src={getImageUrl(logoPreview)} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>

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
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 min-w-[80px]"
                >
                  {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSkills;
