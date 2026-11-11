import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { ProcessSection } from './components/ProcessSection';
import { IndustriesSection } from './components/IndustriesSection';
import { TeamSection } from './components/TeamSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTopButton } from './components/BackToTopButton';
import { InitialLoader } from './components/InitialLoader';

export default function App() {
  const [selectedService, setSelectedService] = useState<string>('');

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
  };

  const handleRequestConsultation = () => {
    const contactInput = document.getElementById('contact-name');
    if (contactInput) {
      setTimeout(() => contactInput.focus({ preventScroll: true }), 350);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFE6] text-[#2B2118]">
      <InitialLoader />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#2B2118] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#FBF8F3]"
      >
        Skip to main content
      </a>

      <Header onNavigateToContact={handleRequestConsultation} />

      <main id="main-content" className="flex-1">
        <Hero onRequestConsultation={handleRequestConsultation} />
        <ServicesSection onSelectService={handleSelectService} />
        <AboutSection />
        <ProcessSection />
        <IndustriesSection />
        <TeamSection />
        <FaqSection />
        <ContactSection selectedService={selectedService} />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}

