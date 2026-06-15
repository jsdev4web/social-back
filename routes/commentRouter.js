import { Router } from "express"

import { createComment, getComment } from "../controllers/commentController.js"

const commentRouter = Router(); //sets the router

commentRouter.get("/", getComment) //route method to function
commentRouter.post("/create", createComment) //route method to function


export { commentRouter };