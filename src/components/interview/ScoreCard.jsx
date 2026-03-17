import { colors, fonts } from "../../styles/theme";

export default function ScoreCard({ metric, score, detail, icon }) {
  const getTheme = (s) => {
    if (s >= 85) return { bg: "#edf7f2", text: "#2d9a5f", bar: "linear-gradient(90deg, #2d9a5f, #48c78e)" };
    if (s >= 65) return { bg: "#fff5f0", text: "#f05e23", bar: "linear-gradient(90deg, #f05e23, #ff8c5a)" };
    return { bg: "#fff5f5", text: "#e53e3e", bar: "linear-gradient(90deg, #e53e3e, #fc8181)" };
  };

  const { bg, text, bar } = getTheme(score);

  return (
    <div style={{
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      padding: "20px 22px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
          <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 15 }}>{metric}</span>
        </div>
        <div style={{ background: bg, color: text, padding: "4px 12px", borderRadius: 99, fontSize: 13, fontWeight: 700 }}>
          {score}/100
        </div>
      </div>
      <div style={{ height: 6, background: colors.bg, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ height: "100%", width: `${score}%`, background: bar, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
      {detail && <p style={{ fontSize: 13, color: colors.muted, lineHeight: 1.55 }}>{detail}</p>}
    </div>
  );
}