import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MessageList } from "../MessageList";
import type { UIMessage } from "ai";

vi.mock("../MarkdownRenderer", () => ({
  MarkdownRenderer: ({ content }: { content: string }) => <div>{content}</div>,
}));

afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

test("shows empty state prompt when messages is empty", () => {
  render(<MessageList messages={[]} />);
  expect(
    screen.getByText("Start a conversation to generate React components")
  ).toBeDefined();
  expect(
    screen.getByText("I can help you create buttons, forms, cards, and more")
  ).toBeDefined();
});

test("does not render message list wrapper when messages is empty", () => {
  const { container } = render(<MessageList messages={[]} />);
  expect(container.querySelector(".overflow-y-auto")).toBeNull();
});

// ---------------------------------------------------------------------------
// User messages
// ---------------------------------------------------------------------------

test("renders user message text", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "user", parts: [{ type: "text", text: "Create a button" }] },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Create a button")).toBeDefined();
});

test("user message uses blue bubble styling", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "user", parts: [{ type: "text", text: "Hello" }] },
  ];
  render(<MessageList messages={messages} />);
  const bubble = screen.getByText("Hello").closest(".rounded-xl");
  expect(bubble?.className).toContain("bg-blue-600");
  expect(bubble?.className).toContain("text-white");
});

test("user message shows User avatar icon", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "user", parts: [{ type: "text", text: "Hi" }] },
  ];
  const { container } = render(<MessageList messages={messages} />);
  // User avatar wrapper has bg-blue-600
  const avatarWrapper = container.querySelector(".bg-blue-600.shadow-sm");
  expect(avatarWrapper).toBeDefined();
});

test("user message is right-aligned", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "user", parts: [{ type: "text", text: "Hi" }] },
  ];
  const { container } = render(<MessageList messages={messages} />);
  const row = container.querySelector(".flex.gap-4");
  expect(row?.className).toContain("justify-end");
});

// ---------------------------------------------------------------------------
// Assistant messages
// ---------------------------------------------------------------------------

test("renders assistant message text via MarkdownRenderer", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [{ type: "text", text: "Here is your component." }],
    },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Here is your component.")).toBeDefined();
});

test("assistant message uses white bubble styling", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [{ type: "text", text: "Hello" }],
    },
  ];
  render(<MessageList messages={messages} />);
  const bubble = screen.getByText("Hello").closest(".rounded-xl");
  expect(bubble?.className).toContain("bg-white");
  expect(bubble?.className).toContain("text-neutral-900");
});

test("assistant message shows Bot avatar icon", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "assistant", parts: [{ type: "text", text: "Hi" }] },
  ];
  const { container } = render(<MessageList messages={messages} />);
  // Bot avatar wrapper: bg-white border border-neutral-200 shadow-sm
  const botAvatar = container.querySelector(
    ".w-9.h-9.rounded-lg.bg-white.border"
  );
  expect(botAvatar).toBeDefined();
});

test("assistant message is left-aligned", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "assistant", parts: [{ type: "text", text: "Hi" }] },
  ];
  const { container } = render(<MessageList messages={messages} />);
  const row = container.querySelector(".flex.gap-4");
  expect(row?.className).toContain("justify-start");
});

// ---------------------------------------------------------------------------
// Reasoning parts
// ---------------------------------------------------------------------------

test("renders reasoning part with label and text", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        { type: "reasoning", text: "I need to think about layout." },
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Reasoning")).toBeDefined();
  expect(screen.getByText("I need to think about layout.")).toBeDefined();
});

// ---------------------------------------------------------------------------
// Tool call (dynamic-tool) parts
// ---------------------------------------------------------------------------

test("renders dynamic-tool part in output-available state as result", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        {
          type: "dynamic-tool",
          toolCallId: "tc1",
          toolName: "str_replace_editor",
          state: "output-available",
          input: { command: "create", path: "src/Card.tsx" },
          output: "done",
        },
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  // result state → green dot, no spinner
  const { container } = render(<MessageList messages={messages} />);
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("renders dynamic-tool part in input-available state as call", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        {
          type: "dynamic-tool",
          toolCallId: "tc2",
          toolName: "str_replace_editor",
          state: "input-available",
          input: { command: "str_replace", path: "src/App.tsx" },
          output: undefined,
        },
      ],
    },
  ];
  const { container } = render(<MessageList messages={messages} />);
  expect(screen.getByText("Editing App.tsx")).toBeDefined();
  // call state → spinner
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("renders dynamic-tool part in streaming state as partial-call", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        {
          type: "dynamic-tool",
          toolCallId: "tc3",
          toolName: "str_replace_editor",
          state: "streaming" as never,
          input: { command: "view", path: "src/index.ts" },
          output: undefined,
        },
      ],
    },
  ];
  const { container } = render(<MessageList messages={messages} />);
  // partial-call → spinner
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("renders multiple tool call parts in one message", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        {
          type: "dynamic-tool",
          toolCallId: "a",
          toolName: "str_replace_editor",
          state: "output-available",
          input: { command: "create", path: "Header.tsx" },
          output: "ok",
        },
        {
          type: "dynamic-tool",
          toolCallId: "b",
          toolName: "str_replace_editor",
          state: "output-available",
          input: { command: "create", path: "Footer.tsx" },
          output: "ok",
        },
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Creating Header.tsx")).toBeDefined();
  expect(screen.getByText("Creating Footer.tsx")).toBeDefined();
});

// ---------------------------------------------------------------------------
// source-url parts
// ---------------------------------------------------------------------------

test("renders source-url part", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        { type: "source-url", url: "https://example.com/docs", sourceId: "s1" },
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Source: https://example.com/docs")).toBeDefined();
});

// ---------------------------------------------------------------------------
// step-start parts
// ---------------------------------------------------------------------------

test("step-start at index > 0 renders an hr separator", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        { type: "text", text: "Phase one done." },
        { type: "step-start" },
        { type: "text", text: "Phase two." },
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  const bubble = screen.getByText("Phase one done.").closest(".rounded-xl");
  expect(bubble?.querySelector("hr")).toBeDefined();
});

test("step-start at index 0 does not render an hr separator", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        { type: "step-start" },
        { type: "text", text: "Only content." },
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  const bubble = screen.getByText("Only content.").closest(".rounded-xl");
  expect(bubble?.querySelector("hr")).toBeNull();
});

// ---------------------------------------------------------------------------
// Loading indicator
// ---------------------------------------------------------------------------

test("shows Generating... for last assistant message with no text parts when loading", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "assistant", parts: [] },
  ];
  render(<MessageList messages={messages} isLoading={true} />);
  expect(screen.getByText("Generating...")).toBeDefined();
});

test("does not show Generating... when isLoading is false, even with empty parts", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "assistant", parts: [] },
  ];
  render(<MessageList messages={messages} isLoading={false} />);
  expect(screen.queryByText("Generating...")).toBeNull();
});

test("does not show Generating... when last assistant message has text content", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [{ type: "text", text: "Already streaming content." }],
    },
  ];
  render(<MessageList messages={messages} isLoading={true} />);
  expect(screen.queryByText("Generating...")).toBeNull();
  expect(screen.getByText("Already streaming content.")).toBeDefined();
});

test("does not show Generating... on an earlier assistant message that has no text", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "assistant", parts: [] },
    { id: "2", role: "user", parts: [{ type: "text", text: "Next prompt" }] },
  ];
  render(<MessageList messages={messages} isLoading={true} />);
  expect(screen.queryByText("Generating...")).toBeNull();
});

test("shows Generating... only on the last message, not earlier ones", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [{ type: "text", text: "First response" }],
    },
    { id: "2", role: "assistant", parts: [] },
  ];
  render(<MessageList messages={messages} isLoading={true} />);
  const loadingItems = screen.getAllByText("Generating...");
  expect(loadingItems).toHaveLength(1);
});

// ---------------------------------------------------------------------------
// Conversation ordering
// ---------------------------------------------------------------------------

test("renders messages in correct document order", () => {
  const messages: UIMessage[] = [
    { id: "1", role: "user", parts: [{ type: "text", text: "First" }] },
    { id: "2", role: "assistant", parts: [{ type: "text", text: "Second" }] },
    { id: "3", role: "user", parts: [{ type: "text", text: "Third" }] },
    { id: "4", role: "assistant", parts: [{ type: "text", text: "Fourth" }] },
  ];

  const { container } = render(<MessageList messages={messages} />);
  const bubbles = container.querySelectorAll(".rounded-xl");
  expect(bubbles).toHaveLength(4);
  expect(bubbles[0].textContent).toContain("First");
  expect(bubbles[1].textContent).toContain("Second");
  expect(bubbles[2].textContent).toContain("Third");
  expect(bubbles[3].textContent).toContain("Fourth");
});

// ---------------------------------------------------------------------------
// Mixed parts in a single message
// ---------------------------------------------------------------------------

test("renders a message with text, reasoning, and tool call parts together", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        { type: "text", text: "Let me build that." },
        { type: "reasoning", text: "User wants a card." },
        {
          type: "dynamic-tool",
          toolCallId: "x",
          toolName: "str_replace_editor",
          state: "output-available",
          input: { command: "create", path: "Card.tsx" },
          output: "ok",
        },
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Let me build that.")).toBeDefined();
  expect(screen.getByText("Reasoning")).toBeDefined();
  expect(screen.getByText("User wants a card.")).toBeDefined();
  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
});

// ---------------------------------------------------------------------------
// Unknown / future part types
// ---------------------------------------------------------------------------

test("ignores unknown part types without crashing", () => {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "assistant",
      parts: [
        { type: "text", text: "Known part." },
        { type: "future-unknown-part" } as never,
      ],
    },
  ];
  render(<MessageList messages={messages} />);
  expect(screen.getByText("Known part.")).toBeDefined();
});
