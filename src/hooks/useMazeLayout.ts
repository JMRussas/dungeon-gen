// dungeon-gen - useMazeLayout Hook
//
// Computes cell positions, wall visibility, stair connections, and
// colors for a single maze level. Pure computation extracted from
// the MazeGrid component.
//
// Depends on: algorithms/types.ts
// Used by:    components/MazeGrid.tsx

import { useMemo } from "react";
import {
  type MazeResult,
  RoomType,
  ROOM_COLORS,
  cellIndex,
  wallKey,
} from "../algorithms/types";

const CELL_SIZE = 64;
const PADDING = 2;

export interface CellLayout {
  index: number;
  x: number;
  y: number;
  roomType: RoomType;
  color: string;
  wallSouth: boolean;
  wallEast: boolean;
  stairUp: boolean;
  stairDown: boolean;
  hasStairs: boolean;
}

export interface MazeLayout {
  width: number;
  height: number;
  padding: number;
  cellSize: number;
  cells: CellLayout[];
}

export function useMazeLayout(maze: MazeResult, activeLevel: number): MazeLayout {
  return useMemo(() => {
    const { config, removedWalls, cellTypes } = maze;
    const { rows, cols, levels } = config;

    const width = cols * CELL_SIZE + PADDING * 2;
    const height = rows * CELL_SIZE + PADDING * 2;

    const cells: CellLayout[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = cellIndex(config, activeLevel, row, col);
        const roomType = cellTypes.get(cell) ?? RoomType.Combat;
        const x = PADDING + col * CELL_SIZE;
        const y = PADDING + row * CELL_SIZE;

        // Stair connections
        let stairUp = false;
        let stairDown = false;
        if (levels > 1) {
          if (activeLevel < levels - 1) {
            const above = cellIndex(config, activeLevel + 1, row, col);
            stairUp = removedWalls.has(wallKey(cell, above));
          }
          if (activeLevel > 0) {
            const below = cellIndex(config, activeLevel - 1, row, col);
            stairDown = removedWalls.has(wallKey(cell, below));
          }
        }

        // Wall visibility (true = wall present, not removed)
        let wallSouth = false;
        if (row < rows - 1) {
          const neighbor = cellIndex(config, activeLevel, row + 1, col);
          wallSouth = !removedWalls.has(wallKey(cell, neighbor));
        }

        let wallEast = false;
        if (col < cols - 1) {
          const neighbor = cellIndex(config, activeLevel, row, col + 1);
          wallEast = !removedWalls.has(wallKey(cell, neighbor));
        }

        cells.push({
          index: cell,
          x,
          y,
          roomType,
          color: ROOM_COLORS[roomType],
          wallSouth,
          wallEast,
          stairUp,
          stairDown,
          hasStairs: stairUp || stairDown,
        });
      }
    }

    return { width, height, padding: PADDING, cellSize: CELL_SIZE, cells };
  }, [maze, activeLevel]);
}
