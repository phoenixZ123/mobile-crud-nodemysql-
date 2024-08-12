import express from "express";
import router from "./src/routes/Route.js";
import engine from "express-edge";
import { fileURLToPath } from "url";
import path from "path";
import fileUpload from "express-fileupload";
const app = express();
app.use(engine);
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log(__dirname);
app.use("/src", express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/', router);
const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
})