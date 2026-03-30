import { create } from 'zustand';
import { ChatMessage, MasterType, SessionMode, EnlightenmentLevel, HiddenEval } from '@/types';

interface SessionState {
  // Current session
  sessionId: string | null;
  masterType: MasterType | null;
  mode: SessionMode | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSessionComplete: boolean;
  finalLevel: EnlightenmentLevel | null;

  // Voice
  isVoiceMode: boolean;
  isRecording: boolean;
  isSpeaking: boolean;

  // Actions
  setSession: (id: string, master: MasterType, mode: SessionMode) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  completeSession: (level: EnlightenmentLevel) => void;
  setVoiceMode: (enabled: boolean) => void;
  setRecording: (recording: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  masterType: null,
  mode: null,
  messages: [],
  isLoading: false,
  isSessionComplete: false,
  finalLevel: null,
  isVoiceMode: false,
  isRecording: false,
  isSpeaking: false,

  setSession: (id, master, mode) =>
    set({ sessionId: id, masterType: master, mode, messages: [], isSessionComplete: false, finalLevel: null }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (loading) => set({ isLoading: loading }),

  completeSession: (level) =>
    set({ isSessionComplete: true, finalLevel: level }),

  setVoiceMode: (enabled) => set({ isVoiceMode: enabled }),
  setRecording: (recording) => set({ isRecording: recording }),
  setSpeaking: (speaking) => set({ isSpeaking: speaking }),

  reset: () =>
    set({
      sessionId: null,
      masterType: null,
      mode: null,
      messages: [],
      isLoading: false,
      isSessionComplete: false,
      finalLevel: null,
      isVoiceMode: false,
      isRecording: false,
      isSpeaking: false,
    }),
}));
