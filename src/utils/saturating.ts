/**
 * Function to perform saturating subtraction
 * @param a base
 * @param b rhs
 * @param min possible min value which is defaulted to runtime SAFE_MIN_INTEGER
 * @param max possible max value which is defaulted to runtime SAFE_MAX_INTEGER
 */
const saturatingSub = (
  a: number,
  b: number,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER,
): number => {
  const result = a - b
  if (result < min) {
    return min
  }
  if (result > max) {
    return max
  }
  return result
}

export default saturatingSub
