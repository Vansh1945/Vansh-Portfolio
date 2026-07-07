import React from "react";
import { FaGithub, FaLinkedinIn, FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useWebsiteSettings } from "../context/WebsiteSettingsContext";

const Footer = () => {
  const { settings } = useWebsiteSettings();

  return (
    <footer className="bg-[#0b0f19] border-t border-gray-800/40 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Copyright Text */}
        <p className="text-gray-400 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} <span className="text-white font-semibold">{settings?.developerName || 'Vansh'}</span>. All rights reserved.
        </p>
        
        {/* Social Icons replication */}
        <div className="flex items-center gap-5">
          {settings?.github && (
            <a 
              href={settings.github} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaGithub className="text-base" />
            </a>
          )}
          {settings?.linkedin && (
            <a 
              href={settings.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaLinkedinIn className="text-base" />
            </a>
          )}
          {settings?.instagram && (
            <a 
              href={settings.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaInstagram className="text-base" />
            </a>
          )}
          {settings?.facebook && (
            <a 
              href={settings.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaFacebookF className="text-base" />
            </a>
          )}
          {settings?.twitter && (
            <a 
              href={settings.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaTwitter className="text-base" />
            </a>
          )}
          {settings?.youtube && (
            <a 
              href={settings.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaYoutube className="text-base" />
            </a>
          )}
          {settings?.whatsapp && (
            <a 
              href={settings.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaWhatsapp className="text-base" />
            </a>
          )}
        </div>

      </div>
    </footer>
  );
};

export default Footer;