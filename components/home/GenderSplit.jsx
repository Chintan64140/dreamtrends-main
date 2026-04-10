export default function GenderSplit() {
  return (
    <section className="gender-wrap">
      <a href="/products?gender=women" className="gender-card women">
        <div>
          <p className="gender-label">WOMEN'S</p>
          <p className="gender-label">WATCHES</p>
          <span className="gender-cta">EXPLORE NOW</span>
        </div>
      </a>

      <a href="/products?gender=men" className="gender-card men">
        <div>
          <p className="gender-label">MEN'S</p>
          <p className="gender-label">WATCHES</p>
          <span className="gender-cta">EXPLORE NOW</span>
        </div>
      </a>
    </section>
  );
}
