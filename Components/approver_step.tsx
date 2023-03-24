import { Check, Clear, Done, Person } from "@mui/icons-material";
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

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#1D336D",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#1D336D",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));
  function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className, error } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {error ? (
          <Clear className="QontoStepIcon-errorIcon" />
        ) : completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }
  const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color:
        theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center",
      ...(ownerState.active && {
        color: "#1D336D",
      }),
      "& .QontoStepIcon-completedIcon": {
        color: "#1D336D",
        zIndex: 1,
        fontSize: 18,
      },
      "& .QontoStepIcon-errorIcon": {
        color: "red",
        zIndex: 1,
        fontSize: 18,
      },
      "& .QontoStepIcon-circle": {
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    })
  );

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
          connector={<QontoConnector />}
        >
          <Step>
            <StepLabel StepIconComponent={QontoStepIcon}>Submit Form</StepLabel>
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
                  <StepLabel {...labelProps} StepIconComponent={QontoStepIcon}>
                    <div className="flex flex-col">
                      <p><Person /> {d.name}</p>
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
              <StepLabel StepIconComponent={QontoStepIcon}>
                <div className="flex flex-col">
                  <CurrentApprover />
                </div>
              </StepLabel>
            </Step>
          )}
          {nextAppoverArr !== undefined && nextAppoverArr?.length > 0 && (
            <Step>
              <StepLabel StepIconComponent={QontoStepIcon}>
                <div className="flex flex-col">
                  <NextApprover nextAppoverArr={nextAppoverArr} />
                </div>
              </StepLabel>
            </Step>
          )}
          <Step>
            <StepLabel StepIconComponent={QontoStepIcon}>End</StepLabel>
          </Step>
        </Stepper>
      )}
    </>
  );
};

export default ApproverStep;
