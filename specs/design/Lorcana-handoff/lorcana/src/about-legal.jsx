// Inkfolk — About + Legal pages
// Editorial pages built on the same paper system. About tells the story of
// the project; Legal collects disclaimers, IP statements, and terms.

// ─── About — Desktop ────────────────────────────────────────
function AboutDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="about"/>

      {/* Masthead */}
      <header style={{ padding: '64px 32px 36px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <span style={{ width: 28, height: 2, background: 'var(--accent)' }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--accent)' }}>About</span>
          </div>
          <h1 className="serif" style={{
            fontSize: 64, fontWeight: 400, letterSpacing: '-.03em',
            margin: '0 0 18px', lineHeight: .98, textWrap: 'balance', maxWidth: 800,
          }}>
            A fan-made database for Lorcana — built by players, for players.
          </h1>
          <p style={{ fontSize: 21, lineHeight: 1.45, color: 'var(--ink-2)', margin: 0,
                       fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            Based in Canada. Open to contributions. Built around the cards, the news,
            and a place to draft with your friends.
          </p>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '24px 32px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.015em',
                                            margin: '0 0 12px' }}>
              How we started
            </h2>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.7,
                         color: 'var(--ink-2)', margin: 0 }}>
              Inkfolk started as a shared spreadsheet between four friends in Lyon trying to
              keep track of which Floodborn we'd actually pulled. It got out of hand. By the
              third set we had a search interface, a draft simulator, and a small group of
              illustrators contributing icons.
            </p>
          </div>
          <div>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.015em',
                                            margin: '0 0 12px' }}>
              What we make
            </h2>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.7,
                         color: 'var(--ink-2)', margin: 0 }}>
              The card encyclopedia is the heart of the site. Around it we wrap a bilingual
              news journal (EN&nbsp;·&nbsp;FR), a draft room for up to eight remote players,
              and quiet tooling for deckbuilders. Everything is free and forever will be.
            </p>
          </div>
        </div>

        {/* Principles strip */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                        textTransform: 'uppercase', color: 'var(--ink-3)', margin: '0 0 18px' }}>
            What we stand by
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              { n: '01', t: 'Player-first', b: 'Every feature starts from a real player asking for it on Discord. We ship for the community we play with, not for engagement metrics.' },
              { n: '02', t: 'Minimal data', b: 'We log nothing personal beyond short-lived request logs. No third-party trackers. Draft rooms are peer-to-peer.' },
              { n: '03', t: 'Open contributions', b: 'Card data corrections, translations, news pitches — anyone can submit. Editors review before publish.' },
            ].map(p => (
              <div key={p.n} style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 14, padding: '20px 22px',
              }}>
                <div className="mono" style={{ fontSize: 12, color: 'var(--accent)',
                                                  fontWeight: 700, marginBottom: 10 }}>
                  {p.n}
                </div>
                <h3 className="serif" style={{ fontSize: 19, fontWeight: 600,
                                                letterSpacing: '-.01em', margin: '0 0 6px' }}>
                  {p.t}
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
                  {p.b}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        {/* Removed for now — will reintroduce when we have a public-facing team page. */}

        {/* Where we are */}
        <section style={{ marginBottom: 56 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center',
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 14, padding: '24px 28px',
          }}>
            <div style={{ position: 'relative', width: 72, height: 72,
                           display: 'grid', placeItems: 'center',
                           background: 'var(--ink-ruby-soft)', borderRadius: 999,
                           border: '1px solid color-mix(in oklab, var(--ink-ruby) 25%, var(--line))' }}>
              <svg viewBox="-2015 -2000 4030 4030" width="50" height="50" aria-hidden="true">
                <path fill="var(--ink-ruby)" d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                             textTransform: 'uppercase', color: 'var(--ink-ruby)', marginBottom: 6 }}>
                Where we are
              </div>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.01em',
                                              margin: '0 0 4px' }}>
                Based in Canada
              </h3>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5, maxWidth: 540 }}>
                Maintainers in Montréal and Vancouver, with contributors across EN&nbsp;·&nbsp;FR
                Lorcana communities worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Contact card */}
        <section style={{
          background: `
            radial-gradient(70% 100% at 100% 0%, var(--ink-amber-soft) 0%, transparent 60%),
            radial-gradient(60% 100% at 0% 100%, var(--ink-amethyst-soft) 0%, transparent 60%),
            var(--surface)
          `,
          border: '1px solid var(--line)', borderRadius: 16, padding: '32px 36px',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                           textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
              Reach us
            </div>
            <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: '0 0 6px', lineHeight: 1.1 }}>
              Got a card correction or a story idea?
            </h3>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5, maxWidth: 480 }}>
              We answer everything within a few days. Press &amp; partnership requests
              should mention Inkfolk in the subject line.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="mailto:hello@inkfolk.cards" className="if-btn if-btn--primary"
               style={{ justifyContent: 'center', padding: '12px 22px', textDecoration: 'none' }}>
              hello@inkfolk.cards
            </a>
            <a href="#" className="if-btn" style={{ justifyContent: 'center', padding: '10px 22px', textDecoration: 'none' }}>
              Join the Discord
            </a>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
}

// ─── About — Mobile ─────────────────────────────────────────
function AboutMobile() {
  return (
    <MobileFrame>
      <TopNavMobile title="About"/>
      <div className="if-scroll" style={{ height: 'calc(100% - 52px - 44px)', overflow: 'auto', paddingBottom: 80 }}>
        <header style={{ padding: '20px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 20, height: 2, background: 'var(--accent)' }}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--accent)' }}>About</span>
          </div>
          <h1 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: '0 0 10px', lineHeight: 1.05 }}>
            A fan-made database for Lorcana.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)', margin: 0,
                       fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            Based in Canada. Open to contributions. Built around the cards, news, and a
            place to draft.
          </p>
        </header>

        <section style={{ padding: '8px 18px 24px',
                           fontFamily: 'var(--font-display)', fontSize: 15, lineHeight: 1.65,
                           color: 'var(--ink-2)' }}>
          <p style={{ margin: '0 0 14px' }}>
            Inkfolk started as a shared spreadsheet between four friends in Lyon trying to track
            which Floodborn we'd pulled. By the third set it was a search engine, a draft
            simulator, and a small group of illustrators contributing icons.
          </p>
          <p style={{ margin: 0 }}>
            Today the card encyclopedia is the heart of the site. We wrap a bilingual news
            journal (EN&nbsp;·&nbsp;FR) around it, plus a draft room for up to eight remote
            players. Everything free, forever.
          </p>
        </section>

        <section style={{ padding: '0 18px 24px' }}>
          <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em',
                        textTransform: 'uppercase', color: 'var(--ink-3)', margin: '0 0 10px' }}>
            What we stand by
          </h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { n: '01', t: 'Player-first', b: 'Every feature starts from a real player ask on Discord.' },
              { n: '02', t: 'Minimal data', b: 'No analytics, no third-party trackers.' },
              { n: '03', t: 'Open contributions', b: 'Corrections, translations, pitches — anyone.' },
            ].map(p => (
              <div key={p.n} style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                    {p.n}
                  </span>
                  <h3 className="serif" style={{ fontSize: 14.5, fontWeight: 600, margin: 0 }}>{p.t}</h3>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--ink-3)', margin: '4px 0 0 26px', lineHeight: 1.45 }}>
                  {p.b}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '0 18px 32px' }}>
          {/* Team removed for now */}
          <div style={{
            display: 'flex', gap: 14, alignItems: 'center',
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center',
                           background: 'var(--ink-ruby-soft)', borderRadius: 999, flexShrink: 0,
                           border: '1px solid color-mix(in oklab, var(--ink-ruby) 25%, var(--line))' }}>
              <svg viewBox="-2015 -2000 4030 4030" width="34" height="34" aria-hidden="true">
                <path fill="var(--ink-ruby)" d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                             textTransform: 'uppercase', color: 'var(--ink-ruby)', marginBottom: 2 }}>
                Where we are
              </div>
              <div className="serif" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.005em' }}>
                Based in Canada
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>
                Montréal &amp; Vancouver. Contributors worldwide.
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 18px 28px' }}>
          <a href="mailto:hello@inkfolk.cards" className="if-btn if-btn--primary"
             style={{ width: '100%', justifyContent: 'center', padding: '12px',
                       textDecoration: 'none', fontSize: 13 }}>
            hello@inkfolk.cards
          </a>
          <a href="#" className="if-btn"
             style={{ width: '100%', justifyContent: 'center', padding: '12px',
                       textDecoration: 'none', fontSize: 13, marginTop: 8 }}>
            Join the Discord
          </a>
        </section>
      </div>
      <MobileTabBar active="more"/>
    </MobileFrame>
  );
}

// ─── Legal — Desktop ────────────────────────────────────────
const LEGAL_TOC = [
  { id: 'ip',       label: 'Intellectual property' },
  { id: 'terms',    label: 'Terms of use' },
  { id: 'privacy',  label: 'Privacy & data' },
  { id: 'content',  label: 'User-submitted content' },
  { id: 'contact',  label: 'Reporting & contact' },
];

function LegalSection({ id, title, num, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: 80, marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14,
                     paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700,
                                          letterSpacing: '.08em' }}>{num}</span>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.015em', margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.7,
                     color: 'var(--ink-2)' }}>
        {children}
      </div>
    </section>
  );
}

function LegalDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="about"/>

      <header style={{ padding: '56px 32px 32px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 28, height: 2, background: 'var(--accent)' }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--accent)' }}>Legal</span>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '.06em' }}>
              · Last updated 8 May 2026
            </span>
          </div>
          <h1 className="serif" style={{
            fontSize: 56, fontWeight: 400, letterSpacing: '-.03em',
            margin: '0 0 14px', lineHeight: 1, maxWidth: 800,
          }}>
            Legal, in plain language.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--ink-2)', margin: 0, maxWidth: 720,
                       fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            Inkfolk is an unofficial, non-commercial fan project. Disney&apos;s and Ravensburger&apos;s
            trademarks and copyrights belong to them. Here&apos;s the rest in detail.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 64px',
                      display: 'grid', gridTemplateColumns: '220px 1fr', gap: 64, alignItems: 'start' }}>
        {/* TOC */}
        <aside style={{ position: 'sticky', top: 84 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                         textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
            On this page
          </div>
          <nav style={{ display: 'grid', gap: 4 }}>
            {LEGAL_TOC.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} style={{
                display: 'flex', gap: 10, alignItems: 'baseline',
                padding: '6px 10px', borderRadius: 6,
                fontSize: 13, color: i === 0 ? 'var(--ink)' : 'var(--ink-2)',
                textDecoration: 'none',
                background: i === 0 ? 'var(--paper-2)' : 'transparent',
                fontWeight: i === 0 ? 600 : 500,
              }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  0{i + 1}
                </span>
                {s.label}
              </a>
            ))}
          </nav>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--line)',
                         fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
            Need a takedown or a clarification?<br/>
            <a href="mailto:legal@inkfolk.cards" style={{ color: 'var(--accent)',
                                                           textDecoration: 'none', fontWeight: 600 }}>
              legal@inkfolk.cards
            </a>
          </div>
        </aside>

        <div>
          {/* Standout disclaimer */}
          <div style={{
            background: 'var(--ink-amber-soft)',
            border: '1px solid color-mix(in oklab, var(--ink-amber) 35%, var(--line))',
            borderRadius: 12, padding: '18px 22px', marginBottom: 40,
            display: 'flex', gap: 14,
          }}>
            <span style={{ fontSize: 18, color: 'var(--ink-amber)', lineHeight: 1, marginTop: 2 }}>⚠</span>
            <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--ink)' }}>Inkfolk is not affiliated with Disney or
              Ravensburger.</strong> Disney Lorcana, its card imagery, character names, and
              related marks are the property of their respective owners and are used here under
              fair-use exceptions for criticism, commentary, and reporting on the game.
            </div>
          </div>

          <LegalSection id="ip" num="01" title="Intellectual property">
            <p>Disney Lorcana, the Lorcana logo, all card names, character likenesses, art, and
            related trademarks are owned by The Walt Disney Company and Ravensburger AG. Inkfolk
            displays card images under Ravensburger&apos;s published Community Code policy and
            applicable fair-use provisions.</p>
            <p>Original content on Inkfolk — written articles, commentary, the database
            schema, the site design, our iconography, and our software — is © 2024–2026 the
            Inkfolk contributors, licensed CC BY-NC-SA 4.0 unless otherwise marked.</p>
          </LegalSection>

          <LegalSection id="terms" num="02" title="Terms of use">
            <p>By using Inkfolk you agree to use the site as published, without attempting to
            circumvent rate limits, scrape bulk card data outside the public JSON endpoints,
            or interfere with other users&apos; draft rooms.</p>
            <p>The service is provided on an &quot;as is&quot; basis. We make no warranty that pull
            rates, pricing estimates, or rules summaries are correct. For competitive
            decisions, consult the official Ravensburger comprehensive rules.</p>
          </LegalSection>

          <LegalSection id="privacy" num="03" title="Privacy & data">
            <p>We collect the minimum possible. No analytics scripts, no third-party trackers,
            no advertising cookies. The only items we store about you are: a session token if
            you opt to save a collection (kept in your browser&apos;s localStorage, never sent to
            our servers without your action), and server logs of HTTP requests for 14 days
            for abuse-prevention.</p>
            <p>Draft rooms run over WebRTC peer-to-peer; the signalling server only sees a
            short-lived room code, never card picks or chat content.</p>
          </LegalSection>

          <LegalSection id="content" num="04" title="User-submitted content">
            <p>Card corrections, deck lists, news pitches, and translations submitted to
            Inkfolk are reviewed by editors before publication. You retain copyright on what
            you submit; by submitting you grant us a non-exclusive licence to publish, edit
            for clarity, and translate.</p>
            <p>We reserve the right to refuse content that is defamatory, infringes third-party
            rights, or violates Ravensburger&apos;s community guidelines.</p>
          </LegalSection>

          <LegalSection id="contact" num="05" title="Reporting & contact">
            <p>If you are a rights-holder and believe content on Inkfolk infringes your IP,
            send a notice to <strong>legal@inkfolk.cards</strong> including: the URL of the
            content, a description of the infringed work, and your contact details. We respond
            within five business days and act in good faith on every notice.</p>
            <p>General questions: <strong>hello@inkfolk.cards</strong> · Press:
            <strong> press@inkfolk.cards</strong></p>
          </LegalSection>
        </div>
      </main>

      <Footer compact/>
    </div>
  );
}

// ─── Legal — Mobile ─────────────────────────────────────────
function LegalMobile() {
  return (
    <MobileFrame>
      <TopNavMobile back title="Legal"/>
      <div className="if-scroll" style={{ height: 'calc(100% - 52px - 44px)', overflow: 'auto', paddingBottom: 80 }}>
        <header style={{ padding: '20px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 20, height: 2, background: 'var(--accent)' }}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--accent)' }}>Legal</span>
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>· Updated 8 May 2026</span>
          </div>
          <h1 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: '0 0 8px', lineHeight: 1.05 }}>
            Legal, in plain language.
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5,
                       fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            Inkfolk is unofficial and non-commercial. Disney&apos;s and Ravensburger&apos;s marks
            belong to them.
          </p>
        </header>

        {/* Disclaimer */}
        <div style={{ margin: '0 18px 20px',
                       background: 'var(--ink-amber-soft)',
                       border: '1px solid color-mix(in oklab, var(--ink-amber) 35%, var(--line))',
                       borderRadius: 10, padding: '12px 14px',
                       display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--ink-amber)', lineHeight: 1, marginTop: 2 }}>⚠</span>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--ink)' }}>Not affiliated with Disney or Ravensburger.</strong>{' '}
            Card imagery used under their Community Code policy and fair use.
          </div>
        </div>

        {/* Sections — collapsible feel via styled blocks */}
        <div style={{ padding: '0 18px 24px', display: 'grid', gap: 14 }}>
          {[
            { num: '01', title: 'Intellectual property',
              body: 'Disney Lorcana marks belong to Disney and Ravensburger. Original Inkfolk content is © 2024–2026 contributors, CC BY-NC-SA 4.0 unless marked otherwise.' },
            { num: '02', title: 'Terms of use',
              body: 'Service provided as-is. No warranty on pull rates, prices, or rules summaries. Consult Ravensburger comprehensive rules for competitive play.' },
            { num: '03', title: 'Privacy & data',
              body: 'No analytics, no third-party trackers. localStorage stays in your browser. Draft rooms are peer-to-peer; signalling never sees picks.' },
            { num: '04', title: 'User-submitted content',
              body: 'You keep copyright on submissions. Editors review before publish; we may decline content that infringes third-party rights.' },
            { num: '05', title: 'Reporting & contact',
              body: 'Takedown notices: legal@inkfolk.cards. General: hello@inkfolk.cards. We respond within five business days.' },
          ].map(s => (
            <article key={s.num} style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--accent)',
                                                  fontWeight: 700 }}>{s.num}</span>
                <h2 className="serif" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-.005em',
                                                margin: 0 }}>{s.title}</h2>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55,
                          margin: '0 0 0 22px', fontFamily: 'var(--font-display)' }}>
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </div>
      <MobileTabBar active="more"/>
    </MobileFrame>
  );
}

Object.assign(window, { AboutDesktop, AboutMobile, LegalDesktop, LegalMobile });
