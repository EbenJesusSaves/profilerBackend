import { Router } from "express";
import { postContent } from "../handlers/routers";

const router = Router();

router.post("/post", postContent);
export default router;
