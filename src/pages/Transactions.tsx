import { ArrowRightLeft } from 'lucide-react';

export default function Transactions() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <ArrowRightLeft className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Detailed Transactions</h2>
      <p className="text-gray-500 max-w-md">
        This page will contain a full-page data table of all your transactions with advanced sorting, filtering, and export capabilities.
      </p>
      <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
        Coming Soon
      </button>
    </div>
  );
}
