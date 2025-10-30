// components/LoginForm.tsx
import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { showNotification } from '../utils/notifications';

interface LoginFormProps {
  onLoginSuccess: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Success', data.message || 'Login successful.', 'success');
        onLoginSuccess(email, password);
      } else {
        showNotification('Error', data.message || 'Login failed.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
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
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging In...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;