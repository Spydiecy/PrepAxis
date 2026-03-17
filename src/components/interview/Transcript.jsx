import { useEffect, useRef } from "react";
import { colors, fonts } from "../../styles/theme";

export default function Transcript({ entries = [], isLive = false }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
    <div style={{
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: 14,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#faf9f7",
      }}>
        <span style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 14,
          color: colors.ink,
        }}>
          Transcript
        </span>
        {isLive && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: colors.orange,
              animation: "blink 1s infinite",
            }} />
            <span style={{ fontSize: 11, color: colors.orange, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Live
            </span>
          </div>
        )}
      </div>

      {/* Scrollable entries */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        scrollbarWidth: "thin",
        scrollbarColor: `${colors.border} transparent`,
      }}>
        {entries.length === 0 ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
            color: colors.muted, fontSize: 13, textAlign: "center",
            padding: "40px 0",
          }}>
            <span style={{ fontSize: 28 }}>📝</span>
            <span>Transcript will appear here</span>
          </div>
        ) : (
          entries.map((entry, i) => (
            <TranscriptEntry key={i} entry={entry} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      {entries.length > 0 && (
        <div style={{
          padding: "10px 20px",
          borderTop: `1px solid ${colors.border}`,
          fontSize: 11,
          color: colors.muted,
          background: "#faf9f7",
        }}>
          {entries.length} turns · {entries.reduce((a, e) => a + e.text.split(" ").length, 0)} words
        </div>
      )}
    </div>
  );
}

function TranscriptEntry({ entry }) {
  const isAI = entry.role === "ai";
  return (
    <div style={{ display: "flex", gap: 10, animation: "fadeUp 0.3s ease both" }}>
      <div style={{
        width: 6, borderRadius: 3, flexShrink: 0, marginTop: 3,
        background: isAI ? colors.dark : colors.orange,
        alignSelf: "stretch",
        minHeight: 16,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
            textTransform: "uppercase",
            color: isAI ? colors.dark : colors.orange,
          }}>
            {isAI ? "AI" : "You"}
          </span>
          {entry.ts && (
            <span style={{ fontSize: 11, color: colors.muted }}>{entry.ts}</span>
          )}
        </div>
        <p style={{ fontSize: 14, color: colors.ink, lineHeight: 1.6 }}>{entry.text}</p>
      </div>
    </div>
  );
}