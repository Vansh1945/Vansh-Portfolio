import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { useWebsiteSettings } from "../context/WebsiteSettingsContext";
import aboutimg from '../Assets/vansh.jpg';

const About = () => {
  const { settings } = useWebsiteSettings();

  return (
    <section className="relative overflow-hidden py-20 bg-white" id="about">
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
            About Me
            <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
          </h2>
        </motion.div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full md:w-3/5 text-left"
          >
            <p className="text-sm md:text-base text-gray-600 leading-relaxed text-justify">
              Hi, I'm <span className="font-semibold text-primary">{settings?.developerName || 'Vansh'}</span>, a passionate Full Stack Web Developer specializing in the <span className="font-semibold text-text">MERN Stack</span> (MongoDB, Express.js, React, Node.js) and other modern web technologies. Having completed my B.Tech in Computer Science Engineering, I focus on building high-performance, responsive web applications with clean architecture.
            </p>

            <p className="text-sm md:text-base text-gray-600 mt-5 leading-relaxed text-justify">
              My expertise spans across both frontend and backend development, enabling me to build seamless user interfaces as well as robust server-side systems. I am dedicated to writing clean, modular, and scalable code that solves real-world problems and delivers exceptional user experiences.
            </p>

            {/* Quick Details List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-gray-600 text-sm font-medium">MERN Stack Development</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-gray-600 text-sm font-medium">B.Tech in Computer Science</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-gray-600 text-sm font-medium">Robust API Architecture</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-gray-600 text-sm font-medium">Clean, Scalable & Modular Code</span>
              </div>
            </div>

            {/* Resume Button */}
            {(settings?.resumePdf || !settings) && (
              <div className="mt-10">
                <a
                  href={settings?.resumePdf || "https://drive.google.com/file/d/1-dJuCmA3P49osW3xNa6Wz7eN12YAMKDa/view?usp=drive_link"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <FaDownload className="text-xs" />
                  Download Resume
                </a>
              </div>
            )}
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full md:w-2/5 flex justify-center"
          >
            <div className="relative group max-w-[280px] sm:max-w-[320px] w-full">
              {/* Backing decorative cards */}
              <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-6 scale-95 transition-transform duration-300 group-hover:rotate-3" />
              <div className="absolute inset-0 bg-secondary/15 rounded-2xl transform -rotate-3 scale-95 transition-transform duration-300 group-hover:-rotate-1" />

              <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-xl bg-white p-2 z-10">
                <img
                  src={settings?.profileImage || aboutimg}
                  alt={settings?.developerName || "Vansh"}
                  className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;