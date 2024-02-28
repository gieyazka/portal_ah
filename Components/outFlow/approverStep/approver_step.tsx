import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Step, StepConnector, StepContent, StepIconProps, StepLabel, Stepper, Typography, stepConnectorClasses, styled } from "@mui/material";
import { Check, Clear, Done, ExpandMore, GroupAdd, KeyboardReturn, Lock, Man, Person, Settings, VideoLabel } from "@mui/icons-material";
import { approver, approverList, requester, task } from "@/types/next-auth";

import ApproverData from "./approverData";
import _ from "lodash";
import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { useQuery } from "react-query";
import { useViewStore } from "@/store/store";

const ApproverStep = (props: { task: task; requester: requester }) => {
  const viewStore = useViewStore();

  const task = props.task;
  const requester = props.requester;
  const filterApprove = task.data?.approverStep?.filter((d) => d.status.toLowerCase() === "approved");
  const checkLastApprove = filterApprove.length === task.data?.approverStep.length ? 1 : 0;
  let current: number = 1 + filterApprove.length + checkLastApprove;

  const currentPosition = _apiFn.usePosition();
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        margin: "0px 8px",

        backgroundImage: "linear-gradient( 95deg,#87BA21 0%,#87BA21 50%,#87BA21 100%)",
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
        backgroundImage: "linear-gradient( 95deg,#86DC89 0%,#86DC89 50%, #86DC89 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      margin: "0px 8px",
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));
  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean; error?: boolean };
  }>(({ theme, ownerState }) => ({
    margin: "0px 4vw",
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
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
        {props.icon === 1 ? <Man /> : error ? <KeyboardReturn /> : completed ? <Check /> : active ? <Settings /> : <Lock />}
      </ColorlibStepIconRoot>
    );
  };

  const ColorlibStepIconRoot_Mobile = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean; error?: boolean };
  }>(({ theme, ownerState }) => ({
    zIndex: 1,
    padding: "4px",

    background: "#1D336D",
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
        {error ? <Clear /> : completed ? <Check /> : active ? <Settings /> : <Lock />}
      </ColorlibStepIconRoot_Mobile>
    );
  };

  if (!viewStore.isMd) {
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
                Flow Approver
              </Typography>
            </AccordionSummary>
            <AccordionDetails className='p-0 flex justify-center'>
              <Box>
                <Stepper
                  activeStep={current - 1}
                  orientation='vertical'
                >
                  {task.data.approverStep !== undefined &&
                    task.data.approverStep.map((d: { [x: string]: any }, i: number) => {
                      const labelProps: {
                        optional?: React.ReactNode;
                        error?: boolean;
                      } = {};

                      const isReject = d.status === "Rejected" || d.status === "Cancel";
                      if (isReject) {
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
                            <div className='flex flex-col'>
                              <Typography
                                component='p'
                                className={`
                                     font-semibold ${d.status === "Rejected" ? "text-[#A43030]" : "text-[#235F2A]"}`}
                              >
                                {i > 0 && task.data.approverStep[i - 1].status === "Rejected" ? "-" : d.status}
                                <Typography
                                  component='span'
                                  className='text-[#818181]'
                                >
                                  {d.actionDate && `@${dayjs(d.actionDate).format("DD/MM/YYYY")}`}
                                </Typography>
                              </Typography>
                              <Typography
                                component='p'
                                className='text-[#818181]'
                              >
                                {/* {oldApprover.name} */}
                              </Typography>
                              <ApproverData approver={d} />
                            </div>
                          </StepLabel>
                        </Step>
                      );
                    })}
                </Stepper>
              </Box>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    );
  }
  return (
    <div
      className=' rounded-[10px] relative h-full   flex flex-col bg-white '
      style={{
        boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Typography
        component='p'
        className='text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2'
      >
        Organization - {task.data.requester.company} {`>> `} {task.data.requester.department} {task.data.requester.section && ` >> ${task.data.requester.section}`}{" "}
        {task.data.requester.sub_section && ` >> ${task.data.requester.sub_section}`}
      </Typography>
      {task !== undefined && (
        <Stepper
          className=' w-auto font-[Bai Jamjuree]  my-2 py-8  px-8'
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
                  backgroundImage: "linear-gradient( 95deg,#86DC89 0%,#1D336D 100%) !important",
                  // "linear-gradient( 95deg,#86DC89 0%,##EB4242 100%)",
                },
              },
            }}
          >
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <div className=' text-[#818181] font-semibold text-sm  '>
                <Typography
                  className=' text-sm '
                  component='p'
                >
                  {requester.name}
                </Typography>
                <Typography
                  className=' text-sm '
                  component='p'
                >
                  {requester.position}
                </Typography>
                {viewStore.isMd && (
                  <>
                    <Typography
                      className=' text-sm '
                      component='p'
                    >
                      Department : {requester.company} : {requester.department}
                    </Typography>

                    <Typography
                      className=' text-sm '
                      component='p'
                    >
                      {dayjs(task.issueDate).format("DD/MM/YYYY @HH:mm:ss")}
                    </Typography>
                  </>
                )}
              </div>
            </StepLabel>
          </Step>
          {task.data.approverStep !== undefined &&
            task.data.approverStep.map((d: { [x: string]: any }, i: number) => {
              const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
              } = {};
              const isReject = d.status === "Rejected" || d.status === "Cancel";
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
                        backgroundImage: isReject ? "linear-gradient( 95deg,#86DC89 0%,#EB4242 100%) !important" : "linear-gradient( 95deg,#86DC89 0%,#86DC89 100%) !important",
                        // "linear-gradient( 95deg,#86DC89 0%,##EB4242 100%)",
                      },
                    },
                  }}
                >
                  <StepLabel
                    {...labelProps}
                    StepIconComponent={ColorlibStepIcon}
                  >
                    <ApproverData approver={d} />
                  </StepLabel>
                </Step>
              );
            })}
          {/* {task.data.currentApprover && (
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
          )} */}

          <Step>
            <StepLabel StepIconComponent={ColorlibStepIcon}>End</StepLabel>
          </Step>
        </Stepper>
      )}
    </div>
  );
};

export default ApproverStep;
