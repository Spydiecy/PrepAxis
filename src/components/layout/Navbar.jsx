import { colors, fonts } from "../../styles/theme";

export default function Navbar({ activePage = "interview" }) {
  const links = [
    { label: "Interview", page: "interview" },
    { label: "Voice", page: "voice" },
    { label: "Resume", page: "resume" },
    { label: "Report", page: "report" },
  ];

  return (
    <nav style={{
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      padding: "0 48px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 0 #e0dfd8",
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 20,
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.orange }} />
        PrepAI
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(l => (
          <a key={l.page} href={`#${l.page}`} style={{
            padding: "6px 16px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            background: activePage === l.page ? colors.orangeLight : "transparent",
            color: activePage === l.page ? colors.orange : colors.muted,
            transition: "all 0.15s",
          }}>
            {l.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button style={{
        background: colors.dark,
        color: colors.white,
        border: "none",
        padding: "9px 22px",
        borderRadius: 7,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: fonts.display,
      }}>
        Upgrade Pro
      </button>
    </nav>
  );
}