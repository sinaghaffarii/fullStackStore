'use client';

export function StructuredData() {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
        url: process.env.NEXT_PUBLIC_SITE_URL,
        name: 'فاران بیوتی',
        description: 'فروشگاه اینترنتی با بهترین قیمت‌ها و کیفیت',
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: `${
              process.env.NEXT_PUBLIC_SITE_URL
            }/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        ],
        inLanguage: 'fa-IR',
      },
      {
        '@type': 'Organization',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
        name: 'فاران بیوتی',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
        sameAs: [],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData) }}
    />
  );
}
