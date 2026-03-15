import { create } from 'zustand';
import { API_CONFIG } from '../constants/api';

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  displayDate: string;
  location: string;
  price: string;
  organizer: string;
  image: string;
  description: string;
  ticketUrl: string;
}

interface EventState {
  events: AppEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: false,
  error: null,
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.EVENTS);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        set({ events: data, isLoading: false });
    } catch (err: any) {
        set({ error: err.message, isLoading: false });
        console.error('Event Fetch Error:', err);
    }
  },
}));
