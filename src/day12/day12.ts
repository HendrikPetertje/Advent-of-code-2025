/** biome-ignore-all lint/style/noNonNullAssertion: those are all defined! */

export const packageFittingChecker = (input: string) => {
  const { packageAreas, parsedAreas } = parseInput(input);

  const filtered = parsedAreas.filter(({ width, height, items }) => {
    const availableArea = width * height;
    const requiredArea = items.reduce(
      (sum, item, index) => sum + packageAreas[index]! * item,
      0,
    );
    return availableArea >= requiredArea;
  });

  return filtered.length;
};

const parseInput = (input: string) => {
  const split = input.split('\n\n');

  const packageShapes = split.slice(0, -1);
  const areas = split.at(-1)!.split('\n');

  const packageAreas = packageShapes.map((packageShape) => {
    return packageShape.match(/#/g)?.length || 0;
  });

  const parsedAreas = areas.map((area) => {
    const match = area.match(/^(\d+)x(\d+): (.+)$/);
    if (!match) throw new Error('Invalid area format');

    const width = parseInt(match[1]!, 10);
    const height = parseInt(match[2]!, 10);
    const items = match[3]!.split(' ').map((item) => parseInt(item, 10));

    return { width, height, items };
  });

  return { packageAreas, parsedAreas };
};
