import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, ArrowUpRight, ArrowDownLeft, ChevronRight, Clock } from 'lucide-react';
import { HistoryRecord } from '../types';
import ParkingMap from './ParkingMap';

interface HistoryViewProps {
  records: HistoryRecord[];
  onBack: () => void;
}

export default function HistoryView({ records, onBack }: HistoryViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(records[0]?.id || null);
  const selectedRecord = records.find(r => r.id === selectedId);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold">Activity History</h2>
        <button onClick={onBack} className="text-sm font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest">Close</button>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-100">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-zinc-300" />
          </div>
          <p className="text-zinc-500 font-medium">No records found yet.</p>
        </div>
      ) : (
        <>
          {/* Map Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Spot Visualization</h3>
              {selectedRecord && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  Spot {selectedRecord.spotId}
                </span>
              )}
            </div>
            <ParkingMap highlightSpot={selectedRecord?.coordinates} />
          </div>

          {/* Records List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 px-2">Recent Events</h3>
            <div className="space-y-3">
              {records.map((record) => (
                <button
                  key={record.id}
                  onClick={() => setSelectedId(record.id)}
                  className={`w-full text-left p-4 rounded-3xl border transition-all ${
                    selectedId === record.id
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                      : 'bg-white border-zinc-100 text-zinc-900 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      selectedId === record.id ? 'bg-white/10' : 'bg-zinc-50'
                    }`}>
                      {record.type === 'PARK' ? (
                        <ArrowDownLeft className={`w-5 h-5 ${selectedId === record.id ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      ) : (
                        <ArrowUpRight className={`w-5 h-5 ${selectedId === record.id ? 'text-blue-400' : 'text-blue-600'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-bold truncate">{record.type === 'PARK' ? 'Parking' : 'Retrieval'}</p>
                        <p className={`text-[10px] font-medium ${selectedId === record.id ? 'text-zinc-400' : 'text-zinc-400'}`}>
                          {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs opacity-70">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {record.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {record.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-30 ${selectedId === record.id ? 'text-white' : 'text-zinc-900'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
