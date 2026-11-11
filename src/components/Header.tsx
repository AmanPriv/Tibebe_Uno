import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { FIRM_INFO } from '../data/firmData';

interface HeaderProps {
  onNavigateToContact: () => void;
}

const NAV_ITEMS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const Header: React.FC<HeaderProps> = ({ onNavigateToContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[#E8DCC8] transition-colors duration-200 ${
        isScrolled ? 'bg-[#FBF8F3]/95 backdrop-blur-md shadow-xs' : 'bg-[#F5EFE6]/95 backdrop-blur-xs'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark + Descriptor */}
        <a
          href="#top"
          className="group flex flex-col cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2F24]"
        >
          <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#2B2118] group-hover:text-[#3B2F24] transition-colors duration-200">
            {FIRM_INFO.name}
          </span>
          <span className="text-[11px] font-medium tracking-wide text-[#5C4E40]">
            {FIRM_INFO.descriptor}
          </span>
        </a>

        {/* Zone 2: Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#5C4E40]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="cursor-pointer whitespace-nowrap shrink-0 py-1 text-[#5C4E40] hover:text-[#2B2118] underline-offset-8 hover:underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2F24]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={() => onNavigateToContact()}
            className="hidden sm:inline-flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 rounded-md bg-[#8A6A3B] px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-[#6F5430] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118]"
          >
            Request a Consultation
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex lg:hidden items-center justify-center cursor-pointer rounded-md border border-[#E8DCC8] bg-[#FBF8F3] p-2.5 text-[#2B2118] hover:bg-[#E8DCC8]/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-[#E8DCC8] bg-[#FBF8F3] px-4 pt-3 pb-6 shadow-md"
        >
          <ul className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleMobileNavClick}
                  className="block cursor-pointer rounded-md px-3 py-2.5 text-base font-medium text-[#2B2118] hover:bg-[#E8DCC8]/40 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-[#E8DCC8]">
            <a
              href="#contact"
              onClick={() => {
                handleMobileNavClick();
                onNavigateToContact();
              }}
              className="flex w-full items-center justify-center cursor-pointer rounded-md bg-[#8A6A3B] px-4 py-3 text-sm font-medium text-white hover:bg-[#6F5430] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118]"
            >
              Request a Consultation
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
