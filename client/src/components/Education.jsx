import React from 'react';
import { motion } from 'framer-motion';
import ptulogo from "../Assets/ptulogo.png"; 
import hplogo from "../Assets/HPBoselogo.png"; 

const Education = () => {
  return (
    <section className="relative py-20 bg-backgroundLightAlt overflow-hidden" id="education">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-left"
        >
          <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight font-cursive relative inline-block">
            Education
            <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
          </h2>
        </motion.div>

        {/* Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PTU Education Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group relative"
          >
            <div className="bg-white rounded-xl p-5 md:p-6 h-full shadow-sm hover:shadow-md border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Header: Logo and Title */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-primary/5 transition-colors duration-300">
                    <img
                      src={ptulogo}
                      alt="I.K. Gujral Punjab Technical University logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors duration-200">
                      I.K. Gujral Punjab Technical University
                    </h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xxs font-semibold bg-green-50 text-green-700 border border-green-200">
                      Completed | 2022 - 2026
                    </span>
                  </div>
                </div>
 
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between items-center gap-2">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-800">
                      B.Tech in Computer Science & Engineering
                    </h4>
                    <span className="text-xxs md:text-xs font-semibold text-gray-500 shrink-0">
                      CGPA: 8.0
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-2 leading-relaxed">
                    Focused on core computer science subjects, algorithms, software engineering principles, and full-stack system architectures.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
 
          {/* HPBOSE Education Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="group relative"
          >
            <div className="bg-white rounded-xl p-5 md:p-6 h-full shadow-sm hover:shadow-md border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Header: Logo and Title */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-primary/5 transition-colors duration-300">
                    <img
                      src={hplogo}
                      alt="HPBOSE logo"
                      className="w-10 h-10 object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors duration-200">
                      Himachal Pradesh Board of School Education
                    </h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xxs font-semibold bg-gray-100 text-gray-600">
                      2012 - 2022
                    </span>
                  </div>
                </div>
 
                {/* Content */}
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-gray-800">
                      Intermediate (Class XII)
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Completed in 2022 with <span className="font-semibold text-gray-700">69%</span> (Non-Medical stream)
                    </p>
                  </div>
                  <div className="pt-1">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-800">
                      Matriculation (Class X)
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Completed in 2020 with <span className="font-semibold text-gray-700">78%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
 
        </div>
      </div>
    </section>
  );
};
 
export default Education;