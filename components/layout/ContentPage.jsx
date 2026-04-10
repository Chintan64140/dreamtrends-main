import Navbar from "@/components/layout/Navbar";

export default function ContentPage({ eyebrow, title, intro, sections = [] }) {
  return (
    <>
      <Navbar />
      <main className="page-shell content-page-shell">
        <section className="content-hero">
          {eyebrow ? <p className="content-eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {intro ? <p>{intro}</p> : null}
        </section>

        <div className="content-grid">
          {sections.map((section) => (
            <section className="content-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.body ? <p>{section.body}</p> : null}
              {section.items?.length ? (
                <ul className="content-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
