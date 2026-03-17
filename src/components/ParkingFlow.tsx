import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Car, ShieldCheck, DoorClosed, Loader2, CheckCircle } from 'lucide-react';

interface ParkingFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  'Enter Pickup Zone',
  'Safety Confirmation',
  'Confirm Parking',
  'Closing Gate',
  'Robot Handling',
  'Parking Complete'
];

export default function ParkingFlow({ onComplete, onCancel }: ParkingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmations, setConfirmations] = useState({
    noOneInside: false,
    engineOff: false,
    wheelsStraight: false,
    peopleLeft: false,
  });

  const allConfirmed = Object.values(confirmations).every(v => v);

  useEffect(() => {
    if (currentStep === 3) {
      // Simulate gate closing
      const timer = setTimeout(() => setCurrentStep(4), 3000);
      return () => clearTimeout(timer);
    }
    if (currentStep === 4) {
      // Simulate robot handling
      const timer = setTimeout(() => setCurrentStep(5), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleConfirm = (key: keyof typeof confirmations) => {
    setConfirmations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-black/5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Parking Process</h2>
        <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600">Cancel</button>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((_, idx) => (
          <div key={idx} className="relative z-10">
            {idx <= currentStep ? (
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
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
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <Car className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Drive into Pickup Zone</h3>
              <p className="text-zinc-500">Please position your vehicle within the designated area.</p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors"
            >
              I'm in the Zone
            </button>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">Safety Checklist</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'noOneInside', label: 'No one inside the vehicle' },
                { key: 'engineOff', label: 'Engine is turned off' },
                { key: 'wheelsStraight', label: 'Wheels are straight' },
                { key: 'peopleLeft', label: 'Everyone has left the zone' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleConfirm(item.key as keyof typeof confirmations)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    confirmations[item.key as keyof typeof confirmations]
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-zinc-50 border-zinc-100 text-zinc-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {confirmations[item.key as keyof typeof confirmations] ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300" />
                  )}
                </button>
              ))}
            </div>
            <button
              disabled={!allConfirmed}
              onClick={() => setCurrentStep(2)}
              className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                allConfirmed 
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              Confirm Status
            </button>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center"
          >
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
              <Car className="w-10 h-10 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to Park?</h3>
              <p className="text-zinc-500">The system will now take over and park your vehicle automatically.</p>
            </div>
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Confirm Parking
            </button>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center py-8"
          >
            <div className="relative w-24 h-24 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-zinc-100 border-t-emerald-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <DoorClosed className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Closing Gate</h3>
              <p className="text-zinc-500">Securing the pickup zone for the robot...</p>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center py-8"
          >
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-100 rounded-full"
              />
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin relative z-10" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Robot Handling</h3>
              <p className="text-zinc-500">The robot is moving your vehicle to the assigned spot.</p>
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-8"
          >
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Parking Successful</h3>
              <p className="text-zinc-500">Your vehicle has been safely parked. You can now leave the area.</p>
            </div>
            <button
              onClick={onComplete}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400 uppercase tracking-widest font-semibold">
        <span>Park4me System</span>
        <span>Step {currentStep + 1} of 6</span>
      </div>
    </div>
  );
}
