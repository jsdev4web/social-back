import { Router } from "express"
import passport from "passport"

const authRouter = Router();

import { authHome, signUp } from "../controllers/authControllers.js"

authRouter.get("/", authHome);
authRouter.post("/sign-up", signUp)

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
 
  res.json({
    success: true,
    id: req.user.id,
    name: req.user.name,
  });
});

authRouter.get("/me", (req, res) => {
  console.log("AUTH ME SESSION:", req.session);
  console.log("AUTH ME USER:", req.user);

  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
    session: req.session,
  });
});

authRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
})

export { authRouter };