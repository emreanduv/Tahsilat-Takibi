export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  tryEquivalent: number;
  type: 'collection' | 'payment';
}

export interface TrialBalanceEntry {
  projectCode: string;
  projectName: string;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
  tryOpeningDebit: number;
  tryOpeningCredit: number;
  tryPeriodDebit: number;
  tryPeriodCredit: number;
  tryClosingDebit: number;
  tryClosingCredit: number;
}

export interface LedgerEntry {
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  currency: string;
  tryEquivalent: {
    debit: number;
    credit: number;
    balance: number;
  };
}