import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Client-only UI state. Server data never goes here — that lives in the TanStack cache.
type UiState = {
  demoNoticeDismissed: boolean;
  dismissDemoNotice: () => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      demoNoticeDismissed: false,
      dismissDemoNotice: () => set({ demoNoticeDismissed: true }),
    }),
    // Per tab session: the notice comes back for the next demo visit.
    {
      name: "healthstream-ui",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
