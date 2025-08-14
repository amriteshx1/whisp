import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/user";
import type { IUser } from "../models/user";

const generateFriendCode = async (): Promise<string> => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  let exists = true;
  while (exists) {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const existingUser = await User.findOne({ friendCode: code });
    if (!existingUser) exists = false;
  }
  return code;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const fullName = profile.displayName || "Google User";
        const profilePic = profile.photos?.[0]?.value?.split('=')[0] || "";

        // already have a user by googleId
        let user = await User.findOne({ googleId }).select("-password");
        if (user) return done(null, user);

        // have a local account with same email - link it
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = googleId;
            if (user.authProvider !== "google") user.authProvider = "google";
            if (!user.profilePic && profilePic) user.profilePic = profilePic;
            await user.save();
            const lean = await User.findById(user._id).select("-password");
            if (lean) {
              return done(null, lean);
            }
            return done(new Error("User not found after linking account"), false);
          }
        }

        // create a new Google-only user
        const friendCode = await generateFriendCode();
        const newUser: IUser = await User.create({
          email: email || `user-${googleId}@noemail.local`,
          fullName,
          profilePic,
          bio: "",
          friendCode,
          googleId,
          authProvider: "google",
        });

        const lean = await User.findById(newUser._id).select("-password");
        if (lean) {
          return done(null, lean);
        }
        return done(new Error("New user not found after creation"), false);
      } catch (err) {
        return done(err as any, undefined);
      }
    }
  )
);

export default passport;
