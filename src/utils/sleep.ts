const sleep = async (number: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, number))
}

export default sleep
