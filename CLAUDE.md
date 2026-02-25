# dungeon-gen

Interactive browser-based dungeon generator using Kruskal's maze algorithm. Ported from a Verse dungeon crawler (UEFN).

## Build / Run

```bash
npm install           # Install dependencies
npm run dev           # Dev server (http://localhost:5173)
npm run build         # Production build → dist/
npx tsc --noEmit      # Type-check only
```

## Project Structure

| File | Role | Depends On | Used By |
|------|------|-----------|---------|
| `src/algorithms/types.ts` | Shared types, grid helpers, room colors | — | All algorithm + component files |
| `src/algorithms/maze.ts` | Kruskal's algorithm + Union-Find | types.ts | App.tsx |
| `src/algorithms/rooms.ts` | BFS room type assignment | types.ts | App.tsx |
| `src/components/MazeGrid.tsx` | SVG maze renderer | types.ts | App.tsx |
| `src/components/LevelSelector.tsx` | Level tab buttons | — | App.tsx |
| `src/components/Controls.tsx` | Grid size sliders + generate button | types.ts | App.tsx |
| `src/components/Legend.tsx` | Room type color legend | types.ts | App.tsx |
| `src/App.tsx` | Root component, wires everything together | all above | main.tsx |

## Conventions

- **Algorithm code is pure TypeScript** — no React imports, no side effects. Easy to test and reuse.
- **RoomType** is a const object + type union (not an enum) due to `erasableSyntaxOnly` in tsconfig.
- **Wall keys** are strings `"cellA-cellB"` with lower index first, stored in Sets.
- **Cell indices** are flat: `level * rows * cols + row * cols + col`.
- **SVG rendering** — MazeGrid uses SVG (not canvas) for crisp scaling and easy interactivity.

## Source Material

Original Verse code: `SluZZyDungeonCrawler/Content/maze_manager.verse`
- Kruskal's algorithm: lines 265-298
- BFS room assignment: lines 315-415
- 3D grid indexing: lines 94-130
