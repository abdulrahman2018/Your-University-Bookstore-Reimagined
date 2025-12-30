import React, { useState } from 'react';
import Button from './Button';
import { EGYPTIAN_UNIVERSITIES } from '../constants';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/mockApi';

type TabType = 'login' | 'signup' | 'reset';

interface AuthPageProps {
  onBack?: () => void;
  onLoginSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<TabType>('signup');
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    postalCode: '',
    university: '',
    privacyAccepted: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length === 0) {
      return { score: 0, feedback: '' };
    }

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) feedback = 'Weak';
    else if (score <= 4) feedback = 'Medium';
    else if (score <= 5) feedback = 'Strong';
    else feedback = 'Very Strong';

    return { score, feedback };
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const passwordsMatch = formData.password && formData.confirmPassword 
    ? formData.password === formData.confirmPassword 
    : null;

  const emailsMatch = formData.email && formData.confirmEmail
    ? formData.email === formData.confirmEmail
    : null;

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'text-red-600';
    if (passwordStrength.score <= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPasswordStrengthBg = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (activeTab === 'signup') {
        if (!emailsMatch || !passwordsMatch || !formData.privacyAccepted) {
          setError('Please fix the form errors before submitting.');
          setIsSubmitting(false);
          return;
        }

        const result = await api.signup(
          formData.email,
          formData.password,
          formData.postalCode,
          formData.university
        );

        if (result.success && result.user) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }
            if (onBack) {
              onBack();
            }
          }, 1500);
        } else {
          setError(result.message || 'Failed to create account. Please try again.');
        }
      } else if (activeTab === 'login') {
        if (!formData.email || !formData.password) {
          setError('Please enter your email and password.');
          setIsSubmitting(false);
          return;
        }

        const result = await api.login(formData.email, formData.password);

        if (result.success && result.user) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }
            if (onBack) {
              onBack();
            }
          }, 1000);
        } else {
          setError(result.message || 'Invalid email or password.');
        }
      } else if (activeTab === 'reset') {
        // Password reset functionality (just a demo)
        setSuccess('Password reset link sent to your email!');
        setTimeout(() => {
          setSuccess(null);
          setActiveTab('login');
        }, 2000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative ring-1 ring-slate-200/50 animate-scale-in">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-5 left-5 p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 z-10"
            title="Back to homepage"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          <div className="relative">
            <h1 className="text-3xl font-extrabold mb-1">CampusBooks</h1>
            <p className="text-indigo-100 text-sm font-medium">Book Marketplace</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'login'
                ? 'text-indigo-600 bg-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            {activeTab === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"></span>
            )}
            Log in
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'signup'
                ? 'text-indigo-600 bg-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            {activeTab === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"></span>
            )}
            Create new account
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'reset'
                ? 'text-indigo-600 bg-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            {activeTab === 'reset' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"></span>
            )}
            Reset your password
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {activeTab === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm e-mail address
                </label>
                <input
                  type="email"
                  required
                  value={formData.confirmEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmEmail: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm ${
                    formData.confirmEmail && emailsMatch === false
                      ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                      : formData.confirmEmail && emailsMatch === true
                      ? 'border-green-400 focus:border-green-500 bg-green-50/50'
                      : 'border-slate-200 focus:border-indigo-500 bg-slate-50 focus:bg-white'
                  }`}
                  placeholder="confirm your email"
                />
                {formData.confirmEmail && (
                  <p className={`text-xs mt-1 ${emailsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {emailsMatch ? '✓ Emails match' : '✗ Emails do not match'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="Enter your password"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">Password strength:</span>
                      <span className={`font-semibold ${getPasswordStrengthColor()}`}>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getPasswordStrengthBg()} shadow-sm`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm ${
                    formData.confirmPassword && passwordsMatch === false
                      ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                      : formData.confirmPassword && passwordsMatch === true
                      ? 'border-green-400 focus:border-green-500 bg-green-50/50'
                      : 'border-slate-200 focus:border-indigo-500 bg-slate-50 focus:bg-white'
                  }`}
                  placeholder="confirm your password"
                />
                {formData.confirmPassword && (
                  <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="e.g. 12345"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  University
                </label>
                <select
                  required
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm cursor-pointer"
                >
                  <option value="">Select your university</option>
                  {EGYPTIAN_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  required
                />
                <label htmlFor="privacy" className="text-sm text-slate-700">
                  I understand the privacy and security policy for CampusBooks.com
                </label>
              </div>
            </>
          )}

          {activeTab === 'login' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="Enter your password"
                />
              </div>
            </>
          )}

          {activeTab === 'reset' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  We'll send you a link to reset your password
                </p>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            size="lg"
            isLoading={isSubmitting}
            disabled={
              isSubmitting || 
              (activeTab === 'signup' && (!emailsMatch || !passwordsMatch || !formData.privacyAccepted)) ||
              (activeTab === 'login' && (!formData.email || !formData.password))
            }
          >
            {activeTab === 'signup' ? 'Create Account' : activeTab === 'login' ? 'Log In' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
