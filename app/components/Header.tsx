'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ['hero', 'about', 'services', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= -50 && rect.top <= window.innerHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'hero', label: t('home'), icon: '🏠' },
    { id: 'about', label: t('about'), icon: '👥' },
    { id: 'services', label: t('services'), icon: '⚡' },
    { id: 'contact', label: t('contact'), icon: '📱' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/70 backdrop-blur-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <a 
              href="#hero"
              onClick={(e) => handleNavClick(e, 'hero')}
            >
              <Image 
                src="/images/logo.png" 
                alt="Arfapro Logo" 
                width={180} 
                height={58}
                className="h-14 w-auto"
              />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex items-center space-x-8"
          >
            {menuItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                variants={itemVariants}
                className={`group relative px-6 py-3 text-2xl font-bold transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-blue-400'
                    : isScrolled ? 'text-white' : 'text-white'
                } hover:text-blue-300`}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  {item.label}
                </span>
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeSection === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </motion.a>
            ))}
            
            {/* Language Toggle */}
            <motion.button
              variants={itemVariants}
              onClick={toggleLanguage}
              className={`px-6 py-3 rounded-full text-xl font-bold transition-all duration-300 
                ${isScrolled  ? 'text-white' 
                : 'text-black'
              } hover:bg-blue-600 hover:text-white`}
            >
              {language === 'id' ? 'EN' : 'ID'}
            </motion.button>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-white focus:outline-none"
            >
              {/* Icon for mobile menu */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }} 
          className="lg:hidden bg-black text-white"
        >
          <div className="flex flex-col items-center">
            {menuItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                onClick={(e) => handleNavClick(e, item.id)} 
                className={`px-4 py-2 text-lg font-bold transition-all duration-300 ${
                  activeSection === item.id ? 'text-blue-400' : 'text-white'
                } hover:text-blue-300`}
              >
                {item.label}
              </a>
            ))}
            <button 
              onClick={toggleLanguage} 
              className="px-4 py-2 text-lg font-bold transition-all duration-300 hover:text-blue-300"
            >
              {language === 'id' ? 'EN' : 'ID'}
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}