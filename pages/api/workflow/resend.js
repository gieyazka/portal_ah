// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import FormData from 'form-data';
import axios from 'axios'
import multer from 'multer';

const upload = multer()

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
        await runMiddleware(req, res, upload.array("files"))
    } catch (e) {
        /* handle error */
    }
    if (req.method === 'POST') {
        let send_formData = new FormData();
        send_formData.append("data", req.body.data);
        // if (req.files.length > 0) {
        //     req.files.forEach((d) => {
        //         send_formData.append(`files`, d.buffer, d.originalname);
        //     })
        // }
        const resData = await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/api/engine/resend/`,
            data: send_formData,
            headers: { "Content-Type": "multipart/form-data" },
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            },
        });
        return res.status(resData.status).json(resData.data)
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
