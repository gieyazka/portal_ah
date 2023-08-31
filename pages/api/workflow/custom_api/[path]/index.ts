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
        const headers = req.headers
        let config = {
            headers: headers
        }
        // console.log('config', headers)
        const resTask = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/custom_api/${path}`,
            data: data,
            headers: {
                'x-api-key': headers['x-api-key'],
                'content-type': headers['content-type']
            }

        })
        res.status(resTask.status).json(resTask.data)
    } else {

        res.status(200).json({ name: 'John Doe' })
    }
}
