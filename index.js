const logger = require('./logger')

/**
 * @function checkRequest
 * This method is used in express middleware. It will check the incoming request with required request.
 * @param {Object} requiredRequest
 * @returns {function(...[*]=)}
 */
function checkRequest (requiredRequest) {
  return async (req, res, next) => {
    let valid = true

    for (const type in requiredRequest) {
      if (type === 'file') {
        if (!(req.file.fieldname === requiredRequest[type])) {
          if (process.env.NODE_ENV !== 'production') {
            logger.info('Missing \'file\' field')
          }
          valid = false
        }
      } else {
        requiredRequest[type].forEach(parameterName => {
          if (!(parameterName in req[type])) {
            if (process.env.NODE_ENV !== 'production') {
              logger.info(`Missing ${parameterName} field`)
            }
            valid = false
          }
        })
      }
    }

    if (!valid) {
      res
        .status(requestResponse.incomplete_body.code)
        .json(requestResponse.incomplete_body)
    } else {
      next()
    }
  }
}

/**
 * @function checkRequiredProperties
 * This method is an alternative method from checkRequest, but can be used more universal, not limited only to express middleware.
 * @param {Object} requiredProperties
 * @param {Object} properties
 * @returns {boolean}
 */
function checkRequiredProperties (requiredProperties, properties) {
  let valid = true

  for (const type in requiredProperties) {
    requiredProperties[type].forEach(parameterName => {
      if (!(parameterName in properties[type])) {
        if (process.env.NODE_ENV !== 'production') {
          logger.info(`Missing ${parameterName} field`)
        }
        valid = false
      }
    })
  }

  return valid
}

const requestResponse = {
  success: {
    code: 200,
    status: true,
    message: 'Success.'
  },
  incomplete_body: {
    code: 400,
    status: false,
    message: 'Bad request. Please check your request data.'
  },
  unauthorized: {
    code: 401,
    status: false,
    message:
      'E-mail or password does not match, or you are not authorized to accessing this page.'
  },
  not_found: {
    code: 404,
    status: false,
    message: 'Resource not found.'
  },
  unprocessable_entity: {
    code: 422,
    status: false,
    message: 'The request you sent is unable to process.'
  },
  server_error: {
    code: 500,
    status: true,
    message: 'Internal server error. Please contact the administrator.'
  }
}

const mongoOptions = {
  keepAlive: true,
  poolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: false
}

module.exports = {
  logger,
  checkRequest,
  checkRequiredProperties,
  mongoOptions,
  requestResponse
}