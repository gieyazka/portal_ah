import dayjs, { Dayjs } from "dayjs";

import { create } from "zustand";

interface filterStore {
  startDate: Dayjs;
  endDate: Dayjs;
  isFetch: boolean;
  handleChangeStartDate: (newDate: Dayjs) => void;
  handleChangeEndDate: (newDate: Dayjs) => void;
  searchClick: () => void;
}
const useFilterStore = create<filterStore>((set) => ({
  startDate: dayjs().subtract(7, "day").startOf("day"),
  endDate: dayjs().add(7, "day").startOf("day"),
  isFetch: true,
  handleChangeStartDate: (newDate: Dayjs) =>
    set((state: any) => ({
      startDate: newDate,
      isFetch: false,
    })),
  handleChangeEndDate: (newDate: Dayjs) =>
    set((state: any) => ({
      endDate: newDate,
      isFetch: false,
    })),
  searchClick: () =>
    set(() => ({
      isFetch: true,
    })),
  //   increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));

export { useFilterStore };
