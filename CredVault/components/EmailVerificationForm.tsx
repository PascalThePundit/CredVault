// components/EmailVerificationForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Input from './ui/Input';
import Button from './ui/Button';
import { showNotification } from '../utils/notifications';

interface EmailVerificationFormProps {
  email: string;
  onVerified: () => void;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({ email, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/verify-email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        login('student', true, user?.isPhoneVerified || false, user?.publicKey || null);
        router.push('/dashboard');
      } else {
        showNotification('Error', data.message || 'Email verification failed.', 'error');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      showNotification('Error', 'Network error or server is unreachable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-center text-text-secondary">An OTP has been sent to <span className="font-semibold text-text-primary">{email}</span>. Please enter it below.</p>
      <Input
        label="OTP"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        required
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Verifying...' : 'Verify Email'}
      </Button>
      <Button type="button" variant="ghost" className="w-full">
        Resend OTP
      </Button>
    </form>
  );
};

export default EmailVerificationForm;
