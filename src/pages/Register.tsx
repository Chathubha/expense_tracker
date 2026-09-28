import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Registration successful! Please sign in.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Right side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 flex-col justify-between p-12 relative overflow-hidden order-2">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-indigo-900 via-indigo-900/80 to-transparent"></div>
        
        <div className="relative z-10 flex justify-end">
          <Link to="/" className="flex items-center text-indigo-200 hover:text-white transition">
            <span className="font-medium hover:underline">Back to website</span>
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md ml-auto">
          <h2 className="text-3xl font-bold text-white mb-8 leading-tight">
            Start managing your money like a pro.
          </h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3 shrink-0" />
              <div>
                <h4 className="text-white font-medium">100% Free Forever</h4>
                <p className="text-indigo-200 text-sm mt-1">No hidden fees, no credit card required to start tracking.</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3 shrink-0" />
              <div>
                <h4 className="text-white font-medium">Secure & Private</h4>
                <p className="text-indigo-200 text-sm mt-1">Bank-level encryption ensures your data is only visible to you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left side - Register Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 order-1">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-10 rounded-xl object-contain" />
            </div>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>

          <div className="bg-white py-8 px-4 sm:rounded-2xl sm:px-10 shadow-xl shadow-gray-200/50 border border-gray-100">
            <form className="space-y-6" onSubmit={handleRegister}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-start">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating account...</>
                  ) : (
                    'Create free account'
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
