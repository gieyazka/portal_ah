import type { NextApiRequest, NextApiResponse } from 'next'

import { Session } from 'next-auth';
import _apiOutFlow from '@/utils/outFlow/api';
import _carBookingCommon from '@/utils/outFlow/carbooking';
import _eGatePassCommon from '@/utils/outFlow/eGatePass';
import axios from 'axios'
import dayjs from 'dayjs';
import { filterStore } from '@/types/next-auth';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction





export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    if (req.method === 'POST') {
        try {
            let dataArr = []
            const { user, filterStore } = req.body.data
            // const getWorkflowTask = await axios({
            //     method: 'POST',
            //     url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/custom_api/find_action_logs`,
            //     data: req.body,
            //     validateStatus: () => true,
            // })
            // dataArr = getWorkflowTask.data


            let queryCarBooking = `?managerApprove_by=${user.email}&managerApproveTime_gte=${dayjs(req.body.data.filterStore.startDate).format("YYYYMMDD HH:mm")}`
            let queryEGatePass = `?doc_type=E-Gate-Pass&action_by=manager-${user.userWithoutCompany}`
            // let queryEGatePass = `?managerApprove_by=${user.email}&managerApproveTime_gte=${dayjs(req.body.data.filterStore.startDate).format("YYYYMMDD HH:mm")}`
            if (req.body.data.filterStore.startDate) {
                queryCarBooking += `&date_gte=${dayjs(filterStore.startDate).format("YYYYMMDD HH:mm")}`
                queryEGatePass += `&created_at_gte=${dayjs(filterStore.startDate).toISOString()}`

            }


            const [getWorkflowTask, carBookingTask, eGatePassTask] = await Promise.all([
                await axios({
                    method: 'POST',
                    url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/custom_api/find_action_logs`,
                    data: req.body,
                    validateStatus: () => true,
                }),
                _apiOutFlow.getCarBookingData(queryCarBooking),
                _apiOutFlow.getGatePassData(queryEGatePass)
            ]);
            dataArr = getWorkflowTask.data
            if (carBookingTask.data !== undefined) {
                const formatCarbooking = _carBookingCommon.formatData(carBookingTask.data);
                dataArr = [...dataArr, ...formatCarbooking];
            }

            if (eGatePassTask.data !== undefined) {
                const formatData = _eGatePassCommon.formatData(eGatePassTask.data);
                dataArr = [...dataArr, ...formatData];
            }

            // try {
            //     const carBookingTask = await _apiOutFlow.getCarBookingData(queryCarBooking)
            //     if (carBookingTask.data !== undefined) {
            //         const formatCarbooking = _carBookingCommon.formatData(carBookingTask.data)

            //         dataArr = [...dataArr, ...formatCarbooking]
            //         // dataArr.concat(formatCarbooking)
            //     }
            // } catch (e: unknown) {
            //     let error
            //     if (typeof e === "string") {
            //         error = e.toUpperCase()
            //     } else if (e instanceof Error) {
            //         error = e.message
            //     }
            //     console.log('unknown when get CarBooking', error)
            // }
            // try {

            //     const eGatePassTask = await _apiOutFlow.getGatePassData(queryEGatePass)
            //     if (eGatePassTask.data !== undefined) {
            //         // console.log('50',eGatePassTask.data)
            //         const formatData = _eGatePassCommon.formatData(eGatePassTask.data)

            //         dataArr = [...dataArr, ...formatData]
            //     }
            // } catch (e: unknown) {
            //     let error
            //     if (typeof e === "string") {
            //         error = e.toUpperCase()
            //     } else if (e instanceof Error) {
            //         error = e.message
            //     }
            //     console.log('error when get eGatePass', error)

            // }

            res.status(200).send(dataArr)
        } catch (error) {
            res.status(400).send(error)
        }
        // res.status(405).send({ message: 'Only POST requests allowed 11111' })
        return
    }



    res.status(405).send({ message: 'Invalid Method requests' })
}





