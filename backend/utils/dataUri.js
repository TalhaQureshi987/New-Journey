import { log } from "console";
import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUrl = (file) => {
    try {
        const parser = new DataUriParser();
        const extName = path.extname(file.originalname).toString();
        return parser.format(extName, file.buffer);
    } catch (error) {
        console.log(error.message);

    }

}

export default getDataUrl;