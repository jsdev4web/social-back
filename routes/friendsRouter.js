import { Router } from "express"

import { getFriends, followUser, unfollowUser } from "../controllers/friendsController.js"

const friendsRouter = Router(); //sets the router

friendsRouter.get("/", getFriends) //route method to function
friendsRouter.post("/follow", followUser)
friendsRouter.post("/unfollow", unfollowUser)

export { friendsRouter };