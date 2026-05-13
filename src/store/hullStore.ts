import { create } from 'zustand';

interface HullState {
  beam: number;
  length: number;
  draft: number;
  bowSharpness: number;
  sternTaper: number;
  predictions: {
    drag_coefficient: number;
    wave_resistance: number;
    efficiency_score: number;
    top_speed_estimate: number;
  } | null;
  isPredicting: boolean;
  setParam: (param: keyof HullState, value: number) => void;
  updatePredictions: (preds: HullState['predictions']) => void;
  setPredicting: (val: boolean) => void;
}

export const useHullStore = create<HullState>((set) => ({
  beam: 10,
  length: 50,
  draft: 3,
  bowSharpness: 50,
  sternTaper: 30,
  predictions: null,
  isPredicting: false,
  setParam: (param, value) => set((state) => ({ ...state, [param]: value })),
  updatePredictions: (preds) => set({ predictions: preds, isPredicting: false }),
  setPredicting: (val) => set({ isPredicting: val })
}));
