import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Lock, User, ShieldAlert, KeyRound, Smartphone } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  // Auth flow steps: 'login' or 'pin'
  const [step, setStep] = useState('login');
  const [tempToken, setTempToken] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Step 1: Password Authenticating
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}auth/login`, {
        username,
        password
      });

      if (response.data && response.data.requirePin) {
        // Switch to Step 2 (PIN Check)
        setTempToken(response.data.tempToken);
        setStep('pin');
      } else {
        setError('Verification error. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Invalid username or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: PIN Verification
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}auth/verify-pin`, {
        pin,
        tempToken
      });

      if (response.data && response.data.success) {
        // Save final token to storage
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminUsername', response.data.data.username);
        localStorage.setItem('role', 'admin');

        // Go to dashboard
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'PIN verification failed.');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Invalid 4-digit PIN. Please check and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLightAlt py-12 px-6">
      {/* Decorative background gradients */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-8 relative z-10 text-left">

        {/* Step 1 Title */}
        {step === 'login' && (
          <div className="text-center mb-8">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Admin Control Panel</h2>
            <p className="text-xxs text-gray-400 mt-1">Please enter your credentials to authenticate.</p>
          </div>
        )}

        {/* Step 2 Title */}
        {step === 'pin' && (
          <div className="text-center mb-8">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit mx-auto mb-4">
              <Smartphone className="w-6 h-6 animate-bounce" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Enter Security PIN</h2>
            <p className="text-xxs text-gray-400 mt-1">Enter your 4-digit administrator passcode to proceed.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-start gap-2 text-xxs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1 Form */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="vansh"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 mt-6 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 2 Form */}
        {step === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">4-Digit Verification PIN</label>
              <input
                type="password"
                required
                maxLength="4"
                pattern="[0-9]{4}"
                inputMode="numeric"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-32 mx-auto text-center tracking-[1em] text-xl font-bold p-3 border border-gray-200 rounded-lg block focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setStep('login');
                  setPin('');
                  setError('');
                }}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-2.5 rounded-lg text-xs transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? 'Verifying PIN...' : 'Access Dashboard'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
