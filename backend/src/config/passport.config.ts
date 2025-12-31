import { Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStraregy } from "passport-local";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";

import { config } from "./app.config";
import { NotFoundException } from "../utils/app-error";
import {
  findUserByIdService,
  loginOrCreateAccountService,
  verifyUserService,
} from "../services/auth.service";
import { ProviderEnum } from "../enums/account-provider.enum";
import { signJwtToken } from "../utils/jw";
import { RoleType } from "../enums/role.enum";
import { Types } from "mongoose";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },

    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        if (!googleId) {
          throw new NotFoundException(`Google ID (sub) is missing`);
        }
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          email: email,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
        });
        const jwt = signJwtToken({
          userId: user._id.toString(),
          role: user.role,
        });
        req.jwt = jwt;
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStraregy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user);
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);

interface JwtPayload {
  userId: string;
  role: RoleType;
}
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done) => {
    try {
      const user = await findUserByIdService(
        new Types.ObjectId(payload.userId)
      );
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const passportAuthenticateJWT = passport.authenticate("jwt", {
  session: false,
});
