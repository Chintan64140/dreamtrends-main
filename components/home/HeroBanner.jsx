"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    id: "curated-drop",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Limited edition showcase",
    title: "Modern wristwear made to look gift-ready at first glance.",
    copy: "Built with bold dials, polished cases, and a glossy storefront feel inspired by high-conversion watch drops.",
    cta: "Shop Collection"
  },
  {
    id: "arrival-story",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "New season arrival",
    title: "Statement pieces, soft gradients, and sharp metallic shine.",
    copy: "The home experience now opens with a fast-moving campaign section that mirrors the energy of premium catalogue landing pages.",
    cta: "View Arrivals"
  },
  {
    id: "signature-edit",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "Signature edit",
    title: "A catalog-first homepage with motion, overlays, and merchandising blocks.",
    copy: "Same store logic underneath, but presented through a more cinematic and editorial storefront shell.",
    cta: "Browse Products"
  }
];

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="hero-shell">
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          <span>Extra polish on every scroll</span>
          <span>Premium-inspired storefront motion</span>
          <span>Fast visual merchandising</span>
          <span>Same routes. Same shopping flow.</span>
        </div>
      </div>

      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10, 10, 10, 0.76), rgba(10, 10, 10, 0.3) 46%, rgba(10, 10, 10, 0.08)), url("${activeSlide.image}")`
        }}
      >
        <div className="hero-overlay">
          <p className="hero-eyebrow">{activeSlide.eyebrow}</p>
          <h1 className="hero-title">{activeSlide.title}</h1>
          <p className="hero-copy">{activeSlide.copy}</p>
          <div className="hero-actions">
            <Link href="/products" className="hero-cta">
              {activeSlide.cta}
            </Link>
            <Link href="/wishlist" className="hero-secondary-cta">
              Save Your Picks
            </Link>
          </div>
        </div>

        <div className="hero-indicators" aria-label="Hero slides">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-indicator ${index === activeIndex ? "active" : ""}`}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
