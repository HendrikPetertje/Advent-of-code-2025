export const getMovableToiletRollsCount = (input: string) => {
  const grid = parseInput(input);
  let count = 0;

  grid.forEach((row, y) => {
    row.forEach((position, x) => {
      if (!position) return;

      const usedSpaces = searchGrid(grid, y, x);
      if (usedSpaces < 4) count += 1;
    });
  });

  return count;
};

export const getMovableToiletrollsCountWhenRemoving = (input: string) => {
  const grid = parseInput(input);
  let count = 0;
  let continueLoop = true;

  while (continueLoop) {
    const scheduledRemove: { x: number; y: number }[] = [];

    grid.forEach((row, y) => {
      row.forEach((position, x) => {
        if (!position) return;

        const usedSpaces = searchGrid(grid, y, x);
        if (usedSpaces < 4) {
          count += 1;
          scheduledRemove.push({ x, y });
        }
      });
    });

    if (scheduledRemove.length === 0) continueLoop = false;

    scheduledRemove.forEach(({ x, y }) => {
      if (!grid[y]?.[x]) throw new Error(`grid error at x: ${x}, y: ${y}`);
      grid[y][x] = false;
    });
  }

  return count;
};

// Support functions

const parseInput = (input: string) => {
  return input
    .trim()
    .split('\n')
    .map((line) => line.split('').map((position) => position === '@'));
};

const searchGrid = (grid: boolean[][], currentY: number, currentX: number) => {
  let usedSpaces = 0;
  // left-up
  if (grid[currentY - 1]?.[currentX - 1] === true) usedSpaces += 1;
  // center-up
  if (grid[currentY - 1]?.[currentX] === true) usedSpaces += 1;
  // right-up
  if (grid[currentY - 1]?.[currentX + 1] === true) usedSpaces += 1;
  // center-left
  if (grid[currentY]?.[currentX - 1] === true) usedSpaces += 1;
  // center-right
  if (grid[currentY]?.[currentX + 1] === true) usedSpaces += 1;
  // bottom-left
  if (grid[currentY + 1]?.[currentX - 1] === true) usedSpaces += 1;
  // bottom-center
  if (grid[currentY + 1]?.[currentX] === true) usedSpaces += 1;
  // bottom-right
  if (grid[currentY + 1]?.[currentX + 1] === true) usedSpaces += 1;
  return usedSpaces;
};
