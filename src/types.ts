export type AppStatus = 'IDLE' | 'PARKING' | 'RETRIEVING' | 'HISTORY';

export interface AGVPosition {
  x: number;
  y: number;
  label?: string;
}

export interface HistoryRecord {
  id: string;
  type: 'PARK' | 'RETRIEVE';
  timestamp: Date;
  location: string;
  spotId: string;
  coordinates: { x: number; y: number };
}

export interface ParkingState {
  step: number;
  confirmations: {
    noOneInside: boolean;
    engineOff: boolean;
    wheelsStraight: boolean;
    peopleLeft: boolean;
  };
}

export interface RetrievalState {
  step: number;
  countdown: number;
}
