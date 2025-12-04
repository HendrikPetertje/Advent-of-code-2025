export const day1_1_getAmountof0passes = (input: string) => {
  const instructions = parseInput(input);

  let counter = 0;
  let value = 50;

  instructions.forEach((instruction) => {
    if (instruction.direction === 'L') {
      value = value - instruction.amount;
    } else {
      value = value + instruction.amount;
    }

    // if value is 0 or divisible by 100, increment counter
    if (value === 0 || value % 100 === 0) {
      counter += 1;
    }
  });

  return counter;
};

export const day1_2_getAmountofAll0Passes = (input: string) => {
  const instructions = parseInput(input);

  let counter = 0;
  let value = 50;

  instructions.forEach((instruction) => {
    const previousValue = value;
    if (instruction.direction === 'L') {
      value = value - instruction.amount;
    } else {
      value = value + instruction.amount;
    }

    // count the amount of times we passed either 0 or anything divisible by 100
    const start = Math.min(previousValue, value);
    const end = Math.max(previousValue, value);
    const passes = Math.floor(end / 100) - Math.floor((start - 1) / 100);
    counter += passes;

    // if we already started on 0 or something divisible by 100, we need to decrement the counter by 1
    if (previousValue === 0 || previousValue % 100 === 0) {
      counter -= 1;
    }
  });

  return counter;
};

// Support functions

const parseInput = (input: string) => {
  return input.split('\n').map((line) => {
    const match = line.match(/^([LR])(\d+)$/);
    if (!match || !match[1] || !match[2]) {
      throw new Error(`Invalid line: ${line}`);
    }

    return { direction: match[1], amount: parseInt(match[2], 10) };
  });
};
