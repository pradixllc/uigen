import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay } from "../ToolCallDisplay";

afterEach(() => {
  cleanup();
});

// str_replace_editor — create
test("shows 'Creating <filename>' for str_replace_editor create command", () => {
  render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/components/Card.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
});

// str_replace_editor — str_replace
test("shows 'Editing <filename>' for str_replace_editor str_replace command", () => {
  render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "src/components/Button.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

// str_replace_editor — insert
test("shows 'Editing <filename>' for str_replace_editor insert command", () => {
  render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "insert", path: "App.tsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Editing App.tsx")).toBeDefined();
});

// str_replace_editor — view
test("shows 'Viewing <filename>' for str_replace_editor view command", () => {
  render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "view", path: "src/index.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Viewing index.ts")).toBeDefined();
});

// str_replace_editor — undo_edit
test("shows 'Undoing edit in <filename>' for str_replace_editor undo_edit command", () => {
  render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "src/utils/helpers.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Undoing edit in helpers.ts")).toBeDefined();
});

// file_manager — rename
test("shows 'Renaming <from> to <to>' for file_manager rename command", () => {
  render(
    <ToolCallDisplay
      toolName="file_manager"
      args={{ command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Renaming Old.tsx to New.tsx")).toBeDefined();
});

// file_manager — delete
test("shows 'Deleting <filename>' for file_manager delete command", () => {
  render(
    <ToolCallDisplay
      toolName="file_manager"
      args={{ command: "delete", path: "src/Unused.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

// Unknown tool falls back to tool name
test("falls back to tool name for unknown tools", () => {
  render(
    <ToolCallDisplay
      toolName="some_unknown_tool"
      args={{}}
      state="call"
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

// In-progress state shows spinner, not green dot
test("shows spinner when state is not result", () => {
  const { container } = render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "Card.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

// Completed state shows green dot, not spinner
test("shows green dot when state is result", () => {
  const { container } = render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "Card.jsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// Path with no slashes — uses full path as filename
test("uses the full path when there are no slashes", () => {
  render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});
