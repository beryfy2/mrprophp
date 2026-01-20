import React from "react";
import "../style/trustby.css";

const BRANDS = [
  { logo: new URL(`../assets/brands/1.png`, import.meta.url).href, name: "Delhi University" },
  { logo: new URL(`../assets/brands/2.png`, import.meta.url).href, name: "Gurugram" },
  { logo: new URL(`../assets/brands/3.png`, import.meta.url).href, name: "Gautam Buddha University" },
  { logo: new URL(`../assets/brands/5.png`, import.meta.url).href, name: "HBTU" },
  { logo: new URL(`../assets/brands/6.png`, import.meta.url).href, name: "UPDI" },
  { logo: new URL(`../assets/brands/7.png`, import.meta.url).href, name: "GL Bajaj" },
  { logo: new URL(`../assets/brands/8.png`, import.meta.url).href, name: "FOAP" },
  { logo: new URL(`../assets/brands/9.png`, import.meta.url).href, name: "IIT Bombay" },
  { logo: new URL(`../assets/brands/10.png`, import.meta.url).href, name: "IIM" },
  { logo: new URL(`../assets/brands/11.png`, import.meta.url).href, name: "NIT Manipur" },
  { logo: new URL(`../assets/brands/12.png`, import.meta.url).href, name: "Amity University" },
  { logo: new URL(`../assets/brands/13.png`, import.meta.url).href, name: "NIET" },
  { logo: new URL(`../assets/brands/14.png`, import.meta.url).href, name: "ITS" },
];


const TrustBy = () => {
  return (
    <section className="bg-(--bg-main) py-14">
      <div className="max-w-8xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-(--text-primary)">
            Our Partners
          </h2>
          <div className="h-1 w-20 bg-(--color-brand) mx-auto mt-2 rounded-full" />
        </div>

        {/* Trusted brands marquee */}
        <div className="trusted-wrapper">
          <div className="trusted-row-single">

            {/* First strip */}
            <div className="trusted-strip">
              {BRANDS.map((brand, i) => (
                <BrandCard key={`brand-1-${i}`} logo={brand.logo} name={brand.name} />
              ))}
            </div>

            {/* Duplicate strip for seamless loop */}
            <div className="trusted-strip">
              {BRANDS.map((brand, i) => (
                <BrandCard key={`brand-2-${i}`} logo={brand.logo} name={brand.name} />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

const BrandCard = ({ logo, name }) => (
  <div className="brand-item">
    <div className="brand-card">
      <img src={logo} alt={name} className="brand-logo" />
    </div>
    <div className="brand-name-box">{name}</div>
  </div>
);

export default TrustBy;
