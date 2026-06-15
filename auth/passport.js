import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../lib/prisma.config.js";
import bcrypt from "bcryptjs"


const logins = passport => {
     passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const user = await prisma.user.findFirst({
          where: {
            name: username,
          },
        });

        if (!user) {
          return done(null, false, {
            message: "Incorrect username",
          });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, {
            message: "Incorrect password",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // both of these functions are session data
  passport.serializeUser((user, done) => {
  //console.log("serializeUser fired:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    //console.log("DESERIALIZE USER RUNNING");
    //console.log("ID FROM SESSION:", id);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id)
      }
    });

    //console.log("USER FOUND IN DESERIALIZE:", user);

    done(null, user);
  } catch (err) {
    //console.log("DESERIALIZE ERROR:", err);
    done(err);
  }
});


}

export { logins }