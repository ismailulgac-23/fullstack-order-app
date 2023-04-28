const httpStatus = require("http-status");

exports.createAction = async (res, cb) => {
 try {
  await cb();
 } catch {
  return res.status(httpStatus.BAD_REQUEST).json({
   message: 'An error occured!',
   status: httpStatus.BAD_REQUEST,
   data: null
  });
 }
}