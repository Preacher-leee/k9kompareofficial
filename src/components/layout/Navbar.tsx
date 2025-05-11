import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { AuthModal } from '../auth/AuthModal';
import { SubscribeModal } from '../premium/SubscribeModal';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const location = useLocation();
  const { user, isPremium, signOut } = useAuthStore();

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/kompare', label: 'Kompare Breeds' },
    { to: '/facts', label: 'Fun Dog Facts' },
    { to: '/about', label: 'About' },
    { to: '/more-projects', label: 'More Projects' },
  ];

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-12 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'nav-link-active' : ''} ${
                      scrolled ? 'text-gray-700' : 'text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <div className="flex items-center gap-4">
                  {!isPremium && (
                    <button
                      onClick={() => setSubscribeModalOpen(true)}
                      className="btn btn-secondary"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                  <div className="relative group">
                    <button className={`flex items-center gap-2 ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                      <UserCircle size={24} />
                      <span>{user.email}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={() => signOut()}
                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className={`flex items-center gap-2 ${
                    scrolled ? 'text-gray-700' : 'text-white'
                  } hover:text-secondary-500 transition-colors`}
                >
                  <LogIn size={20} />
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden focus:outline-none ${
                scrolled ? 'text-primary-600' : 'text-white'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => 
                      `nav-link block text-gray-700 ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {user ? (
                  <>
                    {!isPremium && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSubscribeModalOpen(true);
                        }}
                        className="btn btn-secondary w-full"
                      >
                        Upgrade to Premium
                      </button>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-secondary-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="text-gray-700 hover:text-secondary-500 transition-colors flex items-center gap-2"
                  >
                    <LogIn size={20} />
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </motion.header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      
      <SubscribeModal 
        isOpen={subscribeModalOpen} 
        onClose={() => setSubscribeModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;