import React from 'react';
import { TrialBalanceEntry } from '../types';
import { formatCurrency } from '../utils/accounting';
import { ExportButtons } from './ExportButtons';

interface TrialBalanceProps {
  entries: TrialBalanceEntry[];
}

export function TrialBalance({ entries }: TrialBalanceProps) {
  const totals = entries.reduce(
    (acc, entry) => ({
      openingDebit: acc.openingDebit + entry.openingDebit,
      openingCredit: acc.openingCredit + entry.openingCredit,
      periodDebit: acc.periodDebit + entry.periodDebit,
      periodCredit: acc.periodCredit + entry.periodCredit,
      closingDebit: acc.closingDebit + entry.closingDebit,
      closingCredit: acc.closingCredit + entry.closingCredit,
      tryOpeningDebit: acc.tryOpeningDebit + entry.tryOpeningDebit,
      tryOpeningCredit: acc.tryOpeningCredit + entry.tryOpeningCredit,
      tryPeriodDebit: acc.tryPeriodDebit + entry.tryPeriodDebit,
      tryPeriodCredit: acc.tryPeriodCredit + entry.tryPeriodCredit,
      tryClosingDebit: acc.tryClosingDebit + entry.tryClosingDebit,
      tryClosingCredit: acc.tryClosingCredit + entry.tryClosingCredit,
    }),
    {
      openingDebit: 0,
      openingCredit: 0,
      periodDebit: 0,
      periodCredit: 0,
      closingDebit: 0,
      closingCredit: 0,
      tryOpeningDebit: 0,
      tryOpeningCredit: 0,
      tryPeriodDebit: 0,
      tryPeriodCredit: 0,
      tryClosingDebit: 0,
      tryClosingCredit: 0,
    }
  );

  const hasForeignCurrency = entries.some(entry => 
    entry.openingDebit !== entry.tryOpeningDebit ||
    entry.openingCredit !== entry.tryOpeningCredit ||
    entry.periodDebit !== entry.tryPeriodDebit ||
    entry.periodCredit !== entry.tryPeriodCredit ||
    entry.closingDebit !== entry.tryClosingDebit ||
    entry.closingCredit !== entry.tryClosingCredit
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Mizan Raporu</h3>
        <ExportButtons
          type="trial-balance"
          data={entries}
          title="Mizan Raporu"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proje Kodu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proje Adı</th>
              <th colSpan={hasForeignCurrency ? 2 : 1} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Açılış Borç</th>
              <th colSpan={hasForeignCurrency ? 2 : 1} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Açılış Alacak</th>
              <th colSpan={hasForeignCurrency ? 2 : 1} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Dönem Borç</th>
              <th colSpan={hasForeignCurrency ? 2 : 1} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Dönem Alacak</th>
              <th colSpan={hasForeignCurrency ? 2 : 1} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kapanış Borç</th>
              <th colSpan={hasForeignCurrency ? 2 : 1} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kapanış Alacak</th>
            </tr>
            {hasForeignCurrency && (
              <tr>
                <th colSpan={2}></th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Döviz</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">TL</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Döviz</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">TL</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Döviz</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">TL</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Döviz</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">TL</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Döviz</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">TL</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Döviz</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">TL</th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.projectCode}>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{entry.projectCode}</td>
                <td className="px-4 py-3 text-sm">{entry.projectName}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.openingDebit)}</td>
                {hasForeignCurrency && (
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryOpeningDebit)}</td>
                )}
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.openingCredit)}</td>
                {hasForeignCurrency && (
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryOpeningCredit)}</td>
                )}
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.periodDebit)}</td>
                {hasForeignCurrency && (
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryPeriodDebit)}</td>
                )}
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.periodCredit)}</td>
                {hasForeignCurrency && (
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryPeriodCredit)}</td>
                )}
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.closingDebit)}</td>
                {hasForeignCurrency && (
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryClosingDebit)}</td>
                )}
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.closingCredit)}</td>
                {hasForeignCurrency && (
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(entry.tryClosingCredit)}</td>
                )}
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-3 text-sm" colSpan={2}>TOPLAM</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.openingDebit)}</td>
              {hasForeignCurrency && (
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryOpeningDebit)}</td>
              )}
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.openingCredit)}</td>
              {hasForeignCurrency && (
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryOpeningCredit)}</td>
              )}
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.periodDebit)}</td>
              {hasForeignCurrency && (
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryPeriodDebit)}</td>
              )}
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.periodCredit)}</td>
              {hasForeignCurrency && (
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryPeriodCredit)}</td>
              )}
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.closingDebit)}</td>
              {hasForeignCurrency && (
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryClosingDebit)}</td>
              )}
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.closingCredit)}</td>
              {hasForeignCurrency && (
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.tryClosingCredit)}</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}