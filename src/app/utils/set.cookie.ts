import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as const
};

export const setAuthCookie = (res: Response, tokens: AuthTokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, cookieOptions);
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
  }
};
