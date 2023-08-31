// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import FormData from 'form-data';
import axios from 'axios'
import multer from 'multer';

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}
const handler = (async (req, res) => {
    try {
    } catch (e) {
        /* handle error */
    }
    if (req.method === 'POST') {

        const xKey = req.headers['x-api-key']
        const { flowName } = req.query
        const {data} = req.body
        const resData = await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/api/engine/start/${flowName}`,
            data: { data: data },
            headers: {  "x-api-key": xKey },
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            },
        });
        return res.status(resData.status).json(resData.data)
        // res.json({ message: 'Hello Everyone!' })
    } else {
        res.json({ message: 'Hello Everyone!' })
    }
})
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };
export default handler;
