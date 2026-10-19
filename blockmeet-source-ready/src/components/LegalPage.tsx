import Navbar from "@/components/Navbar";

export type LegalSection = { heading: string; paragraphs?: string[]; items?: string[] };

export default function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  const text = { color: "#444", lineHeight: 1.75, fontSize: 15, margin: "0 0 14px" } as const;
  return (
    <main>
      <Navbar />
      <section className="pageHero">
        <span className="kicker">LEGAL</span>
        <h1>{title}</h1>
        <p>Last updated: {updated}</p>
      </section>
      <section className="accountPage" style={{ paddingTop: 50 }}>
        <p style={{ ...text, fontSize: 17 }}>{intro}</p>
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="accountH">{s.heading}</h2>
            {s.paragraphs?.map((p) => <p key={p} style={text}>{p}</p>)}
            {s.items && (
              <ul style={{ ...text, paddingLeft: 22 }}>
                {s.items.map((i) => <li key={i} style={{ marginBottom: 6 }}>{i}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
