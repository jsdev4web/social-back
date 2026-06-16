import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { getProfile, uploadPhoto, deleteProfileImage } from "../controllers/profileController.js";


const profileRouter = Router();

profileRouter.get("/", getProfile);
profileRouter.post("/upload", upload.single("image"), uploadPhoto);
profileRouter.delete("/image", deleteProfileImage);

export { profileRouter };