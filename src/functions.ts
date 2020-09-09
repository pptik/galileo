import { Request, Response, NextFunction } from 'express'
import * as logger from './logger'
import { requestResponse } from './properties'

type RecordOfFields<O> = {
  [k in keyof O]: ReadonlyArray<keyof O[k]>
}

interface MulterRequest extends Request {
  file: {
    fieldname: string
  }
}

interface RequiredProperties {
  body?: string[],
  headers?: string[],
  file?: string,
  files?: string[],
  fields?: string[]
}

/**
 * @function checkRequest
 * This method is used in express middleware. It will check the incoming request with required request.
 * @param {RequiredProperties} requiredRequest
 * @returns {function(...[*]=)}
 */
export function checkRequest (requiredRequest: RequiredProperties) {
  return async (req: MulterRequest, res: Response, next: NextFunction) => {
    let valid = true;

    for (const type in requiredRequest) {
      if (type === "file") {
        if (!(req.file.fieldname === requiredRequest[type])) {
          if (process.env.NODE_ENV !== "production") {
            logger.info("Missing 'file' field");
          }
          valid = false;
        }
      } else {
        const requestType: keyof RequiredProperties = requiredRequest[type]
        requestType.forEach((parameterName: string) => {
          if (!(parameterName in req[type])) {
            if (process.env.NODE_ENV !== "production") {
              logger.info(`Missing ${parameterName} field`);
            }
            valid = false;
          }
        });
      }
    }

    if (!valid) {
      res
        .status(requestResponse.incomplete_body.code)
        .json(requestResponse.incomplete_body);
    } else {
      next();
    }
  };
}

/**
 * @function checkRequiredProperties
 * This method is an alternative method from checkRequest, but can be used more universal, not limited only to express middleware.
 * @param {Object} requiredProperties
 * @param {Object} properties
 * @returns {boolean}
 */
export function checkRequiredProperties<O>(requiredProperties: RecordOfFields<O>, properties: O) {
  let valid = true;

  for (const type in requiredProperties) {
    requiredProperties[type].forEach((parameterName) => {
      if (!(parameterName in properties[type])) {
        if (process.env.NODE_ENV !== "production") {
          logger.info(`Missing ${parameterName} field`);
        }
        valid = false;
      }
    });
  }

  return valid;
}
