import { Transaction, Project, TrialBalanceEntry, LedgerEntry } from '../types';

export function calculateTrialBalance(
  transactions: Transaction[],
  projects: Project[],
  startDate: string,
  endDate: string
): TrialBalanceEntry[] {
  const trialBalance: TrialBalanceEntry[] = projects.map(project => ({
    projectCode: project.code,
    projectName: project.name,
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
    tryClosingCredit: 0
  }));

  // Calculate opening balances (before start date)
  transactions
    .filter(t => t.date < startDate)
    .forEach(transaction => {
      const tbEntry = trialBalance.find(tb => {
        const project = projects.find(p => p.id === transaction.projectId);
        return project && tb.projectCode === project.code;
      });
      
      if (tbEntry) {
        if (transaction.type === 'collection') {
          tbEntry.openingCredit += transaction.amount;
          tbEntry.tryOpeningCredit += transaction.tryEquivalent;
        } else {
          tbEntry.openingDebit += transaction.amount;
          tbEntry.tryOpeningDebit += transaction.tryEquivalent;
        }
      }
    });

  // Calculate period movements
  transactions
    .filter(t => t.date >= startDate && t.date <= endDate)
    .forEach(transaction => {
      const tbEntry = trialBalance.find(tb => {
        const project = projects.find(p => p.id === transaction.projectId);
        return project && tb.projectCode === project.code;
      });
      
      if (tbEntry) {
        if (transaction.type === 'collection') {
          tbEntry.periodCredit += transaction.amount;
          tbEntry.tryPeriodCredit += transaction.tryEquivalent;
        } else {
          tbEntry.periodDebit += transaction.amount;
          tbEntry.tryPeriodDebit += transaction.tryEquivalent;
        }
      }
    });

  // Calculate closing balances
  trialBalance.forEach(entry => {
    entry.closingDebit = entry.openingDebit + entry.periodDebit;
    entry.closingCredit = entry.openingCredit + entry.periodCredit;
    entry.tryClosingDebit = entry.tryOpeningDebit + entry.tryPeriodDebit;
    entry.tryClosingCredit = entry.tryOpeningCredit + entry.tryPeriodCredit;
  });

  return trialBalance;
}

export function generateLedger(
  transactions: Transaction[],
  projectId: string,
  startDate: string,
  endDate: string
): LedgerEntry[] {
  const ledger: LedgerEntry[] = [];
  let balance = 0;
  let tryBalance = 0;

  // Add opening balance entry if there are transactions before start date
  const openingTransactions = transactions.filter(t => t.projectId === projectId && t.date < startDate);
  if (openingTransactions.length > 0) {
    let openingDebit = 0;
    let openingCredit = 0;
    let tryOpeningDebit = 0;
    let tryOpeningCredit = 0;

    openingTransactions.forEach(transaction => {
      if (transaction.type === 'payment') {
        openingDebit += transaction.amount;
        tryOpeningDebit += transaction.tryEquivalent;
      } else {
        openingCredit += transaction.amount;
        tryOpeningCredit += transaction.tryEquivalent;
      }
    });

    balance = openingDebit - openingCredit;
    tryBalance = tryOpeningDebit - tryOpeningCredit;

    ledger.push({
      date: startDate,
      description: 'Açılış Bakiyesi',
      debit: openingDebit,
      credit: openingCredit,
      balance,
      currency: 'TRY',
      tryEquivalent: {
        debit: tryOpeningDebit,
        credit: tryOpeningCredit,
        balance: tryBalance
      }
    });
  }

  // Add period transactions
  transactions
    .filter(t => t.projectId === projectId && t.date >= startDate && t.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(transaction => {
      if (transaction.type === 'payment') {
        balance += transaction.amount;
        tryBalance += transaction.tryEquivalent;
        ledger.push({
          date: transaction.date,
          description: transaction.description,
          debit: transaction.amount,
          credit: 0,
          balance,
          currency: transaction.currency,
          tryEquivalent: {
            debit: transaction.tryEquivalent,
            credit: 0,
            balance: tryBalance
          }
        });
      } else {
        balance -= transaction.amount;
        tryBalance -= transaction.tryEquivalent;
        ledger.push({
          date: transaction.date,
          description: transaction.description,
          debit: 0,
          credit: transaction.amount,
          balance,
          currency: transaction.currency,
          tryEquivalent: {
            debit: 0,
            credit: transaction.tryEquivalent,
            balance: tryBalance
          }
        });
      }
    });

  return ledger;
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}