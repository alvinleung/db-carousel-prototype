import { clamp } from "motion";

export type MultiPathInterpolator = (t: number) => string;

export function createPathInterporlator(
  paths: string[],
): MultiPathInterpolator {
  if (paths.length < 2) {
    throw new Error("At least two paths are required.");
  }

  const numberRegex = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
  const commandRegex = /[a-zA-Z]/g;

  // Parse and validate
  const parsed = paths.map((path) => {
    const commands = path.match(commandRegex);
    const numbers = path.match(numberRegex)?.map(Number);
    if (!commands || !numbers) throw new Error("Invalid path format.");
    return { commands, numbers };
  });

  const commandSequence = parsed[0].commands.join();
  const numCount = parsed[0].numbers.length;

  for (const { commands, numbers } of parsed) {
    if (commands.join() !== commandSequence) {
      throw new Error("All paths must have the same sequence of commands.");
    }
    if (numbers.length !== numCount) {
      throw new Error("All paths must have the same number of numeric values.");
    }
  }

  const commands = parsed[0].commands;

  // Main interpolator
  return (t: number): string => {
    // clamp the time
    t = clamp(0, 1, t);

    const segmentCount = paths.length - 1;
    const scaledT = t * segmentCount;
    const index = Math.min(Math.floor(scaledT), segmentCount - 1);
    const localT = scaledT - index;

    const from = parsed[index].numbers;
    const to = parsed[index + 1].numbers;

    const interpolated = from.map((start, i) => {
      const end = to[i];
      return +(start + (end - start) * localT).toFixed(4);
    });

    // Rebuild path from commands + numbers
    let result = "";
    let numIndex = 0;

    for (let i = 0; i < commands.length; i++) {
      result += commands[i];
      const cmd = commands[i].toUpperCase();

      const paramCounts: Record<string, number> = {
        M: 2,
        L: 2,
        H: 1,
        V: 1,
        C: 6,
        S: 4,
        Q: 4,
        T: 2,
        A: 7,
        Z: 0,
      };

      const paramCount = paramCounts[cmd];
      if (paramCount === undefined) {
        throw new Error(`Unsupported command: ${cmd}`);
      }

      for (let j = 0; j < paramCount; j++) {
        result += (j > 0 ? " " : "") + interpolated[numIndex++];
      }

      result += " ";
    }

    return result.trim();
  };
}
