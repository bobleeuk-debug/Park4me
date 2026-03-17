import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Car, Bell, Key, LogOut, Loader2, CheckCircle, DoorOpen, Map as MapIcon } from 'lucide-react';
import ParkingMap from './ParkingMap';
import { AGVPosition } from '../types';

interface RetrievalFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  'Request Retrieval',
  'Wait for Robot',
  'Robot Delivering',
  'Ready to Pick Up',
  'Open Gate',
  'Detecting Departure',
  'Flow Complete'
];

export default function RetrievalFlow({ onComplete, onCancel }: RetrievalFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [agvPos, setAgvPos] = useState<AGVPosition>({ x: 0, y: 0, label: 'Robot' });

  // Mock AGV Movement
  useEffect(() => {
    if (currentStep === 2) {
      const interval = setInterval(() => {
        setAgvPos(prev => {
          // Move AGV towards (5, 3) which is the exit zone in our mock
          const targetX = 5;
          const targetY = 3;
          let nextX = prev.x;
          let nextY = prev.y;

          if (nextX < targetX) nextX += 0.2;
          if (nextY < targetY) nextY += 0.2;

          return { ...prev, x: nextX, y: nextY };
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 1 && countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      if (countdown <= 110) setCurrentStep(2); // Simulate robot starting delivery
      return () => clearInterval(timer);
    }
  }, [currentStep, countdown]);

  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(() => setCurrentStep(3), 8000);
      return () => clearTimeout(timer);
    }
    if (currentStep === 5) {
      // Simulate departure detection
      const timer = setTimeout(() => setCurrentStep(6), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-black/5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Retrieval Process</h2>
        <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600">Cancel</button>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((_, idx) => (
          <div key={idx} className="relative z-10">
            {idx <= currentStep ? (
              <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-zinc-200 border-4 border-white shadow-sm" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <Key className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Request Your Vehicle</h3>
              <p className="text-zinc-500">The robot will bring your car to the pickup zone.</p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors"
            >
              Retrieve Car
            </button>
          </motion.div>
        )}

        {(currentStep === 1 || currentStep === 2) && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-zinc-50 rounded-3xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{formatTime(countdown)}</div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Estimated Wait Time</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <MapIcon className="w-4 h-4" /> Live Tracking
                </h3>
                <span className="text-[10px] font-bold text-blue-600 animate-pulse">LIVE</span>
              </div>
              <ParkingMap agvPos={agvPos} className="bg-white border-zinc-100" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">
                {currentStep === 1 ? 'Preparing Retrieval' : 'Robot Delivering'}
              </h3>
              <p className="text-sm text-zinc-500">Your vehicle is being moved to the pickup zone.</p>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6 text-center py-4"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-10 h-10 text-emerald-600 animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Retrieval Complete</h3>
              <p className="text-zinc-500">Your vehicle is ready in the pickup zone.</p>
            </div>
            <button
              onClick={() => setCurrentStep(4)}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Open Gate
            </button>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center py-4"
          >
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
              <DoorOpen className="w-10 h-10 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Gate Opening</h3>
              <p className="text-zinc-500">Please drive your vehicle out of the pickup zone safely.</p>
            </div>
            <button
              onClick={() => setCurrentStep(5)}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors"
            >
              I've Started Driving
            </button>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center py-8"
          >
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-zinc-100 rounded-full"
              />
              <LogOut className="w-10 h-10 text-zinc-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Detecting Departure</h3>
              <p className="text-zinc-500">System is confirming the zone is clear...</p>
            </div>
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-8"
          >
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Service Complete</h3>
              <p className="text-zinc-500">Thank you for using Park4me. Have a safe drive!</p>
            </div>
            <button
              onClick={onComplete}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors"
            >
              Finish
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400 uppercase tracking-widest font-semibold">
        <span>Park4me System</span>
        <span>Step {currentStep + 1} of 7</span>
      </div>
    </div>
  );
}
