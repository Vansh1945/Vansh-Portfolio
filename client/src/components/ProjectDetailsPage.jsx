import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiGithub, FiExternalLink, FiCpu, FiCheckCircle } from 'react-icons/fi';
import { Loader } from 'lucide-react';

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gallery slider state
  const [activeImage, setActiveImage] = useState('');

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}projects/${slug}`);
      if (res.data && res.data.success) {
        const proj = res.data.data;
        setProject(proj);
        setActiveImage(proj.coverImage);

        // Fetch related projects in same category
        const relRes = await axios.get(`${API_URL}projects`, {
          params: { category: proj.category, limit: 4 }
        });
        if (relRes.data && relRes.data.success) {
          // filter current project out
          const filtered = relRes.data.data.filter(p => p._id !== proj._id).slice(0, 3);
          setRelated(filtered);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Project not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-backgroundLightAlt flex flex-col items-center justify-center pt-28">
        <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-500">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-backgroundLightAlt flex flex-col items-center justify-center pt-28 px-6 text-center">
        <p className="text-sm font-bold text-red-500 mb-4">{error || 'Project not found.'}</p>
        <Link to="/projects" className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors">
          <FiArrowLeft /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundLightAlt pt-28 pb-20 text-left">
      <div className="max-w-[95%] mx-auto px-4 md:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-xs mb-8 transition-colors"
        >
          <FiArrowLeft className="text-sm" />
          Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Images & Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden aspect-video relative shadow-sm">
              <img
                src={activeImage}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Gallery Thumbnail Slider */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveImage(project.coverImage)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${activeImage === project.coverImage ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  <img src={project.coverImage} className="w-full h-full object-cover" alt="Cover Thumbnail" />
                </button>
                {project.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${activeImage === imgUrl ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt={`Gallery Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 text-left">
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider relative inline-block">
                  Project Description
                  <span className="absolute left-0 bottom-[-4px] w-6 h-0.5 bg-primary rounded-full"></span>
                </h2>
                {project.shortDescription && (
                  <p className="text-xs md:text-sm font-semibold text-gray-700 mt-4 leading-relaxed">
                    {project.shortDescription}
                  </p>
                )}
              </div>
              <div className="border-l-2 border-primary/20 pl-4 pt-0.5">
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed md:leading-loose whitespace-pre-wrap text-justify font-normal">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Project Meta Details */}
          <div className="space-y-6">

            {/* Meta details card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Project Title</span>
                <h1 className="text-sm md:text-base font-extrabold text-gray-900 mt-1">{project.title}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Category</span>
                  <span className="text-xs font-bold text-gray-800 mt-1 block">{project.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ownership</span>
                  <span className="text-xs font-bold text-gray-800 mt-1 block">{project.projectOwnership}</span>
                </div>
              </div>

              {/* Action Link Buttons */}
              <div className="space-y-2.5">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <FiExternalLink />
                    Live Demo Link
                  </a>
                )}
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                  >
                    <FiGithub />
                    GitHub Repository
                  </a>
                )}
              </div>
            </div>

            {/* Technologies Box */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                <FiCpu className="text-primary text-sm" />
                <span>Technologies Used</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features Box */}
            {project.features && project.features.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                  <FiCheckCircle className="text-green-500 text-sm" />
                  <span>Key Features Included</span>
                </div>
                <ul className="space-y-3">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 font-medium leading-relaxed">
                      <FiCheckCircle className="text-green-500 mt-1 shrink-0 text-xs" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Related Projects Section */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h3 className="text-base font-bold text-gray-900 mb-8">Related Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relProj) => (
                <div
                  key={relProj._id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="aspect-video overflow-hidden bg-gray-50">
                    <img src={relProj.coverImage} className="w-full h-full object-cover" alt={relProj.title} />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{relProj.title}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-2">{relProj.shortDescription}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      to={`/projects/${relProj.slug}`}
                      className="w-full block text-center py-1.5 border border-gray-200 hover:border-gray-300 text-gray-600 font-bold text-xxs rounded-lg transition-colors"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectDetailsPage;
