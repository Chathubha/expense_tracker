import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRightLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Calendar, 
  Filter, 
  Tag, 
  FileDown,
  RotateCcw
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [isExporting, setIsExporting] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  // Extract unique sorted categories
  const categories = Array.from(
    new Set(transactions.map(t => t.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  // Filtered transactions logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || t.type === filterType;
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const tDate = new Date(t.date);
      const today = new Date();
      
      if (dateRange === 'this_month') {
        matchesDate = tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
      } else if (dateRange === 'last_month') {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        matchesDate = tDate.getMonth() === lastMonth.getMonth() && tDate.getFullYear() === lastMonth.getFullYear();
      } else if (dateRange === 'last_7_days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchesDate = tDate >= sevenDaysAgo && tDate <= today;
      } else if (dateRange === 'custom') {
        if (startDate && endDate) {
          matchesDate = tDate >= new Date(startDate) && tDate <= new Date(endDate);
        } else if (startDate) {
          matchesDate = tDate >= new Date(startDate);
        } else if (endDate) {
          matchesDate = tDate <= new Date(endDate);
        }
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  // Dynamic metrics for the filtered view
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const hasActiveFilters = searchTerm !== '' || filterType !== 'All' || selectedCategory !== 'All' || dateRange !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setSelectedCategory('All');
    setDateRange('all');
    setStartDate('');
    setEndDate('');
  };

  // PDF Export Generation
  const exportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const todayStr = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Header Banner
      doc.setFillColor(30, 41, 59); // Slate 800
      doc.rect(0, 0, 210, 38, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('ExpenseTracker', 14, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225); // Slate 300
      doc.text('STATEMENT OF TRANSACTIONS & SALES', 14, 26);
      doc.text(`Generated on: ${todayStr}`, 14, 32);

      if (user?.email) {
        doc.text(`Account: ${user.email}`, 210 - 14, 32, { align: 'right' });
      }

      // Summary Card
      doc.setFillColor(248, 250, 252); // Slate 50
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.roundedRect(14, 46, 182, 28, 3, 3, 'FD');

      doc.setTextColor(71, 85, 105); // Slate 600
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMMARY FOR CURRENT FILTER', 20, 53);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Filter Applied: ${selectedCategory !== 'All' ? selectedCategory : 'All Categories'} | ${dateRange === 'all' ? 'All Time' : dateRange.replace('_', ' ')}`, 20, 59);

      // Financial totals in summary card
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129); // Green
      doc.text(`Total Sales / Income: Rs. ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 20, 68);

      doc.setTextColor(239, 68, 68); // Red
      doc.text(`Total Expense: Rs. ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 105, 68);

      doc.setTextColor(30, 41, 59);
      doc.text(`Net: Rs. ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 210 - 20, 68, { align: 'right' });

      // Transactions Table
      const tableRows = filteredTransactions.map((t, index) => [
        (index + 1).toString(),
        new Date(t.date).toLocaleDateString('en-GB'),
        t.title,
        t.category,
        t.type === 'income' ? 'Income / Sale' : 'Expense',
        `${t.type === 'income' ? '+' : '-'} Rs. ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      ]);

      autoTable(doc, {
        startY: 82,
        head: [['#', 'Date', 'Description', 'Category', 'Type', 'Amount']],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          cellPadding: 3.5
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [51, 65, 85],
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 26 },
          2: { cellWidth: 55 },
          3: { cellWidth: 35 },
          4: { cellWidth: 26 },
          5: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const rawText = data.cell.raw as string;
            if (rawText.startsWith('+')) {
              data.cell.styles.textColor = [16, 185, 129]; // Emerald Green
            } else {
              data.cell.styles.textColor = [225, 29, 72]; // Rose/Red
            }
          }
        },
        foot: [[
          '',
          '',
          `Total Records: ${filteredTransactions.length}`,
          '',
          'Net Balance:',
          `${netBalance >= 0 ? '+' : ''} Rs. ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        ]],
        footStyles: {
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
          fontSize: 9,
          fontStyle: 'bold',
          cellPadding: 3.5
        }
      });

      // Save PDF directly to user's computer
      const fileName = `ExpenseTracker_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Sleek Top Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transactions</h1>
            <p className="text-sm text-gray-500">View, search, and download your financial records</p>
          </div>
        </div>

        {/* Action Button: PDF Download */}
        <button
          onClick={exportPDF}
          disabled={isExporting || filteredTransactions.length === 0}
          className="inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer disabled:cursor-not-allowed self-start md:self-auto"
        >
          <FileDown className="w-4 h-4 text-gray-300" />
          <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
        </button>
      </div>

      {/* Modern, Clean Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales / Income</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              +Rs. {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">
              -Rs. {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Net Balance</p>
            <p className={`text-xl font-bold mt-0.5 ${netBalance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {netBalance >= 0 ? '+' : ''}Rs. {netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {filteredTransactions.length} txns
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Streamlined Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search description or category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs placeholder:text-gray-400"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center space-x-1.5 bg-white px-3 py-2 border border-gray-200 rounded-xl shadow-2xs">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-none text-xs sm:text-sm font-medium focus:ring-0 p-0 text-gray-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center space-x-1.5 bg-white px-3 py-2 border border-gray-200 rounded-xl shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border-none text-xs sm:text-sm font-medium focus:ring-0 p-0 text-gray-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Dates if picked */}
            {dateRange === 'custom' && (
              <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 border border-gray-200 rounded-xl shadow-2xs">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-none text-xs focus:ring-0 p-0.5 text-gray-600 bg-transparent outline-none cursor-pointer"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-none text-xs focus:ring-0 p-0.5 text-gray-600 bg-transparent outline-none cursor-pointer"
                />
              </div>
            )}

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Type Segment Control */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl text-xs font-semibold self-start md:self-center shrink-0">
            <button 
              onClick={() => setFilterType('All')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'All' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'income' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Income
            </button>
            <button 
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'expense' ? 'bg-white text-red-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                <Filter className="w-5 h-5" />
              </div>
              <p className="text-base font-semibold text-gray-800">No transactions match your filters</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">Try searching for something else or clearing your current filter criteria.</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredTransactions.map((t) => {
                  const isIncome = t.type === 'income';
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/70 transition-colors group">
                      {/* Title & Icon */}
                      <td className="py-4 px-6 font-medium text-gray-900">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="block text-gray-900 font-semibold">{t.title}</span>
                            <span className="block text-xs text-gray-400 capitalize md:hidden">{t.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6 hidden md:table-cell">
                        <button
                          onClick={() => setSelectedCategory(t.category)}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100/80 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer"
                          title="Click to filter by this category"
                        >
                          {t.category}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-gray-500 text-xs sm:text-sm">
                        {new Date(t.date).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right font-bold text-sm sm:text-base">
                        <span className={isIncome ? 'text-emerald-600' : 'text-gray-900'}>
                          {isIncome ? '+' : '-'}Rs. {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}