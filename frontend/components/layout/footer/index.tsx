'use client';

import React from 'react';

import AboutSection from './AboutSection';
import ContactColumn from './ContactColumn';
import FooterLegal from './Copyright';
import LinkGroups from './LinkGroups';
import Newsletter from './Newsletter';
import TopStrip from './TopStrip';
import TrustIcons from './TrustIcons';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-auto bg-white">
      <div className="mx-auto flex w-11/12 max-w-[1400px] flex-col gap-10 py-12 lg:py-16">
        <TopStrip />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <ContactColumn />

          <div className="space-y-8">
            <LinkGroups />
            <Newsletter variant="mobile" />
          </div>

          <AboutSection />
        </div>

        <TrustIcons />

        <FooterLegal />
      </div>
    </footer>
  );
};

export default Footer;
