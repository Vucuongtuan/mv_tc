import create from '@/lib/simple-zustand';

interface TVModeState {
  isTVMode: boolean;
  setTVMode: (isTVMode: boolean) => void;
  toggleTVMode: () => void;
}

const useTVModeStore = create<TVModeState>((set) => ({
  isTVMode: false,
  setTVMode: (isTVMode) => set({ isTVMode }),
  toggleTVMode: () => set((state) => ({ isTVMode: !state.isTVMode })),
}));

export default useTVModeStore;
