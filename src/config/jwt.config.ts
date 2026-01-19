// src/config/jwt.config.ts
export default () => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME,
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
  },
});
