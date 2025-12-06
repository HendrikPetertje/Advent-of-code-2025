// part 1
export const doTheMath = (input: string) => {
  const { dataLines, operationsLine } = parseInputForPart1(input);

  let sum = BigInt(0);
  operationsLine.forEach((operation, index) => {
    // biome-ignore lint/style/noNonNullAssertion: should be present
    const selectedNumbers = dataLines.map((line) => line[index]!);
    if (operation === '+') {
      sum =
        sum +
        selectedNumbers.reduce((acc, curr) => acc + BigInt(curr), BigInt(0));
      return;
    }
    if (operation === '*') {
      const [first, ...rest] = selectedNumbers;
      sum =
        sum +
        // biome-ignore lint/style/noNonNullAssertion: is present
        rest.reduce((acc, curr) => acc * BigInt(curr), BigInt(first!));
    }
  });

  return sum;
};

const parseInputForPart1 = (input: string) => {
  const split = input
    .trim()
    .split('\n')
    .map((line) => line.trim().split(/\s+/));

  // the first lines are data, the last line are operations
  const dataLines = split
    .slice(0, -1)
    .map((line) => line.map((item) => parseInt(item, 10)));
  // biome-ignore lint/style/noNonNullAssertion: it is present
  const operationsLine = split.at(-1)!;

  return { dataLines, operationsLine };
};

// part 2
export const doTheMathCephalopodsStyle = (input: string) => {
  const { dataLines, operationsLine } = parseInputForPart2(input);

  // biome-ignore lint/style/noNonNullAssertion: is present
  let index = dataLines[0]!.length - 1;
  let sum = BigInt(0);
  let currentNumbers: number[] = [];

  while (index >= 0) {
    // parse the column into a number
    const columnItems = dataLines
      .map((line) => line[index])
      .filter((item) => item !== ' ')
      .join('');

    // We are at a position between numbers
    if (columnItems.length === 0) {
      index -= 1;
      continue;
    }

    const number = parseInt(columnItems, 10);
    currentNumbers.push(number);

    // check if we should perform an operation
    const operation = operationsLine[index];
    if (operation && operation !== ' ') {
      if (operation === '+') {
        sum =
          sum +
          currentNumbers.reduce((acc, curr) => acc + BigInt(curr), BigInt(0));
      } else if (operation === '*') {
        const [first, ...rest] = currentNumbers;
        sum =
          sum +
          // biome-ignore lint/style/noNonNullAssertion: is present
          rest.reduce((acc, curr) => acc * BigInt(curr), BigInt(first!));
      }
      currentNumbers = [];
    }
    index -= 1;
  }

  return sum;
};

const parseInputForPart2 = (input: string) => {
  const split = input
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => line.split(''));

  const dataLines = split.slice(0, -1);
  // biome-ignore lint/style/noNonNullAssertion: it is present
  const operationsLine = split.at(-1)!;

  return { dataLines, operationsLine };
};
