import Image from 'next/image';
import React from 'react';

interface Props {
  isMobile?: boolean;
}

const ICONS = [
  // {
  //   id: 'enamad',
  //   alt: 'نماد اعتماد الکترونیکی',
  //   src: 'https://Trustseal.eNamad.ir/logo.aspx?id=85847&Code=Cr8BmH3ATXuWskUna2wf',
  // },
  // {
  //   id: 'samandehi',
  //   alt: 'نماد ساماندهی',
  //   src: 'https://logo.samandehi.ir/logo.aspx?id=1010075&p=nbpdlymanbpdlymalymayndtujyn',
  // },
  {
    id: 'ecunion',
    alt: 'اتحادیه',
    src: 'https://images.rojashop.com/pr:sharp/rs:fill:100:0:0/plain/s3://uploads/icons/logo-ecunion.png',
  },
];

const TrustIcons: React.FC<Props> = ({ isMobile = false }) => {
  const iconSize = isMobile ? 64 : 80;
  return (
    <div
      className={`items-center justify-between ${isMobile ? 'flex lg:hidden' : 'hidden lg:flex'}`}
    >
      {ICONS.map((icon) => (
        <div className="rounded-sm bg-white p-2" key={icon.id}>
          <Image
            height={iconSize}
            width={iconSize}
            alt={icon.alt}
            className="h-auto"
            src={icon.src}
          />
        </div>
      ))}
    </div>
  );
};

export default TrustIcons;
