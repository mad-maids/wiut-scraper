/**
 * Sleep for a given number of milliseconds
 * @param number The number of milliseconds to sleep for
 */
const sleep = async (number: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, number))
}

export default sleep
