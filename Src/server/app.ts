import express from "express";
import router from "../Routers/router";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "this this this this" });
});

export default app;

app.use("/user", router);
