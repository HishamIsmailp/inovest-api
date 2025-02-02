import jwt from "jsonwebtoken";

export const generateTokens = (userId: string) => {
  return {
    accessToken: jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    }),
    refreshToken: jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    }),
  };
};
