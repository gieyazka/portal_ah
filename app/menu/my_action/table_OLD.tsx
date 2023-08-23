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
  Skeleton,
  TextField,
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
    value: undefined,
    type: undefined,
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
    if (filter === undefined || filter === "") {
      return data;
    }
    const filterData = data?.filter((d: task) => {
      return d.task_id.includes(filter) || d.data.flowName.includes(filter);
    });
    return filterData;
  };
  const sliceData = (data: {}[]) => {
    const cloneData = [...data];
    return cloneData.slice(tableFooter.start - 1, tableFooter.end);
  };
  return (
    <div className="overflow-auto">
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-end ">
          <DatePicker
            format="DD/MM/YYYY"
            value={filterStore.startDate || null}
            label="Start date"
            slots={{
              textField: CustomInput,
            }}
            onChange={(e) => {
              if (e !== null) {
                filterStore.handleChangeStartDate(e);
              }
            }}
          />
          <DatePicker
            value={filterStore.endDate || null}
            format="DD/MM/YYYY"
            label="End date"
            minDate={filterStore.startDate}

            slots={{
              textField: CustomInput,
            }}
            onChange={(e) => {
              if (e !== null) {
                filterStore.handleChangeEndDate(e);
              }
            }}
          />
          <button
            type="button"
            className="h-max  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => {
              // snackbarStore.showSnackBar("test","success")
              filterStore.searchClick();
            }}
          >
            Search
          </button>
        </div>

        <div>
          {/* TODO: FILTER */}
          <input
            value={filterStore.filterStr}
            onChange={(e) => filterStore.handleChangeFilterStr(e.target.value)}
            placeholder="Filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>

      <table
        style={{
          width: "100%",
          // display: "block",
          // height: "400px",
          // borderRadius: "1em 1em 0 0",
          overflow: "auto",
        }}
      >
        <thead className=" h-10 relative overflow-auto border-separate   ">
          <tr className="sticky top-0 ">
            {headerTable.map((key, index) => {
              return (
                <th
                  onClick={() => {
                    handleClickHeader(key, currentOrder);
                  }}
                  className="px-3 w-16 whitespace-nowrap cursor-pointer"
                  key={index}
                  style={{
                    // width: key.width || "auto",
                    color: key.fontColor ? key.fontColor : "#6B727B",
                    backgroundColor: `${key.color || "#F9FBFC"}`,
                    borderTopLeftRadius: `${index === 0 ? "6px" : "0px"}`,
                    borderTopRightRadius: `${
                      headerTable.length - 1 === index ? "6px" : "0px"
                    }`,
                  }}
                >
                  <div className="relative">
                    <p>
                      {key.field}
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
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-center ">
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
            <tr
              className={` ${i % 2 !== 0 ? "bg-white" : "bg-gray-200"}`}
              key={i.toString()}
            >
              {headerTable.map((key: any, index: number) => {
                if (key.component !== undefined) {
                  return (
                    <td key={key.field} className="text-center py-2">
                      {key.component({ task })}
                    </td>
                  );
                } else {
                  let checkValue = key.value.split(".");
                  let value =
                    task && eval(`task${commonJs.varString(checkValue)}`);

                  if (key.field === "IssueDate") {
                    value = value && dayjs(value).format("DD/MM/YYYY HH:mm");
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
                    <td key={i.toString() + index.toString()}>
                      <div
                        style={
                          {
                            // width: key.width || "auto",
                            // wordBreak: "break-word",
                          }
                        }
                        className={`text-center px-4 py-2 `}
                        // style={{ minWidth: "75%", margin: "1px 0px 1px 0px" }}
                      >
                        {!loading ? (
                          key.fild === "Doc.id" ? (
                            <p className='whitespace-nowrap'>{value}</p>
                          ) : (
                            <p>{value}</p>
                          )
                        ) : (
                          <Skeleton />
                        )}
                      </div>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between px-4 w-full flex-1 mt-2">
        <div className="flex  items-center">
          <p>Row per page : &nbsp; </p>
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
              className="w-18  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            <p>
              {data.length === 0 ? 0 : tableFooter.start} -{" "}
              {tableFooter.end > data.length ? data.length : tableFooter.end} of{" "}
              {data.length} &nbsp;
            </p>
            <IconButton
              sx={{ color: "#1D336D" }}
              disabled={tableFooter.start === 1}
              aria-label="add an alarm"
              onClick={() => {
                previousPage();
              }}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
            &nbsp;
            <IconButton
              disabled={tableFooter.end > data.length}
              sx={{ color: "#1D336D" }}
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
      <p className="">{props.label} :</p>

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
