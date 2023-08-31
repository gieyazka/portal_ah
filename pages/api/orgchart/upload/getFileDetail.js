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
    if (req.method === 'GET') {
        const newQuery = fn.objectToQueryString(req.query)
        const resTask = await axios.get(`${process.env.NEXT_PUBLIC_Strapi}/api/upload/files?${newQuery}`)
        return res.status(resTask.status).json(resTask.data)
        // return res.status(404).json({ error: "test" })
    }
    else {
        res.json({ message: 'Hello Everyone!' })
    }
})


export default handler;
