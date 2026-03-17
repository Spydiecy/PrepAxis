import { colors, fonts } from "../../styles/theme";

export default function Footer() {
  return (
    <footer style={{
      background: colors.white,
      borderTop: `1px solid ${colors.border}`,
      padding: "48px",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 40,
        paddingBottom: 40,
        borderBottom: `1px solid ${colors.border}`,
        marginBottom: 32,
      }}>
        {/* Brand */}
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            fontSize: 18,
            fontWeight: 800,
            fontFamily: fonts.display,
            color: colors.dark,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.orange }} />
            PrepAI
          </div>
          <p style={{
            fontSize: 14,
            color: colors.muted,
            lineHeight: 1.6,
            fontFamily: fonts.body,
          }}>
            AI Interview Coach for smarter preparation, better resumes, and stronger confidence.
          </p>
        </div>

        {/* Links */}
        <div>
          <p style={{
            fontWeight: 700,
            color: colors.dark,
            marginBottom: 16,
            fontSize: 13,
            fontFamily: fonts.display,
          }}>
            PRODUCT
          </p>
          {["Features", "Pricing", "Security", "Roadmap"].map(item => (
            <a
              key={item}
              href="#"
              style={{
                display: "block",
                fontSize: 13,
                color: colors.muted,
                textDecoration: "none",
                marginBottom: 10,
                fontFamily: fonts.body,
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <p style={{
            fontWeight: 700,
            color: colors.dark,
            marginBottom: 16,
            fontSize: 13,
            fontFamily: fonts.display,
          }}>
            COMPANY
          </p>
          {["About", "Blog", "Careers", "Status"].map(item => (
            <a
              key={item}
              href="#"
              style={{
                display: "block",
                fontSize: 13,
                color: colors.muted,
                textDecoration: "none",
                marginBottom: 10,
                fontFamily: fonts.body,
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <p style={{
            fontWeight: 700,
            color: colors.dark,
            marginBottom: 16,
            fontSize: 13,
            fontFamily: fonts.display,
          }}>
            LEGAL
          </p>
          {["Privacy", "Terms", "Cookie Policy", "Contact"].map(item => (
            <a
              key={item}
              href="#"
              style={{
                display: "block",
                fontSize: 13,
                color: colors.muted,
                textDecoration: "none",
                marginBottom: 10,
                fontFamily: fonts.body,
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", color: colors.muted, fontSize: 12, fontFamily: fonts.body }}>
        <p>© 2026 PrepAI. All rights reserved.</p>
      </div>
    </footer>
  );
}