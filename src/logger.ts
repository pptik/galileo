// TODO: Use proper logging like winston or bunyan

import { format } from "date-fns"

/**
 * Write an info to the console
 * @param logText
 */
export function info (logText: string) {
  console.log(`[${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}] Info: ${logText}`)
}

/**
 * Write an error to the console. If the NODE_ENV is not production, it will print the error stack too.
 * @param error
 */
export function error (error: Error) {
  const log: string = process.env.NODE_ENV !== 'production' ? error.stack! : error.message!
  console.log(
    `[${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}] Error: ${log}`
  )
}
