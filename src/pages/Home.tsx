import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Shield, Zap, PieChart, Smartphone } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute top-12 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md border border-gray-200/60 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>The #1 Personal Finance App</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tighter mb-8 leading-[1.1]">
              Manage your money<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                without the stress.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track your expenses, analyze your spending habits, and build a better financial future with our beautifully designed platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to={user ? "/dashboard" : "/register"} 
                className="w-full sm:w-auto flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {user ? 'Open Dashboard' : 'Get Started For Free'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              {!user && (
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto flex items-center justify-center bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Dashboard Mockup Image */}
            <div className="mt-20 relative max-w-5xl mx-auto perspective-[2000px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent z-10 bottom-0 h-3/4 translate-y-1/4"></div>
              <div className="rounded-2xl border border-white/40 bg-white/40 p-2 sm:p-4 backdrop-blur-2xl shadow-2xl transform rotate-x-[5deg] scale-[0.98] hover:scale-100 hover:rotate-x-0 transition-transform duration-700 ease-out">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" 
                  alt="Dashboard Preview" 
                  className="rounded-xl border border-gray-100/50 shadow-sm w-full object-cover h-[300px] sm:h-[450px] lg:h-[600px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* LOGO CLOUD */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-gray-400 mb-8 uppercase tracking-widest">Trusted by over 10,000+ individuals</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
              <span className="text-2xl font-bold font-serif">Forbes</span>
              <span className="text-2xl font-bold tracking-tighter">TechCrunch</span>
              <span className="text-2xl font-bold uppercase tracking-widest">Wired</span>
              <span className="text-2xl font-bold italic">FastCompany</span>
            </div>
          </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                Everything you need.<br/>Nothing you don't.
              </h2>
              <p className="text-lg text-gray-500">
                A carefully crafted suite of tools designed to give you complete visibility and control over your financial life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Feature 1 */}
              <div className="md:col-span-2 bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110 duration-700"></div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                  <PieChart className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Deep Visual Analytics</h3>
                <p className="text-gray-500 text-lg max-w-md mb-8">
                  Instantly see where your money goes with beautiful, interactive charts. We automatically group your spending into easy-to-read categories.
                </p>
                <div className="mt-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" 
                    alt="Analytics" 
                    className="rounded-2xl shadow-lg border border-gray-100 h-48 w-full object-cover transform translate-y-4 group-hover:-translate-y-2 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Small Feature 1 */}
              <div className="md:col-span-1 bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-500 text-lg mb-8 flex-1">
                  Log expenses in literally seconds. The clean interface gets out of your way so you can get on with your life.
                </p>
              </div>

              {/* Small Feature 2 */}
              <div className="md:col-span-1 bg-gray-900 text-white rounded-[2rem] p-8 sm:p-12 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Bank-grade Security</h3>
                <p className="text-gray-400 text-lg mb-8 flex-1">
                  Powered by Supabase's Row Level Security (RLS). Nobody else can see your data, not even us.
                </p>
              </div>

              {/* Large Feature 2 */}
              <div className="md:col-span-2 bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-gray-100 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-8">
                    <Smartphone className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Responsive Design</h3>
                  <p className="text-gray-500 text-lg mb-8">
                    Whether you're at your desk or on the go, ExpenseTracker looks and feels amazing on every device.
                  </p>
                </div>
                <div className="flex-1 w-full relative">
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop" 
                    alt="Mobile responsive" 
                    className="rounded-2xl shadow-xl border border-gray-100 w-full h-64 object-cover transform rotate-2 group-hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Ready to take control?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have already transformed their financial habits. Setup takes less than a minute.
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300"
            >
              Create Your Free Account
            </Link>
            <p className="mt-6 text-sm text-blue-200">No credit card required. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-contain opacity-90 shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-white">ExpenseTracker</span>
          </div>
          <div className="flex space-x-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
