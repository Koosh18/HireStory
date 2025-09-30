import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../lib/api';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = '/app';

  async function handleGoogleSuccess(credentialResponse) {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) throw new Error('Google token missing');
      const { data } = await api.post('/auth/google', { idToken });
      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError('Google sign-in failed');
    }
  }

  function handleGoogleError() {
    setError('Google sign-in failed');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border shadow-sm">
      <h1 className="text-2xl font-extrabold mb-2">Sign in</h1>
      <p className="text-sm text-gray-600 mb-4">Use your college Google account to continue.</p>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap={false} />
        </div>
      ) : (
        <p className="text-sm text-gray-600">Google sign-in not configured.</p>
      )}
    </div>
  );
}


