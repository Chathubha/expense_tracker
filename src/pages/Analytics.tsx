import { PieChart } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
        <PieChart className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
      <p className="text-gray-500 max-w-md">
        Dive deep into your spending habits with bar charts, line graphs, and month-over-month comparisons.
      </p>
      <button className="mt-8 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-sm">
        Coming Soon
      </button>
    </div>
  );
}
