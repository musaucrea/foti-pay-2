import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, RefreshCw, Smartphone, CreditCard, ScanLine, Leaf, Info, WifiOff, CloudOff, Globe, Wallet as WalletIcon, Loader2, Database, Zap } from 'lucide-react';
import { Merchant } from '../types.ts';
import { initiateMpesaStkPush, checkTransactionStatus } from '../services/paymentService.ts';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, merchant: Merchant) => void;
  isOffline: boolean;
  initialMerchant?: Merchant | null;
}

const MOCK_SCANNED_MERCHANT: Merchant = {
  id: 'm-123',
  name: "Mama Oliech's Fish Kitchen",
  category: "Dining",
  rating: 4.8,
  isVerified: true,
  isEco: true,
  location: "Dagoretti North, Nairobi",
  imageUrl: "https://picsum.photos/100/100",
  accepts: ['MPESA', 'QR', 'CARD'],
  culturalTip: "💡 Tip: 10% is customary here for good service."
};

const PAYMENT_RAILS = [
  { id: 'mpesa', name: 'M-Pesa', type: 'LOCAL', color: 'bg-green-600', textColor: 'text-white', sub: 'Safaricom Daraja' },
  { id: 'airtel', name: 'Airtel Money', type: 'LOCAL', color: 'bg-red-600', textColor: 'text-white', sub: 'Airtel' },
  { id: 'card', name: 'Visa / MC', type: 'GLOBAL', color: 'bg-indigo-900', textColor: 'text-white', sub: ' via Stripe' },
];

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, isOffline, initialMerchant }) => {
  const [step, setStep] = useState<'SCAN' | 'AMOUNT' | 'PROCESSING' | 'SUCCESS'>('SCAN');
  const [amount, setAmount] = useState<string>('');
  const [roundUp, setRoundUp] = useState(false);
  const [selectedRail, setSelectedRail] = useState<string>('mpesa');
  const [isStkWaiting, setIsStkWaiting] = useState(false);
  
  const activeMerchant = initialMerchant || MOCK_SCANNED_MERCHANT;
  const EXCHANGE_RATE = 129.50;
  const rawAmount = parseFloat(amount) || 0;
  const roundUpCents = rawAmount > 0 ? (Math.ceil(rawAmount) - rawAmount) : 0;
  const finalRoundUp = roundUp ? roundUpCents : 0;
  const totalPay = rawAmount + finalRoundUp;
  const localAmount = (rawAmount * EXCHANGE_RATE).toFixed(2);

  useEffect(() => {
    if (isOpen) {
      setStep(initialMerchant ? 'AMOUNT' : 'SCAN');
      setAmount('');
      setRoundUp(false);
      setSelectedRail('mpesa');
      setIsStkWaiting(false);
    }
  }, [isOpen, initialMerchant]);

  const handlePay = async () => {
    setStep('PROCESSING');
    
    if (selectedRail === 'mpesa' && !isOffline) {
      setIsStkWaiting(true);
      try {
        const response = await initiateMpesaStkPush({
          amount: parseFloat(localAmount),
          phoneNumber: "254712345678", // In real app, get from user profile
          merchantId: activeMerchant.id,
          currency: 'KES'
        });
        
        const status = await checkTransactionStatus(response.checkoutRequestId);
        if (status === 'SUCCESS') {
          setStep('SUCCESS');
        }
      } catch (error) {
        console.error("Payment failed", error);
        setStep('AMOUNT');
      } finally {
        setIsStkWaiting(false);
      }
    } else {
      // Offline or non-Mpesa simulation
      setTimeout(() => setStep('SUCCESS'), 2000);
    }
  };

  const handleClose = () => {
    if (step === 'SUCCESS') onSuccess(totalPay, activeMerchant);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden min-h-[70vh] flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             {step === 'SCAN' ? 'Scan to Pay' : 'Secure Payment'}
             {step !== 'SCAN' && <ShieldCheck className="w-4 h-4 text-trust-500" />}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          
          {/* Offline Mode Indicator Banner */}
          {isOffline && step === 'AMOUNT' && (
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-start gap-3 animate-fade-in">
              <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Offline Queue Enabled</p>
                <p className="text-[11px] text-amber-700 leading-tight">Your transaction will be securely encrypted and synced automatically once a connection is restored.</p>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {step === 'SCAN' && (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="relative w-64 h-64 bg-gray-900 rounded-3xl overflow-hidden shadow-inner border-4 border-safari-400 cursor-pointer" onClick={() => setStep('AMOUNT')}>
                  <img src="https://picsum.photos/600/600?grayscale" className="w-full h-full object-cover opacity-50" alt="Camera Feed" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="w-16 h-16 text-white animate-pulse" />
                  </div>
                  {isOffline && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-bold shadow-lg">
                      <Database className="w-3 h-3" /> Offline Scan
                    </div>
                  )}
                </div>
                <div className="text-center">
                   <p className="text-gray-900 font-bold">Point at QR Code</p>
                   <p className="text-gray-500 text-sm">Works with all local merchant codes</p>
                </div>
              </div>
            )}

            {step === 'AMOUNT' && (
              <div className="space-y-6 animate-fade-in">
                {/* Enhanced Merchant Card */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="relative">
                    <img src={activeMerchant.imageUrl} className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm" alt={activeMerchant.name} />
                    {isOffline && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm border border-white" title="Details Verified Offline">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 leading-none">{activeMerchant.name}</h3>
                      {isOffline && (
                        <span className="text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">Verified Offline</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{activeMerchant.location}</p>
                    <div className="flex gap-2 mt-2">
                       <span className="flex items-center gap-0.5 text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                         <Zap className="w-2.5 h-2.5 text-safari-500" /> Instant Pay
                       </span>
                    </div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Amount in USD</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-5 text-4xl font-black text-gray-900 bg-white border-2 border-gray-100 rounded-2xl focus:border-safari-500 focus:ring-4 focus:ring-safari-500/10 outline-none transition-all" 
                      autoFocus 
                    />
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Local Settlement (KES)</span>
                      <span className="font-bold text-gray-900">{parseFloat(localAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        Guaranteed Rate <Info className="w-3 h-3 text-gray-300" />
                      </span>
                      <span className="font-mono text-xs font-bold text-gray-700">1 USD = {EXCHANGE_RATE} KES</span>
                    </div>
                  </div>
                </div>

                {/* Rails */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Rail</label>
                  <div className="grid grid-cols-1 gap-2">
                    {PAYMENT_RAILS.map((rail) => (
                      <button 
                        key={rail.id} 
                        onClick={() => setSelectedRail(rail.id)} 
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          selectedRail === rail.id 
                            ? 'border-safari-500 bg-safari-50 shadow-sm' 
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${rail.color} ${rail.textColor}`}>
                            {rail.id === 'mpesa' ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-900">{rail.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-medium">{rail.sub}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedRail === rail.id ? 'border-safari-500 bg-safari-500' : 'border-gray-200'}`}>
                           {selectedRail === rail.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'PROCESSING' && (
              <div className="flex flex-col items-center justify-center h-full min-h-[40vh] space-y-6 text-center">
                {isStkWaiting ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <div className="w-20 h-20 bg-safari-50 rounded-full flex items-center justify-center mb-6">
                      <Smartphone className="w-10 h-10 text-safari-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Pushing STK Request</h3>
                    <p className="text-sm text-gray-500 max-w-[220px] mx-auto mt-2">Check your phone to enter the M-Pesa PIN for {activeMerchant.name}</p>
                    <div className="mt-8 flex gap-2">
                      <div className="w-2.5 h-2.5 bg-safari-500 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-safari-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2.5 h-2.5 bg-safari-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                       {isOffline ? (
                         <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                           <Database className="w-10 h-10 text-amber-500" />
                         </div>
                       ) : (
                         <Loader2 className="w-16 h-16 text-safari-500 animate-spin mb-6" />
                       )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isOffline ? 'Encrypting & Queuing' : 'Securing Transaction'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-[240px]">
                      {isOffline 
                        ? 'Creating a secure offline ledger entry on your device.' 
                        : 'Settling with merchant bank via the travel grid.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="flex flex-col items-center justify-center h-full min-h-[40vh] space-y-6 animate-scale-up text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-2 shadow-inner border-4 border-white ${isOffline ? 'bg-amber-100' : 'bg-trust-50'}`}>
                  {isOffline ? <CloudOff className="w-12 h-12 text-amber-500" /> : <CheckCircle2 className="w-12 h-12 text-trust-500" />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {isOffline ? 'Payment Queued' : 'Payment Complete'}
                  </h3>
                  <p className="text-gray-500 font-medium">
                    {isOffline ? 'Locked in local vault' : 'Settled successfully'}
                  </p>
                </div>

                {isOffline && (
                  <div className="bg-amber-50 px-4 py-2 rounded-full border border-amber-100 flex items-center gap-2">
                     <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                     <span className="text-[11px] font-bold text-amber-700 uppercase tracking-tight">Syncing when online</span>
                  </div>
                )}

                <div className="bg-gray-50 w-full p-5 rounded-2xl border border-dashed border-gray-200">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-500 font-medium">Amount Paid</span>
                    <span className="font-bold text-gray-900 text-lg">${totalPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-200/50">
                    <span className="text-gray-500 font-medium">Local Reciept</span>
                    <span className="font-mono text-xs font-bold text-gray-700">
                      {isOffline ? 'OFFLINE_REF_831' : 'DAR_REF_X92J0P'}
                    </span>
                  </div>
                </div>

                {!isOffline && (
                  <div className="flex items-center gap-2 text-trust-700 bg-trust-50 px-3 py-1.5 rounded-full text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Blockchain Secured
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {(step === 'AMOUNT' || step === 'SUCCESS') && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <button 
              onClick={step === 'AMOUNT' ? handlePay : handleClose} 
              disabled={step === 'AMOUNT' && !amount} 
              className={`w-full py-4 font-bold rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                step === 'AMOUNT' 
                  ? 'bg-safari-500 text-white shadow-safari-500/20 hover:bg-safari-600' 
                  : 'bg-gray-900 text-white shadow-gray-900/20'
              }`}
            >
              {step === 'AMOUNT' ? (
                <>Pay ${totalPay.toFixed(2)} {isOffline && <Database className="w-4 h-4 ml-1" />}</>
              ) : (
                'Close Receipt'
              )}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};