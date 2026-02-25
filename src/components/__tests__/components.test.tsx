// dungeon-gen - Component Tests
//
// Render and interaction tests for React components. Verifies components
// mount without crashing, render expected content, and respond to user input.

import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Legend } from "../Legend";
import { Controls } from "../Controls";
import { LevelSelector } from "../LevelSelector";
import { MazeGrid } from "../MazeGrid";
import App from "../../App";
import type { MazeConfig, MazeResult } from "../../algorithms/types";
import { generateMaze } from "../../algorithms/maze";
import { assignRoomTypes } from "../../algorithms/rooms";

afterEach(cleanup);

// --- Legend ---

describe("Legend", () => {
  it("renders all room type labels", () => {
    render(<Legend />);
    expect(screen.getByText("Safe")).toBeDefined();
    expect(screen.getByText("Boss")).toBeDefined();
    expect(screen.getByText("Combat")).toBeDefined();
  });

  it("renders stair indicator description", () => {
    render(<Legend />);
    expect(screen.getByText("↑↓ = stairs between levels")).toBeDefined();
  });
});

// --- Controls ---

describe("Controls", () => {
  const defaultConfig: MazeConfig = { rows: 4, cols: 4, levels: 3 };

  it("renders sliders with initial values", () => {
    render(<Controls config={defaultConfig} onGenerate={() => {}} />);
    expect(screen.getByText("Rows:")).toBeDefined();
    expect(screen.getByText("Columns:")).toBeDefined();
    expect(screen.getByText("Levels:")).toBeDefined();
  });

  it("calls onGenerate with config when Generate is clicked", () => {
    const onGenerate = vi.fn();
    render(<Controls config={defaultConfig} onGenerate={onGenerate} />);

    fireEvent.click(screen.getByText("Generate"));
    expect(onGenerate).toHaveBeenCalledOnce();
    expect(onGenerate).toHaveBeenCalledWith(defaultConfig);
  });

  it("updates slider values locally before generating", () => {
    const onGenerate = vi.fn();
    render(<Controls config={defaultConfig} onGenerate={onGenerate} />);

    // Change the rows slider to 6
    const sliders = document.querySelectorAll('input[type="range"]');
    fireEvent.change(sliders[0], { target: { value: "6" } });

    fireEvent.click(screen.getByText("Generate"));
    expect(onGenerate).toHaveBeenCalledWith({ rows: 6, cols: 4, levels: 3 });
  });
});

// --- LevelSelector ---

describe("LevelSelector", () => {
  it("renders nothing when levels is 1", () => {
    const { container } = render(
      <LevelSelector levels={1} activeLevel={0} onSelect={() => {}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders a button for each level", () => {
    render(<LevelSelector levels={3} activeLevel={0} onSelect={() => {}} />);
    expect(screen.getByText("Level 1")).toBeDefined();
    expect(screen.getByText("Level 2")).toBeDefined();
    expect(screen.getByText("Level 3")).toBeDefined();
  });

  it("calls onSelect with the correct level index", () => {
    const onSelect = vi.fn();
    render(<LevelSelector levels={3} activeLevel={0} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Level 2"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});

// --- MazeGrid ---

describe("MazeGrid", () => {
  function buildMaze(config: MazeConfig): MazeResult {
    const removedWalls = generateMaze(config);
    const cellTypes = assignRoomTypes(config, removedWalls);
    return { config, removedWalls, cellTypes };
  }

  it("renders an SVG with role and aria-label", () => {
    const maze = buildMaze({ rows: 3, cols: 3, levels: 2 });
    render(<MazeGrid maze={maze} activeLevel={0} />);

    const svg = document.querySelector("svg");
    expect(svg).toBeDefined();
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Maze level 1 of 2");
  });

  it("renders the correct number of cell backgrounds", () => {
    const config: MazeConfig = { rows: 3, cols: 3, levels: 1 };
    const maze = buildMaze(config);
    render(<MazeGrid maze={maze} activeLevel={0} />);

    // Cell backgrounds are rects after the first (border) rect
    const rects = document.querySelectorAll("rect");
    // 1 border + 9 cells = 10
    expect(rects.length).toBe(1 + config.rows * config.cols);
  });
});

// --- App integration ---

describe("App", () => {
  it("renders the heading and generates an initial maze", () => {
    render(<App />);
    expect(screen.getByText("dungeon-gen")).toBeDefined();
    expect(screen.getByText("Generate")).toBeDefined();
  });

  it("renders level selector for default multi-level config", () => {
    render(<App />);
    // Default config is 4x4x3, so level buttons should appear
    expect(screen.getByText("Level 1")).toBeDefined();
    expect(screen.getByText("Level 2")).toBeDefined();
    expect(screen.getByText("Level 3")).toBeDefined();
  });

  it("regenerates maze when Generate is clicked", () => {
    render(<App />);
    const svg1 = document.querySelector("svg")?.innerHTML;

    // Click generate multiple times — at least one should produce a different maze
    let changed = false;
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByText("Generate"));
      const svg2 = document.querySelector("svg")?.innerHTML;
      if (svg2 !== svg1) {
        changed = true;
        break;
      }
    }
    expect(changed).toBe(true);
  });
});
