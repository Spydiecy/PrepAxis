import { colors, fonts } from "../../styles/theme";

export default function Navbar() {
  const handleNavClick = (path) => {
    // Try to scroll to element on current page
    const element = document.getElementById(path);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // If element doesn't exist, navigate to home with the section
      window.location.href = `/?section=${path}`;
    }
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

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
      <button onClick={handleLogoClick} style={{
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 20,
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        border: "none",
        background: "transparent",
        color: colors.dark,
        padding: 0,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.orange }} />
        PrepAI
      </button>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={() => handleNavClick("features")} style={{
          padding: "6px 16px",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          color: colors.muted,
          transition: "all 0.15s",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          fontFamily: fonts.body,
        }}>
          Features
        </button>
        <button onClick={() => handleNavClick("how-it-works")} style={{
          padding: "6px 16px",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          color: colors.muted,
          transition: "all 0.15s",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          fontFamily: fonts.body,
        }}>
          How it Works
        </button>
        <button onClick={() => handleNavClick("cta")} style={{
          padding: "6px 16px",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          color: colors.muted,
          transition: "all 0.15s",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          fontFamily: fonts.body,
        }}>
          Get Started
        </button>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => window.location.href = "/login"} style={{
          padding: "8px 16px",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          color: colors.muted,
          transition: "all 0.15s",
          cursor: "pointer",
          background: "transparent",
          border: "none",
          fontFamily: fonts.body,
        }}>
          Login
        </button>
        <button onClick={() => window.location.href = "/register"} style={{
          background: colors.orange,
          color: colors.white,
          border: "none",
          padding: "9px 22px",
          borderRadius: 7,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: fonts.display,
          transition: "all 0.15s",
          textDecoration: "none",
          display: "inline-block",
        }}>
          Sign Up
        </button>
      </div>
    </nav>
  );
}