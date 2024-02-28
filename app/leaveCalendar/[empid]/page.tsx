"use client";

import "../calendar.css";

import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import { getAllCompany, getLeaveCalendar } from "@/utils/leave";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LeaveDialog from "../leaveDialog";
import React from "react";
import _ from "lodash";
import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { useTheme } from "@emotion/react";
import { useViewStore } from "@/store/store";

const localizer = dayjsLocalizer(dayjs);
function LeaveCalendar() {
  const params = useParams<{ empid: string }>();
  const { empid } = params;
  const [selectMonth, setSelectMonth] = React.useState(dayjs());
  const [selectCompany, setSelectCompany] = React.useState<{ [x: string]: any } | string>();
  const [selectDepartment, setSelectDepartment] = React.useState<{ [x: string]: any } | string>();
  const [selectSection, setSelectSection] = React.useState<{ [x: string]: any } | string>();
  const [selectSubSection, setSelectSubSection] = React.useState<{ [x: string]: any } | string>();
  const [dialogState, setDialogState] = React.useState<{ open: boolean; data: any }>({ open: false, data: undefined });
  const theme = useTheme();
  const isMdCheck = useMediaQuery(theme.breakpoints.up("md"));
  const viewStore = useViewStore();
  
  React.useEffect(() => {
    viewStore.setMd(isMdCheck);
  }, [isMdCheck]);
  const handleCloseDialog = () => {
    setDialogState({ open: false, data: undefined });
  };

  const queryHierachies = useQuery(
    ["hierachies", empid],
    async () => {
      return _apiFn.getMyHierachies(empid);
    },
    {
      enabled: !_.isEmpty(empid),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const hieranchies = React.useMemo(() => {
    const userHieranchy = [];
    if (queryHierachies.data) {
      queryHierachies?.data?.forEach((hierachy) => {
        const company = hierachy.attributes.company?.data?.attributes?.abbreviation;
        const department = hierachy.attributes.department?.data?.attributes?.name;
        const section = hierachy.attributes.section?.data?.attributes?.name;
        const sub_section = hierachy.attributes.sub_section?.data?.attributes?.name;
        userHieranchy.push({ company, department, section, sub_section });
      });
    }
    return userHieranchy;
  }, [queryHierachies.data]);
  const query = useQuery("allCompany", getAllCompany, {
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const queryLeave = useQuery(
    ["leave", selectCompany?.abbreviation, selectDepartment?.name, selectSection?.name, selectSubSection?.name],
    async () => {
      const company = selectCompany?.abbreviation;
      const department = selectDepartment?.name;
      const section = selectSection?.name;
      const sub_section = selectSubSection?.name;
      const startDate = selectMonth.startOf("month").format("YYYYMMDD");
      const endDate = selectMonth.endOf("month").format("YYYYMMDD");
      const data = await getLeaveCalendar({
        company,
        department,
        section,
        sub_section,
        startDate,
        endDate,
      });
      return data;
    },
    {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: false, // Initially, the query will not run
    }
  );

  const companyArr = React.useMemo(() => {
    if (query.data) {
      const getCompany = query.data.map((d) => d.attributes);
      return getCompany.filter((d) => hieranchies.some((hierarchy) => hierarchy.company === d.abbreviation));
    }
    return [];
  }, [query.data]);
  const departmentArr = React.useMemo(() => {
    if (selectCompany) {
      if (selectCompany.departments.data) {
        const getDepartment = selectCompany.departments.data.map((d) => d.attributes);
        return getDepartment.filter((d) => hieranchies.some((hierarchy) => hierarchy.company === selectCompany.abbreviation && hierarchy.department === d.name));
      }
    }
    return [];
  }, [selectCompany]);
  const sectionArr = React.useMemo(() => {
    if (selectDepartment) {
      if (selectDepartment.sections.data) {
        const getSection = selectDepartment.sections.data.map((d) => d.attributes);
        return getSection.filter((d) => hieranchies.some((hierarchy) => !hierarchy.section || hierarchy.section === d.name));
      }
    }
    return [];
  }, [selectDepartment]);
  const subSectionArr = React.useMemo(() => {
    if (selectSection) {
      if (selectSection.sub_sections.data) {
        const getSubSection = selectSection.sub_sections.data.map((d) => d.attributes);
        return getSubSection.filter((d) => hieranchies.some((hierarchy) => !hierarchy.sub_section || hierarchy.sub_section === d.name));
      }
    }
    return [];
  }, [selectSection]);
  console.log("132", hieranchies);
  const handleChangeCompany = (value: {}) => {
    const getCompany = companyArr.find((d) => d.abbreviation === value);

    setSelectCompany((prev) => getCompany);
    setSelectDepartment((prev) => undefined);
    setSelectSection((prev) => undefined);
    setSelectSubSection((prev) => undefined);
  };
  const handleChangeDepartment = (value: {}) => {
    const getDepartment = departmentArr.find((d) => d.name === value);
    setSelectSection((prev) => undefined);
    setSelectSubSection((prev) => undefined);
    setSelectDepartment((prev) => getDepartment);
  };
  const handleChangeSection = (value: {}) => {
    const getSection = sectionArr.find((d) => d.name === value);
    setSelectSubSection((prev) => undefined);
    setSelectSection((prev) => getSection);
  };
  const handleChangeSubSection = (value: {}) => {
    const getSubSection = subSectionArr.find((d) => d.name === value);
    setSelectSubSection((prev) => getSubSection);
  };

  const onChangeMonth = (toAdd: number) => {
    setSelectMonth((prev) => prev.add(toAdd, "month"));
  };

  const eventData = React.useMemo(() => {
    const event: any[] = [];
    if (queryLeave.data) {
      queryLeave.data.forEach((flowData) => {
        flowData.data.leaveData.forEach((d) => {
          event.push({
            id: flowData.task_id,

            title: `${flowData.data.requester.name_th} (${flowData.data.type.label})`,
            allDay: true,
            start: dayjs(d.dateStr).startOf("day"),
            end: dayjs(d.dateStr).endOf("day"),
            resource: flowData,
            color: "red",
          });
        });
      });
    }
    return event;
  }, [queryLeave]);

  const handleClickEvent = (data) => {
    setDialogState({ open: true, data: data.resource });
  };
  if (!empid) {
    return <div>Back Data</div>;
  }
  return (
    // <div className="bg-[#121212] h-screen w-screen text-white">
    <div className='m-4 flex flex-col gap-2'>
    <button onClick={()=>{console.log('',dayjs().toDate())}}>date</button>
      <LeaveDialog
        dialogState={dialogState}
        handleClose={handleCloseDialog}
      />
      <div className='flex gap-2  justify-between'>
        <div className='flex gap-2 '>
          <CustomSelect
            keyData={`abbreviation`}
            lable={`Company`}
            value={selectCompany?.abbreviation}
            handleChange={handleChangeCompany}
            optionArr={companyArr}
          />
          <CustomSelect
            keyData={`name`}
            lable={`Department`}
            value={selectDepartment?.name}
            handleChange={handleChangeDepartment}
            optionArr={departmentArr}
          />
          <CustomSelect
            keyData={`name`}
            lable={`Section`}
            value={selectSection?.name}
            handleChange={handleChangeSection}
            optionArr={sectionArr}
          />
          <CustomSelect
            keyData={`name`}
            lable={`Sub Section`}
            value={selectSubSection?.name}
            handleChange={handleChangeSubSection}
            optionArr={subSectionArr}
          />
        </div>
        <Button
          disabled={selectDepartment === undefined}
          className='bg-[#1D336D] text-white hover:opacity-80'
          variant='contained'
          onClick={async () => {
            queryLeave.refetch();
          }}
        >
          Search
        </Button>
      </div>

      <div className='flex flex-col gap-2 border-2 p-2 border-black rounded-md'>
        <div className='flex gap-4 justify-center items-center'>
          <IconButton
            onClick={() => onChangeMonth(-1)}
            aria-label='leftArrow'
          >
            <ArrowLeftIcon className='w-10 h-10' />
          </IconButton>
          <p className='text-center font-semibold text-xl my-2'>{selectMonth.format("MMMM YYYY")}</p>
          <IconButton
            onClick={() => onChangeMonth(1)}
            aria-label='rightArrow'
          >
            <ArrowRightIcon className='w-10 h-10' />
          </IconButton>
        </div>
        <MyCalendar
          handleClickEvent={handleClickEvent}
          selectMonth={selectMonth}
          events={eventData}
        />
      </div>
    </div>
  );
}
const MyCalendar = (props: { selectMonth: dayjs.Dayjs; events: any[]; handleClickEvent: (event: any) => void }) => {
  const eventStyleGetter = (event) => {
    const isWaiting = event.resource.data.status?.toLowerCase() === "waiting";
    const bgColor = isWaiting ? "#1976D2" : "#A7E5A6";
    const txtColor = isWaiting ? "#FFF" : "#1D336D";
    const style = {
      fontSize: "14px",
      fontWeight: 500,
      backgroundColor: bgColor,
      color: txtColor,
    };
    return {
      style: style,
    };
  };

  const { selectMonth, events, handleClickEvent } = props;
  return (
    <div>
      <Calendar
        // titleAccessor={(d) => {
        //   console.log("", d);
        //   return <div>test123</div>;
        // }}
        events={events}
        popup
        toolbar={false}
        localizer={localizer}
        // view={"month"}
        // events={myEventsList}\
        onNavigate={() => {}}
        date={selectMonth.toDate()}
        defaultDate={selectMonth.toDate()}
        startAccessor='start'
        endAccessor='end'
        eventPropGetter={eventStyleGetter}
        style={{ height: "80svh" }}
        onSelectEvent={(event) => handleClickEvent(event)}
      />
    </div>
  );
};

const CustomSelect = (props: { keyData: string; lable: string; optionArr: []; value: { [x: string]: any } | undefined; handleChange: any }) => {
  const { handleChange, value, optionArr, lable, keyData } = props;
  return (
    <FormControl className='w-48'>
      <InputLabel
        className='text-[#1D366D] font-semibold'
        id={lable}
      >
        {lable}
      </InputLabel>
      <Select
        disabled={optionArr.length === 0}
        labelId={lable}
        onChange={(e) => {
          if (e.target.value !== null) {
            handleChange(e.target.value);
            // filterStore.handleChangeEndDate(e);
          }
        }}
        sx={{
          "& > fieldset": {
            borderRadius: "10px",
            border: "3px solid  #D9DAE6",
          },
        }}
        style={{
          height: "46px",

          background: " #FFF",
          boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
        className='text-base text-[#1D366D] py-0   font-semibold w-auto mt-[5px]  rounded-lg  '
        value={value || ""}
        label={lable}
      >
        {/* <MenuItem value={""}>
          <em>Default Label</em>
        </MenuItem> */}
        {optionArr.map((d: any) => {
          return (
            <MenuItem
              key={d[keyData]}
              value={d[keyData]}
            >
              {d[keyData]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default LeaveCalendar;
