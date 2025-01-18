import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TrialBalanceEntry, LedgerEntry } from '../types';

export function exportToPDF(
  type: 'trial-balance' | 'ledger',
  data: TrialBalanceEntry[] | LedgerEntry[],
  title: string
) {
  const doc = new jsPDF();
  doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 15);
  
  if (type === 'trial-balance') {
    const trialBalance = data as TrialBalanceEntry[];
    doc.autoTable({
      startY: 25,
      head: [[
        'Proje Kodu',
        'Proje Adı',
        'Açılış Borç',
        'Açılış Alacak',
        'Dönem Borç',
        'Dönem Alacak',
        'Kapanış Borç',
        'Kapanış Alacak'
      ]],
      body: trialBalance.map(entry => [
        entry.projectCode,
        entry.projectName,
        entry.openingDebit.toLocaleString('tr-TR'),
        entry.openingCredit.toLocaleString('tr-TR'),
        entry.periodDebit.toLocaleString('tr-TR'),
        entry.periodCredit.toLocaleString('tr-TR'),
        entry.closingDebit.toLocaleString('tr-TR'),
        entry.closingCredit.toLocaleString('tr-TR')
      ])
    });
  } else {
    const ledger = data as LedgerEntry[];
    doc.autoTable({
      startY: 25,
      head: [[
        'Tarih',
        'Açıklama',
        'Borç',
        'Alacak',
        'Bakiye',
        'Döviz'
      ]],
      body: ledger.map(entry => [
        entry.date,
        entry.description,
        entry.debit.toLocaleString('tr-TR'),
        entry.credit.toLocaleString('tr-TR'),
        entry.balance.toLocaleString('tr-TR'),
        entry.currency
      ])
    });
  }
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export function exportToExcel(
  type: 'trial-balance' | 'ledger',
  data: TrialBalanceEntry[] | LedgerEntry[],
  title: string
) {
  const wb = XLSX.utils.book_new();
  
  if (type === 'trial-balance') {
    const trialBalance = data as TrialBalanceEntry[];
    const ws = XLSX.utils.json_to_sheet(trialBalance.map(entry => ({
      'Proje Kodu': entry.projectCode,
      'Proje Adı': entry.projectName,
      'Açılış Borç': entry.openingDebit,
      'Açılış Alacak': entry.openingCredit,
      'Dönem Borç': entry.periodDebit,
      'Dönem Alacak': entry.periodCredit,
      'Kapanış Borç': entry.closingDebit,
      'Kapanış Alacak': entry.closingCredit
    })));
    XLSX.utils.book_append_sheet(wb, ws, 'Mizan');
  } else {
    const ledger = data as LedgerEntry[];
    const ws = XLSX.utils.json_to_sheet(ledger.map(entry => ({
      'Tarih': entry.date,
      'Açıklama': entry.description,
      'Borç': entry.debit,
      'Alacak': entry.credit,
      'Bakiye': entry.balance,
      'Döviz': entry.currency
    })));
    XLSX.utils.book_append_sheet(wb, ws, 'Muavin');
  }
  
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
}