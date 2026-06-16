import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { getProfile, uploadPhoto } from "../controllers/profileController.js";


const profileRouter = Router();

profileRouter.get("/", getProfile);
profileRouter.post("/upload", upload.single("image"), uploadPhoto);

export { profileRouter };