import * as React from "react";

import { ArrowRight, Filter } from "iconsax-react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import {
  dateFilter,
  headerTable,
  menuItem,
  orderState,
  subMenu,
  tableFooter,
  task,
} from "@/types/next-auth";
import {
  useDialogStore,
  useFilterStore,
  useSnackbarStore,
} from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import { DatePicker } from "@mui/x-date-pickers";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuData from "./../menuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SWRResponse } from "swr";
import ShareIcon from "@mui/icons-material/Share";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import _ from "lodash";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Card_Mobile({
  headerTable,
  loading,
  data,
  swrResponse,
}: {
  headerTable: headerTable[];
  loading: boolean;
  data: {}[] | undefined;
  swrResponse: SWRResponse;
}) {
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];
  const searchParams = useSearchParams();
  const getMenu = MenuData.find((d) => d.url === lastPath);
  const getSubMenu = getMenu?.subMenu.find(
    (d) => d.url === searchParams.get("current")
  );
  const [expanded, setExpanded] = React.useState(false);
  const filterStore = useFilterStore();
  const dialogStore = useDialogStore();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const arr = _.uniq(
    _.flatMap(data, (obj: { [key: string]: any }) => obj.data["flowName"])
  );
  const transformedArray = _.map(arr, (item) => ({
    label: item === "leave_flow" ? "E-Leave" : item,
    value: item,
  }));
  console.log("transformedArray", transformedArray);
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

  return (
    <div className="h-full w-full bg-[#EEF1F8] ">
      <div className="px-5 ">
        <div className="pt-4">
          <Typography
            className="text-[#818181] text-lg font-bold"
            component={"p"}
          >
            {getMenu?.name}
            <Typography
              className="text-[#6B739C] text-lg font-bold"
              component={"span"}
            >
              {" > "}
            </Typography>
            <Typography
              className="text-[#1976D2] text-lg font-bold"
              component={"span"}
            >
              {getSubMenu?.name}
            </Typography>
          </Typography>
        </div>
        <div className=" flex items-center justify-between gap-4 ">
          {/* <div className="ml-4 whitespace-nowrap">
          <p>{data ? handleFilter(data).length : 0} รายการ</p>
        </div> */}
          <div className="flex flex-1 justify-between gap-2 items-end mt-2  ">
            <input
              value={filterStore.filterStr}
              onChange={(e) =>
                filterStore.handleChangeFilterStr(e.target.value)
              }
              placeholder="Search..."
              style={{
                borderRadius: "5px",
                boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
              }}
              className=" bg-white pl-2.5 p-2 h-12 w-56"
            />
            <Button
              className="h-12 bg-[#1976D2]"
              variant="contained"
              startIcon={<Filter size="24" color="#FFF" />}
              onClick={() => filterStore.handleOpenDrawer(transformedArray)}
            >
              Filter
            </Button>

            {/* <div>
          <input
            value={filterStore.filterStr}
            onChange={(e) => filterStore.handleChangeFilterStr(e.target.value)}
            placeholder="Filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div> */}
          </div>
        </div>
        <hr className="  h-[2px] bg-[#6B739C] mt-4" />
        <Typography component="p" className="text-[#6B739C] mt-4">
          Count : {data ? handleFilter(data).length : 0} items
        </Typography>
      </div>
      <div className="h-[90%] overflow-auto px-5">
        {data &&
          handleFilter(data)?.map((task: { [key: string]: any }) => {
            let colorStatus = "#1D336D";
            if (task.data.status === "Rejected") {
              colorStatus = "#FF5555";
            } else if (task.data.status === "Success") {
              colorStatus = "#86dc89";
            } else if (task.data.status === "Waiting") {
              colorStatus = "#FFE175";
            }
            let action_item = headerTable.find(
              (header) => header.field === "Action"
            );
            return (
              <div
                className="mt-4 flex bg-white gap-4 items-center h-[102px] justify-between relative"
                key={task["task_id"]}
                style={{
                  borderRadius: "5px",
                  boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
                }}
              >
                {" "}
                <div
                  className={`w-6  absolute h-full bg-[${colorStatus}]`}
                ></div>
                <div className="flex items-center gap-3">
                  <Avatar
                    className="ml-4"
                    sx={{
                      width: 46,
                      height: 46,
                      border: `2px solid #FFF`,
                      backgroundColor: "white",
                      background: "#D8D9DA",
                      color: "black",
                    }}
                    aria-label="recipe"
                  >
                    {fn.getStrName(task.data.requester.name)}
                  </Avatar>

                  <div>
                    <Typography
                      component="p"
                      className="text-[#1D366D] font-semibold"
                    >
                      {task.data.flowName === "leave_flow"
                        ? `E-Leave(${task.data.type.label})`
                        : task.data.flowName}
                    </Typography>
                    <Typography component="p" className="text-[#818181]">
                      {task.data.requester.name}
                    </Typography>
                    <Typography component="p" className="text-[#818181]">
                      {task.data.requester.company},
                      {task.data.requester.department},
                      {task.data.requester.section}
                    </Typography>
                  </div>
                </div>
                <div
                  onClick={() => {
                    dialogStore.onOpenDialog({ task, swrResponse });
                  }}
                  className="w-12 h-full bg-[#D4E8FC] flex justify-center items-center"
                >
                  <ArrowRight size="24" color="#1976D2" />
                </div>
              </div>
            );
          })}{" "}
      </div>
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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};
