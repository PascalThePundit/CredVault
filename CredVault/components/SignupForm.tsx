// components/SignupForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Input from './ui/Input';
import Button from './ui/Button';
import Select from './ui/Select';
import { showNotification } from '../utils/notifications';

interface SignupFormProps {
  onSignupSuccess: (email: string, password: string, role: 'issuer' | 'student' | 'employer') => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'issuer' | 'student' | 'employer' | ''>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting registration with:', JSON.stringify({ email, password: '[HIDDEN]', role })); // Moved log
    if (password !== confirmPassword) {
      showNotification('Error', 'Passwords do not match.', 'error');
      return;
    }
    if (!role) {
      showNotification('Error', 'Please select a role.', 'error');
      return;
    }

    setLoading(true);
    console.log('Registering with:', JSON.stringify({ email, password: '[HIDDEN]', role })); // Added log
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Success', data.message, 'success');
        onSignupSuccess(email, password, role as 'issuer' | 'student' | 'employer');
      } else {
        showNotification('Error', data.message || 'Signup failed.', 'error');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showNotification('Error', 'Network error or server is unreachable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
        required
      />
      <Select
        label="I am a:"
        value={role}
        onChange={(e) => setRole(e.target.value as 'issuer' | 'student' | 'employer')}
        options={[
          { value: '', label: 'Select your role' },
          { value: 'student', label: 'Student' },
          { value: 'issuer', label: 'Issuer' },
          { value: 'employer', label: 'Employer' },
        ]}
        required
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignupForm;
