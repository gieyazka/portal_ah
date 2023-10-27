import { approver } from '@/types/next-auth';
import NextAuth, { DefaultSession } from "next-auth"
import React from 'react'
import { AlertColor } from "@mui/material/Alert";
import { SWRResponse } from "swr";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id?: string
      jwt?: string
      rule?: string
      empid?: string
      department?: string
      company?: string
      level?: string
      section?: string
      sub_section?: string | undefined
      priority?: string
      username?: string
      firstName?: string
      lastName?: string
      fullName?: string
      prefix?: string
      position?: string
    } & DefaultSession["user"]
  }
}


type userData = {
  id?: string
  jwt?: string
  email: string
  rule?: string
  empid?: string
  department?: string
  company?: string
  level?: string
  secion?: string
}

type menuItem = {
  name: string
  url: string
  subMenu: subMenu[]
  icon?: ReactDOM

}
type subMenu = {
  name: string
  url: string
  component?: ReactDOM
  icon?: ReactDOM

}
type headerTable = {
  label: string;
  field: string;
  value: string;
  color?: string;
  fontColor?: string;
  component?: ReactDOM
  actionClick?: (props: any) => void
  width?: string | number
}

type orderState = {
  value: string | undefined;
  type: string | undefined;
}
type tableFooter = {
  page: number;
  rowPerpage: number;
  start: number;
  end: number;
}
type dateFilter = {
  start: Dayjs;
  end: Dayjs;
}

type task = {
  [key: string]: any | undefined
}


type approver = {
  level: string | undefined,
  company: string | undefined,
  department: string | undefined,
  section: string | undefined,
  sub_section: string | undefined
}

type previewStore = {
  open: boolean;
  file: string | undefined;
  type: string | undefined;
  onShowBackDrop: (file: Blob | string, type: string) => void;
  onHideBackDrop: () => void;
}

type filterStore = {
  [x: string]: any;
  open: boolean,
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  isFetch: boolean;
  period: number | undefined;
  docType: string | null,
  filterStr: string | undefined;
  filterDoc: { value: any, label: string } | undefined;
  arrDoc: { label: string, value: stirg }[],
  handleOpenDrawer: (transformedArray: any) => void;
  handleCloseDrawer: () => void;
  handleChangeStartDate: (newDate: Dayjs) => void;
  handleChangeEndDate: (newDate: Dayjs) => void;
  handleChangeFilterStr: (str: string | undefined) => void;
  handleChangeFilterDoc: (any) => void;
  searchClick: () => void;
  handleChangePeriod: (period: number) => void;
}

type requester = {
  startDate: ReactNode;
  sub_section: string;
  company?: string, name?: string, department?: string, section?: string, empid?: string, position?: string
}

type approverList = {
  name: string | undefined
  email: string | undefined
  empid: string | undefined
  position: string | undefined
  priority: number | undefined
  level: string | undefined
  section: string | undefined
  company: string | undefined
  department: string | undefined
  date: string | undefined
  sub_section: string | undefined
  remark: string | undefined
  action: string | undefined
  filesURL: string[] | null | undefined
}

type DialogStore = {
  open: boolean;
  task: task | undefined
  type?: string | undefined,
  swrResponse?: SWRResponse | undefined,
  onOpenDialog: (prop: { task: any, type?: string | undefined, swrResponse?: SWRResponse | undefined }) => void,
  onCloseDialog: () => void;
  onReload: (prop: { task: any }) => void;
}
type actionDialogStore = {
  open: boolean;
  task: task | undefined
  action: boolean | undefined;
  type?: string | undefined,
  swrResponse?: SWRResponse | undefined,
  onOpenDialog: (prop: { task: any, type?: string | undefined, swrResponse?: SWRResponse | undefined, action: boolean }) => void,
  onCloseDialog: () => void;
  onReload: (prop: { task: any }) => void;
}
type snackbarStore = {
  title: stirng;
  open: boolean;
  message?: string
  type?: AlertColor | undefined,
  countdown: number,
  progress: number,
  showSnackBar: (props: { title: string, message?: string, type?: string | undefined }) => void;
  closeSnackbar: () => void;
  onCountdown: () => void
}
type viewStore = {
  isMd: boolean | undefined,
  setMd: (data: boolean) => void;
}
type loadingStore = {
  isLoading: boolean,
  setLoading: (isLoad: boolean) => void;
}
type fileData = {
  type: string
  name: string
  file: Blob
}