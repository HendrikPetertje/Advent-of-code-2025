export const getInvalidIds = (input: string, atLeastTwice?: boolean) => {
  const ranges = parseData(input);

  const repeated: number[] = [];

  ranges.forEach((range) => {
    range.forEach((num) => {
      const asString = num.toString();

      // check with regex if a certain pattern appears exactly twice (or more than twice for part 2)
      const regex = atLeastTwice ? /^(.+)\1+$/ : /^(.+)\1$/;
      const match = asString.match(regex);
      if (match) repeated.push(num);
    });
  });

  const sum = repeated.reduce((acc, curr) => acc + curr, 0);
  return sum;
};

// Support functions

const parseData = (input: string) => {
  const items = input.split(',');
  const ranges = items.map((item) => {
    const [start, end] = item.split('-');
    if (!start || !end) throw new Error(`invalid line data, ${item}`);

    const range = getRangeBetween(parseInt(start, 10), parseInt(end, 10));
    return range;
  });

  return ranges;
};

// thanks https://dev.to/domhabersack/create-number-ranges-in-javascript-5494 for the rough outline of this.
const getRangeBetween = (start: number, end: number) => {
  return new Array(end - start + 1).fill(0).map((_, index) => start + index);
};
