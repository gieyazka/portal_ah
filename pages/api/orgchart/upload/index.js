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
        await runMiddleware(req, res, upload.single("files"))
    } catch (e) {
        /* handle error */
    }

    if (req.method === 'POST') {
        let send_formData = new FormData();
        const file = req.file
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        send_formData.append(`files`, req.file.buffer, req.file.originalname);
        const resData = await axios({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_Strapi_Org}/upload`,
            data: send_formData,
            headers: { "Content-Type": "multipart/form-data" },
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            },
        });
        return res.status(resData.status).json(resData.data)
        // return res.status(404).json({error : "test"})
    }
    else {
        res.json({ message: 'Hello Everyone!' })
    }
})
export const config = {
    api: {
        bodyParser: false,
    },
};
export default handler;
