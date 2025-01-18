import React from 'react';
import { FileDown } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/export';
import { TrialBalanceEntry, LedgerEntry } from '../types';

interface ExportButtonsProps {
  type: 'trial-balance' | 'ledger';
  data: TrialBalanceEntry[] | LedgerEntry[];
  title: string;
}

export function ExportButtons({ type, data, title }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToPDF(type, data, title)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
      >
        <FileDown className="w-4 h-4" />
        PDF
      </button>
      <button
        onClick={() => exportToExcel(type, data, title)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
      >
        <FileDown className="w-4 h-4" />
        Excel
      </button>
    </div>
  );
}