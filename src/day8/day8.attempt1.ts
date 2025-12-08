type Box = { x: number; y: number; z: number };

export const countLightConnections = (input: string) => {
  const boxes = parseInput(input);
  const boxCircuits: string[][] = [];

  boxes.forEach((targetBox) => {
    // find another box that is the closest to this box
    let closestBox: Box;
    let currentDistance = Infinity;
    boxes.forEach((otherBox) => {
      if (targetBox === otherBox) return;

      // get the distance between the two boxes
      const distX = Math.abs(otherBox.x - targetBox.x);
      const distY = Math.abs(otherBox.y - targetBox.y);
      const distZ = Math.abs(otherBox.z - targetBox.z);
      const totalDistance = distX + distY + distZ;

      if (currentDistance > totalDistance) {
        closestBox = otherBox;
        currentDistance = totalDistance;
      }
    });

    // biome-ignore lint/style/noNonNullAssertion: there is always one match
    const closestBoxPosCode = `${closestBox!.x}.${closestBox!.y}.${closestBox!.z}`;
    const posCode = `${targetBox.x}.${targetBox.y}.${targetBox.z}`;

    const targetBoxCircuit = boxCircuits.find((circuit) =>
      circuit.includes(closestBoxPosCode),
    );
    if (targetBoxCircuit) {
      targetBoxCircuit.push(posCode);
    } else {
      boxCircuits.push([closestBoxPosCode, posCode]);
    }
  });

  const sizes = boxCircuits
    .map((circuit) => circuit.length)
    .sort()
    .reverse();

  console.log(sizes);
};

const parseInput = (input: string): Box[] => {
  return input.split('\n').map((line) => {
    const match = line.match(/^(\d+),(\d+),(\d+)/);
    if (!match) throw new Error(`Invalid input line: ${line}`);

    return {
      // biome-ignore lint/style/noNonNullAssertion: we checked that it is present up
      x: parseInt(match[1]!, 10),
      // biome-ignore lint/style/noNonNullAssertion: we checked that it is present up
      y: parseInt(match[2]!, 10),
      // biome-ignore lint/style/noNonNullAssertion: we checked that it is present up
      z: parseInt(match[3]!, 10),
    };
  });
};
