# dungeon-gen

**Interactive browser-based dungeon generator using Kruskal's maze algorithm.**

Ported from a [Verse](https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference) dungeon crawler built in Unreal Editor for Fortnite (UEFN). The original game procedurally generates 3D dungeon layouts using barrier devices — this project extracts the core algorithms into a visual web tool.

![React](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)

**[Live Demo](https://jmrussas.github.io/dungeon-gen/)**

## Features

- **Kruskal's algorithm** with Union-Find generates a perfect maze (exactly one path between any two cells)
- **Multi-level dungeons** with staircase connections between floors
- **BFS room assignment** places room types by distance from start — boss room is always the farthest cell
- **Interactive controls** — adjust rows, columns, and levels with sliders, regenerate on demand
- **Six room types** — Safe (start), Combat, Loot, Shop, Boss, Forge — each color-coded on the grid

## Quick Start

```bash
git clone https://github.com/JMRussas/dungeon-gen.git
cd dungeon-gen
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How It Works

### Maze Generation

The generator builds a grid of cells (rows × cols × levels) where every cell starts fully walled off. It then:

1. Enumerates all internal walls (horizontal, vertical, and floor/ceiling between levels)
2. Shuffles them randomly (Fisher-Yates)
3. Processes each wall using **Kruskal's algorithm** — if the wall separates two disconnected regions, remove it to create a passage
4. Uses **Union-Find** with path compression and union by rank for efficient set operations

The result is a "perfect maze" — every cell is reachable, with no loops.

### Room Assignment

After the maze structure is built, a **BFS traversal** from the starting cell (0,0,0) assigns room types:

- **Cell 0** → Safe (starting room)
- **Farthest cell** from start → Boss
- **Mid-distance cells** → Shop, Loot, Forge (randomly selected from eligible cells at intermediate distances)
- **Everything else** → Combat

### Original Verse Code

The algorithms are ported from `maze_manager.verse`, which runs inside UEFN to control physical barrier devices in a 3D game world. The TypeScript port preserves the same logic with cleaner data structures (Sets and Maps instead of Verse's failable map lookups).

## Project Structure

```
src/
├── algorithms/
│   ├── types.ts          Grid helpers, room types, shared interfaces
│   ├── maze.ts           Kruskal's algorithm + Union-Find
│   ├── rooms.ts          BFS room type assignment
│   └── __tests__/        Vitest test suite
├── hooks/
│   └── useMazeLayout.ts  Computes cell positions, walls, stairs for rendering
└── components/
    ├── MazeGrid.tsx      SVG maze renderer
    ├── LevelSelector.tsx Level tab buttons
    ├── Controls.tsx      Grid size sliders + generate button
    └── Legend.tsx         Room type color reference
```

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Vitest

## License

MIT
