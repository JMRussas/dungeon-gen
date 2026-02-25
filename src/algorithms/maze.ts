// dungeon-gen - Maze Generation (Kruskal's Algorithm)
//
// Generates a perfect maze: exactly one path between any two cells.
// Ported from SluZZyDungeonCrawler/Content/maze_manager.verse (lines 265-310).
//
// Depends on: types.ts
// Used by:    App.tsx (via generate function)

import { type MazeConfig, cellIndex, totalCells, wallKey, shuffle } from "./types";

// --- Union-Find with path compression + union by rank ---

class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    // union by rank
    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA]++;
    }
    return true;
  }
}

// --- Build all internal walls ---

function buildAllWalls(config: MazeConfig): Array<[number, number]> {
  const walls: Array<[number, number]> = [];
  const { rows, cols, levels } = config;

  for (let level = 0; level < levels; level++) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = cellIndex(config, level, row, col);

        // Horizontal wall (south neighbor)
        if (row < rows - 1) {
          walls.push([cell, cellIndex(config, level, row + 1, col)]);
        }
        // Vertical wall (east neighbor)
        if (col < cols - 1) {
          walls.push([cell, cellIndex(config, level, row, col + 1)]);
        }
        // Floor/ceiling wall (level above)
        if (level < levels - 1) {
          walls.push([cell, cellIndex(config, level + 1, row, col)]);
        }
      }
    }
  }

  return walls;
}

// --- Main generation ---

/**
 * Generate a perfect maze using Kruskal's algorithm.
 * Returns the set of wall keys that were removed (passages).
 */
export function generateMaze(config: MazeConfig): Set<string> {
  const numCells = totalCells(config);
  const uf = new UnionFind(numCells);
  const allWalls = shuffle(buildAllWalls(config));
  const removed = new Set<string>();

  for (const [cellA, cellB] of allWalls) {
    if (uf.union(cellA, cellB)) {
      removed.add(wallKey(cellA, cellB));
    }
  }

  return removed;
}
