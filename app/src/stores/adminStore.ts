import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAuthenticated: boolean;
  adminId: string | null;
  sessionToken: string | null;
  sessionExpiry: number | null;

  login: (adminId: string, sessionToken: string) => void;
  logout: () => void;
  isSessionValid: () => boolean;
  refreshSession: () => void;
}

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminId: null,
      sessionToken: null,
      sessionExpiry: null,

      login: (adminId: string, sessionToken: string) => {
        const expiry = Date.now() + SESSION_TIMEOUT_MS;
        set({
          isAuthenticated: true,
          adminId,
          sessionToken,
          sessionExpiry: expiry,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          adminId: null,
          sessionToken: null,
          sessionExpiry: null,
        });
      },

      isSessionValid: () => {
        const state = get();
        if (!state.isAuthenticated || !state.sessionExpiry) {
          return false;
        }
        return Date.now() < state.sessionExpiry;
      },

      refreshSession: () => {
        const state = get();
        if (state.isAuthenticated) {
          set({
            sessionExpiry: Date.now() + SESSION_TIMEOUT_MS,
          });
        }
      },
    }),
    {
      name: 'admin-store',
    },
  ),
);
