import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaInstagram, FaFacebookF, FaPhoneAlt, FaMapMarkerAlt, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { useWebsiteSettings } from "../context/WebsiteSettingsContext";
import { API_URL } from "../config";

const Contact = () => {
  const { settings } = useWebsiteSettings();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setStatus({ type: "error", message: "Please fill out all fields." });
      return;
    }

    setStatus({ type: null, message: "" });

    try {
      const response = await fetch(`${API_URL}contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: data.message || "Thank you! Your message has been sent successfully." });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Something went wrong. Please try again." });
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus({ type: "error", message: "Please try again later." });
    }

    // Clear success/error message after 5 seconds
    setTimeout(() => {
      setStatus({ type: null, message: "" });
    }, 5000);
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden" id="contact">
      <div className="max-w-[95%] mx-auto px-4 md:px-8 relative z-10">

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-left"
        >
          <h2 className="text-text text-xl md:text-2xl font-bold tracking-tight font-cursive relative inline-block">
            Contact
            <span className="absolute left-0 bottom-[-6px] w-10 h-0.5 bg-primary rounded-full"></span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">

          {/* Left Section - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:w-1/2 flex flex-col justify-center space-y-8"
          >
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3">
                Let's connect and build something amazing together!
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6 max-w-md">
                Whether you have a question, a project proposal, or just want to say hi, feel free to reach out. I'm always open to discussing new opportunities.
              </p>

              {/* Contact Details List */}
              <div className="space-y-4 mb-6">
                {/* Email */}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl bg-backgroundLightAlt border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300 group w-full max-w-md"
                  >
                    <div className="bg-primary text-white p-2.5 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <IoIosMail className="text-lg" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                      <span className="text-xs md:text-sm font-bold text-gray-800 hover:text-primary transition-colors">
                        {settings.email}
                      </span>
                    </div>
                  </a>
                )}

                {/* Phone */}
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl bg-backgroundLightAlt border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300 group w-full max-w-md"
                  >
                    <div className="bg-primary/10 text-primary p-2.5 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <FaPhoneAlt className="text-base" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Phone</span>
                      <span className="text-xs md:text-sm font-bold text-gray-800 hover:text-primary transition-colors">
                        {settings.phone}
                      </span>
                    </div>
                  </a>
                )}

                {/* Location */}
                {settings?.location && (
                  <div
                    className="flex items-center gap-3.5 p-2.5 rounded-xl bg-backgroundLightAlt border border-gray-100 hover:border-primary/20 transition-all duration-300 group w-full max-w-md"
                  >
                    <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                      <FaMapMarkerAlt className="text-base" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Location</span>
                      <span className="text-xs md:text-sm font-bold text-gray-800">
                        {settings.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Icons */}
              {(settings?.github || settings?.linkedin || settings?.instagram || settings?.facebook || settings?.twitter || settings?.youtube || settings?.whatsapp) && (
                <div>
                  <h4 className="text-xxs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Follow My Work</h4>
                  <div className="flex gap-2.5">
                    {[
                      { key: 'github', icon: <FaGithub className="text-sm" />, url: settings?.github, label: 'GitHub' },
                      { key: 'linkedin', icon: <FaLinkedinIn className="text-sm" />, url: settings?.linkedin, label: 'LinkedIn' },
                      { key: 'instagram', icon: <FaInstagram className="text-sm" />, url: settings?.instagram, label: 'Instagram' },
                      { key: 'facebook', icon: <FaFacebookF className="text-sm" />, url: settings?.facebook, label: 'Facebook' },
                      { key: 'twitter', icon: <FaTwitter className="text-sm" />, url: settings?.twitter, label: 'Twitter' },
                      { key: 'youtube', icon: <FaYoutube className="text-sm" />, url: settings?.youtube, label: 'YouTube' },
                      { key: 'whatsapp', icon: <FaWhatsapp className="text-sm" />, url: settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : null, label: 'WhatsApp' }
                    ].map(item => item.url && (
                      <a
                        key={item.key}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="bg-backgroundLightAlt p-2.5 rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-gray-700"
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Section - Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:w-1/2 flex"
          >
            <div className="w-full bg-backgroundLightAlt border border-gray-100 rounded-xl p-5 md:p-6 shadow-sm flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your Phone Number"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Feedback"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Your Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write details of your project..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    Send Message
                  </button>
                </div>
              </form>

              {/* Status Notifications */}
              <AnimatePresence>
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-3 rounded-lg text-xxs font-bold ${status.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                  >
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;