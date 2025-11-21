'use client';
import { Copyright } from 'lucide-react';
import React from 'react';

import AboutSection from './AboutSection';
import ContactColumn from './ContactColumn';
import LinksSection from './LinksSection';
import TopSection from './TopSection';
import TrustIcons from './TrustIcons';

const Footer: React.FC = () => {
  return (
    <footer className="relative mx-auto mt-auto w-11/12 max-w-[1400px] bg-white">
      <TopSection />

      <div className="container mx-auto pt-32 lg:pt-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <ContactColumn />

          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <LinksSection />
              <AboutSection />
            </div>

            <TrustIcons isMobile />
          </div>
        </div>
      </div>

      <TrustIcons />
      <Copyright />
    </footer>
  );
};

export default Footer;
