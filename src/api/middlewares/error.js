const httpStatus = require('http-status');
const APIError = require('../errors/api-error');


const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
  };

  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};