import React, { useState, useEffect } from 'react';

import { FiMenu, FiX } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';

const navLinks = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/services' },
    { label: 'Experience', href: '/experience' },
    { label: 'Certificates', href: '/certificates' },
    { label: 'Portfolio', href: '/projects' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
    const { settings } = useWebsiteSettings();
    const [showMediaIcons, setShowMediaIcons] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasTestimonials, setHasTestimonials] = useState(false);

    // Dynamic testimonials availability check
    useEffect(() => {
        const checkTestimonials = async () => {
            try {
                const res = await axios.get(`${API_URL}testimonials`);
                if (res.data && res.data.success && res.data.data.length > 0) {
                    setHasTestimonials(true);
                }
            } catch (err) {
                console.error('Navbar testimonials check failed:', err);
            }
        };
        checkTestimonials();
    }, []);

    // Dynamic admin logged-in check
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        setIsAdmin(!!token);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMenuItemClick = () => {
        setShowMediaIcons(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    // Filter visible links based on whether testimonials exist
    const visibleLinks = navLinks.filter(link => {
        if (link.label === 'Testimonials') {
            return hasTestimonials;
        }
        return true;
    });

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
            ? 'bg-white/95 backdrop-blur-md border-gray-100 shadow-sm py-3'
            : 'bg-transparent border-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                {/* Brand Logo/Name */}
                <div className="flex items-center">
                    <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight font-cursive flex items-center">
                        {settings?.logo ? (
                            <img src={getImageUrl(settings.logo)} className="h-7 w-auto object-contain" alt={settings.websiteName} />
                        ) : (
                            <>{settings?.websiteName || 'Vansh'}<span className="text-primary">.</span></>
                        )}
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center">
                    <ul className="flex space-x-7">
                        {visibleLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="text-xs font-semibold text-gray-600 hover:text-primary transition-colors duration-200 relative py-2"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social Media & Actions Area */}
                <div className="flex items-center space-x-4">

                    {/* Desktop CTA Action Button */}
                    {isAdmin ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link
                                to="/admin/dashboard"
                                className="inline-flex items-center justify-center px-3.5 py-1.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-all border border-red-100"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/contact"
                            className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            Contact Me
                        </Link>
                    )}

                    {/* Mobile Hamburger Icon */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setShowMediaIcons(!showMediaIcons)}
                            className="p-2 text-gray-600 hover:text-primary focus:outline-none transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {showMediaIcons ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown Panel */}
            <div className={`absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xl md:hidden transition-all duration-300 ease-in-out origin-top ${showMediaIcons
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                <ul className="flex flex-col space-y-4 p-6 text-left">
                    {visibleLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={handleMenuItemClick}
                                className="block text-sm font-bold text-gray-700 hover:text-primary transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}

                    {/* Mobile Admin Actions */}
                    {isAdmin && (
                        <li className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                            <Link
                                to="/admin/dashboard"
                                onClick={handleMenuItemClick}
                                className="w-full text-center py-2.5 bg-primary text-white font-bold text-xs rounded-lg shadow-sm"
                            >
                                Admin Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-center py-2.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg border border-red-100"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
