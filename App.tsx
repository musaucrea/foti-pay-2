import React, { useState } from 'react';
import { 
  Home, 
  Map as MapIcon, 
  Wallet, 
  Sparkles, 
  ScanLine, 
  Bell, 
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Navigation,
  Leaf,
  Wifi,
  WifiOff,
  AlertTriangle,
  Smartphone,
  CreditCard,
  Plus
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { AppTab, Merchant } from './types';
import { PaymentModal } from './components/PaymentModal';
import { AiTravelGuide } from './components/AiTravelGuide';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ExploreMap } from './components/ExploreMap';

// Mock Data
const RECENT_TRANSACTIONS = [
  { id: '1', name: 'Java House', amount: 12.50, date: 'Today, 10:30 AM', category: 'Food' },
  { id: '2', name: 'Maasai Market', amount: 45.00, date: 'Yesterday', category: 'Shopping' },
  { id: '3', name: 'Uber Trip', amount: 8.20, date: 'Yesterday', category: 'Transport' },
];

const SPEND_DATA = [
  { day: 'Mon', spend: 20 },
  { day: 'Tue', spend: 45 },
  { day: 'Wed', spend: 30 },
  { day: 'Thu', spend: 85 },
  { day: 'Fri', spend: 50 },
  { day: 'Sat', spend: 120 },
  { day: 'Sun', spend: 90 },
];

const NEARBY_MERCHANTS: Merchant[] = [
  { 
    id: 'm1', 
    name: 'Kosewe Ranalo Foods', 
    category: 'Local Cuisine', 
    rating: 4.7, 
    isVerified: true, 
    isEco: false,
    location: '0.2km • CBD', 
    imageUrl: 'https://picsum.photos/100/100?random=1', 
    accepts: ['MPESA'],
    culturalTip: "It's polite to wash hands at the table sink before eating." 
  },
  { 
    id: 'm2', 
    name: 'City Market Stall #4', 
    category: 'Art & Crafts', 
    rating: 4.5, 
    isVerified: true, 
    isEco: true,
    location: '0.5km • Market', 
    imageUrl: 'https://picsum.photos/100/100?random=2', 
    accepts: ['QR'],
    culturalTip: "Bargaining is expected here. Start at 60% of the price."
  },
  { 
    id: 'm3', 
    name: 'Nairobi National Museum', 
    category: 'Attraction', 
    rating: 4.9, 
    isVerified: true, 
    isEco: true,
    location: '1.2km • Westlands', 
    imageUrl: 'https://picsum.photos/100/100?random=3', 
    accepts: ['CARD', 'MPESA'] 
  },
];

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  
  // Payment States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentMerchant, setSelectedPaymentMerchant] = useState<Merchant | null>(null);

  // App States
  const [balance, setBalance] = useState(842.50);
  const [isOffline, setIsOffline] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);

  const handlePaymentSuccess = (amount: number, merchant: Merchant) => {
    setBalance(prev => prev - amount);
    // Reset selection after success
    setSelectedPaymentMerchant(null);
  };

  const handleOpenPayment = (merchant?: Merchant) => {
    if (merchant) {
      setSelectedPaymentMerchant(merchant);
    } else {
      setSelectedPaymentMerchant(null);
    }
    setIsPaymentOpen(true);
  };

  const handleClosePayment = () => {
    setIsPaymentOpen(false);
    setSelectedPaymentMerchant(null);
  }

  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={() => setHasOnboarded(true)} />;
  }

  const renderHome = () => (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-sm relative overflow-hidden transition-all">
        {isOffline && (
           <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-xs py-1 text-center font-bold z-20">
             OFFLINE MODE ACTIVE • Transactions will queue
           </div>
        )}
        <div className="absolute top-0 right-0 p-10 opacity-10">
           <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="#F59E0B"/>
           </svg>
        </div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <p className="text-gray-500 text-sm font-medium">Karibu, Alex 👋</p>
            <div className="flex items-center gap-2 mt-1">
              <Navigation className="w-4 h-4 text-safari-600" />
              <h1 className="text-2xl font-bold text-gray-900">Nairobi, KE</h1>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {/* Offline Toggle Simulation */}
            <button 
              onClick={() => setIsOffline(!isOffline)}
              className={`p-2 rounded-full transition-colors ${isOffline ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-green-600'}`}
              title="Toggle Simulation Mode"
            >
              {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </button>

            <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors relative">
               <Bell className="w-6 h-6 text-gray-600" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
               <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                 <img src="https://picsum.photos/50/50" alt="Profile" />
               </div>
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl shadow-gray-200 relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-safari-500 rounded-full blur-3xl opacity-20"></div>
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Travel Wallet</p>
                 <h2 className="text-4xl font-bold mt-1">${balance.toFixed(2)}</h2>
               </div>
               <div className="bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
                 <p className="text-xs text-safari-400 font-mono">1 USD = 129.5 KES</p>
               </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setActiveTab(AppTab.WALLET)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                   <Wallet className="w-4 h-4" /> Top Up
                </button>
                <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2" onClick={() => handleOpenPayment()}>
                   <ScanLine className="w-4 h-4" /> Pay Now
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* Discovery Section */}
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-900">Verified Nearby</h3>
          <button onClick={() => { setActiveTab(AppTab.EXPLORE); setShowFullMap(true); }} className="text-safari-600 text-sm font-semibold hover:underline">See Map</button>
        </div>

        <div className="space-y-4">
          {NEARBY_MERCHANTS.map((merchant) => (
            <div key={merchant.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOpenPayment()}>
               <img src={merchant.imageUrl} className="w-16 h-16 rounded-xl object-cover" alt={merchant.name} />
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900">{merchant.name}</h4>
                    <div className="flex gap-1">
                       {merchant.isEco && <Leaf className="w-4 h-4 text-green-500" fill="currentColor" />}
                       {merchant.isVerified && <ShieldCheck className="w-4 h-4 text-trust-500" />}
                    </div>
                 </div>
                 <p className="text-xs text-gray-500 mt-1">{merchant.category} • {merchant.location}</p>
                 <div className="flex gap-2 mt-2">
                   {merchant.accepts.includes('MPESA') && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">M-Pesa</span>}
                   {merchant.accepts.includes('CARD') && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">Card</span>}
                   {merchant.isEco && <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-200">Eco-Friendly</span>}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6">
         <h3 className="font-bold text-lg text-gray-900 mb-4">Recent</h3>
         <div className="space-y-0">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {tx.category === 'Food' ? '🍔' : tx.category === 'Shopping' ? '🛍️' : '🚕'}
                      </span>
                   </div>
                   <div>
                     <p className="font-medium text-gray-900">{tx.name}</p>
                     <p className="text-xs text-gray-500">{tx.date}</p>
                   </div>
                 </div>
                 <span className="font-bold text-gray-900">-${tx.amount.toFixed(2)}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="p-6 pb-24 animate-fade-in">
       <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Spending Insights</h1>
          <button className="flex items-center gap-1 text-xs font-bold bg-red-50 text-red-600 px-3 py-2 rounded-full border border-red-100 hover:bg-red-100 transition-colors">
            <AlertTriangle className="w-4 h-4" /> Help / Dispute
          </button>
       </div>
       
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
         <div className="flex justify-between items-center mb-6">
           <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Total Spent</p>
              <h3 className="text-3xl font-bold text-gray-900">$345.20</h3>
           </div>
           <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">Saved via FoTI</p>
              <p className="text-lg font-bold text-trust-500 flex items-center justify-end gap-1">
                 <ArrowUpRight className="w-4 h-4" /> $12.40
              </p>
           </div>
         </div>
         
         <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={SPEND_DATA}>
               <defs>
                 <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                 cursor={{ stroke: '#e5e7eb' }}
               />
               <Area type="monotone" dataKey="spend" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
             </AreaChart>
           </ResponsiveContainer>
         </div>
       </div>

       {/* Multi-Rail Connections Section */}
       <div className="mb-6">
         <h3 className="font-bold text-lg mb-3">Connected Rails</h3>
         <div className="space-y-3">
            {/* Connected Rail 1: M-Pesa */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                     <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">M-Pesa (Kenya)</h4>
                     <p className="text-xs text-gray-500">Connected • +254 7... 901</p>
                  </div>
               </div>
               <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">Active</span>
            </div>

             {/* Connected Rail 2: Visa */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                     <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">Visa (Global)</h4>
                     <p className="text-xs text-gray-500">Connected • •••• 4242</p>
                  </div>
               </div>
               <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">Active</span>
            </div>
            
            {/* Add New Rail */}
             <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-gray-500 font-medium hover:border-safari-400 hover:text-safari-600 transition-colors">
                <Plus className="w-4 h-4" /> Connect Airtel / Telebirr
             </button>
         </div>
       </div>

       <h3 className="font-bold text-lg mb-4">Travel Memories</h3>
       <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden group">
             <img src="https://picsum.photos/400/400?random=10" alt="Memory" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                <p className="text-white font-bold text-sm">Giraffe Centre</p>
                <p className="text-white/80 text-xs">Tuesday • $15.00</p>
             </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden group">
             <img src="https://picsum.photos/400/400?random=11" alt="Memory" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                <p className="text-white font-bold text-sm">Carnivore</p>
                <p className="text-white/80 text-xs">Monday • $45.00</p>
             </div>
          </div>
       </div>
    </div>
  );

  const renderExplore = () => {
    // If Full Map Mode is active, show the interactive map
    if (showFullMap) {
      return (
        <ExploreMap 
          onClose={() => setShowFullMap(false)}
          onPayMerchant={(merchant) => handleOpenPayment(merchant)}
        />
      );
    }

    // Default Explore View
    return (
      <div className="h-full relative bg-gray-100 flex flex-col items-center justify-center text-center px-6">
        <MapIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Interactive Map</h2>
        <p className="text-gray-500 text-sm mt-2">Discover merchant density, safety zones, and cultural hotspots.</p>
        <button 
          onClick={() => setShowFullMap(true)}
          className="mt-6 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Launch Full Map
        </button>
        <div className="absolute bottom-24 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-gray-600 border border-white/50 shadow-lg">
            📍 12 Verified Merchants within 500m
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden sm:rounded-[3rem] sm:my-8 sm:h-[90vh] sm:border-[8px] sm:border-gray-900">
      
      {/* Dynamic Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 relative">
        {activeTab === AppTab.HOME && renderHome()}
        {activeTab === AppTab.WALLET && renderWallet()}
        {activeTab === AppTab.EXPLORE && renderExplore()}
        {activeTab === AppTab.GUIDE && <AiTravelGuide />}
      </main>

      {/* Sticky Bottom Navigation (Hidden when Full Map is active) */}
      {!showFullMap && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 pb-8 sm:pb-6 z-40">
          <div className="flex justify-between items-center">
            <NavIcon icon={<Home />} label="Home" active={activeTab === AppTab.HOME} onClick={() => setActiveTab(AppTab.HOME)} />
            <NavIcon icon={<MapIcon />} label="Explore" active={activeTab === AppTab.EXPLORE} onClick={() => setActiveTab(AppTab.EXPLORE)} />
            
            {/* Floating Pay Button (Central) */}
            <div className="relative -top-8">
              <button 
                onClick={() => handleOpenPayment()}
                className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg shadow-gray-900/40 hover:scale-105 transition-transform border-4 border-gray-50"
              >
                <ScanLine className="w-7 h-7" />
              </button>
            </div>

            <NavIcon icon={<Wallet />} label="Wallet" active={activeTab === AppTab.WALLET} onClick={() => setActiveTab(AppTab.WALLET)} />
            <NavIcon icon={<Sparkles />} label="Guide" active={activeTab === AppTab.GUIDE} onClick={() => setActiveTab(AppTab.GUIDE)} />
          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={handleClosePayment} 
        onSuccess={handlePaymentSuccess}
        isOffline={isOffline}
        initialMerchant={selectedPaymentMerchant}
      />
    </div>
  );
}

const NavIcon = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-safari-600' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);