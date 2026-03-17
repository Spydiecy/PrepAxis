import { useState, useRef } from "react";
import { colors, fonts, globalCss } from "../../styles/theme";
import Navbar from "../../components/layout/Navbar";

export default function ResumeUpload({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (f && (f.type === "application/pdf" || f.name.endsWith(".docx"))) {
      setFile(f);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !jd.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    onSubmit?.({ file, jd });
  };

  const ready = file && jd.trim().length > 30;

  return (
    <>
      <style>{globalCss}</style>
      <div style={{ minHeight: "100vh", background: colors.bg }}>
        <Navbar activePage="resume" />

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>

          {/* Page header */}
          <div className="fade-up" style={{ marginBottom: 40 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: colors.greenLight, color: colors.green,
              padding: "5px 14px", borderRadius: 99,
              fontSize: 12, fontWeight: 600, marginBottom: 16,
            }}>
              📄 Resume Optimizer
            </div>
            <h1 style={{
              fontFamily: fonts.display, fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1, marginBottom: 12,
            }}>
              Upload your resume &<br />target job description
            </h1>
            <p style={{ color: colors.muted, fontSize: 16, lineHeight: 1.6 }}>
              Our AI will analyze your resume against the JD and suggest targeted improvements.
            </p>
          </div>

          {/* Steps indicator */}
          <div className="fade-up" style={{
            display: "flex", gap: 0, marginBottom: 36,
            background: colors.white, border: `1px solid ${colors.border}`,
            borderRadius: 12, overflow: "hidden",
          }}>
            {[
              { n: "1", label: "Upload Resume", done: !!file },
              { n: "2", label: "Paste Job Description", done: jd.length > 30 },
              { n: "3", label: "Get AI Suggestions", done: false },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: "14px 16px",
                borderRight: i < 2 ? `1px solid ${colors.border}` : "none",
                display: "flex", alignItems: "center", gap: 10,
                background: s.done ? colors.greenLight : "transparent",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: s.done ? colors.green : colors.border,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: s.done ? "#fff" : colors.muted,
                  flexShrink: 0,
                }}>
                  {s.done ? "✓" : s.n}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: s.done ? colors.green : colors.muted,
                }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* File upload zone */}
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <label style={{
              fontSize: 13, fontWeight: 600,
              color: colors.ink, display: "block", marginBottom: 10,
            }}>
              Resume File <span style={{ color: colors.orange }}>*</span>
            </label>

            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragging ? colors.orange : file ? colors.green : colors.border}`,
                borderRadius: 14,
                padding: "40px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? colors.orangeLight : file ? colors.greenLight : colors.white,
                transition: "all 0.2s",
              }}
            >
              {file ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 36 }}>✅</span>
                  <div style={{ fontWeight: 600, color: colors.green, fontSize: 15 }}>{file.name}</div>
                  <div style={{ fontSize: 13, color: colors.muted }}>
                    {(file.size / 1024).toFixed(0)} KB · Click to replace
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 40 }}>📂</span>
                  <div style={{ fontWeight: 600, fontSize: 15, color: colors.ink }}>
                    {dragging ? "Drop it here!" : "Drop your resume or click to browse"}
                  </div>
                  <div style={{ fontSize: 13, color: colors.muted }}>PDF or DOCX · Max 5MB</div>
                  <div style={{
                    marginTop: 8, padding: "8px 20px",
                    background: colors.dark, color: "#fff",
                    borderRadius: 7, fontSize: 13, fontWeight: 600,
                  }}>
                    Browse Files
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>

          {/* JD Textarea */}
          <div className="fade-up" style={{ marginBottom: 32 }}>
            <label style={{
              fontSize: 13, fontWeight: 600,
              color: colors.ink, display: "block", marginBottom: 10,
            }}>
              Job Description <span style={{ color: colors.orange }}>*</span>
              <span style={{ fontWeight: 400, color: colors.muted, marginLeft: 8 }}>
                (paste the full JD for best results)
              </span>
            </label>

            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here...

Example:
We're looking for a Senior Software Engineer to join our platform team. You'll be responsible for designing scalable backend systems, leading technical architecture decisions, and mentoring junior engineers..."
              style={{
                width: "100%",
                minHeight: 200,
                padding: "16px 18px",
                borderRadius: 12,
                border: `1.5px solid ${jd.length > 30 ? colors.green : colors.border}`,
                background: colors.white,
                fontSize: 14,
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
                fontFamily: fonts.body,
                color: colors.ink,
                transition: "border-color 0.2s",
              }}
            />
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 6, fontSize: 12, color: colors.muted,
            }}>
              <span>{jd.length > 30 ? "✓ Looks good!" : `Minimum ~30 chars (${jd.length} so far)`}</span>
              <span>{jd.split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          {/* Tips */}
          <div className="fade-up" style={{
            background: colors.orangeLight,
            border: `1px solid ${colors.orangeMid}`,
            borderRadius: 12, padding: "16px 20px",
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.orange, marginBottom: 8 }}>
              💡 Tips for best results
            </div>
            <ul style={{ fontSize: 13, color: "#a04020", lineHeight: 2, paddingLeft: 18 }}>
              <li>Include the full JD — don't trim requirements</li>
              <li>Use a clean PDF export (not a scanned image)</li>
              <li>Include your most recent 3 roles on your resume</li>
            </ul>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!ready || loading}
            style={{
              width: "100%",
              padding: "16px",
              background: ready && !loading ? colors.orange : colors.border,
              color: ready && !loading ? "#fff" : colors.muted,
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: ready && !loading ? "pointer" : "default",
              fontFamily: fonts.display,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <span className="spin" style={{ display: "inline-block", fontSize: 18 }}>⟳</span>
                Analyzing your resume...
              </>
            ) : (
              "Analyze & Get Suggestions →"
            )}
          </button>
        </div>
      </div>
    </>
  );
}