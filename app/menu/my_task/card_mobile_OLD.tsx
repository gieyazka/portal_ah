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
        <div className="flex justify-between  items-end mt-2 mr-2 ">
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
      {console.log(handleFilter(data))}
      {data &&
        handleFilter(data)?.map((task: { [key: string]: any }) => {
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
                    <div>
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

              {/* <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Issue Date :{" "}
                  {dayjs(task.issueDate).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </CardContent> */}
              {/* <CardActions sx={{ justifyContent: "end" }}>
                {action_item && action_item.component !== undefined && (
                  <div>{action_item.component(task)}</div>
                )} */}

              {/* <ExpandMore
                  expand={expanded}
                  className='w-fit p-2 m-2'
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore> */}
              {/* </CardActions> */}
              {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>Method:</Typography>
                  <Typography paragraph>
                    Heat 1/2 cup of the broth in a pot until simmering, add
                    saffron and set aside for 10 minutes.
                  </Typography>
                  <Typography paragraph>
                    Heat oil in a (14- to 16-inch) paella pan or a large, deep
                    skillet over medium-high heat. Add chicken, shrimp and
                    chorizo, and cook, stirring occasionally until lightly
                    browned, 6 to 8 minutes. Transfer shrimp to a large plate
                    and set aside, leaving chicken and chorizo in the pan. Add
                    pimentón, bay leaves, garlic, tomatoes, onion, salt and
                    pepper, and cook, stirring often until thickened and
                    fragrant, about 10 minutes. Add saffron broth and remaining
                    4 1/2 cups chicken broth; bring to a boil.
                  </Typography>
                  <Typography paragraph>
                    Add rice and stir very gently to distribute. Top with
                    artichokes and peppers, and cook without stirring, until
                    most of the liquid is absorbed, 15 to 18 minutes. Reduce
                    heat to medium-low, add reserved shrimp and mussels, tucking
                    them down into the rice, and cook again without stirring,
                    until mussels have opened and rice is just tender, 5 to 7
                    minutes more. (Discard any mussels that don&apos;t open.)
                  </Typography>
                  <Typography>
                    Set aside off of the heat to let rest for 10 minutes, and
                    then serve.
                  </Typography>
                </CardContent>
              </Collapse> */}
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
