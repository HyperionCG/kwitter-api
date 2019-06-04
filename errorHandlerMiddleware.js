const statuses = require("statuses");

module.exports = (err, req, res, next) => {
  // some packages pass an error with a status property instead of statusCode
  // reconcile that difference here by copying err.status to err.statusCode
  if (err.status) {
    err.statusCode = err.status;
  }
  if (err.statusCode >= 400 && err.statusCode < 500) {
    if (err.statusCode === 401) {
      res.set(
        "WWW-Authenticate",
        `Bearer realm="POST your username and password to /auth/login to receive a token"`
      );
    }
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode
    });
  } else {
    const statusCode = err.statusCode || 500;
    console.error(err.stack);
    res.json({
      message: statuses[statusCode],
      statusCode: statusCode
    });
  }
};
