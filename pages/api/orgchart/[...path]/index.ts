import type { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios'
import fn from "@/utils/common";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // if (req.method !== 'POST') {
    //     console.log('',req.body)
    //     res.status(405).send({ message: 'Only POST requests allowed' })
    //     return
    // }
    // console.log(' req.query', req.query)
    if (req.method === 'POST') {
        const { path } = req.query
        const data = req.body
        const joinPath = path?.join('/');
        const resTask = await axios.post(`${process.env.NEXT_PUBLIC_Strapi}/api/${joinPath}`,
            data
        )
        res.status(resTask.status).json(resTask.data)
    } else {

        const { path, ...query } = req.query
        const joinPath = path?.join('/');
        const newQuery = fn.objectToQueryString(query)
        if (newQuery) {
            const resTask = await axios.get(`${process.env.NEXT_PUBLIC_Strapi}/api/${joinPath}?${newQuery}`)
            res.status(resTask.status).json(resTask.data)
            return resTask
        }
        const resTask = await axios.get(`${process.env.NEXT_PUBLIC_Strapi}/api/${joinPath}`)
        res.status(resTask.status).json(resTask.data)

    }
}

