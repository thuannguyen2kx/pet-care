import express from "express";
import { createCommentSchema, updateCommentSchema } from "../validation/comment.validation";
import {
  addCommentController,
  getPostCommentsController,
  updateCommentController,
  deleteCommentController
} from "../controllers/comment.controller";


const commentRoutes= express.Router();

// Comment routes
commentRoutes.post(
  "/posts/:id/comments", 
  addCommentController
);

commentRoutes.get(
  "/posts/:id/comments", 
  getPostCommentsController
);

commentRoutes.put(
  "/posts/comments/:id", 
  updateCommentController
);

commentRoutes.delete(
  "/posts/comments/:id", 
  deleteCommentController
);



export default commentRoutes;