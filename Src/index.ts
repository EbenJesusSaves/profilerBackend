import app from "./server/app";
import * as dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log("check out the spider man" + PORT));
