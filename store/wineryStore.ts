import { create } from 'zustand';
import { API_CONFIG } from '../constants/api';

export interface Winery {
  id: string;
  name: string;
  region: string;
  igpId: 'codru' | 'stefan-voda' | 'valul-lui-traian' | 'divin';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  longDescription?: string;
  terroir: string;
  topWines: string[];
  imageUrl: string;
  logoUrl?: string;
  rating: number;
  websiteUrl: string;
  bookingUrl: string;
  contactInfo?: {
      phone: string;
      email: string;
  };
}

interface WineryState {
  wineries: Winery[];
  isLoading: boolean;
  error: string | null;
  selectedWinery: Winery | null;
  setSelectedWinery: (winery: Winery | null) => void;
  fetchWineries: () => Promise<void>;
}

export const useWineryStore = create<WineryState>((set) => ({
  wineries: [],
  isLoading: false,
  error: null,
  selectedWinery: null,
  setSelectedWinery: (winery) => set({ selectedWinery: winery }),
  fetchWineries: async () => {
    set({ isLoading: true, error: null });
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.WINERIES);
        if (!response.ok) throw new Error('Failed to fetch wineries');
        const data = await response.json();
        set({ wineries: data, isLoading: false });
    } catch (err: any) {
        set({ error: err.message, isLoading: false });
        console.error('Winery Fetch Error:', err);
    }
  },
}));
