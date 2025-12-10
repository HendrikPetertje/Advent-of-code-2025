/** biome-ignore-all lint/style/noNonNullAssertion: so many of these again */
/**
 * reasoning for today's part 1.
 * the [.##.] obviously looks a crapton like bit state (0 off 1 on)
 * the button part looks a crapton like bits as well 2 being 001 or at least toggling the bit at a position
 *
 * AoC 2023 day 23 was done using some version of "bitmask", so I might as well apply that here with Breadth First Search.
 * In breath first search we use a queue to try out different combinations at the same time and then stop the queue if we find the shortest path
 *  more info:
 * - https://examples.javacodegeeks.com/bit-masking-in-java
 * - https://cp-algorithms.com/graph/01_bfs.html
 *
 * The idea then:
 * - in input parsing:
 *  - convert all target light patterns into bitmasks
 *  - convert buttons into integer masks that can later be used to affect the bitmasks
 * - use BFS to figure out the smallest buttons to press
 *
 */
export const turnIndicatorLightsOn = (input: string) => {
  const parsedInput = parseInput(input);

  const shortestPresses = parsedInput.map((instructionSet) => {
    // this variable provides the maximum number of different light states
    // 1 shifted by x positions where x is the number of lights
    // so for 3 lights we would have 8 different states
    const maxPossibleStates = 1 << instructionSet.config.length;
    const visitedStates = new Array<boolean>(maxPossibleStates).fill(false);

    const queue = [];
    queue.push({ state: 0, distance: 0 });
    visitedStates[0] = true;

    while (queue.length > 0) {
      const { state, distance } = queue.shift()!;

      // If we have reached our configuration, return the distance
      if (state === instructionSet.configBitmask) return distance;

      // press each button once and push the result into the queue
      instructionSet.buttonInIntegerMasks.forEach((mask) => {
        const nextState = state ^ mask; // click the button
        if (!visitedStates[nextState]) {
          visitedStates[nextState] = true;
          queue.push({ state: nextState, distance: distance + 1 });
        }
      });
    }

    throw new Error('Could not find the desired configuration');
  });

  const result = shortestPresses.reduce((acc, presses) => presses + acc, 0);
  return result;
};

const parseInput = (input: string) => {
  return input.split('\n').map((line) => {
    const match = line.match(/\[(.+?)\] (.+?) \{(.+)\}/);
    if (!match) throw new Error(`Invalid input line: ${line}`);

    const rawConfig = match[1]!;
    const rawButtons = match[2]!.split(' ');
    const rawJoltages = match[3]!;

    const config = rawConfig.split('').map((light) => light === '#');
    const configBitmask = config.reduce((acc, lightOn, index) => {
      if (lightOn) acc |= 1 << index;
      return acc;
    }, 0);

    const buttons = rawButtons.map((btn) => {
      const btnMatch = btn.match(/\((.+)\)/);
      if (!btnMatch) throw new Error(`Invalid button format: ${btn}`);
      const result = btnMatch[1]!
        .split(',')
        .map((target) => parseInt(target, 10));
      return result;
    });

    const buttonInIntegerMasks = buttons.map((button) =>
      button.reduce((acc, position) => {
        acc |= 1 << position;
        return acc;
      }, 0),
    );

    const joltages = rawJoltages
      .split(',')
      .map((joltage) => parseInt(joltage, 10));

    return { config, configBitmask, buttons, buttonInIntegerMasks, joltages };
  });
};
