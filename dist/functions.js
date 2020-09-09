"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequiredProperties = exports.checkRequest = void 0;
const tslib_1 = require("tslib");
const logger = require("./logger");
const properties_1 = require("./properties");
function checkRequest(requiredRequest) {
    return (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let valid = true;
        for (const type in requiredRequest) {
            if (type === "file") {
                if (!(req.file.fieldname === requiredRequest[type])) {
                    if (process.env.NODE_ENV !== "production") {
                        logger.info("Missing 'file' field");
                    }
                    valid = false;
                }
            }
            else {
                const requestType = requiredRequest[type];
                requestType.forEach((parameterName) => {
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
                .status(properties_1.requestResponse.incomplete_body.code)
                .json(properties_1.requestResponse.incomplete_body);
        }
        else {
            next();
        }
    });
}
exports.checkRequest = checkRequest;
function checkRequiredProperties(requiredProperties, properties) {
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
exports.checkRequiredProperties = checkRequiredProperties;
