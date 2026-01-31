import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { env } from "./index";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";

// validate required Google OAuth environment variables early so missing config is obvious
if (!env.google_client_id || !env.google_client_secret || !env.google_callback_url) {
  throw new Error(
    'Google OAuth environment variables missing: please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL',
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google_client_id as string,
      clientSecret: env.google_client_secret as string,
      callbackURL: env.google_callback_url,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "no email found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("google strategry error", e);
        return done(e);
      }
    },
  ),
);

// todo: serialize user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// todo: deserialize user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done : any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});
