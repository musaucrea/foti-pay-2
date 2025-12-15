import React, { useState, useEffect } from 'react';
import { X, Search, Filter, MapPin, Navigation, Star, ShieldCheck, Leaf, ArrowRight, Car, Bike, CheckCircle2, MessageSquare } from 'lucide-react';
import { Merchant } from '../types';

interface ExploreMapProps {
  onClose: () => void;
  onPayMerchant: (merchant: Merchant) => void;
}

// Simulated Merchant Data for Map
const MAP_MERCHANTS: Merchant[] = [
  { 
    id: 'm1', name: 'Kosewe Ranalo', category: 'Local Cuisine', rating: 4.7, 
    isVerified: true, isEco: false, location: 'CBD', 
    imageUrl: 'https://picsum.photos/100/100?random=1', accepts: ['MPESA'],
    culturalTip: "Wash hands at the sink before eating." 
  },
  { 
    id: 'm2', name: 'City Market #4', category: 'Shopping', rating: 4.5, 
    isVerified: true, isEco: true, location: 'Market St', 
    imageUrl: 'https://picsum.photos/100/100?random=2', accepts: ['QR'],
    culturalTip: "Bargaining is expected."
  },
  { 
    id: 'm3', name: 'National Museum', category: 'Attraction', rating: 4.9, 
    isVerified: true, isEco: true, location: 'Museum Hill', 
    imageUrl: 'https://picsum.photos/100/100?random=3', accepts: ['CARD'] 
  },
  {
    id: 'm4', name: 'Java House', category: 'Cafe', rating: 4.4,
    isVerified: true, isEco: false, location: 'Kimathi St',
    imageUrl: 'https://picsum.photos/100/100?random=4', accepts: ['MPESA', 'CARD']
  },
  {
    id: 'm5', name: 'Maasai Market', category: 'Shopping', rating: 4.6,
    isVerified: false, isEco: true, location: 'Supreme Court',
    imageUrl: 'https://picsum.photos/100/100?random=5', accepts: ['MPESA']
  }
];

// Ride Options Configuration
const RIDE_OPTIONS = [
  { id: 'uber', name: 'UberX', price: 4.50, time: '4 min', icon: Car, color: 'text-gray-900', bg: 'bg-gray-100' },
  { id: 'boda', name: 'Boda Boda', price: 1.20, time: '2 min', icon: Bike, color: 'text-orange-600', bg: 'bg-orange-50' }, // Motorbike
  { id: 'tuk', name: 'TukTuk', price: 2.00, time: '6 min', icon: Car, color: 'text-yellow-600', bg: 'bg-yellow-50' }, // 3-wheeler
];

// Random positions for demo (top/left %)
const POSITIONS = [
  { top: '40%', left: '30%' },
  { top: '55%', left: '60%' },
  { top: '25%', left: '70%' },
  { top: '65%', left: '25%' },
  { top: '35%', left: '50%' }
];

export const ExploreMap: React.FC<ExploreMapProps> = ({ onClose, onPayMerchant }) => {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Ride Booking State
  const [rideStep, setRideStep] = useState<'IDLE' | 'SELECT' | 'ARRIVING'>('IDLE');
  const [selectedRideId, setSelectedRideId] = useState<string>('uber');

  // Reset ride state when merchant selection changes
  useEffect(() => {
    if (selectedMerchant) {
        setRideStep('IDLE');
        setSelectedRideId('uber');
    }
  }, [selectedMerchant]);

  const handleBookRide = () => {
    setRideStep('ARRIVING');
  };

  const filteredMerchants = activeFilter === 'All' 
    ? MAP_MERCHANTS 
    : MAP_MERCHANTS.filter(m => m.category.includes(activeFilter) || (activeFilter === 'Eco' && m.isEco));

  return (
    <div className="absolute inset-0 bg-gray-100 z-50 flex flex-col h-full animate-fade-in">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-12 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-2 items-center mb-4">
          <div className="flex-1 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
             <Search className="w-4 h-4 text-gray-500" />
             <input type="text" placeholder="Search places..." className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
          <button onClick={onClose} className="p-2 bg-white/90 rounded-full shadow-lg">
             <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Food', 'Shopping', 'Eco'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition-all ${
                activeFilter === filter 
                ? 'bg-safari-500 text-white border-safari-500 shadow-md' 
                : 'bg-white/80 text-gray-800 border-white/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden bg-[#e5e7eb] cursor-grab active:cursor-grabbing">
         {/* Simulated Map Background */}
         <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle, #9ca3af 1px, transparent 1px)',
            backgroundSize: '20px 20px'
         }}></div>
         
         {/* Map Elements (Roads/Rivers simulation) */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <path d="M-10 100 Q 150 300 400 200 T 800 500" fill="none" stroke="white" strokeWidth="20" />
            <path d="M200 -10 Q 250 200 100 600" fill="none" stroke="white" strokeWidth="15" />
            <circle cx="70%" cy="30%" r="50" fill="#bfdbfe" />
         </svg>

         {/* Pins */}
         {filteredMerchants.map((merchant, idx) => {
            const pos = POSITIONS[idx % POSITIONS.length];
            const isSelected = selectedMerchant?.id === merchant.id;
            
            return (
              <button
                key={merchant.id}
                onClick={() => setSelectedMerchant(merchant)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSelected ? 'z-10 scale-125' : 'z-0 hover:scale-110'}`}
                style={{ top: pos.top, left: pos.left }}
              >
                 <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                        merchant.isEco ? 'bg-green-500 border-white' : 'bg-safari-500 border-white'
                    }`}>
                       {merchant.category === 'Shopping' ? '🛍️' : merchant.category === 'Attraction' ? '🏛️' : '🍴'}
                    </div>
                    {/* Pin Tip */}
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${merchant.isEco ? 'bg-green-500' : 'bg-safari-500'}`}></div>
                 </div>
              </button>
            );
         })}

         {/* User Location */}
         <div className="absolute bottom-32 right-4 p-3 bg-white rounded-full shadow-xl z-10">
            <Navigation className="w-5 h-5 text-blue-500 fill-current" />
         </div>
      </div>

      {/* Merchant Details Sheet */}
      {selectedMerchant && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-5 z-20 animate-slide-up max-h-[60vh] overflow-y-auto no-scrollbar">
           <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
           
           {/* RIDE STATUS: DRIVER ARRIVING */}
           {rideStep === 'ARRIVING' ? (
               <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-lg text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Driver Arriving
                     </h3>
                     <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">KDA 420X</span>
                  </div>
                  
                  {/* Driver Card */}
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                     <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://picsum.photos/100/100?random=driver" className="w-full h-full object-cover" alt="Driver" />
                     </div>
                     <div>
                        <p className="font-bold text-gray-900">Kevin M.</p>
                        <p className="text-xs text-gray-500">Toyota Vitz • White</p>
                        <div className="flex items-center gap-1 mt-1">
                           <Star className="w-3 h-3 text-yellow-500 fill-current" />
                           <span className="text-xs font-bold text-gray-700">4.9</span>
                        </div>
                     </div>
                     <div className="ml-auto text-right">
                        <p className="font-bold text-lg text-gray-900">2 min</p>
                        <p className="text-xs text-gray-500">away</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-2">
                      <button className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Message
                      </button>
                      <button onClick={() => setRideStep('IDLE')} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100">Cancel</button>
                  </div>
               </div>
           ) : (
             <>
               {/* MERCHANT INFO & RIDE SELECTION */}
               <div className="flex gap-4 mb-4">
                  <img src={selectedMerchant.imageUrl} alt={selectedMerchant.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{selectedMerchant.name}</h3>
                        <button onClick={() => setSelectedMerchant(null)}><X className="w-5 h-5 text-gray-400" /></button>
                     </div>
                     <p className="text-gray-500 text-sm mb-1">{selectedMerchant.category} • {selectedMerchant.location}</p>
                     <div className="flex items-center gap-2">
                        <div className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                           <Star className="w-3 h-3 mr-0.5 fill-current" /> {selectedMerchant.rating}
                        </div>
                        {selectedMerchant.isVerified && <ShieldCheck className="w-4 h-4 text-trust-500" />}
                        {selectedMerchant.isEco && <Leaf className="w-4 h-4 text-green-500" />}
                     </div>
                  </div>
               </div>
               
               {/* Ride Selection List */}
               {rideStep === 'SELECT' ? (
                 <div className="animate-fade-in mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">Select Ride</p>
                        <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">Uber</span>
                    </div>
                    <div className="space-y-2">
                       {RIDE_OPTIONS.map(ride => (
                          <div 
                            key={ride.id} 
                            onClick={() => setSelectedRideId(ride.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                selectedRideId === ride.id ? 'border-safari-500 bg-safari-50' : 'border-gray-100 hover:bg-gray-50'
                            }`}
                          >
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ride.bg} ${ride.color}`}>
                                   <ride.icon className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="font-bold text-sm text-gray-900">{ride.name}</p>
                                   <p className="text-xs text-gray-500">{ride.time} away</p>
                                </div>
                             </div>
                             <span className="font-bold text-gray-900">${ride.price.toFixed(2)}</span>
                          </div>
                       ))}
                    </div>
                 </div>
               ) : (
                  // Cultural Tip (Hidden during ride selection to save space)
                  selectedMerchant.culturalTip && (
                     <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-800 mb-4 flex gap-2">
                        <span className="font-bold">💡 Tip:</span> {selectedMerchant.culturalTip}
                     </div>
                   )
               )}

               {/* Action Buttons */}
               <div className="flex gap-3">
                  {rideStep === 'SELECT' ? (
                      <>
                        <button onClick={() => setRideStep('IDLE')} className="py-3 px-4 bg-gray-100 font-bold text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">Back</button>
                        <button 
                            onClick={handleBookRide}
                            className="flex-1 py-3 bg-black text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                            Confirm Ride
                        </button>
                      </>
                  ) : (
                      <>
                        <button 
                            onClick={() => setRideStep('SELECT')} 
                            className="flex-1 py-3 bg-gray-100 font-bold text-gray-900 rounded-xl flex items-center justify-center gap-2 group hover:bg-white hover:border-gray-300 hover:shadow-sm border border-transparent transition-all"
                        >
                           <Car className="w-4 h-4 text-gray-500 group-hover:text-gray-900" /> Ride There
                        </button>
                        <button 
                            onClick={() => onPayMerchant(selectedMerchant)}
                            className="flex-[2] py-3 bg-safari-500 hover:bg-safari-600 text-white font-bold rounded-xl shadow-lg shadow-safari-500/20 flex items-center justify-center gap-2 transition-colors"
                        >
                            Pay Now <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                  )}
               </div>
             </>
           )}
        </div>
      )}

    </div>
  );
};