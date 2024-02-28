import * as React from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Search } from "@mui/icons-material";
import Swal from "sweetalert2";
import { Typography } from "@mui/material";
import axios from "axios";

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
  hrSetting: any;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open, data, hrSetting } = props;
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (data !== undefined) {
      data.responsible.map((settingData: any, index: number) => {
        if (settingData.empID) {
          setValue(`empID.${index}`, settingData.empID);
          setValue(`email.${index}`, settingData.email);
          setValue(`name.${index}`, settingData.name);
        }
      });
    }
  }, [data]);

  const onClickSearch = async (empID: string, index: number) => {
    const hrOrg = await axios({
      url: `/api/orgchart/users/getUserByEmpId`,
      method: "POST",
      data: { empid: empID },
    });

    if (hrOrg.data.status === true) {
      setValue(`email.${index}`, hrOrg.data.employee.email);
      setValue(
        `name.${index}`,
        hrOrg.data.employee.prefix +
          "." +
          hrOrg.data.employee.firstName +
          " " +
          hrOrg.data.employee.lastName
      );
    } else {
      Swal.fire({
        icon: "error",
        title: `ไม่พบข้อมูลพนักงาน`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const onSaveHrSetting = async () => {
    Swal.fire({
      title: `Confirm update setting for ${data.company} `,

      showCancelButton: true,
      confirmButtonText: "Confirm",
      reverseButtons: true,
      // showLoaderOnConfirm: true,
    }).then(async (result) => {
      const { email, empID, name } = getValues();
      if (result.isConfirmed) {
        const responsible = [
          {
            type: "Daily",
            empID: empID[0],
            email: email[0],
            name: name[0],
          },
          {
            type: "Monthly",
            empID: empID[1],
            email: email[1],
            name: name[1],
          },
          {
            type: "Sub-Foreign",
            empID: empID[2],
            email: email[2],
            name: name[2],
          },
          {
            type: "Sub-Thai",
            empID: empID[3],
            email: email[3],
            name: name[3],
          },
        ];
        const res = await axios({
          url: `/api/workflow/custom_api/updateSettingHrLeave`,
          method: "POST",
          data: { id: data._id, responsible },
        });
        if (res.status === 200) {
          if (res.data.acknowledged === true) {
            hrSetting.mutate();
            Swal.fire({
              icon: "success",
              title: `แก้ไขข้อมูลสำเร็จ`,
              showConfirmButton: false,
              timer: 1500,
            });
            onClose();
          }
        }
      }
    });
  };

  if (data === undefined) {
    return <></>;
  }
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle className="font-bold text-xl text-[#1D336D] text-center">
        {data.company}
      </DialogTitle>
      <div className="mx-4 flex flex-col gap-2 justify-center mb-4">
        {data.responsible.map((settingData: any, index: number) => {
          return (
            <div key={settingData.type}>
              <div className="flex justify-between gap-4">
                <Typography component="p" className="m-auto font-semibold">
                  {settingData.type}
                </Typography>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Typography component="p" className="my-auto">
                      Emp ID :{" "}
                    </Typography>
                    <input
                      {...register(`empID.${index}`)}
                      className="border-2 border-[#1D336D] rounded-md px-4 py-1 "
                    />
                    <Button
                      startIcon={<Search />}
                      className="bg-[#F3F3F3] "
                      onClick={() =>
                        onClickSearch(getValues(`empID.${index}`), index)
                      }
                    >
                      Search
                    </Button>
                  </div>

                  <div className="flex">
                    <Typography component="p" className="mt-1">
                      Name :{" "}
                    </Typography>
                    <input
                      {...register(`name.${index}`)}
                      className="px-4"
                      readOnly
                    />
                  </div>
                  <div className="flex">
                    <Typography component="p" className="mt-1">
                      Email :{" "}
                    </Typography>
                    <input
                      {...register(`email.${index}`)}
                      className="px-4"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <hr className="mt-2" />
            </div>
          );
        })}
      </div>
      <Button
        onClick={onSaveHrSetting}
        className="bg-[#1D336D] px-2 text-white rounded-none"
      >
        Save
      </Button>
    </Dialog>
  );
}

export default SimpleDialog;
