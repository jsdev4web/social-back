import express from "express" //imports a module
const app = express(); //app represents the module
import cors from "cors"

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
  "http://localhost:5173",
  "https://social-front-n56hxhmrh-jsdev4webs-projects.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

import path from "node:path"; // route internal files and folders in os systems
import session from "express-session"; //save cookie session

import passport from "passport"; //local auth app

import {logins} from "./auth/passport.js"
logins(passport);

const _dirname = path.resolve //creates a absolute path to working dir

import { indexRouter } from "./routes/indexRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { dashRouter } from "./routes/dashRouter.js";
import { postRouter } from "./routes/postRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import { profileRouter } from "./routes/profileRouter.js";
import { friendsRouter } from "./routes/friendsRouter.js";

app.use(express.json()) //auto parse JSON request, req.body woudld not work
app.use(express.urlencoded({ extended: false })); //parse html form data readable

app.set("trust proxy", 1);

//app.use(session({ secret: "cats", resave: false, saveUninitialized: false}));
app.use(session({
  secret: "cats",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // MUST be false for HTTP localhost
    sameSite: "lax"     // IMPORTANT for cross-origin dev
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter) //tells the app which router to use 
app.use("/auth", authRouter)
app.use("/dash", dashRouter)
app.use("/post", postRouter)
app.use("/comment", commentRouter)
app.use("/profile", profileRouter)
app.use("/uploads", express.static("uploads"));
app.use("/friends", friendsRouter)



app.get("/debug", (req, res) => {

    console.log("sessionID:", req.sessionID);
console.log("session:", req.session);

  console.log("session:", req.session);
  console.log("user:", req.user);

  res.json({
    session: req.session,
    user: req.user
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});