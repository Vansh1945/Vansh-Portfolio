import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Certificates from './components/Certificates';
import Project from './components/Project';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ServicesPage from './components/ServicesPage';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import SkillsStrip from './components/SkillsStrip';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import AdminCertificates from './Admin/AdminCertificates';
import AdminServices from './Admin/AdminServices';
import AdminTestimonials from './Admin/AdminTestimonials';
import AdminProjects from './Admin/AdminProjects';
import AdminSettings from './Admin/AdminSettings';
import AdminMessages from './Admin/AdminMessages';
import AdminSkills from './Admin/AdminSkills';
import ProtectedRoute from './components/ProtectedRoute';
import {
  LogOut,
  Award,
  Wrench,
  LayoutDashboard,
  MessageSquare,
  Star,
  Settings,
  Menu,
  X
} from 'lucide-react';

// Scroll helper supporting both route changes and hash navigation
const HashScroll = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Shared Admin Layout Wrapper defining the Sidebar and Admin Account controls
const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const adminUsername = localStorage.getItem('adminUsername') || 'vansh';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Manage Projects', icon: Wrench, path: '/admin/projects' },
    { label: 'Manage Skills', icon: Wrench, path: '/admin/skills' },
    { label: 'Services (Admin)', icon: Wrench, path: '/admin/services' },
    { label: 'Certificates', icon: Award, path: '/admin/certificates' },
    { label: 'Testimonials', icon: Star, path: '/admin/testimonials' },
    { label: 'Messages', icon: MessageSquare, path: '/admin/messages' },
    { label: 'Website Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden text-left font-sans">

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-6 py-4 flex justify-between items-center z-50 shadow-md">
        <Link to="/admin/dashboard" className="text-lg font-bold tracking-tight">
          Vansh<span className="text-blue-500">.</span>Admin
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } h-screen shrink-0`}>
        <div>
          {/* Sidebar Header Branding */}
          <div className="px-6 py-6 border-b border-slate-800">
            <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight text-white font-cursive">
              Vansh<span className="text-blue-500">.</span>Admin
            </Link>
            <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-1.5">Control Center</p>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Account section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm uppercase">
              {adminUsername.charAt(0)}
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-bold text-white truncate">{adminUsername}</p>
              <p className="text-[10px] text-slate-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold text-xs rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/45 z-30 md:hidden"
        />
      )}

      {/* Main Content Dashboard Area */}
      <main className="flex-grow overflow-y-auto">
        {children}
      </main>

    </div>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <SkillsStrip />
      <Certificates isPreview={true} />
      <Testimonials />
    </>
  );
};

// Sub-page layout wrappers for separate routes
const ExperiencePage = () => (
  <div className="pt-20">
    <Experience />
    <Education />
  </div>
);

const CertificatesPage = () => (
  <div className="pt-20">
    <Certificates />
  </div>
);

const ContactPage = () => (
  <div className="pt-20">
    <Contact />
  </div>
);

const App = () => {
  const { pathname } = useLocation();
  const showNavAndFooter = !pathname.toLowerCase().startsWith('/admin');

  return (
    <>
      <HashScroll />
      {showNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/certificates" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminCertificates />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/services" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminServices />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/testimonials" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminTestimonials />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminProjects />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/skills" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminSkills />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminMessages />
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
      {showNavAndFooter && <Footer />}
    </>
  );
};

export default App;
