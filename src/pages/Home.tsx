import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BarChart3, Receipt, Shield, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main className="flex-1">
        {/* Split Hero Section with Image */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Text Content */}
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span>ExpenseTracker is completely free</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                  Manage your wealth <br />
                  <span className="text-blue-600">like a professional.</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-500 mb-8 leading-relaxed">
                  Join thousands of users tracking their expenses, analyzing their spending habits, and building a better financial future today.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    to={user ? "/dashboard" : "/register"} 
                    className="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                    {user ? 'Open Dashboard' : 'Get Started Now'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  {!user && (
                    <Link 
                      to="/login" 
                      className="w-full sm:w-auto flex items-center justify-center bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 transition"
                    >
                      Log In
                    </Link>
                  )}
                </div>
                
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    <span>Bank-level security</span>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative lg:ml-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" 
                  alt="Dashboard on a laptop" 
                  className="rounded-3xl shadow-2xl border border-white/50 object-cover w-full h-[300px] sm:h-[400px] lg:h-[500px]"
                />
                
                {/* Floating UI Element */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:flex items-center space-x-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Saved This Month</p>
                    <p className="text-xl font-bold text-gray-900">$1,240.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Sections with Images */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">See your money in a new light</h2>
              <p className="text-lg text-gray-500">Everything you need to stay on top of your bills and subscriptions.</p>
            </div>

            {/* Feature 1 (Image Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
              <div className="order-2 lg:order-1 max-w-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Visual Analytics</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Instantly see where your money goes with beautiful, interactive pie charts. We automatically group your spending into easy-to-read categories so you know exactly what you're spending on food, housing, and entertainment.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></div> Automatically categorized
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></div> Interactive hover details
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" 
                  alt="Analytics Data" 
                  className="rounded-2xl shadow-lg w-full h-[300px] object-cover border border-gray-200"
                />
              </div>
            </div>

            {/* Feature 2 (Image Left) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop" 
                  alt="Accounting and Finance" 
                  className="rounded-2xl shadow-lg w-full h-[300px] object-cover border border-gray-200"
                />
              </div>
              <div className="max-w-lg lg:ml-auto">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Receipt className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Lightning Fast Logging</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Designed for speed. You can log an expense in literally seconds on your phone or computer. The clean interface gets out of your way so you can get on with your life.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-3"></div> 100% Mobile Optimized
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-3"></div> Filter by month instantly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-blue-600 py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <Shield className="w-16 h-16 text-blue-300 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Your data is safe with us</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              We use Supabase's bank-grade Row Level Security (RLS). Nobody else can see your expenses, not even us.
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl"
            >
              Start Tracking Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
            <span className="text-xl font-bold tracking-tight text-white">ExpenseTracker</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
