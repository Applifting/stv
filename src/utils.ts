export const repeat = (numberOfRepeats: number, lambda: () => void) => {
  for (let i = 0; i < numberOfRepeats; i++) {
    lambda();
  }
}
