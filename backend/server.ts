// backend/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

import {
  sendWelcomeEmail,
  sendResumeReviewEmail,
  sendInterviewCompletedEmail,
  sendWeeklyProgressEmail,
} from './emailService.js';

// ============================================================================
// FIX __dirname FOR ESM
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// LOAD ENV
// ============================================================================

dotenv.config({ path: path.join(__dirname, '.env') });

// ============================================================================
// DEBUG ENV
// ============================================================================

console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT LOADED');
console.log(
  '🔑 EMAIL_PASSWORD:',
  process.env.EMAIL_PASSWORD ? '✅ Loaded' : '❌ NOT LOADED'
);

// ============================================================================
// EXPRESS SETUP
// ============================================================================

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'Backend is running ✅',
  });
});

// ============================================================================
// WELCOME EMAIL
// ============================================================================

app.post('/api/email/welcome', async (req, res) => {
  try {
    const { email, displayName } = req.body;

    if (!email || !displayName) {
      return res.status(400).json({
        error: 'email and displayName are required',
      });
    }

    await sendWelcomeEmail(email, displayName);

    res.json({
      success: true,
      message: 'Welcome email sent',
    });
  } catch (error) {
    console.error('❌ Welcome Email Error:', error);

    res.status(500).json({
      error: 'Failed to send welcome email',
    });
  }
});

// ============================================================================
// RESUME REVIEW EMAIL
// ============================================================================

app.post('/api/email/resume-review', async (req, res) => {
  try {
    const {
      email,
      displayName,
      fileName,
      atsScore,
      summary,
      suggestions,
    } = req.body;

    if (!email || !displayName || !fileName || atsScore === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    await sendResumeReviewEmail(
      email,
      displayName,
      fileName,
      atsScore,
      summary || '',
      suggestions || []
    );

    res.json({
      success: true,
      message: 'Resume review email sent',
    });
  } catch (error) {
    console.error('❌ Resume Review Email Error:', error);

    res.status(500).json({
      error: 'Failed to send resume review email',
    });
  }
});

// ============================================================================
// INTERVIEW COMPLETED EMAIL
// ============================================================================

app.post('/api/email/interview-completed', async (req, res) => {
  try {
    const {
      email,
      displayName,
      interviewType,
      inputMode,
      score,
      summary,
      strengths,
      improvements,
    } = req.body;

    if (!email || !displayName || !interviewType || score === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    await sendInterviewCompletedEmail(
      email,
      displayName,
      interviewType,
      inputMode || 'text',
      score,
      summary || '',
      strengths || [],
      improvements || []
    );

    res.json({
      success: true,
      message: 'Interview completed email sent',
    });
  } catch (error) {
    console.error('❌ Interview Email Error:', error);

    res.status(500).json({
      error: 'Failed to send interview email',
    });
  }
});

// ============================================================================
// WEEKLY REPORT EMAIL
// ============================================================================

app.post('/api/email/weekly-report', async (req, res) => {
  try {
    const { email, displayName, weeklyData } = req.body;

    if (!email || !displayName || !weeklyData) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    await sendWeeklyProgressEmail(
      email,
      displayName,
      weeklyData
    );

    res.json({
      success: true,
      message: 'Weekly report email sent',
    });
  } catch (error) {
    console.error('❌ Weekly Report Error:', error);

    res.status(500).json({
      error: 'Failed to send weekly report email',
    });
  }
});

// ============================================================================
// WEEKLY CRON JOB
// ============================================================================

cron.schedule('0 9 * * 1', async () => {
  console.log('📧 Running weekly email cron job...');
  console.log('✅ Weekly emails sent!');
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(
    `✅ Email API ready at http://localhost:${PORT}/api/email`
  );
});