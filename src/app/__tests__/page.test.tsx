import { test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/actions", () => ({ getUser: vi.fn() }));
vi.mock("@/actions/get-projects", () => ({ getProjects: vi.fn() }));
vi.mock("@/actions/create-project", () => ({ createProject: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/app/main-content", () => ({
  MainContent: ({ user }: { user: { id: string; email: string } | null }) => (
    <div
      data-testid="main-content"
      data-user-id={user?.id ?? "none"}
      data-user-email={user?.email ?? "none"}
    />
  ),
}));

import { getUser } from "@/actions";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockUser = { id: "user-1", email: "user@example.com", createdAt: new Date() };

const makeProject = (id: string) => ({
  id,
  name: `Project ${id}`,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const makeFullProject = (id: string) => ({
  id,
  name: `Project ${id}`,
  userId: mockUser.id,
  messages: "[]",
  data: "{}",
  createdAt: new Date(),
  updatedAt: new Date(),
});

// redirect() in real Next.js throws a special error that stops execution.
// Reproduce that so assertions after redirect never run in the component.
const REDIRECT_ERROR = new Error("NEXT_REDIRECT");

function mockRedirectThrows() {
  vi.mocked(redirect).mockImplementation(() => {
    throw REDIRECT_ERROR;
  });
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Anonymous user
// ---------------------------------------------------------------------------

test("renders MainContent with null user when not authenticated", async () => {
  vi.mocked(getUser).mockResolvedValue(null);

  const ui = await Home();
  render(ui as React.ReactElement);

  const el = screen.getByTestId("main-content");
  expect(el.dataset.userId).toBe("none");
  expect(redirect).not.toHaveBeenCalled();
});

test("does not call getProjects or createProject for anonymous users", async () => {
  vi.mocked(getUser).mockResolvedValue(null);

  const ui = await Home();
  render(ui as React.ReactElement);

  expect(getProjects).not.toHaveBeenCalled();
  expect(createProject).not.toHaveBeenCalled();
});

// ---------------------------------------------------------------------------
// Authenticated user — existing projects
// ---------------------------------------------------------------------------

test("redirects to most recent project when user has projects", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([
    makeProject("proj-recent"),
    makeProject("proj-older"),
  ]);

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
  expect(redirect).toHaveBeenCalledWith("/proj-recent");
  expect(redirect).toHaveBeenCalledTimes(1);
});

test("redirects to the first project returned (most recently updated)", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([
    makeProject("first"),
    makeProject("second"),
    makeProject("third"),
  ]);

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
  expect(redirect).toHaveBeenCalledWith("/first");
});

test("does not call createProject when projects already exist", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([makeProject("proj-1")]);

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
  expect(createProject).not.toHaveBeenCalled();
});

// ---------------------------------------------------------------------------
// Authenticated user — no projects
// ---------------------------------------------------------------------------

test("creates a new project and redirects when user has no projects", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(createProject).mockResolvedValue(makeFullProject("new-proj-1"));

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
  expect(createProject).toHaveBeenCalledTimes(1);
  expect(redirect).toHaveBeenCalledWith("/new-proj-1");
});

test("creates project with empty messages and data", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(createProject).mockResolvedValue(makeFullProject("new-proj-2"));

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");

  const [callArg] = vi.mocked(createProject).mock.calls[0];
  expect(callArg.messages).toEqual([]);
  expect(callArg.data).toEqual({});
});

test("creates project with a name matching 'New Design #<number>'", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(createProject).mockResolvedValue(makeFullProject("new-proj-3"));

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");

  const [callArg] = vi.mocked(createProject).mock.calls[0];
  expect(callArg.name).toMatch(/^New Design #\d+$/);
});

test("redirects to newly created project id, not a hardcoded path", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(createProject).mockResolvedValue(makeFullProject("dynamic-id-xyz"));

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
  expect(redirect).toHaveBeenCalledWith("/dynamic-id-xyz");
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

test("handles a single existing project correctly", async () => {
  mockRedirectThrows();
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getProjects).mockResolvedValue([makeProject("only-proj")]);

  await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
  expect(redirect).toHaveBeenCalledWith("/only-proj");
});
