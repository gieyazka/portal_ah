import { approver } from '@/types/next-auth';
import NextAuth, { DefaultSession } from "next-auth"
import React from 'react'
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
      secion?: string
      priority?: string
    } & DefaultSession["user"]
  }
}


type userData = {
  id?: string
  jwt?: string
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
  field: string;
  value: string;
  color?: string;
  fontColor?: string;
  component?: ReactDOM
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


type requester = {
  company?: string, name?: string, department?: string, section?: string, empid?: string
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
  note: string | undefined
  action: string | undefined
}
