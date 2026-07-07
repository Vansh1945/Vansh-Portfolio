import React from "react";
import { motion } from "framer-motion";
import heroimg from "../Assets/hero.png";
import TextChange from "./TextChange";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useWebsiteSettings } from "../context/WebsiteSettingsContext";

const Hero = () => {
  const { settings } = useWebsiteSettings();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-backgroundLightAlt overflow-hidden pt-16" id='home'>
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row justify-between items-center py-12 md:py-20 relative z-10 gap-12">
        
        {/* Text Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:w-1/2 flex flex-col items-start text-left mt-8 md:mt-0"
        >
          {/* Subtle Work/Status Tag */}
          <motion.span 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-primary bg-primary/10 uppercase mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Available for new opportunities
          </motion.span>

          {/* Heading */}
          <h1 className="text-text font-cursive text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Hi, I'm <span className="text-primary">{settings?.developerName || 'Vansh'}</span>
          </h1>

          {/* Dynamic Designation */}
          <div className="text-lg md:text-2xl text-gray-700 font-medium mt-3 h-10 flex items-center">
            <span className="mr-2">I am a</span>
            <span className="text-primary font-semibold">
              <TextChange designation={settings?.designation} />
            </span>
          </div>

          <p className="mt-5 text-gray-500 text-sm md:text-base max-w-lg leading-relaxed">
            {settings?.tagline || 'Graduate in B.Tech Computer Science & Engineering. Passionate about building robust MERN applications with clean, interactive, and user-centric designs.'}
          </p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 mt-8 w-full sm:w-auto"
          >
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Hire Me
              <FiArrowRight className="text-base" />
            </Link>
            
            {(settings?.resumePdf || !settings) && (
              <a 
                href={settings?.resumePdf || "https://drive.google.com/file/d/1-dJuCmA3P49osW3xNa6Wz7eN12YAMKDa/view?usp=drive_link"} 
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-medium text-sm transition-all duration-200 hover:bg-gray-50 transform hover:-translate-y-0.5"
              >
                Download Resume
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="md:w-1/2 flex justify-center items-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full filter blur-2xl -z-10 transform scale-95" />
          
          <div className="relative group max-w-md w-full">
            <img 
              src={settings?.heroImage || heroimg} 
              alt={`${settings?.developerName || 'Vansh'}'s illustration`} 
              className="w-full h-auto max-h-[450px] object-contain drop-shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-[1.02]" 
            />
          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Hero;