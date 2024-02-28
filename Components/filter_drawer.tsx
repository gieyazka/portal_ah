import * as React from "react";

import { MenuItem, Select } from "@mui/material";

import { Autocomplete } from "@mui/lab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import { useFilterStore } from "@/store/store";

type Anchor = "top" | "left" | "bottom" | "right";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const filterStore = useFilterStore();
  // React.useEffect(() => {
  //   filterStore.handleChangePeriod(undefined);
  // }, []);
  return (
    <div>
      <React.Fragment key={"bottom"}>
        <Drawer
          anchor="bottom"
          open={filterStore.open}
          onClose={filterStore.handleCloseDrawer}
        >
          <div className="p-4">
            <div className="mb-4 flex items-end justify-between ">
              <div className="flex flex-col flex-1 gap-5 ">
                <div className="flex gap-2 items-center">
                  <div className="basis-3/12 text-end ">
                    <label
                      style={{
                        color: "#3B4778)",
                        fontFamily: "Bai Jamjuree",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "500",
                        lineHeight: "normal",
                        letterSpacing: "0.7px",
                        whiteSpace: "nowrap",
                      }}
                      htmlFor="period"
                    >
                      Period :
                    </label>
                  </div>
                  <div className="flex-1">
                    <Select
                      onChange={(e) => {
                        if (e.target.value !== null) {
                          filterStore.handleChangePeriod(
                            parseInt(e.target.value)
                          );
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
                      className="text-base text-[#1D366D] py-0 focus:bg-red-500     font-semibold w-full mt-[5px]  rounded-lg focus:ring-blue-500 focus:border-blue-500   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={filterStore.period}
                    >
                      <MenuItem value={0}>Select Period</MenuItem>
                      <MenuItem value={3}>Last 3 days</MenuItem>
                      <MenuItem value={7}>Last 7 days</MenuItem>
                      <MenuItem value={15}>Last 15 days</MenuItem>
                      <MenuItem value={30}>Last 1 months</MenuItem>
                      <MenuItem value={60}>Last 2 months</MenuItem>
                      <MenuItem value={180}>Last 6 months</MenuItem>
                      <MenuItem value={365}>Last 1 year</MenuItem>
                    </Select>
                    {/* <select
                      id="period"
                      onChange={(e) => {
                        if (e.target.value !== null) {
                          filterStore.handleChangePeriod(
                            parseInt(e.target.value)
                          );
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
                      <option value={0}>Select Period</option>
                      <option value={3}>Last 3 days</option>
                      <option value={7}>Last 7 days</option>
                      <option value={15}>Last 15 days</option>
                      <option value={30}>Last 1 months</option>
                      <option value={60}>Last 2 months</option>
                      <option value={180}>Last 6 months</option>
                      <option value={365}>Last 1 year</option>
                    </select> */}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="basis-3/12  text-end">
                    <label
                      style={{
                        color: "#3B4778)",
                        fontFamily: "Bai Jamjuree",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "500",
                        lineHeight: "normal",
                        letterSpacing: "0.7px",
                        whiteSpace: "nowrap",
                      }}
                      htmlFor="selectDocID"
                    >
                      Doc. Type :{" "}
                    </label>
                  </div>
                  <div className="flex-1">
                    <Autocomplete
                      multiple={false}
                      onChange={(event: any, newValue: any) => {
                        if (newValue !== null) {
                          filterStore.handleChangeFilterDoc(newValue);
                        } else {
                          filterStore.handleChangeFilterDoc(undefined);
                        }
                      }}
                      isOptionEqualToValue={(option: any, value: any) => {
                        return option.value === filterStore.filterDoc;
                      }}
                      value={filterStore.filterDoc}
                      // renderTags={() => {
                      //   return <div>123</div>;
                      // }}
                      id="selectDocID"
                      options={filterStore.arrDoc}
                      renderInput={(params) => {
                        return (
                          <div ref={params.InputProps.ref}>
                            <input
                              type="text"
                              {...params.inputProps}
                              style={{
                                height: "46px",
                                borderRadius: "10px",
                                border: "3px solid  #D9DAE6",
                                background: " #FFF",
                                boxShadow:
                                  "4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
                              }}
                              placeholder="Doc. Type"
                              className="flex-1 text-base text-[#1D366D] py-0   p-2.5   font-semibold w-full mt-[5px]  rounded-lg focus:ring-blue-500 focus:border-blue-500 block  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
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
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    </div>
  );
}

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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};
{
  /* <DatePicker
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
                /> */
}
