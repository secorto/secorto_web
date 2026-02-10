// @ts-check
/**
 * Print an error with a base label and the error value.
 * @param {string} base
 * @param {unknown} err
 */
export function printError(base, err) {
  if (err instanceof Error) console.error(base, err.message)
  else if (typeof err === 'object' && err !== null) {
    try {
      console.error(base, JSON.stringify(err))
    } catch (e) {
      console.error(base, String(err))
    }
  } else console.error(base, String(err))
}

export default { printError }
