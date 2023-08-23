import * as React from "react";

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
import { useFilterStore, useSnackbarStore } from "@/store/store";

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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
}: {
  headerTable: headerTable[];
  loading: boolean;
  data: {}[] | undefined;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const filterStore = useFilterStore();
  const handleExpandClick = () => {
    setExpanded(!expanded);
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

  return (
    <div>
      <div className=" flex items-center justify-between gap-4 ">
        <div className="ml-4 whitespace-nowrap">
          <p>{data ? handleFilter(data).length : 0} รายการ</p>
        </div>
        <div className="flex justify-end gap-4  items-end mt-2 mr-2 ">
          <input
            value={filterStore.filterStr}
            onChange={(e) => filterStore.handleChangeFilterStr(e.target.value)}
            placeholder="EF-xxxxx"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 pl-2.5 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={filterStore.handleOpenDrawer}
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
      {data &&
        handleFilter(data).map((task: { [key: string]: any }) => {
          let colorStatus = "#1D336D";
          if (task.data.status === "Rejected") {
            colorStatus = "#FF5555";
          }
          let action_item = headerTable.find(
            (header) => header.field === "Action"
          );
          return (
            <Card
              sx={{ marginX: "auto", marginTop: "12px" }}
              key={task["task_id"]}
            >
              <CardHeader
                // sx={{ background: colorStatus, color: "white" }}
                sx={{
                  border: `2px solid ${colorStatus}`,
                  borderLeft: `24px solid ${colorStatus}`,
                  color: "black",
                  // padding: "12px 8px",
                  "& .MuiCardHeader-action": {
                    marginTop: "auto",
                    marginBottom: "auto",
                  },
                }}
                avatar={
                  <Avatar
                    sx={{
                      padding: "4px",
                      border: `2px solid ${colorStatus}`,
                      backgroundColor: "white",
                      color: "#1D336D",
                    }}
                    aria-label="recipe"
                  >
                    {fn.getStrName(task.data.requester.name)}
                  </Avatar>
                }
                action={
                  action_item &&
                  action_item.component !== undefined && (
                    <div className="">
                      {action_item.component({
                        task,
                        iconStyle: "text-[#1D336D] mt-2",
                      })}
                    </div>
                  )
                }
                title={task["task_id"]}
                subheader={<p>{task.name}</p>}
              />
            </Card>
          );
        })}
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
