import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import {
  MessageSquare,
  Trash2,
  Check,
  ArrowLeft,
  Loader,
  Star,
  Plus,
  X
} from 'lucide-react';
import Pagination from './Pagination';

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Creation Modal States
  const [showModal, setShowModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientImage, setClientImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_URL}testimonials/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data && res.data.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to fetch testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id) => {
    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.put(`${API_URL}testimonials/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data && res.data.success) {
        setSuccess('Testimonial approved successfully!');
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Error approving testimonial:', err);
      setError(err.response?.data?.message || 'Failed to approve testimonial.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.delete(`${API_URL}testimonials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data && res.data.success) {
        setSuccess('Testimonial deleted successfully!');
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError(err.response?.data?.message || 'Failed to delete testimonial.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limit size: 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        return;
      }
      setClientImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const uploadData = new FormData();
      uploadData.append('clientName', clientName);
      uploadData.append('message', message);
      uploadData.append('rating', rating);
      if (clientImage) {
        uploadData.append('clientImage', clientImage);
      }

      const res = await axios.post(`${API_URL}testimonials`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data && res.data.success) {
        setSuccess('Testimonial created successfully!');
        // Reset states
        setClientName('');
        setClientImage(null);
        setImagePreview('');
        setMessage('');
        setRating(5);
        setShowModal(false);
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Error creating testimonial:', err);
      setError(err.response?.data?.message || 'Failed to create testimonial.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-backgroundLightAlt pt-12 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Navigation */}
        <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex-wrap gap-4 text-left">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Manage Testimonials</h2>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>

        {/* Success/Error Alerts */}
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

        {/* Testimonials List Grid */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading reviews...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-xs font-semibold text-gray-400">No testimonials found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {testimonials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((test) => (
                <div
                  key={test._id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative"
                >
                  {/* Status Badge */}
                  <span className={`absolute top-6 right-6 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${test.approved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    {test.approved ? 'Approved' : 'Pending'}
                  </span>

                  <div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 italic leading-relaxed mb-6">"{test.message}"</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100/60 pt-4 mt-auto">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={test.clientImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'}
                        alt={test.clientName}
                        className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                      />
                      <h4 className="text-xs font-bold text-gray-900">{test.clientName}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {!test.approved && (
                        <button
                          onClick={() => handleApprove(test._id)}
                          className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg shadow-sm transition-colors flex items-center justify-center"
                          title="Approve Review"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(test._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                        title="Reject/Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(testimonials.length / itemsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={testimonials.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}

      </div>

      {/* Creation Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md shadow-2xl relative text-left">
            <button
              onClick={() => {
                setShowModal(false);
                setClientImage(null);
                setImagePreview('');
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 p-5 pb-3">
              Add New Client Testimonial
            </h3>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Client Name (Required)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Client Avatar Image (Optional)</label>
                {imagePreview && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mb-2">
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xxs text-gray-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Star Rating (1-5)</label>
                <div className="flex gap-2 items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors duration-200 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Client Feedback Message (Required)</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write the testimonial message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setClientImage(null);
                    setImagePreview('');
                  }}
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
    </div>
  );
};

export default AdminTestimonials;
