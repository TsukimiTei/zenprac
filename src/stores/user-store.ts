import { create } from 'zustand';
import { UserProfile, DailyStats, GrowthStage } from '@/types';

interface UserState {
  profile: UserProfile | null;
  dailyStats: DailyStats | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;

  setProfile: (profile: UserProfile | null) => void;
  setDailyStats: (stats: DailyStats) => void;
  setAuthenticated: (auth: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  incrementSession: (points: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  dailyStats: null,
  isAuthenticated: false,
  isOnboarded: false,

  setProfile: (profile) => set({ profile, isAuthenticated: !!profile }),
  setDailyStats: (stats) => set({ dailyStats: stats }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
  incrementSession: (points) =>
    set((state) => {
      if (!state.profile || !state.dailyStats) return state;
      return {
        profile: {
          ...state.profile,
          total_sessions: state.profile.total_sessions + 1,
          total_score: state.profile.total_score + points,
        },
        dailyStats: {
          sessions_today: state.dailyStats.sessions_today + 1,
          remaining: state.dailyStats.remaining - 1,
        },
      };
    }),
}));
