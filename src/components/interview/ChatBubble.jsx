import { colors, fonts } from "../../styles/theme";

export default function ChatBubble({ role = "ai", text = "", timestamp, isTyping = false }) {
  const isAI = role === "ai";

  return (
    <div style={{
      display: "flex",
      flexDirection: isAI ? "row" : "row-reverse",
      alignItems: "flex-end",
      gap: 10,
      marginBottom: 18,
      animation: "fadeUp 0.3s ease both",
    }}>
      {/* Avatar */}
      <div style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: isAI ? colors.dark : colors.orange,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: 700,
        color: "#fff",
        boxShadow: isAI ? "0 2px 8px rgba(0,0,0,0.15)" : `0 2px 8px ${colors.orange}44`,
      }}>
        {isAI ? "🤖" : "👤"}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isAI ? "flex-start" : "flex-end" }}>
        <div style={{
          background: isAI ? colors.white : colors.dark,
          color: isAI ? colors.ink : "#fff",
          padding: "12px 18px",
          borderRadius: isAI ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          fontSize: 14,
          lineHeight: 1.65,
          boxShadow: isAI ? "0 2px 12px rgba(0,0,0,0.06)" : "0 2px 12px rgba(17,17,17,0.2)",
          border: isAI ? `1px solid ${colors.border}` : "none",
        }}>
          {isTyping ? <TypingDots /> : text}
        </div>

        {timestamp && (
          <span style={{ fontSize: 11, color: colors.muted, marginTop: 4, padding: "0 4px" }}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "2px 4px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: colors.muted,
          animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}