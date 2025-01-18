import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Trash2, Calculator, BookOpen, FileSpreadsheet } from 'lucide-react';
import { Project, Transaction, TrialBalanceEntry, LedgerEntry } from './types';
import { calculateTrialBalance, generateLedger } from './utils/accounting';
import { TrialBalance } from './components/TrialBalance';
import { Ledger } from './components/Ledger';
import { fetchExchangeRates } from './utils/currency';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    code: '',
    name: '',
    client: '',
    startDate: '',
    endDate: '',
    totalAmount: 0,
    currency: 'TRY'
  });

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    projectId: '',
    date: '',
    description: '',
    amount: 0,
    currency: 'TRY',
    exchangeRate: 1,
    tryEquivalent: 0,
    type: 'collection'
  });

  // States for reports
  const [showTrialBalance, setShowTrialBalance] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [reportDateRange, setReportDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const loadExchangeRates = async () => {
      const rates = await fetchExchangeRates();
      const ratesMap = rates.reduce((acc, rate) => ({
        ...acc,
        [rate.code]: rate.rate
      }), {});
      setExchangeRates(ratesMap);
    };
    
    loadExchangeRates();
  }, []);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    setProjects(prev => [...prev, { ...newProject, id: crypto.randomUUID() }]);
    setNewProject({
      code: '',
      name: '',
      client: '',
      startDate: '',
      endDate: '',
      totalAmount: 0,
      currency: 'TRY'
    });
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const tryEquivalent = newTransaction.currency === 'TRY' ? 
      newTransaction.amount : 
      newTransaction.amount * (exchangeRates[newTransaction.currency] || newTransaction.exchangeRate);
    
    setTransactions(prev => [...prev, {
      ...newTransaction,
      id: crypto.randomUUID(),
      tryEquivalent
    }]);
    
    setNewTransaction({
      projectId: '',
      date: '',
      description: '',
      amount: 0,
      currency: 'TRY',
      exchangeRate: 1,
      tryEquivalent: 0,
      type: 'collection'
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    setTransactions(transactions.filter(transaction => transaction.projectId !== id));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const trialBalanceEntries = showTrialBalance && reportDateRange.startDate && reportDateRange.endDate
    ? calculateTrialBalance(transactions, projects, reportDateRange.startDate, reportDateRange.endDate)
    : [];

  const ledgerEntries = showLedger && selectedProject && reportDateRange.startDate && reportDateRange.endDate
    ? generateLedger(transactions, selectedProject, reportDateRange.startDate, reportDateRange.endDate)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tahsilat Takip Sistemi</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowTrialBalance(!showTrialBalance)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Mizan
            </button>
            <button
              onClick={() => setShowLedger(!showLedger)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Muavin
            </button>
          </div>
        </div>

        {(showTrialBalance || showLedger) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Rapor Kriterleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={reportDateRange.startDate}
                  onChange={e => setReportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={reportDateRange.endDate}
                  onChange={e => setReportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {showLedger && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proje
                  </label>
                  <select
                    value={selectedProject}
                    onChange={e => setSelectedProject(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.code} - {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {showTrialBalance && trialBalanceEntries.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Mizan</h2>
            <TrialBalance entries={trialBalanceEntries} />
          </div>
        )}

        {showLedger && ledgerEntries.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Muavin</h2>
            <Ledger
              entries={ledgerEntries}
              projectId={selectedProject}
              projectName={projects.find(p => p.id === selectedProject)?.name || ''}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Yeni Proje
          </h2>
          
          <form onSubmit={handleAddProject} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proje Kodu
                </label>
                <input
                  type="text"
                  required
                  value={newProject.code}
                  onChange={e => setNewProject(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proje Adı
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={e => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri
                </label>
                <input
                  type="text"
                  required
                  value={newProject.client}
                  onChange={e => setNewProject(prev => ({ ...prev, client: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  required
                  value={newProject.startDate}
                  onChange={e => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  required
                  value={newProject.endDate}
                  onChange={e => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proje Tutarı
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newProject.totalAmount}
                    onChange={e => setNewProject(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <select
                    value={newProject.currency}
                    onChange={e => setNewProject(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Kaydet
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Yeni Tahsilat/Ödeme
          </h2>
          
          <form onSubmit={handleAddTransaction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proje
                </label>
                <select
                  required
                  value={newTransaction.projectId}
                  onChange={e => {
                    const project = projects.find(p => p.id === e.target.value);
                    setNewTransaction(prev => ({
                      ...prev,
                      projectId: e.target.value,
                      currency: project?.currency || 'TRY'
                    }));
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.code} - {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih
                </label>
                <input
                  type="date"
                  required
                  value={newTransaction.date}
                  onChange={e => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İşlem Tipi
                </label>
                <select
                  required
                  value={newTransaction.type}
                  onChange={e => setNewTransaction(prev => ({ ...prev, type: e.target.value as 'collection' | 'payment' }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="collection">Tahsilat</option>
                  <option value="payment">Ödeme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <input
                  type="text"
                  required
                  value={newTransaction.description}
                  onChange={e => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tutar
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={e => setNewTransaction(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <select
                    value={newTransaction.currency}
                    onChange={e => {
                      const currency = e.target.value;
                      setNewTransaction(prev => ({
                        ...prev,
                        currency,
                        exchangeRate: currency === 'TRY' ? 1 : (exchangeRates[currency] || 1)
                      }));
                    }}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kur
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={newTransaction.exchangeRate}
                  onChange={e => setNewTransaction(prev => ({
                    ...prev,
                    exchangeRate: parseFloat(e.target.value) || 1
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Kaydet
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Projeler
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proje Kodu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proje Adı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlangıç</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bitiş</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Proje Tutarı</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Döviz</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map(project => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{project.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{project.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{project.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{project.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{project.endDate}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      {project.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">{project.currency}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Henüz proje bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
          <h2 className="text-xl font-semibold p-6 border-b flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Tahsilat ve Ödemeler
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proje</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem Tipi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Döviz</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kur</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">TL Karşılığı</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(transaction => {
                  const project = projects.find(p => p.id === transaction.projectId);
                  return (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{project?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {transaction.type === 'collection' ? 'Tahsilat' : 'Ödeme'}
                      </td>
                      <td className="px-6 py-4 text-sm">{transaction.description}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        {transaction.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">{transaction.currency}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        {transaction.exchangeRate.toLocaleString('tr-TR', { minimumFractionDigits: 4 })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        {transaction.tryEquivalent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      Henüz tahsilat veya ödeme bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;