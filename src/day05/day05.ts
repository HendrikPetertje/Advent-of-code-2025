export const countTotalRangeLength = (input: string) => {
  const { ranges } = parseInput(input);

  // sort ranges
  const sortedRanges = ranges.sort((a, b) => a.start - b.start);

  // merge overlapping ranges
  const mergedRanges: typeof ranges = [];
  sortedRanges.forEach((currentRange) => {
    const lastMergedRange = mergedRanges[mergedRanges.length - 1];
    // if it is the first item
    if (!lastMergedRange) {
      mergedRanges.push(currentRange);
      return;
    }

    // if there is overlap check if we need to extend the existing record
    if (currentRange.start <= lastMergedRange.end) {
      // if the current range is fully contained, do nothing
      if (currentRange.end <= lastMergedRange.end) return;

      // biome-ignore lint/style/noNonNullAssertion: it is present
      mergedRanges[mergedRanges.length - 1]!.end = currentRange.end;
      return;
    }
    // there is no overlap at all, push it into the merged ranges
    mergedRanges.push(currentRange);
  });

  return mergedRanges.reduce((acc, curr) => acc + curr.end - curr.start + 1, 0);
};

export const countFreshIngredients = (input: string) => {
  const { ranges, items } = parseInput(input);

  // Put items into a new variable with a different reference entirely
  let filteredtems = [...items];
  ranges.forEach(({ start, end }) => {
    filteredtems.forEach((item, index) => {
      if (item >= start && item <= end) {
        filteredtems[index] = -1;
      }
    });
    filteredtems = filteredtems.filter((item) => item !== -1);
  });

  return items.length - filteredtems.length;
};

/**
 * tried to do this the fast way with splices and what not, but something kept failing and the number was too high in the real test
 * so back to simple stuff it is
 * in hindsight (figured this out while doing range length, some ranges have the same start and end, which might have caused problems)
 */
export const countFreshIngredients2 = (input: string) => {
  const { ranges, items } = parseInput(input);

  // Put items into a new variable with a different reference entirely
  const filteredtems = [...items];

  ranges.forEach(({ start, end }) => {
    // remove all items that are higher than start and lower than end (it's a lot)
    const startIndex = filteredtems.findIndex(
      (item) => item >= start && item <= end,
    );

    if (startIndex === -1) return;

    const endIndexReverse = [...filteredtems]
      .reverse()
      .findIndex((item) => item >= start && item <= end);
    const endIndex = filteredtems.length - endIndexReverse - 1;

    filteredtems.splice(startIndex, endIndex - startIndex + 1);
  });

  return items.length - filteredtems.length;
};

const parseInput = (input: string) => {
  const [ranges, items] = input.trim().split('\n\n');
  if (!ranges || !items) throw new Error('invalid data for day 5');

  const parsedRanges = ranges.split('\n').map((line) => {
    const [start, end] = line.split('-');
    if (!start || !end) throw new Error(`invalid line data, ${line}`);
    return { start: parseInt(start, 10), end: parseInt(end, 10) };
  });

  const parsedItems = items.split('\n').map((line) => parseInt(line, 10));

  return { ranges: parsedRanges, items: parsedItems };
};
