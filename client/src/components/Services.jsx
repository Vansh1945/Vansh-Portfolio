import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaLaptopCode, FaDatabase, FaExchangeAlt, FaMobileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Laptop, ShoppingBag, Layout, Server, Database } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

// Icon mapping dictionary
const IconMap = {
  Code: <Code className="text-2xl text-primary" />,
  Laptop: <Laptop className="text-2xl text-primary" />,
  LaptopCode: <Laptop className="text-2xl text-primary" />,
  ShoppingBag: <ShoppingBag className="text-2xl text-primary" />,
  Layout: <Layout className="text-2xl text-primary" />,
  Server: <Server className="text-2xl text-primary" />,
  Database: <Database className="text-2xl text-primary" />
};

const staticServicesData = [
  {
    id: 'static-1',
    title: 'Frontend Development',
    description: 'Creating stunning, responsive, and high-performance user interfaces using React.js, Tailwind CSS, and modern frontend tools.',
    icon: <FaLaptopCode className="text-2xl text-primary" />,
  },
  {
    id: 'static-2',
    title: 'Backend Development',
    description: 'Designing and building scalable server-side systems, RESTful APIs, and background processes using Node.js, Express, and Django.',
    icon: <FaServer className="text-2xl text-primary" />,
  },
  {
    id: 'static-3',
    title: 'Full Stack Integration',
    description: 'Seamless integration of frontend clients with robust backend services, including real-time synchronization and server rendering.',
    icon: <FaCode className="text-2xl text-primary" />,
  },
  {
    id: 'static-4',
    title: 'Database Architecture',
    description: 'Designing optimized relational and non-relational database structures using MongoDB, PostgreSQL, and MySQL.',
    icon: <FaDatabase className="text-2xl text-primary" />,
  },
  {
    id: 'static-5',
    title: 'API & Microservices',
    description: 'Constructing robust, secure API structures with proper authentication (JWT) and third-party integrations.',
    icon: <FaExchangeAlt className="text-2xl text-primary" />,
  },
  {
    id: 'static-6',
    title: 'Mobile-First Optimization',
    description: 'Optimizing application layouts and page speeds to deliver excellent performance across all mobile screens and touch devices.',
    icon: <FaMobileAlt className="text-2xl text-primary" />,
  },
];

const Services = ({ isPreview = false }) => {
  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}services`);
        if (res.data && res.data.success) {
          setDbServices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching database services:', err);
      }
    };
    fetchServices();
  }, []);

  // Use DB services if available, else fallback to static data
  const rawServices = dbServices.length > 0
    ? dbServices.map(s => ({
      id: s._id,
      title: s.title,
      description: s.description,
      icon: IconMap[s.icon] || <FaLaptopCode className="text-2xl text-primary" />
    }))
    : staticServicesData;

  const displayData = isPreview ? rawServices.slice(0, 3) : rawServices;

  return (
    <section className="relative py-20 bg-white overflow-hidden" id="services">
      {/* Subtle decorative background gradient */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight font-cursive relative inline-block">
              {isPreview ? 'Top Services Offered' : 'Services Offered'}
              <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
            </h2>
          </motion.div>

          {isPreview && (
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-primary hover:text-blue-700 font-bold text-xs transition-colors"
            >
              View All Services
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              className="group bg-backgroundLightAlt border border-gray-100 hover:border-primary/20 hover:bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left"
            >
              {/* Icon Container */}
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-55 mb-5 group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-300">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
