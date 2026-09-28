import { useState } from 'react';
import { Settings as SettingsIcon, Key, Download, Trash2, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { user } = useAuth();
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Data state
  const [dataLoading, setDataLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      setPasswordMessage({ type: 'error', text: error.message });
    } else {
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setPasswordLoading(false);
  };

  const handleExportCSV = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        alert('No data to export.');
        return;
      }

      // Convert to CSV
      const headers = ['Date', 'Title', 'Category', 'Type', 'Amount (Rs)'];
      const csvContent = [
        headers.join(','),
        ...data.map(t => `"${t.date}","${t.title}","${t.category}","${t.type}","${t.amount}"`)
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ExpenseTracker_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to export data.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteAllData = async () => {
    if (!window.confirm('WARNING: This will permanently delete ALL your transactions. This action cannot be undone. Are you absolutely sure?')) {
      return;
    }
    
    if (!window.confirm('Final confirmation: Delete all data?')) {
      return;
    }
    
    setDataLoading(true);
    try {
      const { error } = await supabase.from('expenses').delete().eq('user_id', user?.id);
      if (error) throw error;
      alert('All data has been successfully deleted.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete data.');
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
          <div className="bg-gray-100 p-2.5 rounded-xl">
            <SettingsIcon className="w-6 h-6 text-gray-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        </div>

        <div className="space-y-10">
          {/* Profile Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Profile Information
            </h3>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 max-w-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full border-gray-200 bg-gray-100 rounded-lg shadow-sm sm:text-sm border p-2.5 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">Your email address is managed securely by Supabase Auth.</p>
            </div>
          </section>

          {/* Security */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2 text-blue-600" />
              Change Password
            </h3>
            <form onSubmit={handleUpdatePassword} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm max-w-2xl">
              {passwordMessage.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${passwordMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                  {passwordMessage.text}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading || !newPassword || !confirmPassword}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center"
                >
                  {passwordLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : 'Update Password'}
                </button>
              </div>
            </form>
          </section>

          {/* Data Management */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-600" />
              Data Management
            </h3>
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm max-w-2xl">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">Export Transactions</p>
                  <p className="text-sm text-gray-500">Download a CSV file of all your incomes and expenses.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  disabled={dataLoading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition shrink-0 flex items-center justify-center disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
              
              <div className="p-5 bg-red-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-red-700">Delete All Data</p>
                  <p className="text-sm text-red-500/80">Permanently wipe all your transactions. This cannot be undone.</p>
                </div>
                <button
                  onClick={handleDeleteAllData}
                  disabled={dataLoading}
                  className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition shrink-0 flex items-center justify-center disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Data
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
