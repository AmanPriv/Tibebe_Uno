import React, { useState, useCallback, useEffect } from 'react';
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
  const [activeProcessStep, setActiveProcessStep] = useState<number>(3);

  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#top') {
      window.scrollTo(0, 0);
    }
  }, []);

  const attachBgComment = useCallback((node: HTMLElement | null) => {
    if (!node || !node.parentNode) return;
    const prev = node.previousSibling;
    if (
      prev &&
      prev.nodeType === Node.COMMENT_NODE &&
      prev.nodeValue?.includes('BACKGROUND IMAGE')
    ) {
      return;
    }
    const commentNode = document.createComment(
      ' BACKGROUND IMAGE: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80 '
    );
    node.parentNode.insertBefore(commentNode, node);
  }, []);

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
  };

  const handleRequestConsultation = () => {
    const contactInput = document.getElementById('contact-name');
    if (contactInput) {
      setTimeout(() => contactInput.focus({ preventScroll: true }), 250);
    }
  };

  return (
    <div
      ref={attachBgComment}
      className="architectural-page-bg relative min-h-screen flex flex-col text-[#1F1B18]"
    >
      <InitialLoader />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#1F1B18] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#FCFBF9]"
      >
        Skip to main content
      </a>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header onNavigateToContact={handleRequestConsultation} />

        <main id="main-content" className="flex-1">
          <Hero onRequestConsultation={handleRequestConsultation} />
          <ServicesSection onSelectService={handleSelectService} />
          <AboutSection />
          <ProcessSection
            activeStep={activeProcessStep}
            onActiveStepChange={setActiveProcessStep}
          />
          <IndustriesSection />
          <TeamSection />
          <FaqSection />
          <ContactSection selectedService={selectedService} />
        </main>

        <Footer />
        <BackToTopButton />
      </div>
    </div>
  );
}
