import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import {
  Star,
  Clock,
  RefreshCw,
  HelpCircle,
  CheckCircle,
  Plus,
  Minus,
  Calculator,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Mail,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Award,
  ArrowUpRight,
  Copy,
  Download,
  X
} from 'lucide-react';
import { ServiceIcon } from './ServiceIcon';
import { API_URL } from '../config';
import { FaWhatsapp } from 'react-icons/fa';



const maintenanceData = [
  {
    name: 'Basic Support',
    monthlyPrice: 2000,
    annualPrice: 20000,
    features: ['10 Content Updates/mo', 'Monthly Cloud Backups', 'Basic Security Audits', 'Email Ticket Support (48h response)']
  },
  {
    name: 'Standard Support',
    monthlyPrice: 5000,
    annualPrice: 50000,
    features: ['Unlimited Content Updates', 'Weekly Cloud Backups', 'Patch Updates & Bug Fixes', 'Performance Optimization', 'Priority Ticket Support (24h response)'],
    recommended: true
  },
  {
    name: 'Premium Support',
    monthlyPrice: 10000,
    annualPrice: 95000,
    features: ['24/7 Server Monitoring', 'Daily Automated Backups', 'Priority Bug Fixes (< 6h response)', 'Security Patching', 'Dedicated WhatsApp Support', 'Monthly Analytics Reports']
  }
];

const faqsData = [
  { q: 'What tech stack do you use to build websites?', a: 'I specialize in the MERN Stack (MongoDB, Express.js, React.js, Node.js) paired with Tailwind CSS for layouts and Framer Motion for premium micro-animations. I also build static/serverless projects with Vite or Next.js depending on the client’s SEO requirements.' },
  { q: 'Will my website load fast and look professional on mobile devices?', a: 'Absolutely. Every site is built Mobile-First, ensuring that layouts adapt beautifully to all screens. I also optimize images, bundle sizes, and network calls to ensure Google Lighthouse performance scores exceed 90.' },
  { q: 'Can you integrate payment gateways like Stripe or Razorpay?', a: 'Yes, I can set up secure payments, subscriptions, checkout pages, and webhooks to update databases immediately upon successful payment.' },
  { q: 'Do you help with domain registration and cloud hosting?', a: 'Yes. I help you register your custom domain and deploy your application on modern hosting services like Vercel, Netlify, Render, VPS platforms, or AWS Atlas.' },
  { q: 'Do you provide maintenance and support after the launch?', a: 'Yes! Every project includes free post-launch support and bug fixes. After that, you can subscribe to one of my flexible monthly or annual Maintenance Plans.' },
  { q: 'How do we get started?', a: 'Simply select your requirements in the Project Feature Planner above and click "Generate Quote Breakdowns". You can then message me on WhatsApp or email the list directly so we can connect!' }
];


const ServicesPage = () => {
  const { settings } = useWebsiteSettings();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [apiTestimonials, setApiTestimonials] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const storedRole = localStorage.getItem('role');
    if (roleParam === 'admin' || storedRole === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchApiTestimonials = async () => {
      try {
        const res = await axios.get(`${API_URL}testimonials`);
        if (res.data && res.data.success) {
          setApiTestimonials(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    };
    fetchApiTestimonials();
  }, []);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Testimonial State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}services`);
      if (response.data && response.data.success) {
        setServices(response.data.data);
      } else {
        setError('Failed to fetch services.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load services. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Auto Slider for Testimonials
  useEffect(() => {
    const currentLength = apiTestimonials.length;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % currentLength);
    }, 6000);
    return () => clearInterval(timer);
  }, [apiTestimonials.length]);




  return (
    <div className="bg-white min-h-screen text-text pt-20">

      {/* 1. HERO SECTION */}
      <section className="relative bg-backgroundLightAlt py-20 overflow-hidden flex items-center justify-center border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xxs font-bold bg-primary/10 text-primary uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Premium Freelance Development
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 font-cursive leading-tight"
          >
            What I Offer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xs md:text-sm text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            I build fast, secure and scalable websites for startups, businesses and personal brands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 mt-8"
          >
            <a
              href={`https://wa.me/${settings?.phone || '8219136254'}?text=${encodeURIComponent('Hi Vansh, I am interested in getting a free quote.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp Quote
            </a>
            <a
              href={`mailto:${settings?.email || 'vanshvicky65@gmail.com'}?subject=${encodeURIComponent('Inquiry: Free Quote Request')}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              Email Quote
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-semibold text-xs transition-all hover:bg-gray-50 transform hover:-translate-y-0.5"
            >
              View Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-20 relative max-w-[95%] mx-auto px-4 md:px-8" id="services-grid">
        <div className="text-left mb-12">
          <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight relative inline-block">
            Professional Packages
            <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
          </h2>
        </div>



        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-backgroundLightAlt border border-gray-100 rounded-xl p-6 space-y-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-100 rounded-xl p-8 max-w-md mx-auto shadow-sm">
            <HelpCircle className="text-3xl text-red-500 mb-3" />
            <p className="text-sm font-semibold text-gray-800 text-center mb-4">{error}</p>
            <button
              onClick={fetchServices}
              className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-100 rounded-xl p-8 max-w-md mx-auto shadow-sm">
            <Award className="text-4xl text-gray-300 mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-gray-800 mb-1 text-center">No services added yet.</p>
            <p className="text-xs text-gray-500 text-center">Please verify database seeds or try again later.</p>
          </div>
        )}

        {/* Services Grid Content */}
        {!loading && !error && services.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {services.map((service, idx) => {
                return (
                  <motion.div
                    layout
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="group relative flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden h-full text-left"
                  >
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                      {service.popular && (
                        <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
                          Popular
                        </span>
                      )}
                      {service.recommended && (
                        <span className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Icon */}
                      <div className="p-3 bg-primary/5 text-primary rounded-xl w-fit group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-5">
                        <ServiceIcon name={service.icon} className="w-6 h-6" />
                      </div>

                      {/* Header */}
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors mb-1.5">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="text-xxs font-bold text-gray-700">{service.rating || '5.0'}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-xxs text-gray-500 font-semibold">{service.projectsCompleted || '0'}+ Done</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        {service.shortDescription}
                      </p>

                      {/* Features tags */}
                      <div className="mb-5 border-t border-b border-gray-50 py-3 space-y-2 flex-grow">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Features Included:</span>
                        <ul className="space-y-1">
                          {service.featuresIncluded.map((feat, i) => (
                            <li key={i} className="flex items-center gap-2 text-xxs text-gray-600 font-medium">
                              <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mb-5">
                        {service.technologyStack.map((tech, i) => (
                          <span key={i} className="bg-backgroundLight text-gray-500 border border-gray-100 text-[10px] font-medium px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Pricing Footer */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        {isAdmin ? (
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase">Starting at</span>
                            <span className="text-sm font-bold text-primary">₹{service.startingPrice.toLocaleString('en-IN')}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase">Pricing</span>
                            <span className="text-xs font-bold text-primary">Get Quotation</span>
                          </div>
                        )}
                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 justify-end">
                            <Clock className="w-3.5 h-3.5 text-primary" /> Delivery
                          </span>
                          <span className="text-xs font-bold text-gray-800">{service.deliveryTime}</span>
                        </div>
                      </div>

                      {/* Action CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-5">
                        <a
                          href={`https://wa.me/${settings?.phone || '8219136254'}?text=${encodeURIComponent('Hi Vansh, I am interested in: ' + service.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-3 rounded-lg text-xxs transition-all shadow-sm flex items-center justify-center gap-1"
                        >
                          <FaWhatsapp className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                        <a
                          href={`mailto:${settings?.email || 'vanshvicky65@gmail.com'}?subject=${encodeURIComponent('Inquiry: ' + service.title)}`}
                          className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-lg text-xxs transition-all shadow-sm flex items-center justify-center gap-1 text-center"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Email
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* 3. SERVICE DETAILS POPUP */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-left"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-backgroundLightAlt">
                <div>
                  <span className="text-xxs font-bold text-primary uppercase tracking-wider">{selectedService.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">{selectedService.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                {/* Full Description */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Overview</h4>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                    {selectedService.details.fullDescription || selectedService.shortDescription}
                  </p>
                </div>

                {/* Meta details (Revisions, Support, Tech Stack) */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 py-3 border-t border-b border-gray-100 text-xxs font-semibold text-gray-500">
                  <div>
                    <span className="text-gray-400">Revisions:</span> <span className="text-gray-800 font-bold">{selectedService.revisions || '3'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Support Duration:</span> <span className="text-gray-800 font-bold">{selectedService.supportDuration || '30 Days'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Delivery:</span> <span className="text-gray-800 font-bold">{selectedService.deliveryTime || '5 Days'}</span>
                  </div>
                  {selectedService.technologyStack && selectedService.technologyStack.length > 0 && (
                    <div className="w-full flex flex-wrap gap-1 mt-1.5">
                      <span className="text-gray-400 mr-1 self-center">Tech Stack:</span>
                      {selectedService.technologyStack.map((tech, i) => (
                        <span key={i} className="bg-backgroundLight text-gray-500 border border-gray-100 px-2 py-0.5 rounded text-[10px] font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grid Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Who is this for */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">Who is this service for?</h4>
                    <ul className="space-y-1.5">
                      {selectedService.details.whoIsFor && selectedService.details.whoIsFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xxs text-gray-600 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">Project Deliverables</h4>
                    <ul className="space-y-1.5">
                      {selectedService.details.deliverables && selectedService.details.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xxs text-gray-600 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Development Process Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Development Process & Timeline</h4>
                  <div className="border-l border-gray-200 pl-4 ml-2 space-y-4">
                    {selectedService.details.developmentProcess && selectedService.details.developmentProcess.map((proc, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
                        <div className="text-xxs font-bold text-primary flex items-center gap-2">
                          <span>Step {i + 1}: {proc.step}</span>
                          <span className="bg-primary/5 px-2 py-0.5 rounded text-[9px] font-semibold text-primary">{proc.duration}</span>
                        </div>
                        <p className="text-xxs text-gray-500 mt-1">{proc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Service Specific FAQs</h4>
                  <div className="space-y-3">
                    {selectedService.details.faqs && selectedService.details.faqs.map((faq, i) => (
                      <div key={i} className="bg-backgroundLightAlt rounded-lg p-3">
                        <h5 className="text-xxs font-bold text-gray-800 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-primary" />
                          {faq.question}
                        </h5>
                        <p className="text-xxs text-gray-500 mt-1.5 leading-relaxed pl-5">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-backgroundLightAlt">
                {isAdmin ? (
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Starting at</span>
                    <span className="text-base font-bold text-gray-900">₹{selectedService.startingPrice.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Pricing</span>
                    <span className="text-xs font-bold text-primary">Get Quotation</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    window.location.href = `mailto:vanshvicky65@gmail.com?subject=Inquiry: ${encodeURIComponent(selectedService.title)}`;
                    setSelectedService(null);
                  }}
                  className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Select & Inquire
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. FEATURE COMPARISON TABLE */}
      <section className="py-20 bg-backgroundLightAlt border-t border-b border-gray-100 overflow-hidden">
        <div className="max-w-[95%] mx-auto px-4 md:px-8">
          <div className="text-left mb-10">
            <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight relative inline-block">
              Feature Comparison
              <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-backgroundLightAlt border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Features</th>
                  <th className="p-4 text-xs font-bold text-gray-800">Portfolio Website</th>
                  <th className="p-4 text-xs font-bold text-gray-800">Business Website</th>
                  <th className="p-4 text-xs font-bold text-gray-800">E-commerce Portal</th>
                  <th className="p-4 text-xs font-bold text-primary">Custom MERN SaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xxs md:text-xs">
                {isAdmin && (
                  <tr>
                    <td className="p-4 font-bold text-gray-700">Base Price</td>
                    <td className="p-4 text-gray-500">₹12,999</td>
                    <td className="p-4 text-gray-500">₹24,999</td>
                    <td className="p-4 text-gray-500">₹39,999</td>
                    <td className="p-4 text-primary font-bold">₹59,999+</td>
                  </tr>
                )}
                <tr>
                  <td className="p-4 font-bold text-gray-700">Delivery Time</td>
                  <td className="p-4 text-gray-500">5 Days</td>
                  <td className="p-4 text-gray-500">7 Days</td>
                  <td className="p-4 text-gray-500">15 Days</td>
                  <td className="p-4 text-gray-500">30 Days</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700">Responsive Layout</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700">SEO Optimized</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700">Authentication</td>
                  <td className="p-4 text-gray-300">✗</td>
                  <td className="p-4 text-gray-300">✗</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓ (Advanced JWT)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700">Admin Dashboard</td>
                  <td className="p-4 text-gray-300">✗</td>
                  <td className="p-4 text-gray-500">Optional</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓ (Custom panels)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700">Payment Gateway</td>
                  <td className="p-4 text-gray-300">✗</td>
                  <td className="p-4 text-gray-300">✗</td>
                  <td className="p-4 text-green-500 font-bold">✓</td>
                  <td className="p-4 text-green-500 font-bold">✓ (Stripe/Sub billing)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700">Maintenance Support</td>
                  <td className="p-4 text-gray-500">15 Days</td>
                  <td className="p-4 text-gray-500">30 Days</td>
                  <td className="p-4 text-gray-500">60 Days</td>
                  <td className="p-4 text-primary font-bold">90 Days Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. DEVELOPMENT PROCESS */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight">Development Workflow</h2>
          <p className="text-xs text-gray-500 mt-2">A structured engineering process to ensure reliable, high-performance web products.</p>
        </div>

        <div className="relative border-l-2 border-primary/20 ml-6 md:ml-12 pl-6 md:pl-10 space-y-10 text-left">
          {[
            { title: 'Requirement Discussion', icon: 'FileText', desc: 'Understanding your business goal, target audience, structural sections, and feature requirements.' },
            { title: 'UI Design Mockups', icon: 'Layout', desc: 'Establishing visual identity, color palettes, responsive templates, and Figma layout approvals.' },
            { title: 'Development Phase', icon: 'Code', desc: 'Developing clean React components, backend APIs, DB modeling, and integrating animations.' },
            { title: 'Testing & Optimization', icon: 'Shield', desc: 'Debugging layout issues, security audits, CORS/JWT checking, and Google PageSpeed index tuning.' },
            { title: 'Deployment & Launch', icon: 'Zap', desc: 'Publishing application code to live cloud networks, setting up domain configurations, SSL, sitemaps.' },
            { title: 'Support & Maintenance', icon: 'RefreshCw', desc: 'Providing updates, backups, security patching, and bug fixes to ensure 99.9% application uptime.' }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative"
            >
              <span className="absolute -left-[35px] md:-left-[51px] top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-sm ring-4 ring-white">
                {i + 1}
              </span>
              <h3 className="text-sm md:text-base font-bold text-gray-900">{step.title}</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. MAINTENANCE PLANS */}
      <section className="py-20 bg-backgroundLightAlt border-t border-b border-gray-100 text-center">
        <div className="max-w-[95%] mx-auto px-4 md:px-8">
          <div className="mb-10 text-left">
            <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight relative inline-block">
              Support & Maintenance
              <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maintenanceData.map((plan, i) => (
              <div
                key={i}
                className={`bg-white border rounded-xl p-6 md:p-8 flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-all duration-300 relative ${plan.recommended ? 'border-primary ring-2 ring-primary/10' : 'border-gray-100'
                  }`}
              >
                {plan.recommended && (
                  <span className="absolute top-4 right-4 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                    Recommended
                  </span>
                )}

                <div>
                  <h3 className="text-sm md:text-base font-bold text-gray-900">{plan.name}</h3>
                  {isAdmin ? (
                    <div className="mt-4 mb-6 border-b border-gray-50 pb-4">
                      <span className="text-2xl font-black text-gray-900">₹{plan.monthlyPrice.toLocaleString('en-IN')}</span>
                      <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider ml-1">/ month</span>
                      <p className="text-[10px] text-gray-400 mt-1 font-semibold">Or ₹{plan.annualPrice.toLocaleString('en-IN')}/year (save 15%)</p>
                    </div>
                  ) : (
                    <div className="mt-4 mb-6 border-b border-gray-50 pb-4">
                      <span className="text-sm font-bold text-primary">Get Quotation</span>
                    </div>
                  )}

                  <ul className="space-y-2 mb-8">
                    {plan.features.map((feat, index) => (
                      <li key={index} className="flex items-start gap-2 text-xxs text-gray-600 font-medium">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/contact"
                  className={`w-full text-center py-2.5 rounded-lg text-xxs font-bold transition-all shadow-sm ${plan.recommended
                    ? 'bg-primary hover:bg-blue-700 text-white'
                    : 'bg-primary/5 hover:bg-primary/10 text-primary'
                    }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQS (15 Questions Accordion) */}
      <section className="py-20 max-w-3xl mx-auto px-6 text-left">
        <div className="text-center mb-10">
          <HelpCircle className="w-8 h-8 text-primary mx-auto mb-2" />
          <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500 mt-2">Answers to common questions regarding our process, stack, pricing, and guarantees.</p>
        </div>

        <div className="space-y-3">
          {faqsData.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between font-bold text-gray-800 text-xs md:text-sm hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="p-4 border-t border-gray-50 text-xxs md:text-xs text-gray-500 leading-relaxed bg-backgroundLightAlt">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. TESTIMONIALS AUTO SLIDER */}
      {apiTestimonials.length > 0 && (
        <section className="py-12 bg-backgroundLightAlt border-t border-b border-gray-100 overflow-hidden text-center relative">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
              <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight">What Clients Say</h2>
            </div>

            {(() => {
              const currentTestimonials = apiTestimonials.map(t => ({
                name: t.clientName,
                feedback: t.message,
                avatar: t.clientImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
                role: 'Verified Client'
              }));

              return (
                <>
                  <div className="relative h-48 md:h-36 flex items-center justify-center max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={testimonialIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center text-center relative"
                      >
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed italic mb-6">
                          "{currentTestimonials[testimonialIndex]?.feedback}"
                        </p>
                        <div className="flex items-center gap-3">
                          <img
                            src={currentTestimonials[testimonialIndex]?.avatar}
                            alt={currentTestimonials[testimonialIndex]?.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-100"
                          />
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-gray-900 leading-none">{currentTestimonials[testimonialIndex]?.name}</h4>
                            <span className="text-[10px] font-medium text-gray-400 mt-1 block leading-none">{currentTestimonials[testimonialIndex]?.role}</span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex justify-center gap-1.5 mt-6">
                    {currentTestimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestimonialIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${testimonialIndex === i ? 'bg-primary w-4' : 'bg-gray-300'
                          }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      )}

      {/* 11. FINAL CTA BANNER */}
      <section className="py-20 bg-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Need a Custom Website?</h2>
          <p className="text-sm md:text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Let's Build Something Amazing Together. Book a call to align on requirements and map out your project details.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href={`https://wa.me/${settings?.phone ? (settings.phone.startsWith('91') || settings.phone.startsWith('+') ? settings.phone : '91' + settings.phone) : '918219136254'}?text=${encodeURIComponent('Hi Vansh, I need a custom website and want to discuss details.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              WhatsApp Quote
              <FaWhatsapp className="w-3.5 h-3.5" />
            </a>
            <a
              href={`mailto:${settings?.email || 'vanshvicky65@gmail.com'}?subject=Custom Website Inquiry`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Email Quote
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>



    </div>
  );
};

export default ServicesPage;
