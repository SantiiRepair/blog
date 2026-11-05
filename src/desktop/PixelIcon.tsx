import { ICONS, PALETTE, type IconName } from "./icons";

type Run = { x: number; y: number; width: number; color: string };

// Each row becomes a few rectangles (consecutive pixels of one color merged).
function toRuns(rows: readonly string[]): Run[] {
  const runs: Run[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === char) end++;
      if (char !== ".") {
        runs.push({ x, y, width: end - x, color: PALETTE[char] });
      }
      x = end;
    }
  });
  return runs;
}

const RUNS = Object.fromEntries(
  Object.entries(ICONS).map(([name, rows]) => [name, toRuns(rows)])
) as Record<IconName, Run[]>;

type PixelIconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export default function PixelIcon({ name, size = 32, className }: PixelIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {RUNS[name].map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={run.color} />
      ))}
    </svg>
  );
}
