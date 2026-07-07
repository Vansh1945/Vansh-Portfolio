import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import SkillsStrip from './SkillsStrip';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loadingExp, setLoadingExp] = useState(true);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const res = await axios.get(`${API_URL}experiences`);
        if (res.data && res.data.success) {
          setExperiences(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
      } finally {
        setLoadingExp(false);
      }
    };
    fetchExp();
  }, []);

  return (
    <section className="relative overflow-hidden py-20 bg-white" id='experience'>
      <div className="max-w-[95%] mx-auto px-4 md:px-8 relative z-10">

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-left"
        >
          <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight font-cursive relative inline-block">
            Skills & Toolkit
            <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
          </h2>
        </motion.div>
      </div>

      {/* Dynamic scrolling Skills Strip (Full Width) */}
      <div className="mb-14 relative z-10 w-full">
        <SkillsStrip />
      </div>

      <div className="max-w-[95%] mx-auto px-4 md:px-8 relative z-10">
        {/* Work Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-left"
        >
          <h3 className="text-text text-xl md:text-2xl font-bold tracking-tight font-cursive relative inline-block mb-8">
            Work Experience
            <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
          </h3>

          {loadingExp ? (
            <p className="text-xs font-semibold text-gray-400">Loading work experiences...</p>
          ) : experiences.length === 0 ? (
            <div className="bg-backgroundLightAlt rounded-xl p-6 border border-gray-100 text-center">
              <p className="text-xs font-semibold text-gray-400">No experiences registered yet.</p>
            </div>
          ) : (
            <div className="relative border-l border-gray-200 ml-4 md:ml-6 pl-6 md:pl-8 space-y-10">
              {experiences.map((exp) => {
                const startYear = new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
                const endYear = exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
                const dateRange = `${startYear} - ${endYear}`;

                return (
                  <div key={exp._id} className="relative">
                    {/* Timeline dot */}
                    <span className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm ring-4 ring-primary/10 z-10" />

                    <div className="bg-backgroundLightAlt rounded-xl p-5 md:p-6 border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          {exp.companyLogo && (
                            <img
                              src={getImageUrl(exp.companyLogo)}
                              alt={exp.organization}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            />
                          )}
                          <div>
                            <h4 className="text-base font-bold text-gray-900">{exp.title}</h4>
                            <p className="text-xs font-semibold text-primary mt-0.5">
                              {exp.organization} {exp.location && `• ${exp.location}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xxs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            {dateRange}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xxs font-semibold bg-gray-100 text-gray-600 shrink-0">
                            {exp.employmentType}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 leading-relaxed text-justify font-normal whitespace-pre-wrap">
                        {exp.summary}
                      </p>

                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="mt-4 space-y-1.5">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2 text-xxs text-gray-500">
                              <span className="text-primary mt-0.5 font-bold">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default Experience;