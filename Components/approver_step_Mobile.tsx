import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Step,
  StepConnector,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import {
  Check,
  Clear,
  Done,
  ExpandMore,
  GroupAdd,
  KeyboardReturn,
  Lock,
  Man,
  Person,
  Settings,
  VideoLabel,
} from "@mui/icons-material";
import { approver, approverList, task } from "@/types/next-auth";

import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { useViewStore } from "@/store/store";

const ApproverStep = (props: { task: task }) => {
  const viewStore = useViewStore();
  const task = props.task;
  let current: number = 1;
  if (task.data.approverList !== undefined) {
    current = task.data.approverList.length + 1;
    if (task.data.status === "Rejected") {
      current -= 1;
    }
    if (task.data.status === "Success") {
      current += 1;
    }
  }

  const currentPosition = _apiFn.usePosition();
  let nextAppoverArr = fn.getNextApprover(task);
  // console.log('currentPosition',currentPosition)
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        margin: "0px 8px",

        backgroundImage:
          "linear-gradient( 95deg,#87BA21 0%,#87BA21 50%,#87BA21 100%)",
      },
    },
    // [`&.${stepConnectorClasses.active}`]: {
    //   [`& .${stepConnectorClasses.line}`]: {
    //     [`~ .Mui-error`]: {
    //       margin: "0px 2px",

    //       backgroundImage:
    //         "linear-gradient( 95deg,#FF0000 0%,#FF0000 50%,#FF0000 100%)",
    //     },
    //   },
    // },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        margin: "0px 8px",
        backgroundImage:
          "linear-gradient( 95deg,#86DC89 0%,#86DC89 50%, #86DC89 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      margin: "0px 8px",
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));
  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean; error?: boolean };
  }>(({ theme, ownerState }) => ({
    margin: "0px 4vw",
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      // backgroundColor : '#1D336D',
      color: "#FFF",
      backgroundColor: "#1D336D",
      // borderColor: "#1D336D",
      // borderWidth: 3,
      // boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      // backgroundColor : '#1D336D',
      color: "#FFF",
      backgroundColor: "#86DC89",
      // borderColor: "#87BA21",
      // borderWidth: 3,
      // boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      // marginRight : 4
    }),
    ...(ownerState.error && {
      color: "#FFF",
      backgroundColor: "#EB4242",
      // borderColor: "red",
      // borderWidth: 3,
      // boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
  }));

  const ColorlibStepIcon = (props: StepIconProps) => {
    const { active, completed, className, error } = props;

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active, error }}
        className={className}
      >
        {props.icon === 1 ? (
          <Man />
        ) : error ? (
          <KeyboardReturn />
        ) : completed ? (
          <Check />
        ) : active ? (
          <Settings />
        ) : (
          <Lock />
        )}
      </ColorlibStepIconRoot>
    );
  };

  const CurrentApprover = () => {
    if (currentPosition.isLoading) {
      return <div>Loading</div>;
    }
    if (currentPosition.data == undefined) {
      return <div>No data</div>;
    }
    return (
      <>
        {currentPosition.data !== undefined &&
        task.data.currentApprover.name === undefined ? (
          <p>
            {
              currentPosition.data.data.find(
                (d: any) =>
                  d.attributes.level === task.data.currentApprover.level
              ).attributes.position
            }
          </p>
        ) : (
          <>
            <div className=" text-[#818181] font-semibold ">
              <Typography component="p" className=" text-sm ">
                {task.data.currentApprover.name}
              </Typography>
              <Typography component="p" className=" text-sm ">
                {" "}
                {task.data.currentApprover.position}
              </Typography>
              {viewStore.isMd && (
                <Typography component="p" className=" text-sm ">
                  Department :
                  {fn.checkString(
                    undefined,
                    task.data.currentApprover.company,
                    " "
                  )}
                  {fn.checkString(
                    undefined,
                    task.data.currentApprover.department,
                    " : "
                  )}
                </Typography>
              )}
            </div>
          </>
        )}
      </>
    );
  };
  const NextApprover = (props: { nextAppoverArr: approver[] }) => {
    if (currentPosition.isLoading) {
      return <div>Loading</div>;
    }
    if (currentPosition.data == undefined) {
      return <div>No data</div>;
    }
    return (
      <div>
        {props.nextAppoverArr.map((d, i) => {
          let curPOs =
            currentPosition.data.data.find(
              (position: any) => position.attributes.level === d.level
            ) || undefined;
          return (
            <div key={`div${i}`}>
              {task.data.currentApprover ? (
                <>
                 <p>{curPOs?.attributes?.position}</p>
                  {viewStore.isMd && (
                    <p>
                      {fn.checkString(
                        d.company,
                        task.data.currentApprover?.company,
                        ""
                      )}
                      {fn.checkString(
                        d.department,
                        task.data.currentApprover?.department,
                        "_"
                      )}
                      {fn.checkString(
                        d.section,
                        task.data.currentApprover?.section,
                        "_"
                      )}
                      {fn.checkString(
                        d.sub_section,
                        task.data.currentApprover?.sub_section,
                        "_"
                      )}
                    </p>
                  )}
                </>
              ) : (
                <p>Wait for Resend</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!viewStore.isMd) {
    return (
      <>
        <div className=" w-full h-full relative">
          <div
            className=" rounded-[10px] relative h-full  flex flex-col  bg-white"
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
                className="p-0 bg-[#D4E8FC] rounded-t-[10px]"
                expandIcon={<ExpandMore />}
              >
                <Typography
                  component="p"
                  className="text-xl  py-2  text-[#1976D2]  font-bold px-2"
                >
                  Flow Process
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="p-0">
                <Box sx={{ maxWidth: 400 }}>
                  <Stepper activeStep={current - 1} orientation="vertical">
                    {task.data.approverList !== undefined &&
                      task.data.approverList.map(
                        (d: approverList, i: number) => {
                          const labelProps: {
                            optional?: React.ReactNode;
                            error?: boolean;
                          } = {};

                          if (d.action === "Rejected") {
                            labelProps.error = true;
                          }
                          return (
                            <Step key={"div" + i}>
                              <StepLabel
                              // {...labelProps}
                              // StepIconComponent={ColorlibStepIcon}
                              >
                                <div className="flex flex-col">
                                  <p>
                                    <Person /> {d.name}
                                  </p>
                                  {/* <p>{d.position}</p>
                    
                        <p>
                          {d.company}_{d.department}_{d.section}
                        </p> */}
                                </div>
                              </StepLabel>
                            </Step>
                          );
                        }
                      )}
                    {task.data.currentApprover && (
                      <Step>
                        <StepLabel
                        // StepIconComponent={ColorlibStepIcon}
                        >
                          <div className="flex flex-col">
                            <CurrentApprover />
                          </div>
                        </StepLabel>
                        <StepContent>
                          <Typography className=" text-sm ">
                            {task.data.currentApprover.position}
                          </Typography>
                        </StepContent>
                      </Step>
                    )}
                    {nextAppoverArr !== undefined &&
                      nextAppoverArr?.length > 0 && (
                        <Step>
                          <StepLabel
                          // StepIconComponent={ColorlibStepIcon}
                          >
                            <div className="flex flex-col">
                              <NextApprover nextAppoverArr={nextAppoverArr} />
                            </div>
                          </StepLabel>
                          <StepContent></StepContent>
                        </Step>
                      )}
                    <Step>
                      <StepLabel
                      // StepIconComponent={ColorlibStepIcon}
                      >
                        End
                      </StepLabel>
                    </Step>
                  </Stepper>
                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </>
    );
  }
  // console.log("task", task);
  return (
    <>
      {task !== undefined && (
        <Stepper
          className="overflow-x-auto w-auto font-[Bai Jamjuree]"
          activeStep={current}
          alternativeLabel
          connector={<ColorlibConnector />}
        >
          <Step
            sx={{
              [`& .${stepConnectorClasses.active}   `]: {
                [`& .${stepConnectorClasses.line}  `]: {
                  margin: "0px 12px",
                  // backgroundColor: "#FF5555 !important",
                  backgroundImage:
                    "linear-gradient( 95deg,#86DC89 0%,#1D336D 100%) !important",
                  // "linear-gradient( 95deg,#86DC89 0%,##EB4242 100%)",
                },
              },
            }}
          >
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <div className=" text-[#818181] font-semibold text-sm  ">
                <Typography className=" text-sm " component="p">
                  {task.data.requester.name}
                </Typography>
                <Typography className=" text-sm " component="p">
                  {task.data.requester.position}
                </Typography>
                {viewStore.isMd && (
                  <>
                    <Typography className=" text-sm " component="p">
                      Department : {task.data.requester.company} :{" "}
                      {task.data.requester.department}
                    </Typography>

                    <Typography className=" text-sm " component="p">
                      {dayjs(task.issueDate).format("DD/MM/YYYY @HH:mm:ss")}
                    </Typography>
                  </>
                )}
              </div>
            </StepLabel>
          </Step>
          {task.data.approverList !== undefined &&
            task.data.approverList.map((d: approverList, i: number) => {
              const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
              } = {};
              const isReject = d.action === "Rejected";
              if (isReject) {
                labelProps.error = true;
              }
              return (
                <Step
                  key={"div" + i}
                  sx={{
                    [`& .${stepConnectorClasses.active}   `]: {
                      [`& .${stepConnectorClasses.line}  `]: {
                        margin: "0px 12px",
                        // backgroundColor: "#FF5555 !important",
                        backgroundImage: isReject
                          ? "linear-gradient( 95deg,#86DC89 0%,#EB4242 100%) !important"
                          : "linear-gradient( 95deg,#86DC89 0%,#86DC89 100%) !important",
                        // "linear-gradient( 95deg,#86DC89 0%,##EB4242 100%)",
                      },
                    },
                  }}
                >
                  <StepLabel
                    {...labelProps}
                    StepIconComponent={ColorlibStepIcon}
                  >
                    <div className=" text-[#818181] font-semibold text-sm  ">
                      <Typography className=" text-sm " component="p">
                        {d.name}
                      </Typography>
                      <Typography className=" text-sm " component="p">
                        {d.position}
                      </Typography>
                      {viewStore.isMd && (
                        <>
                          <Typography className=" text-sm " component="p">
                            Department : {d.company} : {d.department}
                          </Typography>

                          <Typography className=" text-sm " component="p">
                            {dayjs(d.date).format("DD/MM/YYYY @HH:mm:ss")}
                          </Typography>
                        </>
                      )}
                    </div>
                  </StepLabel>
                </Step>
              );
            })}
          {task.data.currentApprover && (
            <Step
              sx={{
                [`& .${stepConnectorClasses.active}   `]: {
                  [`& .${stepConnectorClasses.line}  `]: {
                    margin: "0px 12px",
                    // backgroundColor: "#FF5555 !important",
                    backgroundImage:
                      "linear-gradient( 95deg,#86DC89 0%,#1D336D 100%) !important",
                    // "linear-gradient( 95deg,#86DC89 0%,##EB4242 100%)",
                  },
                },
              }}
            >
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <div className="flex flex-col">
                  <CurrentApprover />
                </div>
              </StepLabel>
            </Step>
          )}
          {nextAppoverArr !== undefined && nextAppoverArr?.length > 0 && (
            <Step>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <div className="flex flex-col">
                  <NextApprover nextAppoverArr={nextAppoverArr} />
                </div>
              </StepLabel>
            </Step>
          )}
          <Step>
            <StepLabel StepIconComponent={ColorlibStepIcon}>End</StepLabel>
          </Step>
        </Stepper>
      )}
    </>
  );
};

export default ApproverStep;
