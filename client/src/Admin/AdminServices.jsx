import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Wrench,
  Trash2,
  Edit,
  Plus,
  X,
  ArrowLeft,
  Loader,
  Eye
} from 'lucide-react';
import { ServiceIcon } from '../components/ServiceIcon';
import { API_URL } from '../config';
import Pagination from './Pagination';

const AdminServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Laptop');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Development');
  const [deliveryTime, setDeliveryTime] = useState('5 Days');
  const [features, setFeatures] = useState('');
  const [techStack, setTechStack] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}services`);
      if (res.data && res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setIcon('Laptop');
    setPrice('');
    setCategory('Development');
    setDeliveryTime('5 Days');
    setFeatures('');
    setTechStack('');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditMode(true);
    setEditingId(service._id);
    setTitle(service.title);
    setDescription(service.shortDescription || service.description || '');
    setIcon(service.icon || 'Laptop');
    setPrice(service.startingPrice || service.price || '');
    setCategory(service.category || 'Development');
    setDeliveryTime(service.deliveryTime || '5 Days');
    setFeatures(Array.isArray(service.featuresIncluded) ? service.featuresIncluded.join(', ') : '');
    setTechStack(Array.isArray(service.technologyStack) ? service.technologyStack.join(', ') : '');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    const token = localStorage.getItem('adminToken');
    const payload = {
      title,
      description,
      price: Number(price),
      icon,
      category,
      deliveryTime,
      featuresIncluded: features.split(',').map(f => f.trim()).filter(Boolean),
      technologyStack: techStack.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editMode) {
        const res = await axios.put(`${API_URL}services/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Service updated successfully!');
        }
      } else {
        const res = await axios.post(`${API_URL}services`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data && res.data.success) {
          setSuccess('Service added successfully!');
        }
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.delete(`${API_URL}services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data && res.data.success) {
        setSuccess('Service deleted successfully!');
        fetchServices();
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Failed to delete service.');
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
              <Wrench className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Manage Services</h2>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Service
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

        {/* Services Table */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-xs font-semibold text-gray-400">No services found. Add your first service above.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Icon</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price (INR)</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((service) => {
                    return (
                      <tr key={service._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="p-2 bg-primary/5 text-primary rounded-lg w-fit">
                            <ServiceIcon name={service.icon} className="w-4 h-4" />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">{service.title}</td>
                        <td className="px-6 py-4 text-gray-500 line-clamp-2 max-w-xs">{service.shortDescription || service.description}</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-semibold">{service.category}</span></td>
                        <td className="px-6 py-4 font-bold text-gray-900">₹{(service.startingPrice || 0).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedService(service);
                                setShowDetailModal(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(service)}
                              className="text-primary hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-all"
                              title="Edit Service"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service._id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all"
                              title="Delete Service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(services.length / itemsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={services.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 text-left relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              {editMode ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basic Business Website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Brief description of the service packages offered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Starting Price (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Laptop">Laptop / General</option>
                    <option value="Code">Code Development</option>
                    <option value="ShoppingBag">Shopping / E-Commerce</option>
                    <option value="Layout">UI/UX / Layout</option>
                    <option value="Server">Server Management</option>
                    <option value="Database">Database Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Basic, Premium"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Days"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Features Included (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Up to 5 Pages, Responsive Design, Free Support"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Technology Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React.js, Tailwind CSS, Node.js"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
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
      {showDetailModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left relative max-h-[90vh] overflow-y-auto my-8">
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedService(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 border-b border-gray-100 pb-4">
              <div className="p-3 bg-primary/5 text-primary rounded-xl shrink-0">
                <ServiceIcon name={selectedService.icon} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    {selectedService.category}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    {selectedService.deliveryTime || 'N/A'} Delivery
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mt-1">{selectedService.title}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedService.details?.fullDescription || selectedService.shortDescription || selectedService.description}
                </p>
              </div>

              {((selectedService.technologyStack && selectedService.technologyStack.length > 0) || (selectedService.techStack && selectedService.techStack.length > 0)) && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedService.technologyStack || selectedService.techStack).map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {((selectedService.featuresIncluded && selectedService.featuresIncluded.length > 0) || (selectedService.features && selectedService.features.length > 0)) && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Deliverables & Features</h4>
                  <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1.5">
                    {(selectedService.featuresIncluded || selectedService.features).map((feat, idx) => (
                      <li key={idx} className="font-medium">{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div>
                <span className="block text-[9px] text-gray-400 uppercase font-extrabold">Starting Price</span>
                <span className="text-sm font-extrabold text-gray-900">₹{(selectedService.startingPrice || 0).toLocaleString('en-IN')}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedService(null);
                }}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-lg transition-colors"
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

export default AdminServices;
