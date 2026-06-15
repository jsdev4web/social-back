import { Router } from "express"

import { indexHome } from "../controllers/indexControllers.js"

const indexRouter = Router(); //sets the router

//*Note to send data use* /route?id=5&name=Jon 
indexRouter.get("/", indexHome) //route method to function
//indexRouter.get("/:test", indexParam) // routes to the function in controller

export { indexRouter };