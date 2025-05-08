import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalStateType = {
  isLoading?: boolean;
};

type GlobalStateActions = {
  updateGlobalState: <K extends keyof GlobalStateType>(
    data: K,
    value: GlobalStateType[K]
  ) => void;
};

type GlobalState = GlobalStateType & GlobalStateActions;

type SidebarState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ ...state, isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: "sidebar-state",
    }
  )
);

const useGlobalStore = create<GlobalState>((set) => ({
  updateGlobalState: (data, value) =>
    set((state) => ({ ...state, [data]: value })),
}));

// -------------------------
// THEME
// -------------------------
type ThemeStoreState = {
  isDark: boolean;
};

type ThemeStoreActions = {
  updateDarkMode: (state: boolean) => void;
  toggleDarkMode: () => void;
};

type ThemeStore = ThemeStoreState & ThemeStoreActions;

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: true,
      updateDarkMode: (newState) =>
        set((state) => ({ ...state, isDark: newState })),
      toggleDarkMode: () =>
        set((state) => ({ ...state, isDark: !state.isDark })),
    }),
    { name: "digifest-theme" }
  )
);

export default useGlobalStore;
