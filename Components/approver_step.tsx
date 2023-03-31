import {
  Check,
  Clear,
  Done,
  GroupAdd,
  KeyboardReturn,
  Lock,
  Man,
  Person,
  Settings,
  VideoLabel,
} from "@mui/icons-material";
import {
  Chip,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { approver, approverList, task } from "@/types/next-auth";

import fn from "@/utils/common";
import { usePosition } from "@/utils/apiFn";

const ApproverStep = (props: { task: task }) => {
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

  const currentPosition = usePosition();
  let nextAppoverArr = fn.getNextApprover(task);

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        margin: "0px 4px",

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
        margin: "0px 4px",
        backgroundImage:
          "linear-gradient( 95deg,#87BA21 0%,#87BA21 50%, #1D336D 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      margin: "0px 4px",
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
      color: "#1D336D",
      backgroundColor: "transparent",
      borderColor: "#1D336D",
      borderWidth: 3,
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      // backgroundColor : '#1D336D',
      color: "#87BA21",
      backgroundColor: "transparent",
      borderColor: "#87BA21",
      borderWidth: 3,
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      // marginRight : 4
    }),
    ...(ownerState.error && {
      color: "red",
      backgroundColor: "transparent",
      borderColor: "red",
      borderWidth: 3,
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
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
            <p>{task.data.currentApprover.name}</p>
            <p>{task.data.currentApprover.position}</p>
          </>
        )}
        <p>
          {fn.checkString(undefined, task.data.currentApprover.company, "")}
          {fn.checkString(undefined, task.data.currentApprover.department, "_")}
          {fn.checkString(undefined, task.data.currentApprover.section, "_")}
        </p>
      </>
    );
  };
  const NextApprover = (props: { nextAppoverArr: approver[] }) => {
    if (currentPosition.isLoading) {
      return <div>Loading</div>;
    }
    return (
      <>
        {props.nextAppoverArr.map((d, i) => {
          let curPOs = currentPosition.data.data.find(
            (position: any) => position.attributes.level === d.level
          );
          return (
            <>
              <p>{curPOs.attributes.position}</p>
              <p>
                {fn.checkString(
                  d.company,
                  task.data.currentApprover.company,
                  ""
                )}
                {fn.checkString(
                  d.department,
                  task.data.currentApprover.department,
                  "_"
                )}
                {fn.checkString(
                  d.section,
                  task.data.currentApprover.section,
                  "_"
                )}
                {fn.checkString(
                  d.sub_section,
                  task.data.currentApprover.sub_section,
                  "_"
                )}
              </p>
            </>
          );
        })}
      </>
    );
  };
  return (
    <>
      {task !== undefined && (
        <Stepper
          activeStep={current}
          alternativeLabel
          connector={<ColorlibConnector />}
        >
          <Step>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              Submit Form
            </StepLabel>
          </Step>
          {task.data.approverList !== undefined &&
            task.data.approverList.map((d: approverList, i: number) => {
              const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
              } = {};

              if (d.action === "Rejected") {
                labelProps.error = true;
              }

              // labelProps.optional = (
              //   <Chip
              //     variant="outlined"
              //     label={d.action}
              //     icon={d.action === "Approved" ? <Done /> : <Clear />}
              //     color={d.action === "Approved" ? "success" : "error"}
              //   />
              // );
              return (
                <Step key={d.priority}>
                  <StepLabel
                    {...labelProps}
                    StepIconComponent={ColorlibStepIcon}
                  >
                    <div className="flex flex-col">
                      <p>
                        <Person /> {d.name}
                      </p>
                      <p>{d.position}</p>
                      <p>
                        {d.company}_{d.department}_{d.section}
                      </p>
                    </div>
                  </StepLabel>
                </Step>
              );
            })}
          {task.data.currentApprover && (
            <Step>
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
