import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Key, MapPin, History, Settings, Bell, Shield, Info } from 'lucide-react';
import ParkingFlow from './components/ParkingFlow';
import RetrievalFlow from './components/RetrievalFlow';
import HistoryView from './components/HistoryView';
import { AppStatus, HistoryRecord } from './types';

export default function App() {
  const [status, setStatus] = useState<AppStatus>('IDLE');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([
    {
      id: '1',
      type: 'PARK',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      location: 'Main Mall Entrance',
      spotId: 'A-12',
      coordinates: { x: 1, y: 1 }
    }
  ]);

  const handleParkingComplete = () => {
    const newRecord: HistoryRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'PARK',
      timestamp: new Date(),
      location: 'Main Mall Entrance',
      spotId: `B-${Math.floor(Math.random() * 50)}`,
      coordinates: { x: Math.floor(Math.random() * 6), y: Math.floor(Math.random() * 4) }
    };
    setHistory(prev => [newRecord, ...prev]);
    setStatus('IDLE');
    showNotification('Vehicle parked successfully!');
  };

  const handleRetrievalComplete = () => {
    const newRecord: HistoryRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'RETRIEVE',
      timestamp: new Date(),
      location: 'Main Mall Entrance',
      spotId: 'N/A',
      coordinates: { x: 5, y: 3 } // Exit zone
    };
    setHistory(prev => [newRecord, ...prev]);
    setStatus('IDLE');
    showNotification('Retrieval process finished.');
  };

  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Park4me</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-zinc-400 hover:text-zinc-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 pb-24">
        <AnimatePresence mode="wait">
          {status === 'IDLE' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Hero Card */}
              <div className="bg-zinc-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-zinc-200 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
                  <p className="text-zinc-400 mb-8">Ready to park or retrieve your vehicle?</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setStatus('PARKING')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white p-6 rounded-3xl flex flex-col items-center gap-3 transition-all active:scale-95"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Car className="w-6 h-6" />
                      </div>
                      <span className="font-bold">Park Car</span>
                    </button>
                    <button
                      onClick={() => setStatus('RETRIEVING')}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white p-6 rounded-3xl flex flex-col items-center gap-3 transition-all active:scale-95"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Key className="w-6 h-6" />
                      </div>
                      <span className="font-bold">Retrieve</span>
                    </button>
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 px-2">Current Status</h3>
                <div className="bg-white border border-zinc-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-bold">No Active Session</p>
                    <p className="text-sm text-zinc-500">System ready for new request</p>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm">
                  <Shield className="w-5 h-5 text-emerald-600 mb-3" />
                  <p className="text-sm font-bold">Safety First</p>
                  <p className="text-xs text-zinc-500 mt-1">Robotic precision parking</p>
                </div>
                <div className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm">
                  <Info className="w-5 h-5 text-blue-600 mb-3" />
                  <p className="text-sm font-bold">24/7 Support</p>
                  <p className="text-xs text-zinc-500 mt-1">Help is always available</p>
                </div>
              </div>
            </motion.div>
          ) : status === 'PARKING' ? (
            <motion.div
              key="parking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ParkingFlow 
                onComplete={handleParkingComplete} 
                onCancel={() => setStatus('IDLE')} 
              />
            </motion.div>
          ) : status === 'RETRIEVING' ? (
            <motion.div
              key="retrieving"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RetrievalFlow 
                onComplete={handleRetrievalComplete} 
                onCancel={() => setStatus('IDLE')} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <HistoryView 
                records={history} 
                onBack={() => setStatus('IDLE')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-100 pb-8 pt-4 z-50">
        <div className="max-w-md mx-auto px-8 flex justify-between items-center">
          <button 
            onClick={() => setStatus('IDLE')}
            className={`flex flex-col items-center gap-1 transition-colors ${status === 'IDLE' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Car className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => setStatus('HISTORY')}
            className={`flex flex-col items-center gap-1 transition-colors ${status === 'HISTORY' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors">
            <MapPin className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Zones</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors">
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-6 right-6 z-[60]"
          >
            <div className="bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md mx-auto">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-sm font-medium">{activeNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
