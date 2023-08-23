import type { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // if (req.method !== 'POST') {
    //     console.log('',req.body)
    //     res.status(405).send({ message: 'Only POST requests allowed' })
    //     return
    // }
    if (req.method === 'POST') {
        const { path } = req.query
        const data = req.body
        const resTask = await axios.post(`${process.env.NEXT_PUBLIC_Strapi}/api/${path}`,
            data
        )
        res.status(resTask.status).json(resTask.data)
    } else {
        const { path } = req.query
        
        const resTask = await axios.get(`${process.env.NEXT_PUBLIC_Strapi}/api/${path}`)
        res.status(resTask.status).json(resTask.data)

    }
}
