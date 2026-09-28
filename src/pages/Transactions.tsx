import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowRightLeft, ArrowUpCircle, ArrowDownCircle, Search, Calendar, Filter } from 'lucide-react';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
};

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      const formattedData = (data || []).map(item => ({
        ...item,
        type: item.type || 'expense'
      }));
      setTransactions(formattedData);
    }
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[80vh] flex flex-col">
      <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Transactions</h2>
              <p className="text-sm text-gray-500">View and manage your complete transaction history</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setFilterType('All')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterType === 'All' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('income')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterType === 'income' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Income
            </button>
            <button 
              onClick={() => setFilterType('expense')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterType === 'expense' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Expenses
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Filter className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No transactions found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm font-medium text-gray-500 sticky top-0 z-10 shadow-sm">
                <th className="py-4 px-6 font-semibold">Transaction</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`flex h-10 w-10 rounded-full items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {t.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                      </div>
                      <span className="font-medium text-gray-900">{t.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.type === 'income' ? '+' : '-'}Rs. {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
