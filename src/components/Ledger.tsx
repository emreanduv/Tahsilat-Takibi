import React from 'react';
import { LedgerEntry } from '../types';
import { formatCurrency } from '../utils/accounting';
import { ExportButtons } from './ExportButtons';

interface LedgerProps {
  entries: LedgerEntry[];
  projectId: string;
  projectName: string;
}

export function Ledger({ entries, projectId, projectName }: LedgerProps) {
  const totals = entries.reduce(
    (acc, entry) => ({
      debit: acc.debit + entry.debit,
      credit: acc.credit + entry.credit,
      tryDebit: acc.tryDebit + (entry.tryEquivalent?.debit || 0),
      tryCredit: acc.tryCredit + (entry.tryEquivalent?.credit || 0),
    }),
    { debit: 0, credit: 0, tryDebit: 0, tryCredit: 0 }
  );

  const hasForeignCurrency = entries.some(entry => entry.currency !== 'TRY');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{projectName}</h3>
        <ExportButtons
          type="ledger"
          data={entries}
          title={`Muavin - ${projectName}`}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Borç</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Alacak</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bakiye</th>
              {hasForeignCurrency && (
                <>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Borç (TL)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Alacak (TL)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bakiye (TL)</th>
                </>
              )}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Döviz</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry, index) => (
              <tr key={index}>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{entry.date}</td>
                <td className="px-4 py-3 text-sm">{entry.description}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.debit)}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.credit)}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.balance)}</td>
                {hasForeignCurrency && (
                  <>
                    <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryEquivalent?.debit || 0)}</td>
                    <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryEquivalent?.credit || 0)}</td>
                    <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryEquivalent?.balance || 0)}</td>
                  </>
                )}
                <td className="px-4 py-3 text-center text-sm">{entry.currency}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-3 text-sm" colSpan={2}>TOPLAM</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.debit)}</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.credit)}</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(entries[entries.length - 1]?.balance || 0)}</td>
              {hasForeignCurrency && (
                <>
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryDebit)}</td>
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryCredit)}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    {formatCurrency(entries[entries.length - 1]?.tryEquivalent?.balance || 0)}
                  </td>
                </>
              )}
              <td className="px-4 py-3 text-center text-sm">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}