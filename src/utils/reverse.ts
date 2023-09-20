/**
 * Reverse a string
 * @param content The string to reverse.
 */
const reverse = (content: string): string => {
  let result: string = "";

  for (let i = content.length - 1; i > -1; i--) {
    result += content[i];
  }

  return result;
};

export default reverse;
