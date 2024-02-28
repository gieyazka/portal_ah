// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import FormData from 'form-data';
import axios from 'axios'
import fn from "@/utils/common";
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
    } else if (req.method === 'GET') {
        const { fileName } = req.query

        let checkFile = fileName?.includes("pdf")
            ? "pdf"
            : fn.isImageFile(fileName)
                ? "image"
                : "file";

        if (checkFile === "image" || checkFile === "pdf") {
            const resData = await axios({
                method: "GET",
                url: `${process.env.NEXT_PUBLIC_Strapi_Org}/uploads/${fileName}`,
                // responseType: "blob",
                responseType: "stream",
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                },
            });


            // res.setHeader(
            //     "Cache-Control",
            //     `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
            // );
            // res.setHeader("content-type", "image/png");

            // // const { url } = (await getAvatar(fileName)) || {};

            // // if (!url) return res.status(404).end();

            const contentType = resData.headers.get("content-type");
            // console.log('contentType', contentType)
            res.setHeader("content-type", contentType);
            res.status(200).send(resData.data);
            return;


            const imgData = Buffer.from(resData.data, 'binary').toString('base64')

            // console.log('imgData', imgData)
            res.send(imgData)
        }

        if (checkFile === "file") {


            const resData = await axios({
                method: "GET",
                url: `${process.env.NEXT_PUBLIC_Strapi_Org}/uploads/${fileName}`,
                // responseType: "blob",
                responseType: "stream",
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                },
            });
            res.setHeader("content-disposition", `attachment; filename="${fileName}"`);

            // pipe the data to the res object
            resData.data.pipe(res);
        }
        // return res.download(resData.data)
    }
    else {
        res.json({ message: 'Hello Everyone!' })
    }
})
export const config = {
    api: {
        bodyParser: false, externalResolver: true,
    },
};
export default handler;
