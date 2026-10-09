export default function BrandsCarousel() {
  const brands = [
    { src: '/images/brands/dropbox-logo-svg-150px.svg', alt: 'Dropbox' },
    { src: '/images/brands/hubspot-logo-svg-150.svg', alt: 'HubSpot' },
    { src: '/images/brands/livechat-logo-svg-150px.svg', alt: 'LiveChat' },
    { src: '/images/brands/pingdom-logo-svg-150px.svg', alt: 'Pingdom' },
    { src: '/images/brands/scapic-logo-svg-150px.svg', alt: 'Scapic' },
  ];

  return (
    <section className="section-sm pt-16 xl:pt-20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-text-light text-base mb-10">
          Trusted by <strong className="text-primary font-semibold">500+</strong> growing businesses to make smarter financial decisions every day.
        </p>
        <div className="flex gap-10 xl:gap-x-16 flex-wrap justify-center items-center opacity-70 hover:opacity-100 transition-opacity">
          {brands.map((b) => (
            <img key={b.alt} src={b.src} alt={b.alt} className="h-7 lg:h-8 w-auto grayscale hover:grayscale-0 transition-all" />
          ))}
        </div>
      </div>
    </section>
  );
}
