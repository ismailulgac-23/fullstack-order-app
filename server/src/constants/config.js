const ENV = {
 PORT: process.env.PORT,
 ENVIRONMENT: process.env.ENVIRONMENT,
 JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
 COOKIE_SECRET_KEY: process.env.COOKIE_SECRET_KEY
}

const redisClient = require("../services/redis");
require("dotenv").config();
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const sessionMiddleware = session({
 secret: ENV.COOKIE_SECRET_KEY,
 credentials: true,
 name: "sid",
 store: new RedisStore({ client: redisClient }),
 resave: false,
 saveUninitialized: false,
 cookie: {
  secure: ENV.ENVIRONMENT === "production" ? "true" : "auto",
  httpOnly: true,
  expires: 1000 * 60 * 60 * 24 * 7,
  sameSite: ENV.ENVIRONMENT === "production" ? "none" : "lax",
 },
});

const wrap = expressMiddleware => (socket, next) =>
 expressMiddleware(socket.request, {}, next);

const corsConfig = {
 origin: "http://localhost:3000",
 credentials: true,
};

module.exports = { sessionMiddleware, wrap, corsConfig, ENV };