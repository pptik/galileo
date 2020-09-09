"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.info = void 0;
const date_fns_1 = require("date-fns");
function info(logText) {
    console.log(`[${date_fns_1.format(new Date(), 'dd-MM-yyyy HH:mm:ss')}] Info: ${logText}`);
}
exports.info = info;
function error(error) {
    const log = process.env.NODE_ENV !== 'production' ? error.stack : error.message;
    console.log(`[${date_fns_1.format(new Date(), 'dd-MM-yyyy HH:mm:ss')}] Error: ${log}`);
}
exports.error = error;
