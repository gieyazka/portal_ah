import { Avatar, Chip, Skeleton } from "@mui/material";
import { Clear as ClearIcon, Done as DoneIcon } from "@mui/icons-material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import _apiFn from "@/utils/apiFn";
import axios from "axios";
import dayjs from "dayjs";

// import ClearIcon from '@mui/icons-material/Clear';

const RenderExportTable = ({
  headerTable,
  loading,
  mytask,
}: {
  headerTable: {
    field: string;
    color: string;
    fontColor?: string;
    value: string;
  }[];
  loading: boolean;
  mytask: any;
}) => {
  console.log(mytask);

  return (
    <div className="overflow-auto mx-2 my-2">
      <table
        style={{
          width: "100%",
          // borderRadius: "1em 1em 0 0",
          // overflow: "",
        }}
      >
        <thead className=" h-10 relative overflow-auto border-separate">
          <tr className="sticky top-0 ">
            {headerTable.map((key, index) => {
              if (index === headerTable.length - 1) {
                return (
                  <th
                    className={`px-3 $`}
                    key={index}
                    style={{
                      color: key.fontColor ? key.fontColor : "white",

                      backgroundColor: `${key.color}`,
                      borderTopLeftRadius: `${index === 0 ? "6px" : "0px"}`,
                      borderTopRightRadius: `${
                        headerTable.length - 1 === index ? "6px" : "0px"
                      }`,
                      position: "sticky",
                      right: "0px",
                    }}
                  >
                    Action
                  </th>
                );
              }

              return (
                <th
                  className="px-3"
                  key={index}
                  style={{
                    color: key.fontColor ? key.fontColor : "white",

                    backgroundColor: `${key.color}`,
                    borderTopLeftRadius: `${index === 0 ? "6px" : "0px"}`,
                    borderTopRightRadius: `${
                      headerTable.length - 1 === index ? "6px" : "0px"
                    }`,
                  }}
                >
                  {key.field}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-center ">
          {(loading
            ? Array.from(new Array(10))
            : mytask.data !== undefined && mytask.data.length > 0
            ? mytask.data
            : []
          ).map((task: any, i: number) => (
            <tr
              className={`border-2 ${i % 2 !== 0 ? "bg-white" : "bg-gray-200"}`}
              key={i.toString()}
            >
              {headerTable.map((key, index: number) => {
                if (index === headerTable.length - 1) {
                  return (
                    <td
                      className={`px-3 ${
                        i % 2 !== 0 ? "bg-white" : "bg-gray-200"
                      }`}
                      key={i.toString() + index.toString()}
                      style={{
                        color: key.fontColor ? key.fontColor : "black",
                        position: "sticky",
                        right: "0px",
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <Tooltip title="Reject">
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={async () => {
                              // await actionJob(task, "false");
                              mytask.mutate()
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={async () => {
                              // await actionJob(task, "true");
                              mytask.mutate()
                            }}
                          >
                            <DoneIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  );
                }

                let checkValue = key.value?.split(".");
                let value = task && task[key.value];
                if (checkValue?.length > 1) {
                  value = task && task[checkValue[0]][checkValue[1]];
                }
                if (key.field === "IssueDate") {
                  value = dayjs(value).format("DD/MM/YYYY HH:mm");
                }

                return (
                  <td key={i.toString() + index.toString()}>
                    <div
                      className={`text-center px-4 whitespace-nowrap py-2`}
                      // style={{ minWidth: "75%", margin: "1px 0px 1px 0px" }}
                    >
                      {!loading ? (
                        <>
                          {value.slice(0, 10) +
                            (value.length > 10 ? "..." : "")}
                        </>
                      ) : (
                        <Skeleton />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const compareKey = (tableKey: string, valueKey: string, data: {}) => {};

export default RenderExportTable;
