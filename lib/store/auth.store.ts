import { create } from 'zustand';
import { User } from '../types/auth';
import { persist } from 'zustand/middleware';
import { getUser } from '../services/auth.service';

type AuthStoreState = {
  user?: User | undefined;
  accessToken?: string;
};

type AuthStoreActions = {
  fetchUser(): void;
  resetUser(): void;
  setToken(accessToken: string): void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: undefined,
      async fetchUser() {
        try {
          const user = await getUser();

          console.log(user);

          set({ user });
        } catch {
          set({ user: undefined });
        }
      },
      setToken(accessToken) {
        set({ accessToken });
      },
      resetUser() {
        set({ user: undefined, accessToken: undefined });
      },
    }),
    {
      name: 'user-store',
      storage: {
        setItem: (name, value) =>
          sessionStorage.setItem(name, JSON.stringify(value)),
        getItem: (name) =>
          sessionStorage.getItem(name)
            ? JSON.parse(sessionStorage.getItem(name)!)
            : null,
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
