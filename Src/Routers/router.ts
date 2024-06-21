import { Router } from "express";
import {
  deleteComment,
  deleteDraft,
  deletePost,
  editDraftPost,
  editPost,
  getDraftPost,
  getDraftPosts,
  postContent,
  postDraftPost,
  searchPost,
} from "../handlers/routers";

const router = Router();

router.post("/post", postContent);
router.delete("/delete_post", deletePost);
router.put("/edit_post", editPost);
router.post("/search_post", searchPost);

router.delete("/delete_comment", deleteComment);

//============ draft posts ===================//
router.get("/draft_posts", getDraftPosts);
router.get("/draft_post", getDraftPost);
router.post("/draft_post", postDraftPost);
router.delete("/delete_draft_post", deleteDraft);
router.put("/edit_draft_post", editDraftPost);

export default router;
