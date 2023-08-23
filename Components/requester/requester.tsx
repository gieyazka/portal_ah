import { Avatar, Typography } from "@mui/material";
import { requester, task } from "@/types/next-auth";

import { User } from "iconsax-react";
import dayjs from "dayjs";

const Requester = (props: { requester: requester }) => {
  const requester = props.requester;
  return (
    <div className=" w-full h-full relative">
      <div
        className=" rounded-[10px] relative h-full  flex flex-col  bg-white"
        style={{
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          component="p"
          className="text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2"
        >
          Requester
        </Typography>
        <div className="flex items-center flex-1 gap-4 my-2 py-8  px-8 ">
          <div className=" basis-[20%]">
            <Avatar className="mx-auto h-[8vh] w-[8vh] bg-[#D8D9DA]">
              <User size="32" color="#464C59" />
            </Avatar>
          </div>
          <div className="basis-[35%] whitespace-nowrap">
            <Typography component="p">
              <b
                style={{
                  color: "#1D366D",
                  fontFamily: " Bai Jamjuree",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "170%",
                }}
              >
                Name :
              </b>{" "}
              {requester.name}
            </Typography>
            <Typography component="p">
              <b
                style={{
                  color: "#1D366D",
                  fontFamily: " Bai Jamjuree",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "170%",
                }}
              >
                Employee ID :
              </b>{" "}
              {requester.empid}
            </Typography>
            <Typography
              component="p"
              className="whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <b
                style={{
                  color: "#1D366D",
                  fontFamily: " Bai Jamjuree",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "170%",
                }}
              >
                Position :
              </b>{" "}
              {requester.position}
            </Typography>
          </div>
          <div className="basis-[35%] whitespace-nowrap">
            <Typography component="p">
              <b
                style={{
                  color: "#1D366D",
                  fontFamily: " Bai Jamjuree",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "170%",
                }}
              >
                Company :
              </b>{" "}
              {requester.company}
            </Typography>
            <Typography component="p">
              <b
                style={{
                  color: "#1D366D",
                  fontFamily: " Bai Jamjuree",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "170%",
                }}
              >
                Employee ID :
              </b>{" "}
              {requester.department}
            </Typography>
            <Typography component="p">
              <b
                style={{
                  color: "#1D366D",
                  fontFamily: " Bai Jamjuree",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "170%",
                }}
              >
                Section :
              </b>{" "}
              {requester.section}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requester;
