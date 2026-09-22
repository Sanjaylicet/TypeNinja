import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, LogIn, Mail, UserPlus, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          setSuccessMessage('Logged in successfully!');
          setTimeout(() => {
            onAuthSuccess();
            onClose();
          }, 600);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          setSuccessMessage('Account created and logged in! Progress is synced.');
          setTimeout(() => {
            onAuthSuccess();
            onClose();
          }, 800);
        } else if (data.user) {
          setSuccessMessage(
            'Account created! Please check your email if confirmation is enabled, or sign in now.'
          );
          setMode('signin');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FFFDF7] brutal-border-thick brutal-shadow-xl p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white text-black hover:bg-gray-100 brutal-border brutal-shadow-sm brutal-btn-press"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pr-8">
          <div className="inline-block bg-[#00E5FF] text-black text-xs font-black uppercase px-2.5 py-0.5 brutal-border mb-2">
            Cloud Synchronization
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Save your typing speed benchmarks, unlocked lessons, and mistake telemetry securely across devices.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 text-xs font-black uppercase tracking-wider brutal-border transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-black text-white brutal-shadow-sm'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 text-xs font-black uppercase tracking-wider brutal-border transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-[#FFDE03] text-black brutal-shadow-sm font-black'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FF6B6B] text-white brutal-border text-xs font-bold flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-black" />
            <span className="text-black">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-[#6BCB77] text-black brutal-border text-xs font-bold flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-black" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ninja@typing.com"
                className="w-full bg-white brutal-border p-2.5 pl-9 text-sm font-bold text-black placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-black"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black uppercase text-black">
                Password
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] font-bold text-gray-500">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white brutal-border p-2.5 pl-9 pr-10 text-sm font-bold text-black placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-black"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-black"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-black text-[#FFDE03] hover:text-white font-black uppercase tracking-wider text-sm brutal-border brutal-shadow hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 brutal-btn-press disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In & Sync</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t-2 border-black text-center text-[11px] font-bold text-gray-500">
          ⚡ Existing local progress will automatically sync to your account.
        </div>
      </div>
    </div>
  );
};
