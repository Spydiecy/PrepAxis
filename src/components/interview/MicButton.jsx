import { useState } from "react";
import { colors } from "../../styles/theme";

export default function MicButton({ isRecording = false, onToggle, size = "lg" }) {
  const [hovered, setHovered] = useState(false);

  const dimensions = { sm: 48, md: 64, lg: 88 };
  const iconSize =   { sm: 18, md: 24, lg: 32 };
  const dim = dimensions[size];
  const icon = iconSize[size];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: dim, height: dim }}>
        {isRecording && (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                position: "absolute",
                inset: -(i * 14),
                borderRadius: "50%",
                border: `1.5px solid ${colors.orange}`,
                opacity: 1 / (i + 0.5),
                animation: `pulse ${0.9 + i * 0.3}s ease-in-out ${i * 0.15}s infinite`,
                pointerEvents: "none",
              }} />
            ))}
          </>
        )}

        <button
          onClick={onToggle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: dim,
            height: dim,
            borderRadius: "50%",
            border: "none",
            background: isRecording
              ? colors.orange
              : hovered ? colors.dark : "#f0efe9",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: icon,
            transition: "all 0.2s",
            boxShadow: isRecording
              ? `0 0 0 4px ${colors.orange}30, 0 8px 24px ${colors.orange}40`
              : hovered
              ? "0 8px 24px rgba(0,0,0,0.15)"
              : "0 4px 12px rgba(0,0,0,0.08)",
            transform: hovered && !isRecording ? "scale(1.05)" : "scale(1)",
            position: "relative",
            zIndex: 2,
          }}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? "⏹" : "🎙"}
        </button>
      </div>

      <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: isRecording ? colors.orange : colors.muted,
        letterSpacing: isRecording ? "1.5px" : "0.5px",
        textTransform: "uppercase",
        transition: "all 0.2s",
      }}>
        {isRecording ? "● Recording..." : "Tap to Speak"}
      </span>
    </div>
  );
}