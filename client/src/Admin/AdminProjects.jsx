import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import {
  Folder,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  X,
  Loader,
  Eye,
  ExternalLink
} from 'lucide-react';

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination & Search
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal controls
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [ownership, setOwnership] = useState('Personal');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [features, setFeatures] = useState('');
  const [liveDemo, setLiveDemo] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [status, setStatus] = useState('published');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_URL}projects`, {
        params: {
          page,
          limit: 8,
          search,
          admin: 'true' // bypass public published-only filter
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data && res.data.success) {
        setProjects(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setTitle('');
    setOwnership('Personal');
    setCategory('');
    setShortDescription('');
    setDescription('');
    setTechnologies('');
    setFeatures('');
    setLiveDemo('');
    setGithubRepo('');
    setStatus('published');
    setFeatured(false);
    setDisplayOrder(0);
    setCoverImageFile(null);
    setGalleryFiles([]);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditMode(true);
    setEditingId(project._id);
    setTitle(project.title);
    setOwnership(project.projectOwnership || 'Personal');
    setCategory(project.category || '');
    setShortDescription(project.shortDescription);
    setDescription(project.description);
    setTechnologies(Array.isArray(project.technologies) ? project.technologies.join(', ') : '');
    setFeatures(Array.isArray(project.features) ? project.features.join(', ') : '');
    setLiveDemo(project.liveDemo || '');
    setGithubRepo(project.githubRepo || '');
    setStatus(project.status || 'published');
    setFeatured(project.featured || false);
    setDisplayOrder(project.displayOrder || 0);
    setCoverImageFile(null);
    setGalleryFiles([]);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openDetailModal = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.delete(`${API_URL}projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data && res.data.success) {
        setSuccess('Project deleted successfully!');
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete project.');
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
    formData.append('projectOwnership', ownership);
    formData.append('category', category);
    formData.append('shortDescription', shortDescription);
    formData.append('description', description);
    formData.append('technologies', technologies);
    formData.append('features', features);
    formData.append('liveDemo', liveDemo);
    formData.append('githubRepo', githubRepo);
    formData.append('status', status);
    formData.append('featured', featured);
    formData.append('displayOrder', displayOrder);

    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }
    if (galleryFiles && galleryFiles.length > 0) {
      if (galleryFiles.length > 30) {
        setError('You can upload a maximum of 30 gallery images.');
        setSubmitLoading(false);
        return;
      }
      Array.from(galleryFiles).forEach(file => {
        formData.append('galleryImages', file);
      });
    }

    try {
      if (editMode) {
        const res = await axios.put(`${API_URL}projects/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Project updated successfully!');
        }
      } else {
        const res = await axios.post(`${API_URL}projects`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Project created successfully!');
        }
      }
      setShowModal(false);
      fetchProjects();
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Folder className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Manage Projects</h2>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm ml-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-800"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Feedback Messages */}
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

        {/* Projects Listing Table */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-xs font-semibold text-gray-400">No projects found. Add one to build your portfolio!</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((proj) => (
                    <tr key={proj._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <img
                          src={getImageUrl(proj.coverImage)}
                          alt={proj.title}
                          className="w-14 h-9 rounded object-cover border border-gray-100"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{proj.title}</td>
                      <td className="px-6 py-4 text-gray-500">{proj.category} ({proj.projectOwnership})</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${proj.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {proj.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${proj.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-medium">
                        {new Date(proj.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openDetailModal(proj)}
                            className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(proj)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj._id)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-2.5 py-1 border border-gray-200 hover:bg-white rounded text-xxs font-bold text-gray-500 transition-colors disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-2.5 py-1 border border-gray-200 hover:bg-white rounded text-xxs font-bold text-gray-500 transition-colors disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
              {editMode ? 'Edit Project Details' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GuardianNet Safety App"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Project Ownership</label>
                  <select
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Personal">Personal Project</option>
                    <option value="Client">Client Work</option>
                    <option value="Company">Company Project</option>
                    <option value="College">College Project</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Category / Type</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend API">Backend API</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Game">Game</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="Brief one-liner summary..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description (Full)</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Comprehensive details about the project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React.js, Tailwind CSS"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Features (comma-separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Real-time alert, Twilio sms"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={liveDemo}
                    onChange={(e) => setLiveDemo(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImageFile(e.target.files[0])}
                    className="w-full text-xxs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xxs file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Gallery Images Files</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setGalleryFiles(e.target.files)}
                    className="w-full text-xxs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xxs file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10"
                  />
                </div>
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
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-left relative max-h-[90vh] overflow-y-auto my-8">
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedProject(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedProject.projectOwnership === 'Personal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                  {selectedProject.projectOwnership} Project
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                  {selectedProject.category}
                </span>
                {selectedProject.featured && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${selectedProject.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {selectedProject.status}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">{selectedProject.title}</h3>
            </div>

            {/* Cover Image */}
            {selectedProject.coverImage && (
              <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <img
                  src={getImageUrl(selectedProject.coverImage)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Short Description</h4>
                  <p className="text-xs text-gray-700 font-medium">{selectedProject.shortDescription}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Description</h4>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{selectedProject.description}</p>
                </div>

                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Key Features</h4>
                    <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                      {selectedProject.features.map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  {selectedProject.liveDemo && (
                    <a
                      href={selectedProject.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Live Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedProject.githubRepo && (
                    <a
                      href={selectedProject.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-lg transition-colors"
                    >
                      GitHub Repo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="text-[10px] text-gray-400 font-bold space-y-1 border-t border-gray-50 pt-3">
                  <p>Created: {new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                  <p>Last Updated: {new Date(selectedProject.updatedAt).toLocaleDateString()}</p>
                  <p>Display Order: {selectedProject.displayOrder || 0}</p>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {selectedProject.galleryImages && selectedProject.galleryImages.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Project Gallery</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedProject.galleryImages.map((img, idx) => (
                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="aspect-video rounded-lg overflow-hidden border border-gray-100 hover:opacity-90 transition-opacity">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedProject(null);
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

export default AdminProjects;
