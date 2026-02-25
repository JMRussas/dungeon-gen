// dungeon-gen - Room Type Assignment (BFS)
//
// Assigns room types based on BFS distance from start cell.
// Start = cell 0, Boss = farthest cell.
// Ported from SluZZyDungeonCrawler/Content/maze_manager.verse (lines 315-415).
//
// Depends on: types.ts
// Used by:    App.tsx (via assignRoomTypes function)

import {
  type MazeConfig,
  RoomType,
  cellIndex,
  cellLevel,
  cellRow,
  cellCol,
  totalCells,
  wallKey,
} from "./types";

/** Returns indices of all cells adjacent to the given cell (N/S/E/W/Up/Down). */
function getCellNeighbors(config: MazeConfig, index: number): number[] {
  const neighbors: number[] = [];
  const level = cellLevel(config, index);
  const row = cellRow(config, index);
  const col = cellCol(config, index);

  // North
  if (row > 0) neighbors.push(cellIndex(config, level, row - 1, col));
  // South
  if (row < config.rows - 1) neighbors.push(cellIndex(config, level, row + 1, col));
  // West
  if (col > 0) neighbors.push(cellIndex(config, level, row, col - 1));
  // East
  if (col < config.cols - 1) neighbors.push(cellIndex(config, level, row, col + 1));
  // Below
  if (level > 0) neighbors.push(cellIndex(config, level - 1, row, col));
  // Above
  if (level < config.levels - 1) neighbors.push(cellIndex(config, level + 1, row, col));

  return neighbors;
}

/**
 * Assign room types to all cells via BFS from cell 0.
 * Returns a Map of cell index -> RoomType.
 */
export function assignRoomTypes(
  config: MazeConfig,
  removedWalls: Set<string>,
): Map<number, RoomType> {
  const numCells = totalCells(config);
  const startCell = 0;

  // BFS to find distances from start
  const distances = new Map<number, number>();
  distances.set(startCell, 0);
  const queue: number[] = [startCell];
  let farthestCell = 0;
  let farthestDist = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDist = distances.get(current)!;

    for (const neighbor of getCellNeighbors(config, current)) {
      const key = wallKey(current, neighbor);
      // Only traverse if wall was removed (passage exists)
      if (removedWalls.has(key) && !distances.has(neighbor)) {
        const newDist = currentDist + 1;
        distances.set(neighbor, newDist);
        queue.push(neighbor);
        if (newDist > farthestDist) {
          farthestDist = newDist;
          farthestCell = neighbor;
        }
      }
    }
  }

  // Default all cells to Combat
  const cellTypes = new Map<number, RoomType>();
  for (let i = 0; i < numCells; i++) {
    cellTypes.set(i, RoomType.Combat);
  }

  // Override special rooms
  cellTypes.set(startCell, RoomType.Safe);
  cellTypes.set(farthestCell, RoomType.Boss);

  // Assign Shop, Loot, Forge to first eligible mid-distance cells
  let shopAssigned = false;
  let lootAssigned = false;
  let forgeAssigned = false;

  for (let i = 0; i < numCells; i++) {
    if (shopAssigned && lootAssigned && forgeAssigned) break;
    if (i === startCell || i === farthestCell) continue;

    const dist = distances.get(i);
    if (dist !== undefined && dist > 1 && dist < farthestDist) {
      if (!shopAssigned) {
        cellTypes.set(i, RoomType.Shop);
        shopAssigned = true;
      } else if (!lootAssigned) {
        cellTypes.set(i, RoomType.Loot);
        lootAssigned = true;
      } else if (!forgeAssigned) {
        cellTypes.set(i, RoomType.Forge);
        forgeAssigned = true;
      }
    }
  }

  return cellTypes;
}
