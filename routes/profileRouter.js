import { Router } from "express"
import { upload } from "../middleware/upload.js";
import { getProfile, uploadPhoto } from "../controllers/profileController.js"

const profileRouter = Router(); //sets the router

profileRouter.get("/", getProfile) //route method to function
profileRouter.post("/upload", upload.single("image"), uploadPhoto);

export { profileRouter };