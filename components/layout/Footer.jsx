import Link from "next/link";

const footerGroups = [
  {
    title: "Quick links",
    links: [
      { label: "Home", href: "/" },
      { label: "Watch Collection", href: "/products" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Track Order", href: "/profile" }
    ]
  },
  {
    title: "Policy",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Shipping Info", href: "/shipping-info" },
      { label: "Secure Checkout", href: "/secure-checkout" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "My Account", href: "/profile" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-shell">
        <section className="footer-main">
          <div className="footer-brand-block">
            <Link href="/" className="footer-brand">
              DREAMTRENDS
            </Link>
            <p>
              A fast, high-polish storefront for fashion-led watch discovery, built to feel premium without changing the way your current store works.
            </p>
            <div className="footer-trust-row">
              <span>Free shipping</span>
              <span>Easy returns</span>
              <span>Pan-India delivery</span>
              <span>COD available</span>
            </div>
          </div>

          <div className="footer-links-grid">
            {footerGroups.map((group) => (
              <div key={group.title} className="footer-link-group">
                <h3>{group.title}</h3>
                <div>
                  {group.links.map((link) => (
                    <Link key={link.label} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                  
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="footer-bottom">
          <p>(c) 2026 dreamtrends. All rights reserved.</p>
          <div>
            <span>Email: support@dreamtrends.store</span>
            <Link href="/contact-us">Support Hours: 10 AM - 7 PM</Link>
          </div>
        </section>
      </div>
    </footer>
  );
}
