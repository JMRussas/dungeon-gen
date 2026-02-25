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
  getCellNeighbors,
  totalCells,
  wallKey,
  shuffle,
} from "./types";

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
  let queueHead = 0;
  let farthestCell = 0;
  let farthestDist = 0;

  while (queueHead < queue.length) {
    const current = queue[queueHead++];
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

  // Collect eligible cells (mid-distance, not start or boss) and shuffle
  // to spread special rooms across the maze instead of clustering near start.
  const eligible: number[] = [];
  for (let i = 0; i < numCells; i++) {
    if (i === startCell || i === farthestCell) continue;
    const dist = distances.get(i);
    if (dist !== undefined && dist > 1 && dist < farthestDist) {
      eligible.push(i);
    }
  }
  shuffle(eligible);

  const specialRooms = [RoomType.Shop, RoomType.Loot, RoomType.Forge];
  for (let s = 0; s < specialRooms.length && s < eligible.length; s++) {
    cellTypes.set(eligible[s], specialRooms[s]);
  }

  return cellTypes;
}
