import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Mail, MailOpen, Trash2, ArrowLeft, Loader, Calendar, User, Info } from 'lucide-react';

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_URL}contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id) => {
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.patch(`${API_URL}contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        // Update local state
        setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, read: !msg.read } : msg));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update message status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.delete(`${API_URL}contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete message');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 text-left">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header bar */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Contact Messages Inbox
            </h1>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">
              Read and manage client inquiries submitted through the contact form
            </p>
          </div>
        </div>

        {/* Loading and Error states */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl">
            <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Retrieving messages...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-md mx-auto">
            <MailOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-gray-700">Inbox is empty</h3>
            <p className="text-xxs text-gray-400 font-semibold mt-1">There are no messages from clients yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`bg-white border rounded-2xl p-5 md:p-6 transition-all duration-200 ${msg.read ? 'border-gray-100 opacity-80' : 'border-primary/20 shadow-sm ring-1 ring-primary/5'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-4">
                  {/* Meta Details */}
                  <div className="space-y-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${msg.read ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'
                      }`}>
                      {msg.read ? 'Read' : 'New Message'}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 pt-1">
                      <User className="w-3.5 h-3.5 text-gray-400" /> {msg.name}
                      <span className="text-xxs text-gray-400 font-medium">({msg.email})</span>
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleToggleRead(msg._id)}
                      disabled={actionLoadingId === msg._id}
                      className={`p-2 border rounded-lg transition-colors flex items-center gap-1.5 text-xxs font-bold ${msg.read
                          ? 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          : 'border-primary/20 text-primary bg-primary/5 hover:bg-primary/10'
                        }`}
                      title={msg.read ? "Mark as Unread" : "Mark as Read"}
                    >
                      {msg.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                      {msg.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      disabled={actionLoadingId === msg._id}
                      className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-1.5 text-xxs font-bold text-gray-400 uppercase">
                    <Info className="w-3.5 h-3.5" /> Subject: <span className="text-gray-700 font-black">{msg.subject}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 white-space-pre-wrap">
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold pt-1 justify-end">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminMessages;
