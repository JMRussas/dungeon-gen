// dungeon-gen - Grid Helper Tests
//
// Tests for cell indexing, wall keys, and round-trip encoding.

import { describe, it, expect } from "vitest";
import { cellIndex, cellLevel, cellRow, cellCol, totalCells, wallKey } from "../types";
import type { MazeConfig } from "../types";

describe("cell indexing", () => {
  const config: MazeConfig = { rows: 4, cols: 4, levels: 3 };

  it("encodes (0,0,0) as index 0", () => {
    expect(cellIndex(config, 0, 0, 0)).toBe(0);
  });

  it("encodes level offset correctly", () => {
    // Level 1, row 0, col 0 should be at index = 1 * 4 * 4 = 16
    expect(cellIndex(config, 1, 0, 0)).toBe(16);
  });

  it("round-trips (level, row, col) through encode/decode", () => {
    for (let level = 0; level < config.levels; level++) {
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          const idx = cellIndex(config, level, row, col);
          expect(cellLevel(config, idx)).toBe(level);
          expect(cellRow(config, idx)).toBe(row);
          expect(cellCol(config, idx)).toBe(col);
        }
      }
    }
  });

  it("totalCells matches rows * cols * levels", () => {
    expect(totalCells(config)).toBe(48);
  });
});

describe("wallKey", () => {
  it("produces canonical order (lower-higher)", () => {
    expect(wallKey(5, 3)).toBe("3-5");
    expect(wallKey(3, 5)).toBe("3-5");
  });

  it("handles adjacent large indices", () => {
    expect(wallKey(99, 100)).toBe("99-100");
    expect(wallKey(100, 99)).toBe("99-100");
  });
});
