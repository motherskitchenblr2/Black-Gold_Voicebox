import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AIProvider {
  id: string;
  name: string;
  type: 'llm' | 'embedding' | 'image' | 'audio';
  apiKey: string;
  isActive: boolean;
  models: string[];
  selectedModel: string;
  baseUrl?: string;
  rateLimit?: number;
  usageStats: {
    requestsToday: number;
    tokensUsed: number;
    lastUsed?: string;
  };
}

interface AIProviderStore {
  providers: AIProvider[];
  selectedProvider: string | null;

  addProvider: (provider: AIProvider) => void;
  updateProvider: (id: string, updates: Partial<AIProvider>) => void;
  deleteProvider: (id: string) => void;
  setSelectedProvider: (id: string | null) => void;
  activateProvider: (id: string) => void;
  deactivateProvider: (id: string) => void;
  updateUsageStats: (id: string, stats: Partial<AIProvider['usageStats']>) => void;
  getActiveProvider: () => AIProvider | undefined;
}

export const useAIProviderStore = create<AIProviderStore>()(
  persist(
    (set, get) => ({
      providers: [],
      selectedProvider: null,

      addProvider: (provider: AIProvider) => {
        set((state) => ({
          providers: [...state.providers, provider],
          selectedProvider: provider.id,
        }));
      },

      updateProvider: (id: string, updates: Partial<AIProvider>) => {
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        }));
      },

      deleteProvider: (id: string) => {
        set((state) => ({
          providers: state.providers.filter((p) => p.id !== id),
          selectedProvider:
            state.selectedProvider === id ? null : state.selectedProvider,
        }));
      },

      setSelectedProvider: (id: string | null) => {
        set({ selectedProvider: id });
      },

      activateProvider: (id: string) => {
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, isActive: true } : p,
          ),
        }));
      },

      deactivateProvider: (id: string) => {
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, isActive: false } : p,
          ),
        }));
      },

      updateUsageStats: (id: string, stats: Partial<AIProvider['usageStats']>) => {
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id
              ? {
                  ...p,
                  usageStats: { ...p.usageStats, ...stats },
                }
              : p,
          ),
        }));
      },

      getActiveProvider: () => {
        const state = get();
        if (state.selectedProvider) {
          return state.providers.find((p) => p.id === state.selectedProvider);
        }
        return state.providers.find((p) => p.isActive);
      },
    }),
    {
      name: 'ai-provider-store',
    },
  ),
);
