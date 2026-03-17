export const colors = {
  bg: "#f5f4f0",
  white: "#ffffff",
  dark: "#111111",
  ink: "#1a1a2e",
  muted: "#888888",
  border: "#e0dfd8",
  green: "#2d9a5f",
  greenLight: "#edf7f2",
  orange: "#f05e23",
  orangeLight: "#fff5f0",
  orangeMid: "#ffe4cc",
  red: "#e53e3e",
  redLight: "#fff5f5",
  yellow: "#d69e2e",
  yellowLight: "#fffff0",
};

export const fonts = {
  display: "'Syne', sans-serif",
  body: "'Instrument Sans', sans-serif",
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const shadow = {
  sm: "0 2px 8px rgba(0,0,0,0.06)",
  md: "0 8px 32px rgba(0,0,0,0.08)",
  lg: "0 20px 60px rgba(0,0,0,0.12)",
};

export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');";

export const globalCss = `
${FONT_IMPORT}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #f5f4f0; font-family: 'Instrument Sans', sans-serif; color: #1a1a2e; }
@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes spin   { to { transform:rotate(360deg); } }
@keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
@keyframes wave   { 0%,100%{height:6px} 50%{height:28px} }
.fade-up  { animation: fadeUp  0.45s ease both; }
.fade-in  { animation: fadeIn  0.35s ease both; }
.blink    { animation: blink   1s   infinite; }
.spin     { animation: spin    0.8s linear infinite; }
.pulse-anim { animation: pulse 1.2s ease-in-out infinite; }
`;