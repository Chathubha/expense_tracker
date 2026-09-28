import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PieChart as PieChartIcon, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

type Transaction = {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
};

export default function Analytics() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('id, amount, date, type')
      .order('date', { ascending: true });
    
    if (!error && data) {
      const formattedData = data.map(item => ({
        ...item,
        type: item.type || 'expense'
      }));
      setTransactions(formattedData);
    }
    setLoading(false);
  };

  // Prepare data for Monthly Income vs Expense
  const monthlyDataMap = transactions.reduce((acc, curr) => {
    const month = curr.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { name: month, Income: 0, Expense: 0 };
    }
    if (curr.type === 'income') {
      acc[month].Income += curr.amount;
    } else {
      acc[month].Expense += curr.amount;
    }
    return acc;
  }, {} as Record<string, { name: string, Income: number, Expense: number }>);
  
  const monthlyData = Object.values(monthlyDataMap).sort((a, b) => a.name.localeCompare(b.name)).map(d => ({
    ...d,
    name: new Date(d.name + '-01').toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
  }));

  // Prepare data for Daily Cash Flow (Cumulative)
  let cumulativeBalance = 0;
  const dailyDataMap = transactions.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) {
      acc[date] = { date, balance: 0, dailyIncome: 0, dailyExpense: 0 };
    }
    if (curr.type === 'income') {
      acc[date].dailyIncome += curr.amount;
    } else {
      acc[date].dailyExpense += curr.amount;
    }
    return acc;
  }, {} as Record<string, { date: string, balance: number, dailyIncome: number, dailyExpense: number }>);

  const dailyData = Object.values(dailyDataMap).sort((a, b) => a.date.localeCompare(b.date)).map(d => {
    cumulativeBalance += (d.dailyIncome - d.dailyExpense);
    return {
      date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Balance: cumulativeBalance
    };
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
          <PieChartIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-sm text-gray-500">Visualize your financial trends over time</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl border border-gray-100">
          <Activity className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">Not enough data to show analytics.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-700">Income Overview</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">Rs. {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-gray-500 mt-1">Total recorded income</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500 mb-4">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-700">Expense Overview</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">Rs. {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-gray-500 mt-1">Total recorded expenses</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Comparison */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Monthly Income vs Expense</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `Rs.${value}`} />
                    <Tooltip 
                      formatter={(value: any) => `Rs. ${Number(value).toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#F3F4F6' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cumulative Balance Trend */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Net Balance Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `Rs.${value}`} />
                    <Tooltip 
                      formatter={(value: any) => `Rs. ${Number(value).toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="Balance" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
