import React, { useState } from 'react';
import Button from './Button';
import { EGYPTIAN_UNIVERSITIES } from '../constants';
import { ArrowLeft } from 'lucide-react';

type TabType = 'login' | 'signup' | 'reset';

interface AuthPageProps {
  onBack?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signup') {
      if (!emailsMatch || !passwordsMatch || !formData.privacyAccepted) {
        alert('Please fix the form errors before submitting.');
        return;
      }
      console.log('Signup data:', formData);
      alert('Account created successfully!');
    } else if (activeTab === 'login') {
      console.log('Login data:', { email: formData.email, password: formData.password });
      alert('Login successful!');
    } else if (activeTab === 'reset') {
      console.log('Reset password for:', formData.email);
      alert('Password reset link sent to your email!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            title="Back to homepage"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">CampusBooks.com</h1>
          <p className="text-indigo-100 text-sm mt-1">Book Marketplace</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'signup'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Create new account
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'reset'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Reset your password
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Confirm e-mail address
                </label>
                <input
                  type="email"
                  required
                  value={formData.confirmEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmEmail: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                    formData.confirmEmail && emailsMatch === false
                      ? 'border-red-500 focus:border-red-500'
                      : formData.confirmEmail && emailsMatch === true
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-slate-300 focus:border-indigo-500'
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthBg()}`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                    formData.confirmPassword && passwordsMatch === false
                      ? 'border-red-500 focus:border-red-500'
                      : formData.confirmPassword && passwordsMatch === true
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-slate-300 focus:border-indigo-500'
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g. 12345"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  University
                </label>
                <select
                  required
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </>
          )}

          {activeTab === 'reset' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-slate-500 mt-1">
                  We'll send you a link to reset your password
                </p>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={activeTab === 'signup' && (!emailsMatch || !passwordsMatch || !formData.privacyAccepted)}
          >
            {activeTab === 'signup' ? 'Create Account' : activeTab === 'login' ? 'Log In' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

