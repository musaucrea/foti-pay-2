export interface Merchant {
  id: string;
  name: string;
  category: string;
  rating: number;
  isVerified: boolean; // FoTI Verified
  isEco: boolean; // Sustainability Badge
  location: string;
  imageUrl: string;
  accepts: ('MPESA' | 'CARD' | 'QR' | 'WALLET')[];
  culturalTip?: string; // e.g. "Tipping is appreciated but not mandatory"
}

export interface Transaction {
  id: string;
  merchantName: string;
  merchantCategory: string;
  amountLocal: number;
  currencyLocal: string;
  amountHome: number;
  currencyHome: string;
  date: string;
  hasMemory: boolean; // Is a photo/note attached?
  status: 'COMPLETED' | 'PENDING' | 'QUEUED_OFFLINE';
  roundUpAmount?: number;
}

export enum AppTab {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  WALLET = 'WALLET',
  GUIDE = 'GUIDE'
}

export interface FxRate {
  pair: string;
  rate: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}