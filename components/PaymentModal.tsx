import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, RefreshCw, Smartphone, CreditCard, ScanLine, Leaf, Info, WifiOff, CloudOff } from 'lucide-react';
import { Merchant } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, merchant: Merchant) => void;
  isOffline: boolean;
}

// Mock Merchant Data for the "Scan" result
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

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, isOffline }) => {
  const [step, setStep] = useState<'SCAN' | 'AMOUNT' | 'PROCESSING' | 'SUCCESS'>('SCAN');
  const [amount, setAmount] = useState<string>('');
  const [roundUp, setRoundUp] = useState(false);
  
  // FX Simulation
  const EXCHANGE_RATE = 129.50; // USD to KES
  
  // Calculations
  const rawAmount = parseFloat(amount) || 0;
  const roundUpCents = rawAmount > 0 ? (Math.ceil(rawAmount) - rawAmount) : 0;
  const finalRoundUp = roundUp ? roundUpCents : 0;
  const totalPay = rawAmount + finalRoundUp;
  
  const localAmount = (rawAmount * EXCHANGE_RATE).toFixed(2);

  useEffect(() => {
    if (isOpen) {
      setStep('SCAN');
      setAmount('');
      setRoundUp(false);
    }
  }, [isOpen]);

  const handleScanSimulate = () => {
    // Simulate QR code detection delay
    setTimeout(() => {
      setStep('AMOUNT');
    }, 1500);
  };

  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
    }, 2000);
  };

  const handleClose = () => {
    if (step === 'SUCCESS') {
      onSuccess(totalPay, MOCK_SCANNED_MERCHANT);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden min-h-[60vh] flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             {step === 'SCAN' ? 'Scan to Pay' : 'Secure Payment'}
             {step !== 'SCAN' && <ShieldCheck className="w-4 h-4 text-trust-500" />}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col p-6 relative overflow-y-auto no-scrollbar">
          
          {/* STEP 1: SCANNER */}
          {step === 'SCAN' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="relative w-64 h-64 bg-gray-900 rounded-3xl overflow-hidden shadow-inner border-4 border-safari-400 cursor-pointer group" onClick={handleScanSimulate}>
                <img src="https://picsum.photos/600/600?grayscale" alt="Camera Feed" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="w-16 h-16 text-white animate-pulse" />
                </div>
                {isOffline && (
                   <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                     <WifiOff className="w-3 h-3" /> Offline Mode
                   </div>
                )}
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-medium">
                  Tap to simulate scan
                </div>
              </div>
              <p className="text-gray-500 text-sm text-center">
                Scan QR, Till Number, or Paybill.<br/>
                <span className="text-xs text-gray-400">Works with M-Pesa, Airtel, & Visa</span>
              </p>
            </div>
          )}

          {/* STEP 2: AMOUNT & TRANSPARENCY */}
          {step === 'AMOUNT' && (
            <div className="space-y-6 animate-fade-in pb-4">
              {/* Merchant Card */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <img src={MOCK_SCANNED_MERCHANT.imageUrl} alt="Merchant" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1">
                    {MOCK_SCANNED_MERCHANT.name}
                    {MOCK_SCANNED_MERCHANT.isVerified && <ShieldCheck className="w-4 h-4 text-trust-500" fill="currentColor" />}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">{MOCK_SCANNED_MERCHANT.location}</p>
                    {MOCK_SCANNED_MERCHANT.isEco && (
                      <span className="flex items-center gap-0.5 text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full font-medium">
                        <Leaf className="w-3 h-3" /> Eco
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cultural Tip (Tourism Intelligence) */}
              {MOCK_SCANNED_MERCHANT.culturalTip && (
                <div className="flex gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                   <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                   <p className="text-xs text-blue-800 leading-relaxed">{MOCK_SCANNED_MERCHANT.culturalTip}</p>
                </div>
              )}

              {/* Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Enter Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 text-3xl font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-safari-500 focus:ring-0 outline-none transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* FX & Transparency Widget */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Payment Breakdown</span>
                    <span className="text-[10px] text-trust-700 bg-trust-50 px-2 py-0.5 rounded-full border border-trust-100">Best Rate Guarantee</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Merchant Gets (KES)</span>
                    <span className="font-bold text-gray-900">{parseFloat(localAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">FX Rate <RefreshCw className="w-3 h-3 text-gray-400"/></span>
                    <span className="font-mono text-gray-700">1 USD = {EXCHANGE_RATE} KES</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">FoTI Platform Fee</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  
                  {/* Round Up Feature */}
                  {rawAmount > 0 && roundUpCents > 0 && (
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <label className="flex items-center justify-between cursor-pointer group">
                         <div className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${roundUp ? 'bg-safari-500 border-safari-500' : 'border-gray-300'}`}>
                              {roundUp && <div className="w-2 h-2 bg-white rounded-full" />}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-gray-800">Round up for Conservation</p>
                             <p className="text-[10px] text-gray-500">Support local wildlife trust (+${roundUpCents.toFixed(2)})</p>
                           </div>
                         </div>
                         <input type="checkbox" className="hidden" checked={roundUp} onChange={() => setRoundUp(!roundUp)} />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Card</span>
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-safari-500 bg-safari-50 rounded-xl text-safari-900">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm font-bold">Wallet / M-Pesa</span>
                 </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === 'PROCESSING' && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 border-4 border-safari-100 border-t-safari-500 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-700">{isOffline ? 'Queuing Transaction...' : 'Securing Payment...'}</p>
              <p className="text-sm text-gray-400">Verifying with {MOCK_SCANNED_MERCHANT.name}</p>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-scale-up text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${isOffline ? 'bg-orange-100' : 'bg-trust-50'}`}>
                {isOffline ? <CloudOff className="w-10 h-10 text-orange-500" /> : <CheckCircle2 className="w-12 h-12 text-trust-500" />}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{isOffline ? 'Payment Queued' : 'Payment Complete'}</h3>
                <p className="text-gray-500">{isOffline ? 'Will sync when online' : 'Receipt sent to email'}</p>
              </div>
              
              <div className="bg-gray-50 w-full p-4 rounded-xl border border-dashed border-gray-300">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-bold">${totalPay.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Merchant Rec'd</span>
                  <span className="font-bold">KES {parseFloat(localAmount).toLocaleString()}</span>
                </div>
                {roundUp && (
                   <div className="flex justify-between text-sm text-safari-700 bg-safari-50 p-2 rounded">
                    <span>Wildlife Donation</span>
                    <span className="font-bold">+${roundUpCents.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="bg-amber-100 p-4 rounded-xl w-full text-left">
                <p className="text-xs font-bold text-amber-800 uppercase mb-1">Travel Memory</p>
                <p className="text-sm text-amber-900">Would you like to attach a photo to this transaction?</p>
                <div className="flex gap-2 mt-3">
                   <button className="text-xs bg-white py-2 px-3 rounded shadow-sm font-medium hover:bg-amber-50">Add Photo</button>
                   <button className="text-xs py-2 px-3 font-medium text-amber-800" onClick={handleClose}>Skip</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'AMOUNT' && (
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handlePay}
              disabled={!amount}
              className="w-full py-4 bg-safari-500 hover:bg-safari-600 text-white font-bold rounded-xl shadow-lg shadow-safari-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              Pay ${totalPay.toFixed(2)}
            </button>
          </div>
        )}
        
        {step === 'SUCCESS' && (
           <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleClose}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};