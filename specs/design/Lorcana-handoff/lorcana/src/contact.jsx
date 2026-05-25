// Inkfolk — Contact page
// Just the form. Editorial paper, on-brand chrome.

// ─── Atoms ────────────────────────────────────────────────
function ContactField({ label, hint, required, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline',
                     justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
                        textTransform: 'uppercase', color: 'var(--ink-2)' }}>
          {label}
          {required && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>·</span>}
        </span>
        {hint && (
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function inputStyles(extra = {}) {
  return {
    width: '100%', padding: '12px 14px', fontSize: 14.5,
    border: '1px solid var(--line-strong)', borderRadius: 10,
    background: 'var(--surface)', color: 'var(--ink)', outline: 0,
    fontFamily: 'var(--font-ui)', lineHeight: 1.4,
    ...extra,
  };
}

// ─── Contact — DESKTOP ────────────────────────────────────
function ContactDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="about"/>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px 56px' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ width: 28, height: 2, background: 'var(--accent)' }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--accent)' }}>
              Contact
            </span>
          </div>
          <h1 className="serif" style={{
            fontSize: 56, fontWeight: 500, letterSpacing: '-.03em',
            margin: '0 0 14px', lineHeight: 1, textWrap: 'balance',
          }}>
            Get in touch.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
            We read every message — expect a reply in 1–3 days.
          </p>
        </div>

        {/* Form */}
        <form>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ContactField label="Your name" required>
              <input style={inputStyles()} placeholder="Cleo Marquand"/>
            </ContactField>
            <ContactField label="Email" required>
              <input type="email" style={inputStyles()} placeholder="cleo@example.com"/>
            </ContactField>
          </div>

          <ContactField label="What's this about?" required>
            <div style={{ position: 'relative' }}>
              <select style={inputStyles({ appearance: 'none', WebkitAppearance: 'none',
                                             paddingRight: 40, cursor: 'pointer' })}>
                <option>Pick a topic…</option>
                <option>Card data correction</option>
                <option>Bug report</option>
                <option>Feature suggestion</option>
                <option>Press / partnership</option>
                <option>Legal / takedown</option>
                <option>Something else</option>
              </select>
              <Chevron dir="down" size={12} style={{ position: 'absolute', right: 14, top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--ink-3)', pointerEvents: 'none' }}/>
            </div>
          </ContactField>

          <ContactField label="Your message" required>
            <textarea
              rows={8}
              style={inputStyles({ resize: 'vertical', minHeight: 160 })}
              defaultValue=""
              placeholder="The more specific, the faster we can help. If it's a card bug, please include the set code and card name."
            />
          </ContactField>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
            <button type="submit" className="if-btn if-btn--accent"
                     style={{ fontSize: 14, padding: '12px 22px' }}>
              Send message →
            </button>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', flex: 1 }}>
              Stored only to reply. No analytics, no newsletter.
            </span>
          </div>
        </form>
      </main>

      <Footer compact/>
    </div>
  );
}

// ─── Contact — MOBILE ─────────────────────────────────────
function ContactMobile() {
  return (
    <MobileFrame>
      <TopNavMobile back title="Contact"/>
      <div className="if-scroll" style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
        overflow: 'auto', paddingBottom: 90,
      }}>
        {/* Header */}
        <header style={{ padding: '18px 18px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                          fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em',
                          textTransform: 'uppercase', color: 'var(--accent)' }}>
            <span style={{ width: 18, height: 2, background: 'var(--accent)' }}/>
            Contact
          </div>
          <h1 className="serif" style={{
            fontSize: 32, fontWeight: 500, letterSpacing: '-.02em',
            margin: '0 0 8px', lineHeight: 1, textWrap: 'balance',
          }}>
            Get in touch.
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.45 }}>
            We read every message — expect a reply in 1–3 days.
          </p>
        </header>

        {/* Form */}
        <section style={{ padding: '22px 18px 8px' }}>
          <ContactField label="Name" required>
            <input style={inputStyles({ fontSize: 14, padding: '10px 12px' })} placeholder="Cleo Marquand"/>
          </ContactField>
          <ContactField label="Email" required>
            <input type="email" style={inputStyles({ fontSize: 14, padding: '10px 12px' })}
                    placeholder="cleo@example.com"/>
          </ContactField>
          <ContactField label="Topic" required>
            <div style={{ position: 'relative' }}>
              <select style={inputStyles({ fontSize: 14, padding: '10px 36px 10px 12px',
                                             appearance: 'none', WebkitAppearance: 'none',
                                             cursor: 'pointer' })}>
                <option>Pick a topic…</option>
                <option>Card data correction</option>
                <option>Bug report</option>
                <option>Feature suggestion</option>
                <option>Press / partnership</option>
                <option>Legal / takedown</option>
                <option>Something else</option>
              </select>
              <Chevron dir="down" size={12} style={{ position: 'absolute', right: 12, top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'var(--ink-3)', pointerEvents: 'none' }}/>
            </div>
          </ContactField>
          <ContactField label="Message" required>
            <textarea
              rows={6}
              style={inputStyles({ fontSize: 14, padding: '10px 12px', resize: 'vertical',
                                     minHeight: 140 })}
              placeholder="The more specific, the faster we can help."
            />
          </ContactField>
          <button className="if-btn if-btn--accent" style={{
            width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: 14,
          }}>
            Send message →
          </button>
          <p style={{ fontSize: 11.5, color: 'var(--ink-3)', margin: '12px 0 0', lineHeight: 1.5,
                       textAlign: 'center' }}>
            Stored only to reply. No analytics, no newsletter.
          </p>
        </section>
      </div>
      <MobileTabBar active="about"/>
    </MobileFrame>
  );
}

Object.assign(window, {
  ContactDesktop, ContactMobile,
});
