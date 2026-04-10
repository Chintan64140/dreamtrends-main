import Link from "next/link";

const footerGroups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Best Sellers", href: "/products?sort=popular" },
      { label: "Gift Picks", href: "/products?tag=gifts" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "My Account", href: "/profile" },
      { label: "My Orders", href: "/profile" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" }
    ]
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Shipping Info", href: "/shipping-info" },
      { label: "Secure Checkout", href: "/secure-checkout" },
      { label: "Contact Us", href: "/contact-us" }
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
              A trend-led shopping destination for fashion, lifestyle, gifting, and everyday finds.
              Built for customers who want sharp discovery, trusted checkout, and smooth delivery.
            </p>
            <div className="footer-trust-row">
              <span>Secure payments</span>
              {/* <span>Easy returns</span> */}
              <span>Pan-India delivery</span>
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
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/contact-us">Support Hours: 10 AM - 7 PM</Link>
          </div>
        </section>
      </div>
    </footer>
  );
}
