import React, { useState } from 'react';
import { Package, Eye, EyeOff, CheckCircle, LogIn, UserPlus, Home, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function SafeHandsAuth({ setCurrentPage: setAppPage }) {
  const [currentPage, setCurrentPage] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    contactInfo: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  const calculatePasswordStrength = (password) => {
    if (!password) return '';
    if (password.length < 4) return 'Weak';
    if (password.length < 8) return 'Medium';
    return 'High';
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const handleSignIn = () => {
    if (signInData.email && signInData.password) {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const handleSignUp = () => {
    if (signUpData.name && signUpData.email && signUpData.password &&
        signUpData.password === signUpData.confirmPassword) {
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        setCurrentPage('signin');
      }, 3000);
    }
  };

  const handlePasswordChange = (value) => {
    setSignUpData({ ...signUpData, password: value });
    setPasswordStrength(calculatePasswordStrength(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SafeHands
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAppPage('home')}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setCurrentPage('signin')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition font-medium ${
                  currentPage === 'signin'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-lg transition font-medium shadow-md ${
                  currentPage === 'signup'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <div className="font-bold text-lg">
                {currentPage === 'signin' ? 'Sign in successful' : 'Sign up successful'}
              </div>
              <div className="text-sm text-green-50">
                {currentPage === 'signin'
                  ? 'Welcome back to SafeHands!'
                  : 'You have successfully signed up.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">

          {/* Left Side - Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12">
            {currentPage === 'signin' ? (
              // Sign In Form
              <div>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Sign in to your account
                  </h1>
                  <p className="text-gray-600">Welcome back! Please enter your details.</p>
                </div>

                <div className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Remember me</span>
                    </label>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    onClick={handleSignIn}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>Sign in</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Sign Up Link */}
                  <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setCurrentPage('signup')}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Sign up now!
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // Sign Up Form
              <div>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Create your account
                  </h1>
                  <p className="text-gray-600">Join SafeHands today and get started.</p>
                </div>

                <div className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="Rifat"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-indigo-50 border-2 border-indigo-100 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="rifat123@gmail.com"
                      />
                    </div>
                  </div>

                  {/* Contact Info & Address */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Info <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={signUpData.contactInfo}
                          onChange={(e) => setSignUpData({ ...signUpData, contactInfo: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                          placeholder="0127123"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={signUpData.address}
                          onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-indigo-50 border-2 border-indigo-100 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                          placeholder="Gendaria TSO"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signUpData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {signUpData.password && (
                      <div className="mt-2">
                        <div className="flex space-x-1 mb-1">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                i <= (passwordStrength === 'Weak' ? 2 : passwordStrength === 'Medium' ? 4 : 6)
                                  ? getPasswordStrengthColor(passwordStrength)
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 text-right">{passwordStrength}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-all"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    onClick={handleSignUp}
                    disabled={!signUpData.name || !signUpData.email || !signUpData.password ||
                              signUpData.password !== signUpData.confirmPassword}
                    className="w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-500 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Submitting
                  </button>

                  {/* Sign In Link */}
                  <p className="text-center text-gray-600">
                    Already a user?{' '}
                    <button
                      onClick={() => setCurrentPage('signin')}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Sign in instead!
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Image/Illustration */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop"
                  alt="Professional workspace"
                  className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute bottom-12 left-12 right-12 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Join SafeHands Today
                  </h3>
                  <p className="text-gray-600">
                    Experience seamless service delivery with our trusted platform.
                    Your safety and convenience are our top priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slide-up {
          from {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
