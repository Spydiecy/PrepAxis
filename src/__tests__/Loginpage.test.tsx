// src/__tests__/LoginPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { addDoc } from 'firebase/firestore';
import LoginPage from '../pages/LoginPage';

// Helper to render LoginPage with router
const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

// ══════════════════════════════════════════════════════════════════════════════
// UNIT TESTS — UI Rendering
// ══════════════════════════════════════════════════════════════════════════════

describe('🔐 LoginPage - UI Rendering', () => {
  test('✅ renders PrepAxis logo and brand name', () => {
    renderLoginPage();
    expect(screen.getByText('PrepAxis')).toBeInTheDocument();
  });

  test('✅ renders welcome heading', () => {
    renderLoginPage();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test('✅ renders Sign In with Google button', () => {
    renderLoginPage();
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
  });

  test('✅ renders Terms of Service text', () => {
    renderLoginPage();
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
  });

  test('✅ does not show error message initially', () => {
    renderLoginPage();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS — Google Sign-In Flow
// ══════════════════════════════════════════════════════════════════════════════

describe('🔐 LoginPage - Google Sign-In Integration', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ successful login saves user to localStorage', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: 'test-user-123',
        email: 'test@gmail.com',
        displayName: 'Test User',
        photoURL: 'https://photo.url',
      },
    });
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'login-doc-1' });

    renderLoginPage();
    fireEvent.click(screen.getByText(/sign in with google/i));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      expect(stored.uid).toBe('test-user-123');
      expect(stored.email).toBe('test@gmail.com');
      expect(stored.loginMethod).toBe('google');
    });
  });

  test('✅ successful login saves login record to Firestore', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({
      user: {
        uid: 'test-user-123',
        email: 'test@gmail.com',
        displayName: 'Test User',
        photoURL: 'https://photo.url',
      },
    });
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'login-doc-1' });

    renderLoginPage();
    fireEvent.click(screen.getByText(/sign in with google/i));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
      const savedData = (addDoc as jest.Mock).mock.calls[0][1];
      expect(savedData.userId).toBe('test-user-123');
      expect(savedData.email).toBe('test@gmail.com');
      expect(savedData.provider).toBe('google');
    });
  });

  test('❌ shows error message when sign-in fails', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(
      new Error('Popup blocked by browser')
    );

    renderLoginPage();
    fireEvent.click(screen.getByText(/sign in with google/i));

    await waitFor(() => {
      expect(screen.getByText(/popup blocked by browser/i)).toBeInTheDocument();
    });
  });

  test('❌ cancelled popup does not show error', async () => {
    const error = new Error('Cancelled');
    (error as any).code = 'auth/cancelled-popup-request';
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(error);

    renderLoginPage();
    fireEvent.click(screen.getByText(/sign in with google/i));

    await waitFor(() => {
      expect(screen.queryByText(/cancelled/i)).not.toBeInTheDocument();
    });
  });
});