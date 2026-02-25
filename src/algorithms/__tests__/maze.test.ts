// dungeon-gen - Maze Generation Tests
//
// Tests for Kruskal's algorithm: connectivity, perfect maze properties,
// wall count, and multi-level support.

import { describe, it, expect } from "vitest";
import { generateMaze } from "../maze";
import { type MazeConfig, getCellNeighbors, totalCells, wallKey } from "../types";

/** BFS reachability: returns the set of cells reachable from startCell. */
function reachableCells(config: MazeConfig, removedWalls: Set<string>, startCell: number): Set<number> {
  const visited = new Set<number>([startCell]);
  const queue = [startCell];
  let head = 0;

  while (head < queue.length) {
    const cell = queue[head++];
    for (const neighbor of getCellNeighbors(config, cell)) {
      if (!visited.has(neighbor) && removedWalls.has(wallKey(cell, neighbor))) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return visited;
}

describe("generateMaze", () => {
  const configs: Array<[string, MazeConfig]> = [
    ["2x2 single level", { rows: 2, cols: 2, levels: 1 }],
    ["4x4 single level", { rows: 4, cols: 4, levels: 1 }],
    ["3x3x2 multi-level", { rows: 3, cols: 3, levels: 2 }],
    ["4x4x3 multi-level", { rows: 4, cols: 4, levels: 3 }],
  ];

  for (const [name, config] of configs) {
    describe(name, () => {
      it("produces a fully connected maze (all cells reachable)", () => {
        const removed = generateMaze(config);
        const reachable = reachableCells(config, removed, 0);
        expect(reachable.size).toBe(totalCells(config));
      });

      it("removes exactly N-1 walls (spanning tree property)", () => {
        const removed = generateMaze(config);
        // A spanning tree of N nodes has exactly N-1 edges
        expect(removed.size).toBe(totalCells(config) - 1);
      });

      it("returns wall keys in canonical form (lower-higher)", () => {
        const removed = generateMaze(config);
        for (const key of removed) {
          const [a, b] = key.split("-").map(Number);
          expect(a).toBeLessThan(b);
        }
      });
    });
  }

  it("produces different mazes on repeated calls (randomness)", () => {
    const config: MazeConfig = { rows: 6, cols: 6, levels: 1 };
    const results = new Set<string>();
    // Generate 10 mazes, serialize wall sets, expect at least 2 unique
    for (let i = 0; i < 10; i++) {
      const removed = generateMaze(config);
      const sorted = [...removed].sort().join("|");
      results.add(sorted);
    }
    expect(results.size).toBeGreaterThan(1);
  });
});
