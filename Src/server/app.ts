import express from "express";
import router from "../Routers/router";
import { signIn, signUp } from "../handlers/user";
import { stringValidator, validateSignIn } from "../middlewares/authChecks";
import { protect } from "../handlers/protectRoutes";
import cors from "cors";
const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "this this this this" });
});

export default app;

app.post("/createuser", stringValidator(), signUp);
app.post("/signin", validateSignIn(), signIn);
app.use("/admin", protect, router);
