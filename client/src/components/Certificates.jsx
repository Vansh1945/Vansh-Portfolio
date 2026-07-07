import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiX, FiZoomIn, FiDownload, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const Certificates = ({ isPreview = false }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}certificates`);
        if (response.data && response.data.success) {
          setCertificates(response.data.data);
        } else {
          setError('Failed to load certificates');
        }
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError('Unable to connect to server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Dynamically extract categories for filtering
  const categories = ['all', ...new Set(certificates.map(cert => cert.category || 'Development'))];

  // Filtered certificates based on selected category tag
  const filteredCertificates = activeFilter === 'all'
    ? certificates
    : certificates.filter(cert => (cert.category || 'Development') === activeFilter);

  const displayCertificates = isPreview ? filteredCertificates.slice(0, 4) : filteredCertificates;

  const handleDownload = (imageUrl, title) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.download = `${title.replace(/\s+/g, '_')}_Certificate`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative py-20 bg-backgroundLightAlt overflow-hidden" id="certificates">
      <div className="max-w-[95%] mx-auto px-4 md:px-8 relative z-10">

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight font-cursive relative inline-block">
              {isPreview ? 'Top Certifications' : 'My Certifications'}
              <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
            </h2>
          </motion.div>

          {isPreview && (
            <Link
              to="/certificates"
              className="inline-flex items-center gap-1 text-primary hover:text-blue-700 font-bold text-xs transition-colors"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Filter Navigation */}
        {!isPreview && !loading && !error && certificates.length > 0 && (
          <div className="flex flex-wrap justify-start items-center gap-2 mb-10">
            {categories.map(category => {
              const isActive = activeFilter === category;
              const displayLabel = category === 'all' ? 'All' : category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className="relative px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-full focus:outline-none"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCertFilterBg"
                      className="absolute inset-0 bg-primary rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    {displayLabel}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State (Skeleton Loader) */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse text-left">
                <div className="aspect-[4/3] bg-gray-200 w-full" />
                <div className="p-5 flex flex-col flex-grow space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded w-full mt-2" />
                  <div className="h-6 bg-gray-200 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-100 rounded-xl p-8 max-w-md mx-auto shadow-sm">
            <FiInfo className="text-3xl text-red-500 mb-3" />
            <p className="text-sm font-semibold text-gray-800 text-center">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && certificates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-100 rounded-xl p-8 max-w-md mx-auto shadow-sm">
            <FiAward className="text-4xl text-gray-300 mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-gray-800 mb-1 text-center">No certificates added yet</p>
            <p className="text-xs text-gray-500 text-center">Check back later for updates on my learning achievements.</p>
          </div>
        )}

        {/* Certificates Grid */}
        {!loading && !error && certificates.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayCertificates.map((cert) => (
                <motion.div
                  key={cert._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedCert(cert)}
                  className="bg-white border border-gray-100 hover:border-primary/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-left cursor-pointer group"
                >
                  {/* Certificate Image Frame */}
                  <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden border-b border-gray-50/50">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/95 rounded-full shadow-lg text-primary transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <FiZoomIn className="text-lg" />
                      </div>
                    </div>
                    {/* Issue Date Badge */}
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-500 font-bold text-[8px] px-2 py-0.5 rounded border border-gray-100">
                      Issued: {cert.date}
                    </span>
                  </div>

                  {/* Certificate Information */}
                  <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                    <div className="space-y-1.5 min-h-[64px] flex flex-col justify-start">
                      <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded tracking-wider uppercase self-start">
                        {cert.issuer || 'Verification Issued'}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-1">
                        {cert.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox / Details Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" onClick={() => setSelectedCert(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-4 md:p-6 max-w-2xl w-full shadow-2xl space-y-4 text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors z-10"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Certificate Image Frame */}
              <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info & Footer Actions */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{selectedCert.title}</h3>
                    <p className="text-xs font-semibold text-gray-500 mt-1">
                      Issuer: <span className="text-primary font-bold">{selectedCert.issuer}</span> • Date: {selectedCert.date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedCert.image, selectedCert.title)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm shrink-0"
                  >
                    <FiDownload /> Download Certificate
                  </button>
                </div>

                {selectedCert.credentialId && (
                  <p className="text-xxs text-gray-400 font-semibold pt-1 border-t border-gray-50">
                    Credential ID: <span className="text-gray-600 font-bold">{selectedCert.credentialId}</span>
                  </p>
                )}

                {selectedCert.description && (
                  <p className="text-xs text-gray-600 leading-relaxed pt-1 border-t border-gray-50 whitespace-pre-wrap">
                    {selectedCert.description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
