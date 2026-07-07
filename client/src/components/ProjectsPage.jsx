import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { API_URL } from '../config';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}projects`, {
        params: { page, limit: 6 }
      });
      if (res.data && res.data.success) {
        setProjects(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Projects fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  return (
    <div className="min-h-screen bg-backgroundLightAlt pt-28 pb-20">
      <div className="max-w-[95%] mx-auto px-4 md:px-8 text-left">

        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Portfolio Projects</h1>
          <p className="text-xs text-gray-500 mt-2">Explore my professional journey through custom web portals, personal products, and client systems.</p>
        </div>

        {/* Projects Listing Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-md mx-auto">
            <p className="text-xs font-semibold text-gray-400">No projects found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-white border border-gray-100 hover:border-primary/20 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image */}
                    <div className="relative aspect-video overflow-hidden bg-gray-50 border-b border-gray-100">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {project.featured && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                          Featured
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-gray-100">
                        {project.projectOwnership}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm line-clamp-1">{project.title}</h3>
                        <span className="bg-primary/5 text-primary font-bold text-[9px] px-2 py-0.5 rounded shrink-0">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xxs md:text-xs text-gray-500 leading-relaxed line-clamp-2">{project.shortDescription}</p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="bg-gray-50 text-gray-600 border border-gray-100 text-[9px] font-semibold px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-gray-400 font-bold text-[9px] px-1 py-0.5">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card CTA Actions */}
                  <div className="p-5 border-t border-gray-50 flex gap-2 mt-auto">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="flex-1 text-center py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xxs rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-primary hover:bg-blue-700 text-white font-bold text-xxs px-3.5 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                      >
                        <FiExternalLink className="text-[10px]" />
                        Demo
                      </a>
                    )}
                    {project.githubRepo && (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-gray-200 hover:bg-gray-50 text-gray-600 p-2 rounded-lg transition-colors flex items-center justify-center"
                        title="GitHub Code"
                      >
                        <FiGithub className="text-xs" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xxs font-bold text-gray-600 transition-colors disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xxs font-bold text-gray-500">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xxs font-bold text-gray-600 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
