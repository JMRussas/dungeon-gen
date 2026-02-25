// dungeon-gen - Algorithm Types
//
// Shared types for maze generation and room assignment.
//
// Depends on: (none)
// Used by:    maze.ts, rooms.ts, all components

export const RoomType = {
  Safe: "Safe",
  Combat: "Combat",
  Loot: "Loot",
  Shop: "Shop",
  Boss: "Boss",
  Forge: "Forge",
} as const;

export type RoomType = (typeof RoomType)[keyof typeof RoomType];

export interface MazeConfig {
  rows: number;
  cols: number;
  levels: number;
}

export interface MazeResult {
  config: MazeConfig;
  /** Set of wall keys ("cellA-cellB") that were removed (passages). */
  removedWalls: Set<string>;
  /** Room type assigned to each cell index. */
  cellTypes: Map<number, RoomType>;
}

/** Room type display info: label and color. */
export const ROOM_COLORS: Record<RoomType, string> = {
  [RoomType.Safe]: "#22c55e",
  [RoomType.Combat]: "#ef4444",
  [RoomType.Loot]: "#eab308",
  [RoomType.Shop]: "#3b82f6",
  [RoomType.Boss]: "#a855f7",
  [RoomType.Forge]: "#f97316",
};

// --- Grid index helpers ---
// Cell index = level * (rows * cols) + row * cols + col

export function cellIndex(config: MazeConfig, level: number, row: number, col: number): number {
  return level * config.rows * config.cols + row * config.cols + col;
}

export function cellLevel(config: MazeConfig, index: number): number {
  return Math.floor(index / (config.rows * config.cols));
}

export function cellRow(config: MazeConfig, index: number): number {
  const local = index % (config.rows * config.cols);
  return Math.floor(local / config.cols);
}

export function cellCol(config: MazeConfig, index: number): number {
  const local = index % (config.rows * config.cols);
  return local % config.cols;
}

export function totalCells(config: MazeConfig): number {
  return config.rows * config.cols * config.levels;
}

/** Returns indices of all cells adjacent to the given cell (N/S/E/W/Up/Down). */
export function getCellNeighbors(config: MazeConfig, index: number): number[] {
  const neighbors: number[] = [];
  const level = cellLevel(config, index);
  const row = cellRow(config, index);
  const col = cellCol(config, index);

  if (row > 0) neighbors.push(cellIndex(config, level, row - 1, col));
  if (row < config.rows - 1) neighbors.push(cellIndex(config, level, row + 1, col));
  if (col > 0) neighbors.push(cellIndex(config, level, row, col - 1));
  if (col < config.cols - 1) neighbors.push(cellIndex(config, level, row, col + 1));
  if (level > 0) neighbors.push(cellIndex(config, level - 1, row, col));
  if (level < config.levels - 1) neighbors.push(cellIndex(config, level + 1, row, col));

  return neighbors;
}

/** Fisher-Yates shuffle (in-place). */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** Wall key: always stores lower index first for consistency. */
export function wallKey(cellA: number, cellB: number): string {
  return cellA < cellB ? `${cellA}-${cellB}` : `${cellB}-${cellA}`;
}
