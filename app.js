import express from "express" //imports a module
const app = express(); //app represents the module
import cors from "cors"
import path from "node:path"; // route internal files and folders in os systems
import session from "express-session"; //save cookie session
import passport from "passport"; //local auth app
import {logins} from "./auth/passport.js"
logins(passport);

const _dirname = path.resolve() //creates a absolute path to working dir

import { indexRouter } from "./routes/indexRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { dashRouter } from "./routes/dashRouter.js";
import { postRouter } from "./routes/postRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import { profileRouter } from "./routes/profileRouter.js";
import { friendsRouter } from "./routes/friendsRouter.js";


app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://social-front-3blu2vqlf-jsdev4webs-projects.vercel.app",
  "https://social-front-eight.vercel.app",
  "https://social-front-811ma2mqp-jsdev4webs-projects.vercel.app",
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


app.use(express.json()) //auto parse JSON request, req.body woudld not work
app.use(express.urlencoded({ extended: false })); //parse html form data readable


const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
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
    sessionID: req.sessionID,
    session: req.session,
    user: req.user
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});