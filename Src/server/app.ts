import express from "express";
import router from "../Routers/router";
import { signUp } from "../handlers/user";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "this this this this" });
});

export default app;

app.post("/createuser", signUp);
app.use("/user", router);
