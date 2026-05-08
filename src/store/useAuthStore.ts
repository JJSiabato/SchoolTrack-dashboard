import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username, password) => {
        if (username === 'admin' && password === 'admin') {
          set({ isAuthenticated: true, user: { name: 'Admin User', role: 'Administrator' } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'schooltrack-auth-storage',
    }
  )
);
