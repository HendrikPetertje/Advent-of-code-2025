export const getHighestJoltageChainofNum = (
  input: string,
  iterations: number,
) => {
  const banks = parseInput(input);

  const voltages = banks.map((bank) =>
    parseInt(iterateHighest(bank, iterations), 10),
  );

  return voltages.reduce((acc, curr) => acc + curr, 0);
};

const parseInput = (input: string) => {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const stringParts = line.split('');
      return stringParts.map((part) => parseInt(part, 10));
    });
};

export const iterateHighest = (
  restBank: number[],
  currentRun: number,
): string => {
  if (currentRun === 0) return '';

  // We limit to a selection so there are enough numbers left on the right to at least fill up x remaining positions
  const selection = restBank.slice(0, restBank.length - (currentRun - 1));
  // get the highest number in available selection
  const highestNumber = Math.max(...selection);
  // find the index in the list so we can then construct the remainder for the next iteration
  const indexOfHighest = restBank.indexOf(highestNumber);
  const remainingNumbers = restBank.slice(indexOfHighest + 1);

  // iterate and return
  return `${highestNumber}${iterateHighest(remainingNumbers, currentRun - 1)}`;
};
