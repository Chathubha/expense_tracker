import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit, Filter, ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
};

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Investments',
  'Gifts',
  'Other',
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF8', '#F472B6', '#FBBF24', '#9CA3AF'];

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter State
  const [filterMonth, setFilterMonth] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All'); // 'All', 'income', 'expense'

  // Update category dropdown if type changes
  useEffect(() => {
    if (!editingId) {
      setCategory(transactionType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
    }
  }, [transactionType]);

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
      // Handle legacy records without 'type'
      const formattedData = (data || []).map(item => ({
        ...item,
        type: item.type || 'expense'
      }));
      setTransactions(formattedData);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const transactionData = {
      user_id: user.id,
      title,
      amount: parseFloat(amount),
      category,
      date,
      type: transactionType
    };

    if (editingId) {
      const { error } = await supabase
        .from('expenses')
        .update(transactionData)
        .eq('id', editingId);
      if (!error) {
        setEditingId(null);
        resetForm();
        fetchTransactions();
      }
    } else {
      const { error } = await supabase
        .from('expenses')
        .insert([transactionData]);
      if (!error) {
        resetForm();
        fetchTransactions();
      } else {
        alert("Failed to add transaction. Did you run the SQL script to add the 'type' column?");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) fetchTransactions();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setTitle(transaction.title);
    setAmount(transaction.amount.toString());
    setTransactionType(transaction.type || 'expense');
    setCategory(transaction.category);
    setDate(transaction.date);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setTransactionType('expense');
    setCategory(EXPENSE_CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
    setEditingId(null);
  };

  const availableMonths = Array.from(
    new Set(transactions.map(t => t.date.substring(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  const filteredTransactions = transactions.filter(t => {
    const matchMonth = filterMonth === 'All' || t.date.startsWith(filterMonth);
    const matchType = filterType === 'All' || t.type === filterType;
    return matchMonth && matchType;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseCategoryData = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      const existing = acc.find((c: any) => c.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []).sort((a: any, b: any) => b.value - a.value);

  const activeCategories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Filters & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <option value="All">All Time</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{new Date(m).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</option>
              ))}
            </select>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          >
            <option value="All">All Transactions</option>
            <option value="income">Incomes Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center bg-blue-600 text-white rounded-lg py-2 px-6 hover:bg-blue-700 transition shadow-sm font-medium whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          {showForm ? 'Close Form' : 'Add Transaction'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <DollarSign className="w-4 h-4" />
            <h3 className="text-sm font-medium">Net Balance</h3>
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-green-100 mb-2">
            <ArrowUpCircle className="w-4 h-4" />
            <h3 className="text-sm font-medium">Total Income</h3>
          </div>
          <p className="text-3xl font-bold tracking-tight">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-red-100 mb-2">
            <ArrowDownCircle className="w-4 h-4" />
            <h3 className="text-sm font-medium">Total Expenses</h3>
          </div>
          <p className="text-3xl font-bold tracking-tight">${totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${transactionType === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h2 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Update Transaction' : 'Add New Transaction'}</h2>
          
          <div className="flex mb-6 space-x-2 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${transactionType === 'expense' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${transactionType === 'income' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Income
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount ($)</label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5 bg-white transition cursor-pointer"
              >
                {activeCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title / Note</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={transactionType === 'income' ? "e.g., Salary" : "e.g., Weekly Groceries"}
                className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2.5 transition"
              />
            </div>
            <div className="lg:col-span-4 flex items-center justify-end space-x-3 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-8 py-2.5 text-white rounded-lg transition font-medium shadow-sm ${transactionType === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {editingId ? 'Save Changes' : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Expense Breakdown</h2>
          {expenseCategoryData.length > 0 ? (
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseCategoryData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 min-h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-2">
              No expenses to show
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-lg font-medium text-gray-900">No transactions found</p>
              <p className="mt-1">Adjust your filters or add a new transaction.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((t) => (
                <div 
                  key={t.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0">
                    <div className={`hidden sm:flex h-12 w-12 rounded-full items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {t.type === 'income' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">{t.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600">
                          {t.category}
                        </span>
                        <span>•</span>
                        <span>{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-6 w-full sm:w-auto border-t sm:border-0 border-gray-100 pt-3 sm:pt-0">
                    <span className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </span>
                    <div className="flex space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(t)} 
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)} 
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
