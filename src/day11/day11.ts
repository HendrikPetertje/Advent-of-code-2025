/** biome-ignore-all lint/style/noNonNullAssertion: all over the place */

export const getPossiblePaths = (
  input: string,
  startPoint: string,
  requiredRoutPoints: string[] = [],
) => {
  const devices = parseInput(input);

  const cache = new Map<string, number>();

  const step = (current: string, visited: Set<string>): number => {
    console.log(`Cache size: ${cache.size}`);
    if (current === 'out') {
      return requiredRoutPoints.every((point) => visited.has(point)) ? 1 : 0;
    }

    // Create cache key from current node and sorted visited nodes
    const visitedArray = Array.from(visited).sort();
    const cacheKey = `${current}:${visitedArray.join(',')}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const paths = devices[current]!;

    const numberOfPaths = paths.map((path) => {
      if (visited.has(path)) return 0;

      const newVisited = new Set(visited);
      newVisited.add(path);
      return step(path, newVisited);
    });

    const result = numberOfPaths.reduce((a, b) => a + b, 0);
    cache.set(cacheKey, result);
    return result;
  };

  const initialVisited = new Set<string>([startPoint]);
  const result = step(startPoint, initialVisited);
  return result;
};

const parseInput = (input: string) => {
  const devices = input
    .split('\n')
    .reduce<Record<string, string[]>>((acc, line) => {
      const [device, rest] = line.split(': ');
      if (!device || !rest) throw new Error(`invalid line: ${line}`);
      const attachedTo = rest.split(' ');
      acc[device] = attachedTo;
      return acc;
    }, {});

  return devices;
};
