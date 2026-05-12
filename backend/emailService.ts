// backend/emailService.ts
// ============================================================================
// EMAIL SERVICE — Nodemailer
// ============================================================================

import dotenv from 'dotenv';
dotenv.config();

import * as nodemailer from 'nodemailer';

// ─── Debug Env ────────────────────────────────────────────────────────────────
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT LOADED');
console.log('🔑 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Loaded' : '❌ NOT LOADED');

// ─── Transporter ──────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ─── Shared Styles ────────────────────────────────────────────────────────────
const baseStyle =
  `font-family:'Courier New',monospace;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;`;

const headerStyle =
  `background:#FF6B2C;padding:32px;text-align:center;`;

const bodyStyle =
  `padding:32px;color:#1a1a1a;`;

const footerStyle =
  `background:#f5f5f5;padding:20px 32px;text-align:center;color:#888;font-size:12px;`;

const btnStyle =
  `display:inline-block;background:#FF6B2C;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px;`;

const badgeStyle = (color: string) =>
  `display:inline-block;background:${color};color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;`;

function scoreColor(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#FF6B2C';
  return '#ef4444';
}

function scoreLabel(score: number): string {
  if (score >= 75) return '🌟 Excellent!';
  if (score >= 50) return '👍 Good job!';
  return '💪 Keep practicing!';
}

// ============================================================================
// 1. WELCOME EMAIL
// ============================================================================
export async function sendWelcomeEmail(
  toEmail: string,
  displayName: string
): Promise<void> {

  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="color:#fff;margin:0;font-size:28px;">🐦 PrepAxis</h1>
        <p style="color:#ffe0d0;margin:8px 0 0;font-size:14px;">
          AI-Powered Interview Preparation
        </p>
      </div>

      <div style="${bodyStyle}">
        <h2 style="margin-top:0;">
          Welcome, ${displayName}! 🎉
        </h2>

        <p style="color:#444;line-height:1.7;">
          We're thrilled to have you on board.
        </p>

        <div style="text-align:center;">
          <a
            href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard"
            style="${btnStyle}"
          >
            Start Preparing →
          </a>
        </div>
      </div>

      <div style="${footerStyle}">
        <p>PrepAxis — Master your interviews with AI coaching</p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"PrepAxis" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Welcome to PrepAxis, ${displayName}! 🎉`,
    html,
  });

  console.log('✅ Welcome email sent:', info.messageId);
}

// ============================================================================
// 2. RESUME REVIEW EMAIL
// ============================================================================
export async function sendResumeReviewEmail(
  toEmail: string,
  displayName: string,
  fileName: string,
  atsScore: number,
  summary: string,
  suggestions: string[]
): Promise<void> {

  const color = scoreColor(atsScore);
  const label = scoreLabel(atsScore);

  const suggestionsHtml = suggestions
    .slice(0, 5)
    .map(
      s => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#444;font-size:13px;">
          → ${s}
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="color:#fff;margin:0;font-size:28px;">🐦 PrepAxis</h1>
      </div>

      <div style="${bodyStyle}">
        <h2>Resume Review Complete 📄</h2>

        <p>Hello ${displayName},</p>

        <p>Your resume <strong>${fileName}</strong> has been analyzed.</p>

        <div style="text-align:center;padding:24px;background:#f9f9f9;border-radius:12px;margin:20px 0;">
          <p style="margin:0;color:#888;">ATS Score</p>

          <p style="margin:8px 0;font-size:56px;font-weight:bold;color:${color};">
            ${atsScore}%
          </p>

          <span style="${badgeStyle(color)}">
            ${label}
          </span>
        </div>

        <div style="background:#fff8f5;border-left:3px solid #FF6B2C;padding:16px;">
          ${summary}
        </div>

        ${
          suggestions.length > 0
            ? `
          <table style="width:100%;margin-top:20px;border-collapse:collapse;">
            ${suggestionsHtml}
          </table>
        `
            : ''
        }
      </div>

      <div style="${footerStyle}">
        PrepAxis
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"PrepAxis" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Resume Score: ${atsScore}%`,
    html,
  });

  console.log('✅ Resume review email sent:', info.messageId);
}

// ============================================================================
// 3. INTERVIEW COMPLETED EMAIL
// ============================================================================
export async function sendInterviewCompletedEmail(
  toEmail: string,
  displayName: string,
  interviewType: 'hr' | 'technical',
  inputMode: 'voice' | 'text',
  score: number,
  summary: string,
  strengths: string[],
  improvements: string[]
): Promise<void> {

  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="color:#fff;">🐦 PrepAxis</h1>
      </div>

      <div style="${bodyStyle}">
        <h2>Interview Completed 🎤</h2>

        <p>Hello ${displayName},</p>

        <p>Your ${interviewType} interview is complete.</p>

        <p><strong>Mode:</strong> ${inputMode}</p>
        <p><strong>Score:</strong> ${score}/100</p>

        <p>${summary}</p>

        <h3>Strengths</h3>
        <ul>
          ${strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>

        <h3>Improvements</h3>
        <ul>
          ${improvements.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>

      <div style="${footerStyle}">
        PrepAxis
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"PrepAxis" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Interview Complete! Score: ${score}/100`,
    html,
  });

  console.log('✅ Interview email sent:', info.messageId);
}

// ============================================================================
// 4. WEEKLY PROGRESS EMAIL
// ============================================================================
export async function sendWeeklyProgressEmail(
  toEmail: string,
  displayName: string,
  weeklyData: {
    resumeReviews: number;
    avgAtsScore: number;
    bestAtsScore: number;
    interviews: number;
    avgInterviewScore: number;
    bestInterviewScore: number;
  }
): Promise<void> {

  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="color:#fff;">🐦 PrepAxis</h1>
      </div>

      <div style="${bodyStyle}">
        <h2>Weekly Progress Report 📊</h2>

        <p>Hello ${displayName},</p>

        <p>Resume Reviews: ${weeklyData.resumeReviews}</p>
        <p>Average ATS Score: ${weeklyData.avgAtsScore}%</p>
        <p>Best ATS Score: ${weeklyData.bestAtsScore}%</p>

        <hr />

        <p>Interviews: ${weeklyData.interviews}</p>
        <p>Average Interview Score: ${weeklyData.avgInterviewScore}</p>
        <p>Best Interview Score: ${weeklyData.bestInterviewScore}</p>
      </div>

      <div style="${footerStyle}">
        PrepAxis
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"PrepAxis" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `📊 Weekly PrepAxis Report`,
    html,
  });

  console.log('✅ Weekly progress email sent:', info.messageId);
}