// dungeon-gen - Room Assignment Tests
//
// Tests for BFS room assignment: all cells assigned, correct special
// room placement, boss is farthest from start.

import { describe, it, expect } from "vitest";
import { assignRoomTypes } from "../rooms";
import { generateMaze } from "../maze";
import { type MazeConfig, RoomType, getCellNeighbors, totalCells, wallKey } from "../types";

/** BFS distance from startCell through removedWalls. */
function bfsDistances(config: MazeConfig, removedWalls: Set<string>, startCell: number): Map<number, number> {
  const distances = new Map<number, number>([[startCell, 0]]);
  const queue = [startCell];
  let head = 0;

  while (head < queue.length) {
    const cell = queue[head++];
    const dist = distances.get(cell)!;
    for (const neighbor of getCellNeighbors(config, cell)) {
      if (!distances.has(neighbor) && removedWalls.has(wallKey(cell, neighbor))) {
        distances.set(neighbor, dist + 1);
        queue.push(neighbor);
      }
    }
  }

  return distances;
}

describe("assignRoomTypes", () => {
  const configs: Array<[string, MazeConfig]> = [
    ["4x4 single level", { rows: 4, cols: 4, levels: 1 }],
    ["3x3x2 multi-level", { rows: 3, cols: 3, levels: 2 }],
    ["4x4x3 multi-level", { rows: 4, cols: 4, levels: 3 }],
  ];

  for (const [name, config] of configs) {
    describe(name, () => {
      it("assigns a room type to every cell", () => {
        const removed = generateMaze(config);
        const types = assignRoomTypes(config, removed);
        expect(types.size).toBe(totalCells(config));
      });

      it("marks cell 0 as Safe (start)", () => {
        const removed = generateMaze(config);
        const types = assignRoomTypes(config, removed);
        expect(types.get(0)).toBe(RoomType.Safe);
      });

      it("places Boss at the farthest cell from start", () => {
        const removed = generateMaze(config);
        const types = assignRoomTypes(config, removed);
        const distances = bfsDistances(config, removed, 0);

        // Find which cell is Boss
        let bossCell = -1;
        for (const [cell, type] of types) {
          if (type === RoomType.Boss) {
            bossCell = cell;
            break;
          }
        }
        expect(bossCell).not.toBe(-1);

        // Boss distance should equal max distance
        const maxDist = Math.max(...distances.values());
        expect(distances.get(bossCell)).toBe(maxDist);
      });

      it("has exactly one Safe and one Boss room", () => {
        const removed = generateMaze(config);
        const types = assignRoomTypes(config, removed);

        let safeCount = 0;
        let bossCount = 0;
        for (const type of types.values()) {
          if (type === RoomType.Safe) safeCount++;
          if (type === RoomType.Boss) bossCount++;
        }
        expect(safeCount).toBe(1);
        expect(bossCount).toBe(1);
      });

      it("assigns at most one of each special room type", () => {
        const removed = generateMaze(config);
        const types = assignRoomTypes(config, removed);

        const counts = new Map<RoomType, number>();
        for (const type of types.values()) {
          counts.set(type, (counts.get(type) ?? 0) + 1);
        }
        expect(counts.get(RoomType.Shop) ?? 0).toBeLessThanOrEqual(1);
        expect(counts.get(RoomType.Loot) ?? 0).toBeLessThanOrEqual(1);
        expect(counts.get(RoomType.Forge) ?? 0).toBeLessThanOrEqual(1);
      });

      it("only uses valid RoomType values", () => {
        const removed = generateMaze(config);
        const types = assignRoomTypes(config, removed);
        const validTypes = new Set(Object.values(RoomType));
        for (const type of types.values()) {
          expect(validTypes.has(type)).toBe(true);
        }
      });
    });
  }

  it("handles minimal 2x2 grid", () => {
    const config: MazeConfig = { rows: 2, cols: 2, levels: 1 };
    const removed = generateMaze(config);
    const types = assignRoomTypes(config, removed);

    expect(types.size).toBe(4);
    expect(types.get(0)).toBe(RoomType.Safe);
    // With only 4 cells, Boss should exist somewhere
    const hasBoss = [...types.values()].includes(RoomType.Boss);
    expect(hasBoss).toBe(true);
  });
});
