import { Router } from "express";
import {
  getPost,
  getPosts,
  insertComment,
  postContent,
} from "../handlers/routers";

const router = Router();

router.get("/post/:id", getPost);
router.post("/post", postContent);
router.post("/post_comments", insertComment);
export default router;
