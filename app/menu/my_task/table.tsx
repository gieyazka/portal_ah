import {
  ArrowBackIosNew,
  ArrowForwardIos,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useAutocomplete,
} from "@mui/material";
import { DarkMode, LightMode, Send } from "@mui/icons-material";
import React, { useState } from "react";
import _, { forIn } from "lodash";
import {
  dateFilter,
  headerTable,
  menuItem,
  orderState,
  subMenu,
  tableFooter,
  task,
} from "@/types/next-auth";
import dayjs, { Dayjs } from "dayjs";
import { useFilterStore, useSnackbarStore } from "@/store/store";

import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SWRResponse } from "swr";
import commonJs from "@/utils/common";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const RenderExportTable = ({
  headerTable,
  loading,
  data,
}: {
  headerTable: headerTable[];
  loading: boolean;
  data: {}[] | undefined;
}) => {
  const [currentOrder, setCurrentOrder] = React.useState<orderState>({
    value: "issueDate",
    type: "desc",
  });
  const filterStore = useFilterStore();
  const snackbarStore = useSnackbarStore();

  const [tableFooter, setTableFooter] = useState<tableFooter>({
    page: 1,
    rowPerpage: 10,
    start: 1,
    end: 10,
  });
  const handleClickHeader = (key: headerTable, currentOrder: orderState) => {
    if (key.field === "Action") {
      return;
    }
    if (key.value === currentOrder.value) {
      if (currentOrder.type === "asc") {
        setCurrentOrder({
          value: key.value,
          type: "desc",
        });
      } else {
        setCurrentOrder({
          value: key.value,
          type: "asc",
        });
      }
    } else {
      setCurrentOrder({
        value: key.value,
        type: "asc",
      });
    }
  };

  const nextPage = () => {
    setTableFooter((prev: tableFooter) => {
      const start = prev.start + prev.rowPerpage;
      const end = prev.end + prev.rowPerpage;
      const page = prev.page + 1;
      return {
        ...prev,
        start,
        end,
        page,
      };
    });
  };
  const previousPage = () => {
    setTableFooter((prev: tableFooter) => {
      const start = prev.start - prev.rowPerpage;
      const end = prev.end - prev.rowPerpage;
      const page = prev.page - 1;
      return {
        ...prev,
        start,
        end,
        page,
      };
    });
  };
  const handleFilter = (data: task[]) => {
    let filter = filterStore.filterStr;
    let filterDoc = filterStore.filterDoc;
    if (
      (filter === undefined || filter === "") &&
      (filterDoc === "" || filterDoc === undefined)
    ) {
      return data;
    }
    const filterData = data?.filter((d: task) => {
      return (
        d.data?.flowName === filterDoc ||
        d.data?.requester?.name
          ?.toUpperCase()
          .includes((filter as string).toUpperCase()) ||
        d.data?.requester?.empid
          ?.toUpperCase()
          .includes((filter as string).toUpperCase())
      );
    });
    return filterData;
  };
  const sliceData = (data: {}[]) => {
    const cloneData = [...data];
    return cloneData.slice(tableFooter.start - 1, tableFooter.end);
  };

  // console.log("getInputProps", getInputProps());
  const [value, setValue] = React.useState<any>();
  console.log("data", data);
  const arr = _.uniq(
    _.flatMap(data, (obj: { [key: string]: any }) => obj.data["flowName"])
  );
  const transformedArray = _.map(arr, (item) => ({
    label: item === "leave_flow" ? "E-Leave" : item,
    value: item,
  }));

  React.useEffect(() => {
    filterStore.handleChangePeriod(undefined);
  }, []);
  return (
    <div className="overflow-auto h-full">
      <div className="mb-4 flex items-end justify-between ">
        <div className="flex items-end mx-2 gap-2">
          <div className="text-[#1D336D] w-[260px] ">
            <label
              style={{
                color: "#3B4778)",
                fontFamily: "Bai Jamjuree",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "normal",
                letterSpacing: "0.7px",
              }}
              htmlFor="selectDocID"
            >
              Doc. Type
            </label>
            <Autocomplete
              multiple={false}
              onChange={(event: any, newValue: any) => {
                console.log("", newValue);
                if (newValue !== null) {
                  filterStore.handleChangeFilterDoc(newValue.value);
                } else {
                  filterStore.handleChangeFilterDoc(undefined);
                }
                // setValue(newValue.value);
              }}
              id="selectDocID"
              options={transformedArray}
              renderInput={(params) => {
                return (
                  <div ref={params.InputProps.ref}>
                    <input
                      type="text"
                      {...params.inputProps}
                      style={{
                        border: "3px solid  #D9DAE6",
                        boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
                      }}
                      placeholder="Doc. Type"
                      className=" text-base text-[#1D366D] py-1.5 h-[46px] font-semibold   mt-[5px]   rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                );
              }}
            />
          </div>
          <div className="w-[260px]">
            <label
              style={{
                color: "#3B4778)",
                fontFamily: "Bai Jamjuree",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "normal",
                letterSpacing: "0.7px",
              }}
              htmlFor="period"
            >
              Period
            </label>
            <select
              id="period"
              onChange={(e) => {
                if (e.target.value !== null) {
                  console.log("e", e.target.value);
                  filterStore.handleChangePeriod(parseInt(e.target.value));
                  // filterStore.handleChangeEndDate(e);
                }
              }}
              value={filterStore.period}
              style={{
                height: "46px",
                borderRadius: "10px",
                border: "3px solid  #D9DAE6",
                background: " #FFF",
                boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
              }}
              className="text-base text-[#1D366D] py-0   p-2.5   font-semibold w-full mt-[5px]  rounded-lg focus:ring-blue-500 focus:border-blue-500 block  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {" "}
              <option value={undefined}>Select Period</option>
              <option value={3}>Last 3 days</option>
              <option value={7}>Last 7 days</option>
              <option value={15}>Last 15 days</option>
              <option value={30}>Last 1 months</option>
              <option value={60}>Last 2 months</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last 1 year</option>
            </select>
          </div>
        </div>

        <div
          style={{
            marginRight: "24px",
          }}
        >
          {/* TODO: FILTER */}
          <input
            type="text"
            style={{
              // border: "3px solid  #D9DAE6",
              // boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
              width: "260px",
              height: "46px",

              filter: "drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.15))",
            }}
            value={filterStore.filterStr}
            onChange={(e) => filterStore.handleChangeFilterStr(e.target.value)}
            placeholder="Search"
            className=" text-base text-[#1D366D] py-0    font-semibold   mt-[5px] bg-[#F5F5F5]   rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      <div className="h-[calc(80%-48px)] overflow-y-auto">
        <div className=" mx-4 border-t-[#3B4778] border-t-2 ">
          <div className="flex flex-1 justify-between">
            {headerTable.map((key, index) => {
              return (
                <div
                  onClick={() => {
                    handleClickHeader(key, currentOrder);
                  }}
                  className={`py-2 text-center  whitespace-nowrap cursor-pointer flex-1 font-medium ${
                    !key.width && "flex-1"
                  } `}
                  key={index}
                  style={{
                    width: key.width || "auto",
                    color: key.fontColor ? key.fontColor : "#3B4778",
                    backgroundColor: `${key.color || "#FFFFFF"}`,
                    borderTopLeftRadius: `${index === 0 ? "6px" : "0px"}`,
                    borderTopRightRadius: `${
                      headerTable.length - 1 === index ? "6px" : "0px"
                    }`,
                  }}
                >
                  <div className="relative">
                    <p>
                      {key.label}
                      {currentOrder.value !== undefined && (
                        <span>
                          {currentOrder.value === key.value &&
                            (currentOrder.type === "asc" ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            ))}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex  flex-col gap-1">
            {(loading
              ? Array.from(new Array(10))
              : data !== undefined && data.length > 0
              ? currentOrder.value === undefined
                ? sliceData(handleFilter(data))
                : _.orderBy(
                    sliceData(handleFilter(data)),
                    (item) =>
                      eval(
                        `item${commonJs.varString(
                          currentOrder.value!.split(".")
                        )}`
                      ),
                    //@ts-ignore
                    [`${currentOrder.type!}`]
                  )
              : []
            ).map((task: any, i: number) => (
              <div
                className={`rounded-xl flex flex-1  h-full relative  content-center  justify-between ${
                  i % 2 !== 0 ? "bg-white" : "bg-[#F5F5F5]"
                }`}
                key={i.toString()}
              >
                {headerTable.map((key: any, index: number) => {
                  if (key.actionClick !== undefined) {
                    return (
                      <div
                        key={key.field}
                        className={`text-center  flex-1  cursor-pointer flex flex-col justify-center  font-semibold text-[#1976D2] hover:text-white   ${
                          key.field === "Action" &&
                          "bg-[#D4E8FC] hover:bg-[#1976D2]"
                        } rounded-r-lg  py-1`}
                        onClick={async () => {
                          key.actionClick({ task });
                        }}
                      >
                        <Typography
                          component="p"
                          className="text-xl font-semibold "
                        >
                          View
                        </Typography>
                        {/* {key.component({ task })} */}
                      </div>
                    );
                  } else {
                    let checkValue = key.value.split(".");
                    let value =
                      task && eval(`task${commonJs.varString(checkValue)}`);

                    if (key.field === "IssueDate") {
                      value = value && dayjs(value).format("DD/MM/YYYY");
                    }

                    if (key.field === "Description") {
                      value =
                        value && value.length > 100
                          ? value.slice(0, 97) + "..."
                          : value;
                    }
                    if (key.field === "Pending") {
                      value = value && dayjs(value).fromNow(true);
                    }
                    if (key.field === "Doc.Type") {
                      if (value === "leave_flow") {
                        value = "E-Leave";
                      }
                    }

                    return (
                      <div
                        key={i.toString() + index.toString()}
                        className={`text-center flex-1 flex flex-col justify-center  ${
                          !key.width && "flex-1"
                        }`}
                        style={{
                          width: key.width || "auto",
                        }}
                      >
                        {!loading ? (
                          key.field === "Doc.id" ? (
                            <Typography
                              component="p"
                              className="text-base whitespace-nowrap "
                            >
                              {value}
                            </Typography>
                          ) : (
                            <Typography component="p" className="text-base ">
                              {value}
                            </Typography>
                          )
                        ) : (
                          <Skeleton />
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between px-20 mb-4   w-full flex-1 mt-4">
        <div className="flex  items-center ">
          <p className="text-[#3B4778]">Row per page : &nbsp; </p>
          <span>
            <select
              defaultValue={10}
              onChange={(e) => {
                setTableFooter((prev: tableFooter) => {
                  return {
                    page: 1,
                    rowPerpage: parseInt(e.target.value),
                    start: 1,
                    end: parseInt(e.target.value),
                  };
                });
              }}
              className="w-18 bg-[#1976D2] text-white border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </span>
        </div>
        {data && (
          <div className="flex items-center">
            <IconButton
              className="bg-[#1976D2] text-white hover:text-[#1976D2] hover:bg-[#D4E8FC] disabled:bg-white disabled:text-[#1976D2]"
              disabled={tableFooter.start === 1}
              aria-label="add an alarm"
              onClick={() => {
                previousPage();
              }}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
            &nbsp;
            <p className="text-[#3B4778] ">
              {data.length === 0 ? 0 : tableFooter.start} -{" "}
              {tableFooter.end > data.length ? data.length : tableFooter.end} of{" "}
              {data.length} &nbsp;
            </p>
            &nbsp;
            <IconButton
              disabled={tableFooter.end > data.length}
              className="bg-[#1976D2] text-white hover:text-[#1976D2] hover:bg-[#D4E8FC]  disabled:bg-white disabled:text-[#1976D2]"
              aria-label="add an alarm"
              onClick={() => {
                nextPage();
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;

  return (
    <div className="relative mr-2">
      <p className="">{props.label}</p>

      <div className="relative" ref={InputProps?.ref}>
        <div className="absolute top-1/2 left-[-4px]  -translate-y-1/2 ">
          {InputProps?.endAdornment}
        </div>

        <input
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default RenderExportTable;
