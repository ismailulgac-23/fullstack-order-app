const httpStatus = require("http-status");
const db = require("../services/db/index");
const { compareSync, hashSync, hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { createAction } = require("../constants/helpers");
const { ENV } = require("../constants/config");
exports.login = async (req, res) => createAction(res, async () => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Required!",
      data: null,
      status: httpStatus.BAD_REQUEST
    });

  const user = await db.user.findFirst({
    where: {
      username: username,
    }
  });
  if (!user)
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Wrong credentials!",
      data: null,
      status: httpStatus.BAD_REQUEST
    });

  if (!compareSync(password, user.password))
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Wrong credentials!",
      data: null,
      status: httpStatus.BAD_REQUEST
    });

  const userWithoutPass = {
    ...user,
    password: undefined
  };

  const token = sign({ user: userWithoutPass }, ENV.JWT_SECRET_KEY, { expiresIn: "7d" });

  return res.status(httpStatus.OK).json({
    message: "Logged in!",
    data: {
      user: userWithoutPass,
      token: token
    },
    status: httpStatus.OK
  });
});
exports.register = (req, res) => createAction(res, async () => {
  const { fullName, username, password } = req.body;
  if (!fullName || !username || !password)
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Required!",
      data: null,
      status: httpStatus.BAD_REQUEST
    });

  const isUserRegistered = await db.user.findFirst({
    where: {
      username: username
    }
  });

  if (isUserRegistered)
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Please choose a unique username!",
      data: null,
      status: httpStatus.BAD_REQUEST
    });

  const hashedPassword = hashSync(password, 12);

  const createdUser = await db.user.create({
    data: {
      fullName: fullName,
      username: username,
      password: hashedPassword
    },
    select: {
      uuid: true,
      fullName: true,
      username: true
    }
  });

  const token = sign({ user: user }, ENV.JWT_SECRET_KEY, { expiresIn: "7d" });

  return res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Registered!",
    data: {
      user: user,
      token: token
    }
  })

});