import express from "express";
import router from "../Routers/router";
import { signIn, signUp } from "../handlers/user";
import { stringValidator } from "../middlewares/authChecks";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "this this this this" });
});

export default app;

app.post("/createuser", stringValidator(), signUp);
app.post("/signin", signIn);
app.use("/user", router);
