import React, { useState, useEffect } from 'react';
import { ScanFace, MapPin, ArrowRight, ShieldCheck, Fingerprint, CreditCard, CheckCircle2, Globe, ScanLine, Loader2, RefreshCw, Camera } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 States
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Step 2 States
  const [fxAmount, setFxAmount] = useState(100);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [cardLinked, setCardLinked] = useState(false);

  // FX Constants
  const RATE = 129.50;
  const BANK_RATE = 124.00; // Worse rate for comparison

  const handleScanPassport = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      // Simulate location prompt success
      setTimeout(() => setLocationEnabled(true), 500);
    }, 2500);
  };

  const handleLinkCard = () => {
    setCardLinked(true);
    // Auto-enable biometrics for UX flow
    setTimeout(() => setBiometricsEnabled(true), 500);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-safari-500 rounded-b-[3rem] opacity-10"></div>
        
        <div className="w-full flex justify-end pt-4">
           <div className="flex gap-1">
             <div className="w-8 h-1 bg-safari-500 rounded-full"></div>
             <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm space-y-8 z-10">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Travel Identity</h1>
            <p className="text-gray-400">Scan your passport to create an instant, verified travel wallet.</p>
          </div>

          <div className="relative w-64 h-80 bg-gray-800 rounded-3xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
            {isScanning ? (
              <>
                 <div className="absolute inset-0 bg-safari-500/10 animate-pulse"></div>
                 <div className="w-full h-1 bg-safari-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                 <ScanLine className="w-16 h-16 text-safari-500 animate-pulse mb-4" />
                 <p className="text-safari-500 font-mono text-xs">SCANNING ID...</p>
              </>
            ) : scanComplete ? (
              <div className="flex flex-col items-center animate-scale-up">
                 <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                 </div>
                 <p className="font-bold text-lg">Verified</p>
                 <p className="text-xs text-gray-400">Alex Doe • USA</p>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-50">
                <ScanFace className="w-20 h-20 text-gray-400 mb-4" />
                <p className="text-xs uppercase tracking-widest text-gray-500">Align Face & ID</p>
              </div>
            )}
            
            {/* Live Camera View Simulation */}
            {!scanComplete && (
               <div className="absolute bottom-4 right-4">
                  <Camera className="w-6 h-6 text-gray-500" />
               </div>
            )}
          </div>

          <div className="w-full space-y-3">
             {scanComplete ? (
               <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-3 border border-gray-700 animate-fade-in">
                  <div className={`p-2 rounded-full ${locationEnabled ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Location Access</p>
                    <p className="text-xs text-gray-400">{locationEnabled ? 'Granted' : 'Required for compliance'}</p>
                  </div>
                  {locationEnabled && <CheckCircle2 className="w-5 h-5 text-green-500" />}
               </div>
             ) : (
               <button 
                 onClick={handleScanPassport}
                 className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
               >
                 <ScanLine className="w-5 h-5" /> Scan Passport
               </button>
             )}
          </div>
        </div>

        {scanComplete && locationEnabled && (
          <button 
            onClick={() => setStep(2)}
            className="w-full max-w-sm py-4 bg-safari-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-safari-500/20 animate-slide-up"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        )}
        
        {/* Style for scan animation */}
        <style>{`
          @keyframes scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-between p-6">
      <div className="w-full flex justify-end pt-4">
           <div className="flex gap-1">
             <div className="w-2 h-1 bg-gray-300 rounded-full"></div>
             <div className="w-8 h-1 bg-safari-500 rounded-full"></div>
           </div>
        </div>

      <div className="flex-1 flex flex-col w-full max-w-sm pt-10 pb-6">
         <h1 className="text-3xl font-bold mb-2">Setup Wallet</h1>
         <p className="text-gray-500 mb-8">Link a funding source and enable secure biometric payments.</p>

         {/* Card Link Section */}
         <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-8 relative overflow-hidden">
            {!cardLinked ? (
              <div className="text-center py-6">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8" />
                 </div>
                 <h3 className="font-bold text-lg mb-2">Add Payment Method</h3>
                 <p className="text-sm text-gray-500 mb-6">Visa, Mastercard, or Apple Pay</p>
                 <button 
                   onClick={handleLinkCard}
                   className="w-full py-3 border-2 border-gray-900 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all"
                 >
                   Link Card securely
                 </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3">
                       <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                         <CreditCard className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="font-bold text-gray-900">Visa Preferred</p>
                         <p className="text-xs text-gray-500">•••• 4242</p>
                       </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                 </div>
                 
                 <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                       <Fingerprint className={`w-6 h-6 ${biometricsEnabled ? 'text-safari-600' : 'text-gray-400'}`} />
                       <div>
                         <p className="text-sm font-bold">FaceID / TouchID</p>
                         <p className="text-[10px] text-gray-500">For secure payments</p>
                       </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${biometricsEnabled ? 'bg-safari-500' : 'bg-gray-300'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${biometricsEnabled ? 'translate-x-4' : ''}`}></div>
                    </div>
                 </div>
              </div>
            )}
         </div>

         {/* FX Preview Slider */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold flex items-center gap-2">
                 <RefreshCw className="w-4 h-4 text-gray-400" /> FX Preview
               </h3>
               <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Live Rate</span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-3xl font-bold text-gray-900">${fxAmount}</span>
                 <ArrowRight className="w-6 h-6 text-gray-300 mb-1" />
                 <span className="text-3xl font-bold text-safari-600">{(fxAmount * RATE).toLocaleString()} <span className="text-sm text-gray-500 font-medium">KES</span></span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="1000" 
                step="10"
                value={fxAmount}
                onChange={(e) => setFxAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-safari-500"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-sm">
               <span className="text-gray-500">Airport Exchange</span>
               <span className="text-gray-400 line-through">{(fxAmount * BANK_RATE).toLocaleString()} KES</span>
            </div>
            <p className="text-center text-xs text-green-600 mt-2 font-medium">
               You get +{((fxAmount * RATE) - (fxAmount * BANK_RATE)).toLocaleString()} KES more with FoTI
            </p>
         </div>
      </div>

      <button 
        onClick={onComplete}
        disabled={!cardLinked}
        className="w-full max-w-sm py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        Go to Dashboard
      </button>
    </div>
  );
};