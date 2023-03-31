import { DialogStore, filterStore, previewStore } from "@/types/next-auth";
import dayjs, { Dayjs } from "dayjs";

import { create } from "zustand";

const usePreviewStore = create<previewStore>((set) => ({
  open: false,
  file: undefined,
  type: undefined,
  onShowBackDrop: (file: Blob, type: string) =>
    set((state: any) => ({
      open: true,
      file : URL.createObjectURL(file),
      type,
    })),
  onHideBackDrop: () =>
    set((state: any) => ({
      open: false,
      file: undefined,
      type: undefined,
    })),
}));

const useDialogStore = create<DialogStore>((set) => ({
  open: false,
  task: undefined,
  type: undefined,
  onOpenDialog: (task: any, type?: string | undefined) =>
    set((state: any) => ({
      open: true,
      task: task,
      type: type,
    })),
  onCloseDialog: () =>
    set((state: any) => ({
      open: false,
      task: undefined,
      type: undefined,
    })),
}));

const useFilterStore = create<filterStore>((set) => ({
  startDate: dayjs().subtract(7, "day").startOf("day"),
  endDate: dayjs().add(7, "day").startOf("day"),
  isFetch: true,
  filterStr: "",
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
  handleChangeFilterStr: (str: string | undefined) =>
    set((state: any) => ({
      filterStr: str,
    })),
  searchClick: () =>
    set(() => ({
      isFetch: true,
    })),
  //   increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));

export { useFilterStore, useDialogStore , usePreviewStore };
