import { Accordion, AccordionDetails, AccordionSummary, Avatar, TabsClassKey, Typography } from "@mui/material";
import { requester, task } from "@/types/next-auth";

import ApproverStep from "../approver_step";
import { ExpandMore } from "@mui/icons-material";
import { User } from "iconsax-react";
import dayjs from "dayjs";
import fn from "@/utils/common";

const Requester = (props: { task: task; requester: requester }) => {
  const { task, requester } = props;

  return (
    <div className=' w-full h-full relative'>
      <div
        className=' rounded-[10px] relative h-full  flex flex-col  bg-white'
        style={{
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Accordion defaultExpanded>
          <AccordionSummary
            sx={{
              minHeight: 44,
              maxHeight: 44,
              "&.Mui-expanded": {
                minHeight: 44,
                maxHeight: 44,
              },
            }}
            className='p-0 bg-[#D4E8FC] rounded-t-[10px]'
            expandIcon={<ExpandMore />}
          >
            <Typography
              component='p'
              className='text-xl  py-2  text-[#1976D2]  font-bold px-2'
            >
              Requester Info.
            </Typography>
          </AccordionSummary>
          <AccordionDetails className='p-0'>
            <div className='flex flex-col flex-1 gap-1 my-auto py-2 mx-4 '>
              <div className=' '>
                <Avatar className='mx-auto h-[8vh] w-[8vh] bg-[#D8D9DA]'>
                  <User
                    size='32'
                    color='#464C59'
                  />
                </Avatar>
              </div>
              <Typography component='p'>
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
              <Typography component='p'>
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

              <Typography component='p'>
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
              <Typography component='p'>
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
                  Department :
                </b>{" "}
                {requester.departmentPayroll ?? requester.department}
              </Typography>

              {/* <Typography component="p">
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
                  Sub Section :
                </b>{" "}
                {requester.sub_section}
              </Typography> */}
              <Typography component='p'>
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
                  Start Date :
                </b>{" "}
                {requester.startDate} ({fn.getDiffDate(requester.startDate)})
              </Typography>
              <Typography component='p'>
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
                  Organization :
                </b>{" "}
                {task.data.requester.company} {`>> `} {task.data.requester.department} {task.data.requester.section && ` >> ${task.data.requester.section}`}{" "}
                {task.data.requester.sub_section && ` >> ${task.data.requester.sub_section}`}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Requester;
