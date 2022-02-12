const httpStatus = require('http-status');
const APIError = require('../../api/errors/api.error');


const handler = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500

  const response = {
    code: statusCode,
    message: err.message || httpStatus[statusCode]
  };

  res.status(statusCode);
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