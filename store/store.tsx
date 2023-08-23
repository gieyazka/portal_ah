import {
  DialogStore,
  actionDialogStore,
  filterStore,
  loadingStore,
  previewStore,
  snackbarStore,
  viewStore,
} from "@/types/next-auth";
import dayjs, { Dayjs } from "dayjs";

import { SWRResponse } from "swr";
import { create } from "zustand";
import zukeeper from "zukeeper";

const usePreviewStore = create<previewStore>((set) => ({
  open: false,
  file: undefined,
  type: undefined,
  onShowBackDrop: (file: Blob | string, type: string) =>
    set((state: any) => ({
      open: true,
      file: typeof file === "string" ? file : URL.createObjectURL(file),
      type,
    })),
  onHideBackDrop: () =>
    set((state: any) => ({
      open: false,
      file: undefined,
      type: undefined,
    })),
}));

const useDialogStore = create<DialogStore>(
  zukeeper((set: any) => ({
    open: false,
    task: undefined,
    type: undefined,
    onReload: (props: { task: any }) =>
      set((state: any) => {
        return {
          task: props.task,
        };
      }),
    onOpenDialog: (props: {
      task: any;
      type?: string | undefined;
      swrResponse?: SWRResponse | undefined;
    }) =>
      set((state: any) => {
        return {
          open: true,
          task: props.task,
          type: props.type,
          swrResponse: props.swrResponse,
        };
      }),
    onCloseDialog: () =>
      set((state: any) => ({
        open: false,
        task: undefined,
        type: undefined,
      })),
  }))
);
const useActionDialogStore = create<actionDialogStore>(
  zukeeper((set: any) => ({
    open: false,
    task: undefined,
    type: undefined,
    swrResponse: undefined,
    action: undefined,
    onOpenDialog: (props: {
      task: any;
      type?: string | undefined;
      action: boolean;
      swrResponse?: SWRResponse | undefined;
    }) =>
      set((state: any) => ({
        open: true,
        task: props.task,
        type: props.type,
        action: props.action,
        swrResponse: props.swrResponse,
      })),
    onCloseDialog: () =>
      set((state: any) => ({
        open: false,
        task: undefined,
        type: undefined,
        swrResponse: undefined,
        action: undefined,
      })),
  }))
);

const useFilterStore = create<filterStore>((set) => ({
  open: false,
  docType: null,
  period: undefined,
  startDate: null,
  endDate: null,
  // startDate: dayjs().subtract(7, "day").startOf("day"),
  // endDate: dayjs().add(7, "day").endOf("day"),
  isFetch: true,
  filterStr: "",
  filterDoc: "",
  arrDoc: [],
  handleOpenDrawer: (arrDoc) =>
    set((state: any) => ({
      arrDoc: arrDoc,
      open: true,
    })),
  handleCloseDrawer: () =>
    set((state: any) => ({
      arrDoc: [],
      open: false,
    })),
  handleChangeStartDate: (newDate: Dayjs) =>
    set((state: any) => {
      if (newDate.isAfter(state.endDate)) {
        return {
          startDate: newDate,
          endDate: null,
          isFetch: false,
        };
      }

      return {
        startDate: newDate,
        isFetch: false,
      };
    }),
  handleChangeEndDate: (newDate: Dayjs) =>
    set((state: any) => {
      return {
        endDate: newDate,
        isFetch: false,
      };
    }),
  handleChangeFilterStr: (str: string | undefined) =>
    set((state: filterStore) => ({
      filterStr: str,
    })),
  handleChangeFilterDoc: (str: string | undefined) =>
    set((state: filterStore) => ({
      filterDoc: str,
    })),
  searchClick: () =>
    set((state: filterStore) => {
      if (state.endDate === null) {
        return state;
      }
      return { isFetch: true };
    }),
  handleChangePeriod: (period: number | undefined) =>
    set((state: any) => {
      if (period) {
        return {
          period: period,
          startDate: dayjs().subtract(period, "days"),
          endDate: null,
          isFetch: true,
        };
      } else {
        return {
          period: period,
          startDate: null,
          endDate: null,
          isFetch: true,
        };
      }
    }),
  //   increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
}));
const useSnackbarStore = create<snackbarStore>(
  zukeeper((set: any) => ({
    open: false,
    message: "",
    type: undefined,
    progress: 100,
    countdown: 5,
    showSnackBar: (message: string, type?: string | undefined) =>
      set((state: any) => ({
        open: true,
        message: message,
        type: type,
        progress: 100,
        countdown: 3,
      })),
    closeSnackbar: () =>
      set((state: any) => ({
        open: false,
        // message: "",
        // type: undefined,
      })),
    onCountdown: () =>
      set((state: any) => ({
        countdown: state.countdown - 0.1,
        progress: (state.countdown - 0.1) * 20,
      })),
  }))
);

const useViewStore = create<viewStore>(
  zukeeper((set: any) => ({
    isMd: undefined,

    setMd: (data: boolean) =>
      set((state: any) => ({
        isMd: data,
      })),
  }))
);
const useLoading = create<loadingStore>(
  zukeeper((set: any) => ({
    isLoading: false,

    setLoading: (isLoad: boolean) =>
      set((state: any) => ({
        isLoading: isLoad,
      })),
  }))
);

//ts-ignored
if (typeof window !== "undefined") {
  //@ts-ignore
  window.store = useSnackbarStore;
  //@ts-ignore
  window.store = useActionDialogStore;
  //@ts-ignore
  window.store = useDialogStore;
}

export {
  useFilterStore,
  useDialogStore,
  usePreviewStore,
  useActionDialogStore,
  useSnackbarStore,
  useViewStore,
  useLoading,
};
