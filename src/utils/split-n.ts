import test from "node:test"
import * as assert from "assert"

/**
 * Split a string into an array of substrings, each of length n.
 * @param string The string to split.
 * @param separator The separator to use.
 * @param n The length of each substring.
 */
const splitN = (string: string, separator: string, n: number): string[] => {
  const array = string.split(separator)
  const result = []

  for (let index = 0; index < n; index++) {
    result.push(array.shift())
  }

  result.push(array.join(separator))

  return result as string[]
}

export default splitN
