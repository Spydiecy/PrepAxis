import { colors, fonts } from "../../styles/theme";

export default function ResumeComparison({ diffs = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 12,
      }}>
        {[
          { label: "Original", icon: "📄", color: colors.muted, bg: "#f5f4f0" },
          { label: "AI Improved", icon: "✨", color: colors.green, bg: colors.greenLight },
        ].map(col => (
          <div key={col.label} style={{
            background: col.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span>{col.icon}</span>
            <span style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 14,
              color: col.color,
            }}>{col.label}</span>
          </div>
        ))}
      </div>

      {/* Diff rows */}
      {diffs.map((d, i) => (
        <DiffRow key={i} diff={d} index={i} />
      ))}
    </div>
  );
}

function DiffRow({ diff }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {/* Section label */}
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: colors.muted,
        marginBottom: 6,
        paddingLeft: 4,
      }}>
        {diff.section}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Original */}
        <div style={{
          background: "#fff8f8",
          border: `1px solid #fdd`,
          borderRadius: 10,
          padding: "14px 16px",
          fontSize: 14,
          lineHeight: 1.65,
          color: "#555",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 10, right: 12,
            fontSize: 10, fontWeight: 700, letterSpacing: 1,
            color: "#e53e3e", textTransform: "uppercase",
          }}>Before</div>
          <p style={{ paddingRight: 40 }}>{diff.original}</p>
        </div>

        {/* Improved */}
        <div style={{
          background: colors.greenLight,
          border: `1px solid #b2f0d6`,
          borderRadius: 10,
          padding: "14px 16px",
          fontSize: 14,
          lineHeight: 1.65,
          color: "#1a4a2e",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 10, right: 12,
            fontSize: 10, fontWeight: 700, letterSpacing: 1,
            color: colors.green, textTransform: "uppercase",
          }}>After</div>
          <p style={{ paddingRight: 40 }}>{diff.improved}</p>
        </div>
      </div>
    </div>
  );
}