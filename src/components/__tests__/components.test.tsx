// dungeon-gen - Component Smoke Tests
//
// Basic render tests for React components. Verifies components
// mount without crashing and render expected content.

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Legend } from "../Legend";
import App from "../../App";

afterEach(cleanup);

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

describe("App", () => {
  it("renders the heading and generates an initial maze", () => {
    render(<App />);
    expect(screen.getByText("dungeon-gen")).toBeDefined();
    expect(screen.getByText("Generate")).toBeDefined();
  });
});
