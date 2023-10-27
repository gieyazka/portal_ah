"use client";

import { Add } from "@mui/icons-material";
import Image from "next/image";
import Providers from "./../provider";
import React from "react";
import RenderDialog from "./dialog";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import _apiFn from "@/utils/apiFn";
import axios from "axios";

export default function HomePage() {
  const user = _apiFn.useUser();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    data: any;
  }>({
    open: false,
    data: undefined,
  });
  const devArr = [
    "pokkate.e@aapico.com",
    "sawanon.w@aapico.com",
    "watthana.m@aapico.com",
  ];
  const checkCanView = devArr.some((d) => d === user.data?.user?.email);
  const hrSetting = _apiFn.useHrSetting(checkCanView);
  const handleClickOpen = (data: any) => {
    setDialogState({
      open: true,
      data: data,
    });
  };

  const handleClose = () => {
    setDialogState({
      open: false,
      data: undefined,
    });
  };

  const onClickAddCompany = () => {
    Swal.fire({
      title: "Input Company name  (AH)",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "ADD Company",
      reverseButtons: true,
      // showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value } = result;

        if (value === "") {
          Swal.fire({
            icon: "error",
            title: `กรุณากรอกชื่อบริษัท`,
            showConfirmButton: false,
            timer: 1500,
          });

          return;
        }
        const company = value.toUpperCase();
        const checkSameCompany = hrSetting.data?.some(
          (d) => d.company.toUpperCase() === company
        );
        if (checkSameCompany === true) {
          Swal.fire({
            icon: "error",
            title: `มีบริษัทในการตั้งค่าแล้ว`,
            showConfirmButton: false,
            timer: 1500,
          });

          return;
        }
        const addObject = {
          company: company,
          responsible: [
            {
              type: "Daily",
              empID: null,
            },
            {
              type: "Monthly",
              empID: null,
            },
            {
              type: "Sub-Foreign",
              empID: null,
            },
            {
              type: "Sub-Thai",
              empID: null,
            },
          ],
        };
        const res = await axios({
          url: `/api/workflow/custom_api/addLeaveHrCompany`,
          method: "POST",
          data: addObject,
        });
        if (res.data._id) {
          hrSetting.mutate();
          Swal.fire({
            icon: "success",
            title: `เพิ่มบริษัท ${company} สำเร็จ`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  if (hrSetting.isLoading || user.isLoading) {
    return <div>Loading...</div>;
  }
  if (checkCanView === false) {
    return (
      <div className="">
        <Image alt="no_permission" src={"/assets/no_permission.gif"} fill />
      </div>
    );
  }
  return (
    <Providers>
      <div className="w-screen h-[64px] bg-[#1D336D]  text-white flex items-center">
        <Typography variant="h4" className="ml-4">
          Setting HR
        </Typography>
      </div>
      <div className="flex gap-2 mt-8 flex-wrap mx-4">
        <div onClick={onClickAddCompany}>
          <div className="w-48 h-24 flex items-center rounded-lg border-2 border-[#1D336D] justify-center text-[#1D336D] cursor-pointer hover:bg-[#1D336D] hover:border-white hover:text-white">
            <Add className="text-[48px]" />
          </div>
        </div>
        {hrSetting.data?.map((d) => {
          return (
            <div onClick={() => handleClickOpen(d)} key={d._id}>
              <div className="w-48 h-24 flex items-center rounded-lg border-2 border-[#1D336D] justify-center text-[#1D336D] cursor-pointer hover:bg-[#1D336D] hover:border-white hover:text-white">
                <Typography variant="h3">{d.company}</Typography>
              </div>
            </div>
          );
        })}
      </div>

      <RenderDialog
        hrSetting={hrSetting}
        open={dialogState.open}
        data={dialogState.data}
        onClose={handleClose}
      />
    </Providers>
  );
}
