// components/PhoneVerificationForm.tsx
import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { showNotification } from '../utils/notifications';

interface PhoneVerificationFormProps {
  onVerified: () => void;
}

const PhoneVerificationForm: React.FC<PhoneVerificationFormProps> = ({ onVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to send OTP to phone number
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      showNotification('Success', `OTP sent to ${phoneNumber}.`, 'success');
      setOtpSent(true);
    } catch (error) {
      console.error('Send OTP error:', error);
      showNotification('Error', 'Failed to send OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      if (otp === '654321') { // Hardcoded OTP for simulation
        showNotification('Success', 'Phone number verified successfully!', 'success');
        onVerified();
      } else {
        showNotification('Error', 'Invalid OTP. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      showNotification('Error', 'Verification failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
      {!otpSent ? (
        <>
          <Input
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., +2348012345678"
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </>
      ) : (
        <>
          <p className="text-center text-text-secondary">An OTP has been sent to <span className="font-semibold text-text-primary">{phoneNumber}</span>. Please enter it below.</p>
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
            {loading ? 'Verifying...' : 'Verify Phone'}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={handleSendOtp} disabled={loading}>
            Resend OTP
          </Button>
        </>
      )}
    </form>
  );
};

export default PhoneVerificationForm;
