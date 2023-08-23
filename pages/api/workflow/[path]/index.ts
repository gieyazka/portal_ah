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
        const resTask = await axios.post(`${process.env.NEXT_PUBLIC_WORKFLOW_URL}/custom_api/${path}`,
            data
        )
        res.status(resTask.status).json( resTask.data)
    } else {

        res.status(200).json({ name: 'John Doe' })
    }
}
