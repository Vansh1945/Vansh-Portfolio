import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Loader } from 'lucide-react';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}testimonials`);
        if (res.data && res.data.success) {
          setTestimonials(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to retrieve testimonials.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto scroll logic for testimonials carousel
  useEffect(() => {
    if (testimonials.length <= 3) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (testimonials.length - 2));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const visibleTestimonials = testimonials.length <= 3
    ? testimonials
    : testimonials.slice(currentIndex, currentIndex + 3);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="relative py-20 bg-white overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

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
              Client Testimonials
              <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
            </h2>
          </motion.div>
        </div>

        {/* Testimonials Grid Layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading reviews...</p>
          </div>
        ) : error ? (
          <p className="text-xs font-bold text-red-500">{error}</p>
        ) : testimonials.length === 0 ? (
          <div className="bg-backgroundLightAlt border border-gray-100 rounded-xl p-12 text-center max-w-md mx-auto">
            <p className="text-xs font-semibold text-gray-400">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial._id || testimonial.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="bg-backgroundLightAlt border border-gray-100 hover:border-primary/20 hover:bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left relative"
              >
                {/* Quote Mark */}
                <div className="absolute top-5 right-5 text-gray-200/80 group-hover:text-primary/10 transition-colors">
                  <FaQuoteLeft className="text-2xl" />
                </div>

                <div>
                  {/* Stars Rating */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-amber-400 text-xs" />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed italic mb-6">
                    "{testimonial.message}"
                  </p>
                </div>

                {/* Client Meta Profile */}
                <div className="flex items-center gap-3 border-t border-gray-50 pt-4 mt-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                    {testimonial.clientImage ? (
                      <img
                        src={getImageUrl(testimonial.clientImage)}
                        alt={testimonial.clientName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-bold text-sm">
                        {testimonial.clientName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{testimonial.clientName}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Verified Client</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
