import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { FiExternalLink } from 'react-icons/fi';
import { ArrowRight } from 'lucide-react';

const Project = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_URL}projects/featured`);
        if (res.data && res.data.success) {
          setFeaturedProjects(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="relative py-20 bg-backgroundLightAlt overflow-hidden" id="projects">
      <div className="max-w-[95%] mx-auto px-4 md:px-8 relative z-10">

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight font-cursive relative inline-block">
              Featured Projects
              <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
            </h2>
          </motion.div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-primary hover:text-blue-700 font-bold text-xs transition-colors"
          >
            View All Projects
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center max-w-md mx-auto">
            <p className="text-xs font-semibold text-gray-400">No featured projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                className="group flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-300 text-left"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-video bg-gray-50 border-b border-gray-55">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-gray-100">
                    {project.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                    {project.title}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-500 mt-2 leading-relaxed flex-grow text-justify font-normal line-clamp-3">
                    {project.shortDescription}
                  </p>

                  {/* Tech Tags */}
                  <div className="my-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((lang, index) => (
                        <span key={index} className="bg-primary/5 text-primary text-[10px] font-semibold px-2 py-0.5 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Links */}
                  <div className="flex items-center gap-2.5 mt-auto pt-2">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-gray-600 font-semibold text-xxs transition-all duration-200 hover:bg-gray-50"
                    >
                      Details
                    </Link>
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white font-semibold text-xxs transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FiExternalLink className="text-xs" />
                        Live Demo
                      </a>
                    )}
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

export default Project;