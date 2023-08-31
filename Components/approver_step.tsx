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
  // console.log("currentPosition", currentPosition.data);
  // console.log("nextAppoverArr", nextAppoverArr);
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
      color: "#FFF",
      backgroundColor: "#1D336D",
    }),
    ...(ownerState.completed && {
      color: "#FFF",
      backgroundColor: "#86DC89",
    }),
    ...(ownerState.error && {
      color: "#FFF",
      backgroundColor: "#EB4242",
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

  const ColorlibStepIconRoot_Mobile = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean; error?: boolean };
  }>(({ theme, ownerState }) => ({
    zIndex: 1,
    color: "#fff",
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      color: "#FFF",
      backgroundColor: "#1D336D",
    }),
    ...(ownerState.completed && {
      color: "#FFF",
      backgroundColor: "#86DC89",
    }),
    ...(ownerState.error && {
      color: "#FFF",
      backgroundColor: "#EB4242",
    }),
  }));

  const ColorlibStepIcon_Mobile = (props: StepIconProps) => {
    const { active, completed, className, error } = props;

    return (
      <ColorlibStepIconRoot_Mobile
        ownerState={{ completed, active, error }}
        className={className}
      >
        {error ? (
          <Clear />
        ) : completed ? (
          <Check />
        ) : active ? (
          <Settings />
        ) : (
          <Lock />
        )}
      </ColorlibStepIconRoot_Mobile>
    );
  };

  const CurrentApprover = () => {
    if (currentPosition.isLoading) {
      return <div>Loading</div>;
    }
    if (currentPosition.data == undefined) {
      return <div>No data</div>;
    }
    // console.log('currentPosition',currentPosition)
    return (
      <>
        {currentPosition.data !== undefined &&
        task.data.currentApprover.name === undefined ? (
          <p>
            {currentPosition.data.data.find(
              (d: any) => d.attributes.level === task.data.currentApprover.level
            )?.attributes?.position ?? ""}
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
  const NextApprover = (props: { nextAppover: approver }) => {
    if (currentPosition.isLoading) {
      return <div>Loading</div>;
    }
    if (currentPosition.data == undefined) {
      return <div>No data</div>;
    }
    const nextAppover = props.nextAppover;
    let curPOs =
      currentPosition.data.data.find(
        (position: any) => position.attributes.level === nextAppover!.level
      ) || undefined;
    // console.log("nextAppover", nextAppover);
    return (
      <div>
     
        {task.data.currentApprover ? (
          <>
             <p>{curPOs ? curPOs?.attributes?.position : nextAppover.level}</p>
            <p>
              {fn.checkString(nextAppover.section, undefined, "")}
              {fn.checkString(nextAppover.company, undefined, ":")}

              {fn.checkString(nextAppover.department, undefined, ":")}

              {fn.checkString(nextAppover.sub_section, undefined, ":")}
            </p>
          </>
        ) : (
          <p>Wait for Resend</p>
        )}
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
              <AccordionDetails className="p-0 flex justify-center">
                <Box>
                  <Stepper activeStep={current} orientation="vertical">
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
                            <Step
                              key={"div" + i}
                              sx={{
                                // [`& .MuiStepLabel-root`]: {
                                //   [`& .MuiStepLabel-iconContainer `]: {
                                //     [`& .MuiSvgIcon-root`]: {
                                //       color:
                                //         d.action === "Rejected"
                                //           ? "#EB4242"
                                //           : "#86DC89",
                                //     },
                                //   },
                                // },

                                [`& .${stepConnectorClasses.active}   `]: {
                                  [`& .${stepConnectorClasses.line}  `]: {
                                    vertical: {
                                      padding: 0,
                                      width: 5,
                                      marginLeft: 8, // half icon
                                    },
                                    // margin: "4px 0px",

                                    backgroundImage:
                                      // "linear-gradient( 95deg,#86DC89 0%,#1D336D 100%) !important",
                                      "linear-gradient( 95deg,#86DC89 0%,##EB4242 100%)",
                                  },
                                },
                              }}
                            >
                              <StepLabel
                                {...labelProps}
                                StepIconComponent={ColorlibStepIcon_Mobile}
                              >
                                <div className="flex flex-col">
                                  <Typography
                                    component="p"
                                    className={`
                                     font-semibold ${
                                       d.action === "Rejected"
                                         ? "text-[#A43030]"
                                         : "text-[#235F2A]"
                                     }`}
                                  >
                                    {d.action}
                                    <Typography
                                      component="span"
                                      className="text-[#818181]"
                                    >
                                      {" "}
                                      @{dayjs(d.date).format("DD/MM/YYYY")}
                                    </Typography>
                                  </Typography>
                                  <Typography
                                    component="p"
                                    className="text-[#818181]"
                                  >
                                    {d.name}
                                  </Typography>
                                </div>
                              </StepLabel>
                            </Step>
                          );
                        }
                      )}
                    {task.data.currentApprover && (
                      <Step>
                        <StepLabel>
                          <div className="flex flex-col">
                            <Typography
                              component="p"
                              className={`
                           font-semibold
                        text-[#1D336D]`}
                            >
                              {"Waiting"}{" "}
                            </Typography>
                            <Typography
                              component="p"
                              className="text-[#818181]"
                            >
                              {task.data.currentApprover.name}
                            </Typography>
                          </div>
                        </StepLabel>
                        {/* <StepLabel
                        // StepIconComponent={ColorlibStepIcon}
                        >
                          <div className="flex flex-col">
                            <CurrentApprover />
                          </div>
                        </StepLabel>
                        <StepContent></StepContent> */}
                      </Step>
                    )}
                    {nextAppoverArr !== undefined &&
                      nextAppoverArr?.length > 0 &&
                      nextAppoverArr.map((d, index) => (
                        <Step
                          key={`step_${index}`}
                          sx={{
                            [`& .${stepConnectorClasses.active}   `]: {
                              [`& .${stepConnectorClasses.line}  `]: {
                                vertical: {
                                  padding: 0,
                                  width: 5,
                                  marginLeft: 8, // half icon
                                },
                                // margin: "4px 0px",

                                backgroundImage:
                                  // "linear-gradient( 95deg,#86DC89 0%,#1D336D 100%) !important",
                                  "linear-gradient( 95deg,#86DC89 0%,##EB4242 100%)",
                              },
                            },
                          }}
                        >
                          <StepLabel>
                            <div className="flex flex-col">
                              <NextApprover nextAppover={d} />
                            </div>
                          </StepLabel>
                          <StepContent></StepContent>
                        </Step>
                      ))}
                  </Stepper>
                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {task !== undefined && (
        <Stepper
          className=" w-auto font-[Bai Jamjuree]"
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
          {nextAppoverArr !== undefined &&
            nextAppoverArr?.length > 0 &&
            nextAppoverArr.map((d, index) => (
              <Step key={`step_${index}`}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <div className="flex flex-col">
                    <NextApprover nextAppover={d} />
                  </div>
                </StepLabel>
              </Step>
            ))}
          <Step>
            <StepLabel StepIconComponent={ColorlibStepIcon}>End</StepLabel>
          </Step>
        </Stepper>
      )}
    </>
  );
};

export default ApproverStep;
