import { prisma } from "../lib/prisma.config.js";

async function indexHome(req, res) {

    console.log("test")
    res.send("Home Page Back End")
}

async function indexParam(req, res) {
    const { testId } = req.params; //any route hits the below request
    res.send(`Is the url param working = YES: ${testId}`)
}

export { indexHome, indexParam }