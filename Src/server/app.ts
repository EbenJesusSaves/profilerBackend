import express from "express";
import router from "../Routers/router";
import { signIn, signUp } from "../handlers/user";
import { stringValidator, validateSignIn } from "../middlewares/authChecks";
import { protect } from "../handlers/protectRoutes";
import cors from "cors";
import {
  emailNotification,
  getPost,
  getPosts,
  insertComment,
} from "../handlers/routers";
const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "this this this this" });
});

export default app;

app.post("/createuser", stringValidator(), signUp);
app.post("/signin", validateSignIn(), signIn);
app.post("/email", emailNotification);
app.get("/posts", getPosts);
app.get("/post/:id", getPost);
app.post("/post_comments", insertComment);
app.use("/admin", protect, router);
