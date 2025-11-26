import Image from 'next/image';
import React from 'react';

interface Props {
  className?: string;
}

const ICONS = [
  {
    id: 'ecunion',
    alt: 'عضو اتحادیه کشوری کسب و کارهای مجازی',
    src: 'https://images.rojashop.com/pr:sharp/rs:fill:100:0:0/plain/s3://uploads/icons/logo-ecunion.png',
  },
  // فضای آینده برای enamad و samanadehi
];

const TrustIcons: React.FC<Props> = ({ className = '' }) => (
  <section
    aria-label="نمادهای اعتماد"
    className={`grid gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
  >
    {ICONS.map((icon) => (
      <div
        className="flex items-center justify-center rounded-lg bg-white p-3 shadow-sm"
        key={icon.id}
      >
        <Image height={80} width={80} alt={icon.alt} src={icon.src} />
      </div>
    ))}
  </section>
);

export default TrustIcons;
