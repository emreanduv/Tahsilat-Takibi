// Tek Düzen Hesap Planı
export const accounts = [
  // 1 DÖNEN VARLIKLAR
  { code: '100', name: 'KASA', type: 'asset' },
  { code: '101', name: 'ALINAN ÇEKLER', type: 'asset' },
  { code: '102', name: 'BANKALAR', type: 'asset' },
  { code: '103', name: 'VERİLEN ÇEKLER VE ÖDEME EMİRLERİ (-)', type: 'asset' },
  { code: '120', name: 'ALICILAR', type: 'asset' },
  { code: '121', name: 'ALACAK SENETLERİ', type: 'asset' },
  { code: '126', name: 'VERİLEN DEPOZİTO VE TEMİNATLAR', type: 'asset' },
  { code: '131', name: 'ORTAKLARDAN ALACAKLAR', type: 'asset' },
  { code: '136', name: 'DİĞER ÇEŞİTLİ ALACAKLAR', type: 'asset' },
  { code: '153', name: 'TİCARİ MALLAR', type: 'asset' },
  { code: '181', name: 'GELİR TAHAKKUKLARI', type: 'asset' },

  // 2 DURAN VARLIKLAR
  { code: '253', name: 'TESİS, MAKİNE VE CİHAZLAR', type: 'asset' },
  { code: '254', name: 'TAŞITLAR', type: 'asset' },
  { code: '255', name: 'DEMİRBAŞLAR', type: 'asset' },
  { code: '257', name: 'BİRİKMİŞ AMORTİSMANLAR (-)', type: 'asset' },
  
  // 3 KISA VADELİ YABANCI KAYNAKLAR
  { code: '300', name: 'BANKA KREDİLERİ', type: 'liability' },
  { code: '320', name: 'SATICILAR', type: 'liability' },
  { code: '321', name: 'BORÇ SENETLERİ', type: 'liability' },
  { code: '331', name: 'ORTAKLARA BORÇLAR', type: 'liability' },
  { code: '335', name: 'PERSONELE BORÇLAR', type: 'liability' },
  { code: '360', name: 'ÖDENECEK VERGİ VE FONLAR', type: 'liability' },
  { code: '361', name: 'ÖDENECEK SOSYAL GÜVENLİK KESİNTİLERİ', type: 'liability' },
  
  // 4 UZUN VADELİ YABANCI KAYNAKLAR
  { code: '400', name: 'BANKA KREDİLERİ', type: 'liability' },
  
  // 5 ÖZKAYNAKLAR
  { code: '500', name: 'SERMAYE', type: 'equity' },
  { code: '590', name: 'DÖNEM NET KARI', type: 'equity' },
  { code: '591', name: 'DÖNEM NET ZARARI (-)', type: 'equity' },
  
  // 6 GELİR TABLOSU HESAPLARI
  { code: '600', name: 'YURTİÇİ SATIŞLAR', type: 'income' },
  { code: '601', name: 'YURTDIŞI SATIŞLAR', type: 'income' },
  { code: '602', name: 'DİĞER GELİRLER', type: 'income' },
  
  // 7 MALİYET HESAPLARI
  { code: '760', name: 'PAZARLAMA SATIŞ VE DAĞITIM GİDERLERİ', type: 'expense' },
  { code: '770', name: 'GENEL YÖNETİM GİDERLERİ', type: 'expense' },
  { code: '780', name: 'FİNANSMAN GİDERLERİ', type: 'expense' },

  // 9 NAZIM HESAPLAR
  { code: '900', name: 'TEMİNAT MEKTUPLARI', type: 'memo' },
  { code: '901', name: 'ALINAN TEMİNAT MEKTUPLARI', type: 'memo' },
  { code: '902', name: 'VERİLEN TEMİNAT MEKTUPLARI', type: 'memo' },
  { code: '903', name: 'ALINAN TEMİNATLAR', type: 'memo' },
  { code: '904', name: 'VERİLEN TEMİNATLAR', type: 'memo' },
  { code: '905', name: 'İPOTEKLER', type: 'memo' },
  { code: '906', name: 'ALINAN İPOTEKLER', type: 'memo' },
  { code: '907', name: 'VERİLEN İPOTEKLER', type: 'memo' },
  { code: '910', name: 'ŞİRKET GARANTİLERİ', type: 'memo' },
  { code: '911', name: 'ALINAN ŞİRKET GARANTİLERİ', type: 'memo' },
  { code: '912', name: 'VERİLEN ŞİRKET GARANTİLERİ', type: 'memo' }
] as const;