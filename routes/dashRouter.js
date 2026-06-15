import { Router } from "express"

import { dashHome, getProfiles, followUser, unfollowUser } from "../controllers/dashController.js"

const dashRouter = Router(); //sets the router

//*Note to send data use* /route?id=5&name=Jon 
dashRouter.get("/", dashHome) //route method to function
dashRouter.get("/profiles", getProfiles) //get profiles from database
dashRouter.post("/follow", followUser)
dashRouter.post("/unfollow", unfollowUser)



export { dashRouter };