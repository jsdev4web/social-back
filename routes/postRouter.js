import { Router } from "express"

import { postHome, createPost, deletePost, feedPost, postLike, myPost } from "../controllers/postControllers.js"

const postRouter = Router(); //sets the router

postRouter.get("/", postHome) //route method to function
postRouter.post("/create", createPost) //route method to function
postRouter.post("/delete", deletePost) //route method to function
postRouter.get("/feed", feedPost) //route method to function
postRouter.post("/:id/like", postLike) // adds a like to post
postRouter.get("/mypost", myPost) //user post & who they follow

export { postRouter };